import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/productUtils';
import { Trash2, Minus, Plus, ShoppingBag, Percent, Sparkles, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const CartPage = () => {
  const { 
    cart, updateQuantity, removeFromCart, totalQuantity,
    getItemPriceDetails, subtotalItems, discountMayorista, totalFinalPrice, 
    montoMinimoMayorista, alcanzoMayorista, porcentajeMayorista 
  } = useCart();

  const navigate = useNavigate();

  const montoFaltante = Math.max(0, montoMinimoMayorista - subtotalItems);
  const porcentajeProgreso = montoMinimoMayorista > 0 ? Math.min((subtotalItems / montoMinimoMayorista) * 100, 100) : 100;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-artemisa-light text-artemisa-accent rounded-full flex items-center justify-center mb-6 border border-artemisa-border">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-black text-artemisa-neutral uppercase tracking-tight">Tu carrito está vacío</h2>
        <p className="text-artemisa-secondary text-sm mt-2 max-w-sm">
          Todavía no agregaste ninguna variante de producto a tu pedido.
        </p>
        <Link 
          to="/productos" 
          className="mt-6 inline-flex h-12 items-center justify-center px-6 bg-artemisa-primary text-artemisa-light font-black uppercase text-xs tracking-wider rounded-xl hover:bg-artemisa-secondary transition-all"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-artemisa-light/50 py-4 md:py-12">
      <div className="container mx-auto px-2 sm:px-4 max-w-5xl">
        <h2 className="text-3xl font-black text-artemisa-neutral uppercase tracking-tight italic mb-8">
          Detalle de tu Carrito
        </h2>

        {/* BARRA DINÁMICA DE PROMO MAYORISTA */}
        {montoMinimoMayorista > 0 && (
          <div className={`p-5 rounded-3xl border transition-all mb-8 shadow-sm ${
            alcanzoMayorista 
              ? 'bg-artemisa-light border-artemisa-accent text-artemisa-primary' 
              : 'bg-artemisa-light/80 border-artemisa-border text-artemisa-neutral'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {alcanzoMayorista 
                ? <Sparkles size={18} className="text-artemisa-accent animate-pulse" /> 
                : <Percent size={18} className="text-artemisa-secondary" />
              }
              <span className="text-sm font-black uppercase tracking-tight">
                {alcanzoMayorista ? '¡Beneficio Mayorista Activado!' : 'Beneficio de Compra Mayorista'}
              </span>
            </div>

            {alcanzoMayorista ? (
              <p className="text-xs font-semibold">
                ¡Excelente! Se aplicó automáticamente un <strong>{porcentajeMayorista}% OFF extra</strong> sobre el total de tu pedido.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-semibold">
                  Estás a <strong className="text-artemisa-primary">${montoFaltante.toLocaleString('es-AR')}</strong> de bonificar un {porcentajeMayorista}% general.
                </p>
                <div className="w-full bg-artemisa-border h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-artemisa-accent h-full transition-all duration-500 ease-out" 
                    style={{ width: `${porcentajeProgreso}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 items-start">
          
          {/* LISTA DE PRODUCTOS */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const { originalPrice, finalPrice, hasDiscount } = getItemPriceDetails(item);
              return (
                <div key={item.variantId} className="bg-white p-4 sm:p-6 rounded-3xl border border-artemisa-border shadow-sm flex items-center gap-4">
                  <img src={item.image} alt={item.productName} className="w-16 h-16 rounded-xl object-cover border border-artemisa-border shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-artemisa-neutral text-sm truncate">{item.productName}</h4>
                    <p className="text-xs text-artemisa-secondary">{item.variantName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-black text-artemisa-neutral">{formatPrice(finalPrice)}</p>
                      {hasDiscount && (
                        <p className="text-xs text-artemisa-secondary line-through font-semibold">
                          {formatPrice(originalPrice)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-artemisa-light border border-artemisa-border rounded-xl h-9 px-2">
                      <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="p-1 text-artemisa-neutral"><Minus size={12} /></button>
                      <span className="w-6 text-center text-xs font-black">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="p-1 text-artemisa-neutral"><Plus size={12} /></button>
                    </div>

                    <button onClick={() => removeFromCart(item.variantId)} className="text-artemisa-accent hover:text-red-600 p-2">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RESUMEN */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-artemisa-border shadow-sm space-y-6 w-full sticky top-24">
            <h3 className="text-xl font-black text-artemisa-neutral uppercase tracking-tight">Resumen</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-artemisa-secondary">
                <span>Subtotal ({totalQuantity} prod.)</span>
                <span className="font-bold text-artemisa-neutral">{formatPrice(subtotalItems)}</span>
              </div>
              
              {alcanzoMayorista && (
                <div className="flex justify-between text-artemisa-primary font-bold">
                  <span>Desc. Mayorista ({porcentajeMayorista}%)</span>
                  <span>-{formatPrice(discountMayorista)}</span>
                </div>
              )}

              <div className="pt-4 border-t border-artemisa-border flex justify-between items-center text-base">
                <span className="font-black text-artemisa-neutral">Total</span>
                <span className="text-2xl font-black text-artemisa-accent">{formatPrice(totalFinalPrice)}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')} 
              className="w-full h-14 bg-artemisa-primary text-artemisa-light font-black uppercase text-sm rounded-2xl flex items-center justify-center gap-2 hover:bg-artemisa-secondary transition-all"
            >
              <span>Continuar al Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};