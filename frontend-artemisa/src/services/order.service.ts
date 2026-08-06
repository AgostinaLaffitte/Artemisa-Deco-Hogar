// src/services/order.service.ts (o donde tengas definido el CreateOrderDto en el Front)
import api from '../api/axiosConfig';

export interface CreateOrderItemDto {
  variantId: number;
  quantity: number;
}

export interface CreateOrderDto {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryMethod: 'RETIRO' | 'ENVIO';
  address?: string;
  city?: string;
  postalCode?: string;
  notes?: string;
  paymentMethod?: string; // <-- Actualizado acá
  items: CreateOrderItemDto[];
}

export const OrderService = {
  create: async (orderData: CreateOrderDto) => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },
  findAll: async () => {
    const { data } = await api.get('/orders');
    return data;
  },
  updateStatus: async (id: number, status: string) => {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data;
  },
};