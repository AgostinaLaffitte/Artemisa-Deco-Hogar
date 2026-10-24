import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service'; // 👈 Importamos Prisma

@Injectable()
export class ShippingService {
  private token: string | null = null;
  private tokenExpiration: number = 0;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService // 👈 Inyectamos Prisma para buscar pesos
  ) {}

  private async getToken(): Promise<string> {
    const now = Date.now();
    if (this.token && now < this.tokenExpiration) {
      return this.token;
    }

    const user = this.configService.get<string>('CORREO_API_USER');
    const password = this.configService.get<string>('CORREO_API_PASSWORD');
    const baseUrl = this.configService.get<string>('CORREO_API_URL') || 'https://api.correoargentino.com.ar/micorreo/v1';

    const credentials = Buffer.from(`${user}:${password}`).toString('base64');

    try {
      const response = await fetch(`${baseUrl}/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al autenticar con la API de Correo Argentino');
      }

      const data: any = await response.json();
      const fetchedToken = data.token || data.access_token;

      if (!fetchedToken) {
        throw new Error('No se encontró el token en la respuesta');
      }

      this.token = fetchedToken;
      this.tokenExpiration = now + (55 * 60 * 1000); 
      
      return fetchedToken;
    } catch (error: any) {
      console.error('Error obteniendo token de Correo Argentino:', error.message);
      throw new InternalServerErrorException('No se pudo conectar con el servicio de envíos.');
    }
  }

  // 📦 Método actualizado para calcular el peso real según los productos del carrito
  async calculateRate(destinationPostalCode: string, items?: { variantId: number; quantity: number }[]) {
    let totalWeightInKg = 1.0; // Peso por defecto si no vienen ítems

    if (items && items.length > 0) {
      totalWeightInKg = 0;
      for (const item of items) {
        const variant = await this.prisma.productVariant.findUnique({
          where: { id: item.variantId },
        });
        
        // Si la variante tiene peso cargado, lo usa; si es null, toma 1 kg por defecto
        const itemWeight = variant?.weight ?? 1.0;
        totalWeightInKg += itemWeight * item.quantity;
      }
    }

    // Aseguramos un peso mínimo de 0.5 kg para evitar errores en la API
    if (totalWeightInKg <= 0) {
      totalWeightInKg = 1.0;
    }

    const token = await this.getToken();
    const baseUrl = this.configService.get<string>('CORREO_API_URL') || 'https://api.correoargentino.com.ar/micorreo/v1';
    const originPostalCode = this.configService.get<string>('ORIGIN_POSTAL_CODE') || '7400';

    try {
      const response = await fetch(`${baseUrl}/rates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postal_code_source: originPostalCode,
          postal_code_destiny: destinationPostalCode,
          weight: totalWeightInKg, // 👈 Enviamos el peso total real calculado
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo calcular la tarifa para el código postal ingresado.');
      }

      const data: any = await response.json();
      return { cost: data.price || data.total || 0, calculatedWeight: totalWeightInKg };
    } catch (error: any) {
      console.error('Error calculando tarifa de envío:', error.message);
      return { cost: 5500 }; 
    }
  }
}