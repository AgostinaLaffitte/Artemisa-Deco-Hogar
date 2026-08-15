// src/services/order.service.ts
import api from '../api/axiosConfig'; // o tu instancia configurada de axios

export interface CreateOrderItemDto {
  variantId: number;
  quantity: number;
}

export interface CreateOrderDto {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: 'RETIRO' | 'ENVIO';
  paymentMethod?: string;
  paymentType?: 'ALL' | 'TRANSFER'; // 👈 Agregado para soportar la lógica de MP / Transferencia
  address?: string;
  city?: string;
  postalCode?: string;
  shippingCost?: number;
  notes?: string;
  items: CreateOrderItemDto[];
}

export const OrderService = {
  // Crear una nueva orden / preferencia de MP
  create: async (orderData: CreateOrderDto) => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },

  // Obtener todas las órdenes (Protegido con validación de Array)
  findAll: async () => {
    try {
      const { data } = await api.get('/orders');
      // 🛡️ Si por alguna razón la API falla o devuelve algo que no es lista, devuelves [] para evitar crash con .map
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
      return [];
    }
  },

  // Obtener una orden por ID
  findOne: async (id: number) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  // Actualizar el estado de la orden desde el Panel Admin
  updateStatus: async (id: number, status: string) => {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data;
  },
};