export interface ProductVariant {
  id: number;
  name: string;
  stock: number;
  price?: number;
  size?: string;
  color?: string;
  image?: string;
  productId: number;
}