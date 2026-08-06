// src/services/banner.service.ts
import api from '../api/axiosConfig';
import type { Banner } from '../types/banner';

export const BannerService = {
  getAll: async (): Promise<Banner[]> => {
    const { data } = await api.get<Banner[]>('/banners');
    return data;
  },

  create: async (formData: FormData): Promise<Banner> => {
    const { data } = await api.post<Banner>('/banners', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/banners/${id}`);
  }
};