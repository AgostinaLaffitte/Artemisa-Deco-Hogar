import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem } from '../types/cart';
import api from '../api/axiosConfig';

interface Promotion {
  id: number;
  name: string;
  type: 'PORCENTAJE' | 'CANTIDAD' | 'TOTAL_CARRITO';
  minQuantity: number;
  discountValue: number;
  active: boolean;
  productId?: number | null;
  categoryId?: number | null;
}

interface CartContextType {
  cart: CartItem[];
  promotions: Promotion[];
  addToCart: (items: CartItem[]) => void;
  removeFromCart: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clearCart: () => void;
  totalQuantity: number;
  getItemPriceDetails: (item: CartItem) => { originalPrice: number; finalPrice: number; hasDiscount: boolean };
  subtotalItems: number;
  discountMayorista: number;
  totalFinalPrice: number;
  montoMinimoMayorista: number;
  porcentajeMayorista: number;
  alcanzoMayorista: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('aquiles_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    api.get('/promotions')
      .then(res => setPromotions(res.data.filter((p: Promotion) => p.active)))
      .catch(err => console.error('Error al sincronizar promos:', err));
  }, []);

  useEffect(() => {
    localStorage.setItem('aquiles_cart', JSON.stringify(cart));
  }, [cart]);
  const addToCart = (newItems: CartItem[]) => {
    setCart((prev) => {
      let updated = [...prev];
      newItems.forEach((newItem) => {
        const idx = updated.findIndex(i => i.variantId === newItem.variantId);
        if (idx > -1) {
          // Si ya existe, actualizamos la cantidad (sin pasarse del stock)
          updated[idx] = { 
              ...updated[idx], 
              quantity: Math.min(updated[idx].quantity + newItem.quantity, newItem.stockMax) 
          };
        } else {
          // Si no existe, lo agregamos
          updated.push(newItem);
        }
      });
      return updated;
    });
  };

  const removeFromCart = (variantId: number) => setCart(prev => prev.filter(i => i.variantId !== variantId));
  const updateQuantity = (variantId: number, quantity: number) => setCart(prev => 
    prev.map(i => i.variantId === variantId ? { ...i, quantity: Math.min(Math.max(1, quantity), i.stockMax) } : i)
  );
  const clearCart = () => setCart([]);

  const quantityByProduct = cart.reduce((acc, item) => ({ ...acc, [item.productId]: (acc[item.productId] || 0) + item.quantity }), {} as Record<number, number>);

  const getItemPriceDetails = (item: CartItem) => {
    let finalPrice = item.price;
    const volPromo = promotions.find(p => p.productId === item.productId && p.type === 'CANTIDAD' && quantityByProduct[item.productId] >= p.minQuantity);
    const pctPromo = promotions.find(p => p.productId === item.productId && p.type === 'PORCENTAJE');
    if (volPromo) finalPrice = volPromo.discountValue;
    else if (pctPromo) finalPrice = item.price * (1 - (pctPromo.discountValue / 100));
    return { originalPrice: item.price, finalPrice, hasDiscount: finalPrice < item.price };
  };

  const totalQuantity = cart.reduce((acc, i) => acc + i.quantity, 0);
  const subtotalItems = cart.reduce((acc, i) => acc + (getItemPriceDetails(i).finalPrice * i.quantity), 0);

  // Lógica Robusta de Promo Mayorista
  const wholesalePromo = promotions.find(p => p.type === 'TOTAL_CARRITO' && p.active);
  const montoMinimoMayorista = wholesalePromo?.minQuantity || 0;
  const porcentajeMayorista = wholesalePromo?.discountValue || 0;
  
  const alcanzoMayorista = !!wholesalePromo && subtotalItems >= montoMinimoMayorista && montoMinimoMayorista > 0;
  const discountMayorista = alcanzoMayorista ? subtotalItems * (porcentajeMayorista / 100) : 0;
  const totalFinalPrice = subtotalItems - discountMayorista;

  return (
    <CartContext.Provider value={{ cart, promotions, addToCart, removeFromCart, updateQuantity, clearCart, totalQuantity, getItemPriceDetails, subtotalItems, discountMayorista, totalFinalPrice, montoMinimoMayorista, porcentajeMayorista, alcanzoMayorista }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe ser usado dentro de un CartProvider');
  return context;
};