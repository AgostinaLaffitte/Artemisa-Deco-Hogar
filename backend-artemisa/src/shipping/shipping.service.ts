import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ShippingService {
  private token: string | null = null;
  private tokenExpiration: number = 0;

  constructor(private configService: ConfigService) {}

  private async getToken(): Promise<string> {
    const now = Date.now();
    
    // Si ya tenemos token y no expiró, lo usamos
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
      this.tokenExpiration = now + (55 * 60 * 1000); // 55 minutos corregido
      
      // Retornamos la variable local asegurando que es un string y evitando el error de TS
      return fetchedToken;
    } catch (error: any) {
      console.error('Error obteniendo token de Correo Argentino:', error.message);
      throw new InternalServerErrorException('No se pudo conectar con el servicio de envíos.');
    }
  }

  async calculateRate(destinationPostalCode: string, weightInKg: number = 1) {
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
          weight: weightInKg,
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo calcular la tarifa para el código postal ingresado.');
      }

      const data: any = await response.json();
      return { cost: data.price || data.total || 0 };
    } catch (error: any) {
      console.error('Error calculando tarifa de envío:', error.message);
      return { cost: 5500 }; 
    }
  }
}