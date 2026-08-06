import type { Product } from '../types/product';

export const getProductTotalStock = (product: Product): number => {
  if (!product.variants || product.variants.length === 0) return 0;
  return product.variants.reduce((acc, v) => acc + v.stock, 0);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(price);
};
