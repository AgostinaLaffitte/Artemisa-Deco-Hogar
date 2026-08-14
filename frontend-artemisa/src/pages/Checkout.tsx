import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { OrderService } from '../services/order.service';
import { formatPrice } from '../utils/productUtils';
import { ChevronLeft, Truck, Store, ShoppingBag, AlertCircle, CreditCard, Landmark } from 'lucide-react';

export const Checkout = () => {
  const { 
    cart, 
    subtotalItems, 
    discountMayorista, 
    totalFinalPrice, 
    alcanzoMayorista 
  } = useCart();
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Nuevo estado para la opción de pago elegida
  const [paymentType, setPaymentType] = useState<'ALL' | 'TRANSFER'>('ALL');

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
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

  // Cálculos de descuento por transferencia
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
        deliveryMethod: formData.deliveryMethod,
        paymentMethod: 'MERCADOPAGO',
        paymentType, // Pasamos si es 'ALL' o 'TRANSFER'
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
      } else {
        navigate('/pedido-confirmado', { state: { orderId: createdOrder.id } });
      }

    } catch (error: any) {
      console.error('Error al procesar la orden:', error);
      setErrorMessage(error.response?.data?.message || 'Hubo un problema al procesar tu pedido.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-artemisa-light/50 py-6 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/carrito" className="inline-flex items-center gap-2 text-sm font-bold text-artemisa-secondary hover:text-artemisa-primary transition-colors mb-4">
          <ChevronLeft size={16} /> Volver al Carrito
        </Link>

        <h1 className="text-2xl font-black text-artemisa-neutral uppercase italic mb-6">Finalizar Pedido</h1>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-3 text-sm font-bold">
            <AlertCircle size={20} className="shrink-0" />
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
            
            {/* 1. Datos de Contacto */}
            <div className="bg-white p-5 md:p-8 rounded-3xl border border-artemisa-border shadow-sm space-y-4">
              <h2 className="text-sm font-black text-artemisa-neutral uppercase border-b border-artemisa-border pb-2">1. Datos de Contacto</h2>
              <div className="space-y-3">
                <input type="text" required value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} placeholder="Nombre Completo" className="w-full h-12 px-4 rounded-xl border border-artemisa-border text-base text-artemisa-neutral bg-artemisa-light/30 focus:border-artemisa-primary outline-none" />
                <input type="email" required value={formData.customerEmail} onChange={(e) => setFormData({...formData, customerEmail: e.target.value})} placeholder="Email" className="w-full h-12 px-4 rounded-xl border border-artemisa-border text-base text-artemisa-neutral bg-artemisa-light/30 focus:border-artemisa-primary outline-none" />
                <input type="tel" required value={formData.customerPhone} onChange={(e) => setFormData({...formData, customerPhone: e.target.value})} placeholder="WhatsApp (ej: 2284123456)" className="w-full h-12 px-4 rounded-xl border border-artemisa-border text-base text-artemisa-neutral bg-artemisa-light/30 focus:border-artemisa-primary outline-none" />
              </div>
            </div>

            {/* 2. Entrega */}
            <div className="bg-white p-5 md:p-8 rounded-3xl border border-artemisa-border shadow-sm space-y-4">
              <h2 className="text-sm font-black text-artemisa-neutral uppercase border-b border-artemisa-border pb-2">2. Método de Entrega</h2>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex flex-col items-center justify-center gap-2 p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.deliveryMethod === 'RETIRO' ? 'border-artemisa-primary bg-artemisa-light text-artemisa-primary' : 'border-artemisa-border text-artemisa-secondary hover:border-artemisa-secondary'}`}>
                  <input type="radio" name="deliveryMethod" className="sr-only" checked={formData.deliveryMethod === 'RETIRO'} onChange={() => setFormData({...formData, deliveryMethod: 'RETIRO'})} />
                  <Store size={22} /> <span className="text-xs font-bold uppercase">Retiro en Local</span>
                </label>
                <label className={`flex flex-col items-center justify-center gap-2 p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.deliveryMethod === 'ENVIO' ? 'border-artemisa-primary bg-artemisa-light text-artemisa-primary' : 'border-artemisa-border text-artemisa-secondary hover:border-artemisa-secondary'}`}>
                  <input type="radio" name="deliveryMethod" className="sr-only" checked={formData.deliveryMethod === 'ENVIO'} onChange={() => setFormData({...formData, deliveryMethod: 'ENVIO'})} />
                  <Truck size={22} /> <span className="text-xs font-bold uppercase">Envío a Domicilio</span>
                </label>
              </div>

              {formData.deliveryMethod === 'ENVIO' && (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" required value={formData.postalCode} onChange={(e) => setFormData({...formData, postalCode: e.target.value})} placeholder="Código Postal" className="col-span-1 h-12 px-4 rounded-xl border border-artemisa-border text-base text-artemisa-neutral bg-artemisa-light/30 focus:border-artemisa-primary outline-none font-bold" />
                    <input type="text" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} placeholder="Ciudad" className="col-span-2 h-12 px-4 rounded-xl border border-artemisa-border text-base text-artemisa-neutral bg-artemisa-light/30 focus:border-artemisa-primary outline-none" />
                  </div>
                  <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Dirección, Altura, Piso / Dpto" className="w-full h-12 px-4 rounded-xl border border-artemisa-border text-base text-artemisa-neutral bg-artemisa-light/30 focus:border-artemisa-primary outline-none" />

                  <div className="p-3 bg-artemisa-light/80 border border-artemisa-border rounded-xl text-xs text-artemisa-neutral flex justify-between items-center">
                    <span>Tiempo estimado de entrega:</span>
                    <strong className="text-artemisa-primary">3 a 6 días hábiles</strong>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Forma de Pago */}
            <div className="bg-white p-5 md:p-8 rounded-3xl border border-artemisa-border shadow-sm space-y-4">
              <h2 className="text-sm font-black text-artemisa-neutral uppercase border-b border-artemisa-border pb-2">3. Medio de Pago</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentType === 'ALL' ? 'border-artemisa-primary bg-artemisa-light text-artemisa-primary' : 'border-artemisa-border text-artemisa-secondary hover:border-artemisa-secondary'}`}>
                  <input type="radio" name="paymentType" className="sr-only" checked={paymentType === 'ALL'} onChange={() => setPaymentType('ALL')} />
                  <CreditCard size={22} className="shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase">Tarjetas o Débito</p>
                    <p className="text-[10px] opacity-80">Mercado Pago estándar</p>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentType === 'TRANSFER' ? 'border-artemisa-primary bg-artemisa-light text-artemisa-primary' : 'border-artemisa-border text-artemisa-secondary hover:border-artemisa-secondary'}`}>
                  <input type="radio" name="paymentType" className="sr-only" checked={paymentType === 'TRANSFER'} onChange={() => setPaymentType('TRANSFER')} />
                  <Landmark size={22} className="shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase text-artemisa-accent">Transferencia (5% OFF)</p>
                    <p className="text-[10px] opacity-80">Pagas por MP con CVU/CBU</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Botón de Confirmación y Pago */}
            <div className="space-y-3">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full h-14 bg-artemisa-primary text-artemisa-light font-black uppercase rounded-2xl shadow-lg hover:bg-artemisa-secondary transition-all flex items-center justify-center gap-3 active:scale-[0.99]"
              >
                <CreditCard size={20} />
                <span>{loading ? 'Procesando pedido...' : 'Ir a Pagar'}</span>
              </button>

              <div className="text-center space-y-1">
                <p className="text-xs font-semibold text-artemisa-secondary">
                  Serás redirigido a Mercado Pago para completar tu pago
                </p>
              </div>
            </div>
          </form>

          {/* Resumen Final */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-artemisa-border shadow-sm sticky top-6">
            <h2 className="font-black mb-4 uppercase text-sm text-artemisa-secondary border-b border-artemisa-border pb-2">Resumen de Compra</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between font-medium text-artemisa-neutral">
                <span>Subtotal Productos</span>
                <span>{formatPrice(subtotalItems)}</span>
              </div>
              
              {alcanzoMayorista && (
                <div className="text-artemisa-primary font-bold flex justify-between">
                  <span>Desc. Mayorista</span>
                  <span>-{formatPrice(discountMayorista)}</span>
                </div>
              )}

              <div className="flex justify-between font-medium text-artemisa-neutral">
                <span>Costo de Envío</span>
                <span>{formData.deliveryMethod === 'RETIRO' ? 'GRATIS' : (shippingCost > 0 ? formatPrice(shippingCost) : 'Ingresá tu CP')}</span>
              </div>

              {paymentType === 'TRANSFER' && (
                <div className="text-artemisa-accent font-bold flex justify-between bg-artemisa-light p-2 rounded-lg">
                  <span>Desc. Transferencia (5%)</span>
                  <span>-{formatPrice(transferDiscount)}</span>
                </div>
              )}

              <div className="text-2xl font-black pt-4 border-t border-artemisa-border mt-2 flex justify-between items-center text-artemisa-neutral">
                <span>Total a Pagar</span>
                <span className="text-artemisa-accent">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};