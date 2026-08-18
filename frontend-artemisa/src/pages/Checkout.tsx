import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { OrderService } from '../services/order.service';
import { formatPrice } from '../utils/productUtils';
import { ChevronLeft, Truck, Store, ShoppingBag, AlertCircle, CreditCard, Landmark } from 'lucide-react';

export const Checkout = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    subtotalItems, 
    discountMayorista, 
    totalFinalPrice, 
    alcanzoMayorista,
    clearCart 
  } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<'ALL' | 'TRANSFER'>('ALL');

  // Script de Seguridad de Mercado Pago (Antifraude)
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.mercadopago.com/v2/security.js';
    script.setAttribute('output', 'artemisa_checkout');
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerDni: '',
    deliveryMethod: 'RETIRO' as 'RETIRO' | 'ENVIO',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  const shippingCost = useMemo(() => {
    if (formData.deliveryMethod === 'RETIRO') return 0;
    const cp = parseInt(formData.postalCode.trim(), 10);
    if (isNaN(cp) || cp <= 0) return 0;

    if (cp === 7400 || cp === 6550) return 3000; 
    if ((cp >= 1000 && cp <= 1999) || (cp >= 6000 && cp <= 7999)) return 5500; 
    return 7500; 
  }, [formData.deliveryMethod, formData.postalCode]);

  const baseTotal = totalFinalPrice + shippingCost;
  const transferDiscount = useMemo(() => {
    return paymentType === 'TRANSFER' ? baseTotal * 0.05 : 0;
  }, [paymentType, baseTotal]);

  const grandTotal = baseTotal - transferDiscount;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-artemisa-light flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-artemisa-border/50 rounded-full flex items-center justify-center text-artemisa-secondary mb-4">
          <ShoppingBag size={28} />
        </div>
        <h2 className="text-xl font-black text-artemisa-neutral uppercase italic">Tu carrito está vacío</h2>
        <Link to="/productos" className="mt-4 inline-flex h-11 items-center bg-artemisa-primary text-artemisa-light font-bold px-6 rounded-xl text-sm hover:bg-artemisa-secondary transition-colors">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const itemsPayload = cart.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
      }));

      const finalOrder = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        customerDni: formData.customerDni,
        deliveryMethod: formData.deliveryMethod,
        paymentMethod: paymentType === 'TRANSFER' ? 'TRANSFERENCIA' : 'MERCADOPAGO',
        paymentType,
        address: formData.deliveryMethod === 'RETIRO' ? '' : formData.address,
        city: formData.deliveryMethod === 'RETIRO' ? '' : formData.city,
        postalCode: formData.deliveryMethod === 'RETIRO' ? '' : formData.postalCode,
        shippingCost,
        items: itemsPayload
      };

      const createdOrder = await OrderService.create(finalOrder);
      const mpUrl = createdOrder.initPoint || createdOrder.sandbox_init_point;
      
      if (mpUrl) {
        window.location.href = mpUrl;
      } else if (paymentType === 'TRANSFER') {
        if (clearCart) clearCart();
        navigate('/checkout/transfer-success', { state: { order: createdOrder } });
      } else {
        setErrorMessage('No se pudo procesar la solicitud de pago.');
        setLoading(false);
      }

    } catch (error: any) {
      console.error('Error al procesar la orden:', error);
      setErrorMessage(error.response?.data?.message || 'Hubo un problema al procesar tu pedido.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-artemisa-light/50 py-6 md:py-12 w-full overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <Link to="/carrito" className="inline-flex items-center gap-2 text-sm font-bold text-artemisa-secondary hover:text-artemisa-primary transition-colors mb-6">
          <ChevronLeft size={16} /> Volver al Carrito
        </Link>

        <h1 className="text-2xl md:text-3xl font-black text-artemisa-neutral uppercase italic mb-6 tracking-tight">Finalizar Pedido</h1>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 text-sm font-bold break-words">
            <AlertCircle size={20} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Formulario de Pago y Datos */}
          <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6 w-full min-w-0">
            
            {/* 1. Datos de Contacto */}
            <div className="bg-white p-5 sm:p-6 md:p-8 rounded-3xl border border-artemisa-border shadow-sm space-y-4">
              <h2 className="text-xs sm:text-sm font-black text-artemisa-neutral uppercase border-b border-artemisa-border pb-3 tracking-wider">
                1. Datos de Contacto
              </h2>
              <div className="space-y-3">
                <input 
                  type="text" 
                  required 
                  value={formData.customerName} 
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})} 
                  placeholder="Nombre Completo" 
                  className="w-full h-12 px-4 rounded-xl border border-artemisa-border text-sm md:text-base text-artemisa-neutral bg-artemisa-light/30 focus:border-artemisa-primary focus:bg-white transition-colors outline-none" 
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="email" 
                    required 
                    value={formData.customerEmail} 
                    onChange={(e) => setFormData({...formData, customerEmail: e.target.value})} 
                    placeholder="Email" 
                    className="w-full h-12 px-4 rounded-xl border border-artemisa-border text-sm md:text-base text-artemisa-neutral bg-artemisa-light/30 focus:border-artemisa-primary focus:bg-white transition-colors outline-none" 
                  />
                  <input 
                    type="text" 
                    required 
                    value={formData.customerDni} 
                    onChange={(e) => setFormData({...formData, customerDni: e.target.value})} 
                    placeholder="DNI / CUIT" 
                    className="w-full h-12 px-4 rounded-xl border border-artemisa-border text-sm md:text-base text-artemisa-neutral bg-artemisa-light/30 focus:border-artemisa-primary focus:bg-white transition-colors outline-none font-medium" 
                  />
                </div>

                <input 
                  type="tel" 
                  required 
                  value={formData.customerPhone} 
                  onChange={(e) => setFormData({...formData, customerPhone: e.target.value})} 
                  placeholder="WhatsApp (ej: 2284123456)" 
                  className="w-full h-12 px-4 rounded-xl border border-artemisa-border text-sm md:text-base text-artemisa-neutral bg-artemisa-light/30 focus:border-artemisa-primary focus:bg-white transition-colors outline-none" 
                />
              </div>
            </div>

            {/* 2. Método de Entrega */}
            <div className="bg-white p-5 sm:p-6 md:p-8 rounded-3xl border border-artemisa-border shadow-sm space-y-4">
              <h2 className="text-xs sm:text-sm font-black text-artemisa-neutral uppercase border-b border-artemisa-border pb-3 tracking-wider">
                2. Método de Entrega
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`flex items-center sm:flex-col sm:justify-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all min-w-0 ${formData.deliveryMethod === 'RETIRO' ? 'border-artemisa-primary bg-artemisa-light text-artemisa-primary' : 'border-artemisa-border text-artemisa-secondary hover:border-artemisa-secondary'}`}>
                  <input type="radio" name="deliveryMethod" className="sr-only" checked={formData.deliveryMethod === 'RETIRO'} onChange={() => setFormData({...formData, deliveryMethod: 'RETIRO'})} />
                  <Store size={22} className="shrink-0" /> 
                  <span className="text-xs font-bold uppercase truncate">Retiro en Local</span>
                </label>

                <label className={`flex items-center sm:flex-col sm:justify-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all min-w-0 ${formData.deliveryMethod === 'ENVIO' ? 'border-artemisa-primary bg-artemisa-light text-artemisa-primary' : 'border-artemisa-border text-artemisa-secondary hover:border-artemisa-secondary'}`}>
                  <input type="radio" name="deliveryMethod" className="sr-only" checked={formData.deliveryMethod === 'ENVIO'} onChange={() => setFormData({...formData, deliveryMethod: 'ENVIO'})} />
                  <Truck size={22} className="shrink-0" /> 
                  <span className="text-xs font-bold uppercase truncate">Envío a Domicilio</span>
                </label>
              </div>

              {formData.deliveryMethod === 'ENVIO' && (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input 
                      type="text" 
                      required 
                      value={formData.postalCode} 
                      onChange={(e) => setFormData({...formData, postalCode: e.target.value})} 
                      placeholder="Código Postal" 
                      className="sm:col-span-1 h-12 px-4 rounded-xl border border-artemisa-border text-sm md:text-base text-artemisa-neutral bg-artemisa-light/30 focus:border-artemisa-primary outline-none font-bold" 
                    />
                    <input 
                      type="text" 
                      required 
                      value={formData.city} 
                      onChange={(e) => setFormData({...formData, city: e.target.value})} 
                      placeholder="Ciudad" 
                      className="sm:col-span-2 h-12 px-4 rounded-xl border border-artemisa-border text-sm md:text-base text-artemisa-neutral bg-artemisa-light/30 focus:border-artemisa-primary outline-none" 
                    />
                  </div>
                  
                  <input 
                    type="text" 
                    required 
                    value={formData.address} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})} 
                    placeholder="Dirección, Altura, Piso / Dpto" 
                    className="w-full h-12 px-4 rounded-xl border border-artemisa-border text-sm md:text-base text-artemisa-neutral bg-artemisa-light/30 focus:border-artemisa-primary outline-none" 
                  />

                  <div className="p-3 bg-artemisa-light/80 border border-artemisa-border rounded-xl text-xs text-artemisa-neutral flex justify-between items-center flex-wrap gap-2">
                    <span>Tiempo estimado de entrega:</span>
                    <strong className="text-artemisa-primary">3 a 6 días hábiles</strong>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Medio de Pago */}
            <div className="bg-white p-5 sm:p-6 md:p-8 rounded-3xl border border-artemisa-border shadow-sm space-y-4">
              <h2 className="text-xs sm:text-sm font-black text-artemisa-neutral uppercase border-b border-artemisa-border pb-3 tracking-wider">
                3. Medio de Pago
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`flex items-start gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all min-w-0 ${paymentType === 'ALL' ? 'border-artemisa-primary bg-artemisa-light text-artemisa-primary' : 'border-artemisa-border text-artemisa-secondary hover:border-artemisa-secondary'}`}>
                  <input type="radio" name="paymentType" className="sr-only" checked={paymentType === 'ALL'} onChange={() => setPaymentType('ALL')} />
                  <CreditCard size={22} className="shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase truncate">Tarjetas / Mercado Pago</p>
                    <p className="text-[10px] opacity-80 truncate">Pasarela Mercado Pago</p>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all min-w-0 ${paymentType === 'TRANSFER' ? 'border-artemisa-primary bg-artemisa-light text-artemisa-primary' : 'border-artemisa-border text-artemisa-secondary hover:border-artemisa-secondary'}`}>
                  <input type="radio" name="paymentType" className="sr-only" checked={paymentType === 'TRANSFER'} onChange={() => setPaymentType('TRANSFER')} />
                  <Landmark size={22} className="shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase text-artemisa-accent truncate">Transferencia Directa (5% OFF)</p>
                    <p className="text-[10px] opacity-80 truncate">Alias / CBU bancario</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Botón de Confirmación y Pago */}
            <div className="space-y-3 pt-2">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full h-14 bg-artemisa-primary text-artemisa-light font-black uppercase rounded-2xl shadow-lg hover:bg-artemisa-secondary transition-all flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-50 px-4 text-center"
              >
                {paymentType === 'TRANSFER' ? <Landmark size={20} className="shrink-0" /> : <CreditCard size={20} className="shrink-0" />}
                <span className="text-xs sm:text-sm md:text-base truncate">
                  {loading 
                    ? 'Procesando pedido...' 
                    : (paymentType === 'TRANSFER' ? 'Confirmar Pedido por Transferencia' : 'Ir a Pagar en Mercado Pago')
                  }
                </span>
              </button>

              <div className="text-center space-y-1">
                <p className="text-xs font-semibold text-artemisa-secondary px-2">
                  {paymentType === 'TRANSFER' 
                    ? 'Te mostraremos los datos bancarios para realizar la transferencia'
                    : 'Serás redirigido a Mercado Pago para completar tu pago'
                  }
                </p>
              </div>
            </div>
          </form>

          {/* Resumen Final Lateral */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-6 md:p-8 rounded-3xl border border-artemisa-border shadow-sm lg:sticky lg:top-6 w-full min-w-0">
            <h2 className="font-black mb-4 uppercase text-xs sm:text-sm text-artemisa-secondary border-b border-artemisa-border pb-3 tracking-wider">
              Resumen de Compra
            </h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between font-medium text-artemisa-neutral gap-2">
                <span className="truncate">Subtotal Productos</span>
                <span className="shrink-0">{formatPrice(subtotalItems)}</span>
              </div>
              
              {alcanzoMayorista && (
                <div className="text-artemisa-primary font-bold flex justify-between gap-2">
                  <span className="truncate">Desc. Mayorista</span>
                  <span className="shrink-0">-{formatPrice(discountMayorista)}</span>
                </div>
              )}

              <div className="flex justify-between font-medium text-artemisa-neutral gap-2">
                <span className="truncate">Costo de Envío</span>
                <span className="shrink-0">
                  {formData.deliveryMethod === 'RETIRO' ? 'GRATIS' : (shippingCost > 0 ? formatPrice(shippingCost) : 'Ingresá tu CP')}
                </span>
              </div>

              {paymentType === 'TRANSFER' && (
                <div className="text-artemisa-accent font-bold flex justify-between bg-artemisa-light p-2.5 rounded-xl gap-2 text-xs sm:text-sm">
                  <span className="truncate">Desc. Transferencia (5%)</span>
                  <span className="shrink-0">-{formatPrice(transferDiscount)}</span>
                </div>
              )}

              <div className="text-xl sm:text-2xl font-black pt-4 border-t border-artemisa-border mt-3 flex justify-between items-center text-artemisa-neutral gap-2">
                <span>Total a Pagar</span>
                <span className="text-artemisa-accent shrink-0">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};