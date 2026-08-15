import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

type CreateOrderInput = CreateOrderDto & { 
  paymentType?: 'ALL' | 'TRANSFER';
  shippingCost?: number;
};

@Injectable()
export class OrdersService {
  private mpClient: MercadoPagoConfig;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {
    const accessToken = this.configService.get<string>('MP_ACCESS_TOKEN') || '';
    this.mpClient = new MercadoPagoConfig({ accessToken });
  }

  async create(createOrderDto: CreateOrderInput) {
    const { 
      items, customerName, customerEmail, customerPhone, 
      deliveryMethod, address, city, postalCode, notes, 
      paymentType, shippingCost = 0 
    } = createOrderDto;

    return this.prisma.$transaction(async (tx) => {
      const activePromos = await tx.promotion.findMany({ where: { active: true } });
      let totalOrder = 0;
      const orderItemsData: any[] = [];
      const quantityByProduct: { [productId: number]: number } = {};

      for (const item of items) {
        const v = await tx.productVariant.findUnique({ where: { id: item.variantId } });
        if (v) {
          quantityByProduct[v.productId] = (quantityByProduct[v.productId] || 0) + item.quantity;
        }
      }

      const itemsForMP: any[] = [];

      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: { include: { categories: true } } },
        });

        if (!variant) {
          throw new BadRequestException(`La variante con ID ${item.variantId} no existe.`);
        }

