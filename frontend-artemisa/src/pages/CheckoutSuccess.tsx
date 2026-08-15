import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle2, Store, Sparkles, CreditCard } from 'lucide-react';

export const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  
  const orderId = searchParams.get('orderId') || searchParams.get('external_reference');
  const paymentId = searchParams.get('payment_id');
  const { clearCart } = useCart();

  useEffect(() => {
    // Vaciamos el carrito cuando la compra se confirma al volver de MP
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-artemisa-light/50 py-10 md:py-16 flex items-center justify-center p-4">
      <div className="bg-white p-6 md:p-10 rounded-3xl border border-artemisa-border max-w-xl w-full space-y-8 shadow-sm text-center">
        
        {/* ENCABEZADO */}
        <div className="space-y-3">
          <div className="w-16 h-16 bg-artemisa-border/40 text-artemisa-primary rounded-full flex items-center justify-center mx-auto border border-artemisa-accent/30">
            <CheckCircle2 size={36} className="text-artemisa-accent" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-artemisa-border/40 rounded-full text-artemisa-secondary text-[10px] uppercase tracking-widest font-semibold">
            <Sparkles size={12} /> Compra Confirmada
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-artemisa-primary">
            ¡Gracias por tu compra!
          </h1>
          
          <p className="text-xs md:text-sm text-artemisa-secondary max-w-md mx-auto">
            Tu pedido ha sido procesado con éxito. Ya comenzamos a prepararlo con la atención y dedicación artesanal de Artemisa.
          </p>
        </div>

        {/* DETALLES DE TRANSACCIÓN */}
        {orderId && (
          <div className="bg-artemisa-light/80 border border-artemisa-border rounded-2xl p-4 space-y-1.5 text-left max-w-sm mx-auto">
            <p className="text-xs text-artemisa-secondary flex justify-between items-center">
              <span>Número de Orden:</span>
              <strong className="text-artemisa-primary font-mono text-xs">#{orderId}</strong>
            </p>
            {paymentId && (
              <p className="text-xs text-artemisa-secondary flex justify-between items-center border-t border-artemisa-border/60 pt-1.5">
                <span className="flex items-center gap-1">
                  <CreditCard size={12} className="text-artemisa-accent" /> ID de Pago (MP):
                </span>
                <span className="font-mono text-[11px] text-artemisa-neutral">{paymentId}</span>
              </p>
            )}
          </div>
        )}

        {/* ACCIÓN PRINCIPAL */}
        <div className="pt-2">
          <Link
            to="/productos"
            className="w-full h-12 bg-artemisa-primary hover:bg-artemisa-neutral text-artemisa-light font-medium text-xs md:text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 border border-artemisa-accent/30 hover:scale-[1.01] active:scale-[0.99]"
          >
            <Store size={18} className="text-artemisa-accent" />
            <span>Volver a la tienda</span>
          </Link>
        </div>

      </div>
    </div>
  );
};