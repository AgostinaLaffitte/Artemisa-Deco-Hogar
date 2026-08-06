import api from '../api/axiosConfig';
import type { Product } from '../types/product';

export const ProductService = {
  // Obtener todos los productos
  getAll: async (search?: string, categoryId?: number): Promise<Product[]> => {
    const { data } = await api.get<Product[]>('/products', {
      params: {
        search: search || undefined,
        category: categoryId || undefined,
      },
    });
    return data;
  },

  // Obtener uno solo por ID
  getById: async (id: number): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  // Filtrar por categoría (si tenés el endpoint)
  getByCategory: async (category: string): Promise<Product[]> => {
    const { data } = await api.get<Product[]>(`/products/category/${category}`);
    return data;
  }
};