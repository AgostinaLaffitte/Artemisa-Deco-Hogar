import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');


@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
   this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465, // Usamos 465 en vez de 587 para SSL directo
      secure: true, // true para 465
      auth: {
        user: this.configService.get<string>('SMTP_USER') || this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('SMTP_PASS') || this.configService.get<string>('MAIL_PASS'),
      },
      // 🚀 FORZAMOS IPv4 para evitar el error ENETUNREACH en Render
      family: 4, 
      connectionTimeout: 10000, // Timeout de 10 segundos para no congelar el servidor
    } as any);
  }

  // 📧 Email 1: Confirmación de Pago Aprobado (Mercado Pago)
  async sendOrderApprovedEmail(order: any) {
    const from = this.configService.get<string>('EMAIL_FROM') || 'Artemisa <no-reply@artemisa.com>';
    const itemsHtml = order.items.map((i: any) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${i.product?.name || 'Producto'} (${i.variant?.name || 'Variante'})</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${i.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${i.priceAtPurchase?.toLocaleString('es-AR')}</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px;">
        <h2 style="color: #333; text-align: center; font-style: italic;">¡Gracias por tu compra en Artemisa! ✨</h2>
        <p>Hola <strong>${order.customerName}</strong>,</p>
        <p>¡Confirmamos que recibimos tu pago con éxito! Ya estamos preparando tu pedido.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold;">Orden #${order.id}</p>
          <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Estado: <strong style="color: green;">PAGADO</strong></p>
          <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Método de Entrega: ${order.deliveryMethod === 'ENVIO' ? 'Envío a domicilio' : 'Retiro en local'}</p>
          ${order.deliveryMethod === 'ENVIO' ? `<p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Dirección: ${order.address}, ${order.city} (CP: ${order.postalCode})</p>` : ''}
        </div>

        <h3>Detalle del Pedido:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; text-align: left;">Producto</th>
              <th style="padding: 8px; text-align: center;">Cant.</th>
              <th style="padding: 8px; text-align: right;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="text-align: right; font-size: 18px; font-weight: bold; color: #333;">
          Total Pagado: $${order.total?.toLocaleString('es-AR')}
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">Artemisa - Confección Artesanal</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from,
        to: order.customerEmail,
        subject: `¡Pago Confirmado! Orden #${order.id} - Artemisa`,
        html,
      });
      this.logger.log(`Email de confirmación de pago enviado a ${order.customerEmail}`);
    } catch (err) {
      this.logger.error(`Error enviando email a ${order.customerEmail}:`, err);
    }
  }

  // 📧 Email 2: Instrucciones de Transferencia Directa
  async sendTransferInstructionsEmail(order: any) {
    const from = this.configService.get<string>('EMAIL_FROM') || 'Artemisa <no-reply@artemisa.com>';
    const itemsHtml = order.items.map((i: any) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${i.product?.name || 'Producto'} (${i.variant?.name || 'Variante'})</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${i.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${i.priceAtPurchase?.toLocaleString('es-AR')}</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px;">
        <h2 style="color: #333; text-align: center; font-style: italic;">¡Tu Orden #${order.id} ha sido registrada! 📋</h2>
        <p>Hola <strong>${order.customerName}</strong>,</p>
        <p>Gracias por tu compra. Reservamos tus productos por un plazo máximo de <strong>72 horas</strong>.</p>
        
        <div style="background-color: #fff8e1; border: 1px solid #ffe082; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #b78103;">⚠️ Instrucciones para finalizar tu compra:</h4>
          <p style="margin: 5px 0; font-size: 14px;">1. Realizá la transferencia por el total de <strong>$${order.total?.toLocaleString('es-AR')}</strong>.</p>
          <p style="margin: 5px 0; font-size: 14px;">2. Envíanos el comprobante por WhatsApp al <strong>+54 9 2284 690919</strong> indicando tu número de orden <strong>#${order.id}</strong>.</p>
          <p style="margin: 5px 0; font-size: 14px; color: #d32f2f;"><strong>Importante:</strong> Si el comprobante no es enviado dentro de las 72 horas, la orden se cancelará automáticamente y los productos volverán al stock.</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #333;">🏦 Datos Bancarios para la Transferencia:</h4>
          <p style="margin: 4px 0;"><strong>Banco:</strong> Mercado Pago</p>
          <p style="margin: 4px 0;"><strong>Alias:</strong> <span style="font-family: monospace; font-size: 16px;">agostina.laffitte</span></p>
          <p style="margin: 4px 0;"><strong>CBU:</strong> <span style="font-family: monospace;">0000003100005625606408</span></p>
          <p style="margin: 4px 0;"><strong>Titular:</strong> Agostina Laffitte</p>
        </div>

        <h3>Resumen del Pedido:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; text-align: left;">Producto</th>
              <th style="padding: 8px; text-align: center;">Cant.</th>
              <th style="padding: 8px; text-align: right;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="text-align: right; font-size: 18px; font-weight: bold; color: #333;">
          Total a Transferir: $${order.total?.toLocaleString('es-AR')}
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">Artemisa - Confección Artesanal</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from,
        to: order.customerEmail,
        subject: `Orden #${order.id} Pendiente de Pago - Artemisa`,
        html,
      });
      this.logger.log(`Email de datos de transferencia enviado a ${order.customerEmail}`);
    } catch (err) {
      this.logger.error(`Error enviando email a ${order.customerEmail}:`, err);
    }
  }
}