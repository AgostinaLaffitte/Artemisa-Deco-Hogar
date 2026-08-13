export interface ProductVariant {
  id: number;
  name: string;
  stock: number;
  price?: number;
  size?: string;
  color?: string;
  image?: string;          // Compatibilidad hacia atrás
  images?: string[];        // Soporte para múltiples imágenes
  media?: string[];         // Soporte para imágenes o videos
  productId: number;
}