// src/types/banner.ts
export interface Banner {
  id: number;
  title?: string;
  imageUrl: string;
  link?: string;
  active?: boolean;
  order?: number;
}