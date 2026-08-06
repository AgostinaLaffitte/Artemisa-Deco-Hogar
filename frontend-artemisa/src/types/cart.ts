
export interface CartItem {
  productId: number;
  productName: string;
  variantId: number;
  variantName: string;
  price: number;
  image: string;
  quantity: number;
  stockMax: number; // Para controlar que no sumen más del stock real en la vista del carrito
}