        if (variant.stock < item.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para "${variant.name}". Disponibles: ${variant.stock}, solicitados: ${item.quantity}`,
          );
        }

        const precioBase = variant.price ?? (variant.product.isOffer ? variant.product.offerPrice : variant.product.price) ?? 0;
        let precioFinal = precioBase;
        const totalProductQty = quantityByProduct[variant.productId] || item.quantity;

        const volumePromo = activePromos.find(
          p => p.productId === variant.productId && p.type === 'CANTIDAD' && totalProductQty >= p.minQuantity
        );
        const categoriesList = Array.isArray(variant.product?.categories) ? variant.product.categories : [];
        const categoryIds = categoriesList.map(c => c.id);
        const percentPromo = activePromos.find(
          p => p.type === 'PORCENTAJE' && (p.productId === variant.productId || categoryIds.includes(p.categoryId ?? -1))
        );

        if (volumePromo) {
          precioFinal = volumePromo.discountValue; 
        } else if (percentPromo) {
          precioFinal = precioBase * (1 - (percentPromo.discountValue / 100));
        }

        totalOrder += (precioFinal * item.quantity);

        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });

        orderItemsData.push({
          productId: variant.productId,
          variantId: variant.id,
          quantity: item.quantity,
          priceAtPurchase: Number(precioFinal.toFixed(2)),
        });

        itemsForMP.push({
          id: variant.id.toString(),
          title: `${variant.product.name} - ${variant.name}`,
          quantity: item.quantity,
          unit_price: Number(precioFinal.toFixed(2)),
          currency_id: 'ARS',
        });
      }

      // Promoción por monto mayorista/carrito general
      const wholesalePromo = activePromos.find(p => p.type === 'TOTAL_CARRITO' && p.active);
      if (wholesalePromo && totalOrder >= wholesalePromo.minQuantity) {
        totalOrder = totalOrder * (1 - (wholesalePromo.discountValue / 100));
        
        const totalOriginal = itemsForMP.reduce((acc, i) => acc + (i.unit_price * i.quantity), 0);
        const factorDescuento = totalOrder / totalOriginal;
        itemsForMP.forEach(item => {
          item.unit_price = Number((item.unit_price * factorDescuento).toFixed(2));
        });
      }

      // Sumamos el envío al total antes del descuento por transferencia (o después, según tu lógica)
      if (shippingCost > 0) {
        totalOrder += shippingCost;
      }

      const isTransfer = paymentType === 'TRANSFER';
      if (isTransfer) {
        totalOrder = totalOrder * 0.95;
        itemsForMP.forEach(item => {
          item.unit_price = Number((item.unit_price * 0.95).toFixed(2));
        });
      }

      const order = await tx.order.create({
        data: {
          customerName,
          customerEmail,
          customerPhone,
          deliveryMethod,
          address,
          city,
          postalCode,
          notes,
          paymentMethod: isTransfer ? 'TRANSFERENCIA' : 'MERCADOPAGO',
          status: 'PENDIENTE',
          total: Number(totalOrder.toFixed(2)),
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: { product: true, variant: true },
          },
        },
      });

      // Si NO es transferencia, creamos preferencia de Mercado Pago
      if (!isTransfer) {
        try {
          const baseUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
          const successUrl = `${baseUrl}/checkout/success`;
          const failureUrl = `${baseUrl}/checkout/failure`;
          const pendingUrl = `${baseUrl}/checkout/pending`;

          const apiUrl = this.configService.get<string>('API_URL') || this.configService.get<string>('NGROK_URL') || 'http://localhost:3000';
          const cleanApiUrl = apiUrl.trim().replace(/\/+$/, '');

          const preference = new Preference(this.mpClient);

          const response = await preference.create({
            body: {
              items: itemsForMP,
              payer: {
                name: customerName,
                email: customerEmail,
              },
              back_urls: {
                success: successUrl,
                failure: failureUrl,
                pending: pendingUrl,
              },
              auto_return: 'approved',
              notification_url: `${cleanApiUrl}/orders/webhook`,
              external_reference: String(order.id),
            },
          });

          const updatedOrder = await tx.order.update({
            where: { id: order.id },
            data: { preferenceId: response.id },
            include: { items: { include: { product: true, variant: true } } },
          });

          return {
            ...updatedOrder,
            initPoint: response.init_point || response.sandbox_init_point,
          };
        } catch (error: any) {
          console.error('Error de MP:', JSON.stringify(error?.response?.data || error?.message || error, null, 2));
          throw new InternalServerErrorException('Error al inicializar el pago con Mercado Pago.');
        }
      }

      // Si es Transferencia directa fuera de MP
      return order;
    });
  }

  // Webhook Robusto (Procesa tanto Body como Query params)
  async handleWebhook(query: any, body: any) {
    try {
      const topic = query?.topic || query?.type || body?.type;
      const paymentId = body?.data?.id || query?.['data.id'] || query?.id;

      if (topic === 'payment' && paymentId) {
        const payment = new Payment(this.mpClient);
        const paymentData = await payment.get({ id: paymentId });

        const orderId = parseInt((paymentData as any).external_reference ?? '', 10);
        const statusMP = paymentData.status;

        if (!isNaN(orderId)) {
          let orderStatus = 'PENDIENTE';
          if (statusMP === 'approved') orderStatus = 'PAGADO';
          if (statusMP === 'rejected') orderStatus = 'CANCELADO';

          await this.prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({ where: { id: orderId } });

            if (order) {
              await tx.order.update({
                where: { id: orderId },
                data: {
                  paymentId: paymentId.toString(),
                  paymentStatus: statusMP,
                  status: orderStatus,
                },
              });

              // Si el pago es rechazado y la orden no estaba cancelada previa, devolvemos el stock
              if (statusMP === 'rejected' && order.status !== 'CANCELADO') {
                const items = await tx.orderItem.findMany({ where: { orderId } });
                for (const item of items) {
                  if (item.variantId) {
                    await tx.productVariant.update({
                      where: { id: item.variantId },
                      data: { stock: { increment: item.quantity } },
                    });
                  }
                }
              }
            }
          });
        }
      }
      return { received: true };
    } catch (error: any) {
      console.error('Error procesando Webhook de Mercado Pago:', error?.message || error);
      return { received: true }; // Se devuelve 200 siempre para evitar reintentos continuos de MP
    }
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { items: { include: { product: true, variant: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true, variant: true } } },
    });
    if (!order) throw new NotFoundException(`Orden #${id} no encontrada`);
    return order;
  }

  async updateStatus(id: number, status: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ 
        where: { id },
        include: { items: true } 
      });

      if (!order) throw new NotFoundException(`Orden #${id} no encontrada`);

      const oldStatus = order.status;

      if (oldStatus !== 'CANCELADO' && status === 'CANCELADO') {
        for (const item of order.items) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } }
            });
          }
        }
      } else if (oldStatus === 'CANCELADO' && status !== 'CANCELADO') {
        for (const item of order.items) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.quantity } }
            });
          }
        }
      }

      return tx.order.update({
        where: { id },
        data: { status },
      });
    });
  }
}