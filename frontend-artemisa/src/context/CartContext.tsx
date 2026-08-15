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
  addToCart: (items: CartItem | CartItem[]) => void;
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

  // 🛡️ Inicialización hiper-segura del Carrito
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('aquiles_cart');
      if (!savedCart) return [];
      const parsed = JSON.parse(savedCart);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // 🛡️ Petición de Promociones a prueba de errores
  useEffect(() => {
    api.get('/promotions')
      .then(res => {
        let rawData: any[] = [];
        if (Array.isArray(res.data)) {
          rawData = res.data;
        } else if (res.data && typeof res.data === 'object') {
          const arrayKey = Object.keys(res.data).find(k => Array.isArray(res.data[k]));
          if (arrayKey) rawData = res.data[arrayKey];
        }
        setPromotions(rawData.filter((p: Promotion) => p && p.active));
      })
      .catch(err => {
        console.error('Error al sincronizar promos:', err);
        setPromotions([]);
      });
  }, []);

  // 🛡️ Sincronización con localStorage segura
  useEffect(() => {
    try {
      localStorage.setItem('aquiles_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error al guardar en localStorage:', e);
    }
  }, [cart]);

  // 🛡️ Agregar al carrito tolerante a items unitarios o arrays
  const addToCart = (newItems: CartItem | CartItem[]) => {
    const itemsArray = Array.isArray(newItems) ? newItems : [newItems];

    setCart((prev) => {
      const currentCart = Array.isArray(prev) ? prev : [];
      let updated = [...currentCart];

      itemsArray.forEach((newItem) => {
        if (!newItem || !newItem.variantId) return;
        const idx = updated.findIndex(i => i.variantId === newItem.variantId);
        if (idx > -1) {
          updated[idx] = { 
            ...updated[idx], 
            quantity: Math.min(updated[idx].quantity + newItem.quantity, newItem.stockMax || 99) 
          };
        } else {
          updated.push(newItem);
        }
      });
      return updated;
    });
  };

  const removeFromCart = (variantId: number) => {
    setCart(prev => (Array.isArray(prev) ? prev.filter(i => i.variantId !== variantId) : []));
  };

  const updateQuantity = (variantId: number, quantity: number) => {
    setCart(prev => 
      (Array.isArray(prev) ? prev : []).map(i => 
        i.variantId === variantId 
          ? { ...i, quantity: Math.min(Math.max(1, quantity), i.stockMax || 99) } 
          : i
      )
    );
  };

  const clearCart = () => setCart([]);

  // 🛡️ Cálculo seguro de cantidades por producto
  const safeCart = Array.isArray(cart) ? cart : [];
  
  const quantityByProduct = safeCart.reduce((acc, item) => {
    if (!item || !item.productId) return acc;
    acc[item.productId] = (acc[item.productId] || 0) + (item.quantity || 0);
    return acc;
  }, {} as Record<number, number>);

  const getItemPriceDetails = (item: CartItem) => {
    if (!item || typeof item.price !== 'number') {
      return { originalPrice: 0, finalPrice: 0, hasDiscount: false };
    }
    let finalPrice = item.price;
    const safePromos = Array.isArray(promotions) ? promotions : [];

    const volPromo = safePromos.find(p => p.productId === item.productId && p.type === 'CANTIDAD' && (quantityByProduct[item.productId] || 0) >= p.minQuantity);
    const pctPromo = safePromos.find(p => p.productId === item.productId && p.type === 'PORCENTAJE');

    if (volPromo) finalPrice = volPromo.discountValue;
    else if (pctPromo) finalPrice = item.price * (1 - (pctPromo.discountValue / 100));

    return { originalPrice: item.price, finalPrice, hasDiscount: finalPrice < item.price };
  };

  const totalQuantity = safeCart.reduce((acc, i) => acc + (i?.quantity || 0), 0);
  const subtotalItems = safeCart.reduce((acc, i) => acc + (getItemPriceDetails(i).finalPrice * (i?.quantity || 0)), 0);

  // Lógica Mayorista
  const safePromos = Array.isArray(promotions) ? promotions : [];
  const wholesalePromo = safePromos.find(p => p.type === 'TOTAL_CARRITO' && p.active);
  const montoMinimoMayorista = wholesalePromo?.minQuantity || 0;
  const porcentajeMayorista = wholesalePromo?.discountValue || 0;
  
  const alcanzoMayorista = !!wholesalePromo && subtotalItems >= montoMinimoMayorista && montoMinimoMayorista > 0;
  const discountMayorista = alcanzoMayorista ? subtotalItems * (porcentajeMayorista / 100) : 0;
  const totalFinalPrice = subtotalItems - discountMayorista;

  return (
    <CartContext.Provider value={{ 
      cart: safeCart, 
      promotions: safePromos, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      totalQuantity, 
      getItemPriceDetails, 
      subtotalItems, 
      discountMayorista, 
      totalFinalPrice, 
      montoMinimoMayorista, 
      porcentajeMayorista, 
      alcanzoMayorista 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe ser usado dentro de un CartProvider');
  return context;
};