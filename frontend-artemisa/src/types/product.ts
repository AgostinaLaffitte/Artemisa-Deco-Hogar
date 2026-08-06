import { type Category } from './category';
import type { ProductVariant } from './productVariant';
export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  images: string[];    
  isOffer: boolean;
  offerPrice?: number;
  categories: Category[];
  variants: ProductVariant[];
}