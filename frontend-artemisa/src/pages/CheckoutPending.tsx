import { useSearchParams, Link } from 'react-router-dom';
import { Clock, Store, Sparkles } from 'lucide-react';

export const CheckoutPending = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || searchParams.get('external_reference');

  return (
    <div className="min-h-screen bg-artemisa-light/50 py-10 md:py-16 flex items-center justify-center p-4">
      <div className="bg-white p-6 md:p-10 rounded-3xl border border-artemisa-border max-w-xl w-full space-y-8 shadow-sm text-center">
        
        {/* ENCABEZADO */}
        <div className="space-y-3">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <Clock size={36} className="text-amber-600" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full text-amber-700 text-[10px] uppercase tracking-widest font-semibold border border-amber-200/60">
            <Sparkles size={12} /> Pago en Pendiente
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-artemisa-primary">
            Tu pago está en proceso
          </h1>
          
          <p className="text-xs md:text-sm text-artemisa-secondary max-w-md mx-auto">
            Estamos esperando la confirmación de la transacción. Si abonaste en un punto de cobro o por transferencia bancaria, la acreditación puede demorar unos minutos.
          </p>
        </div>

        {/* DETALLE DE ORDEN */}
        {orderId && (
          <div className="bg-artemisa-light/80 border border-artemisa-border rounded-2xl p-4 inline-block text-center w-full max-w-sm">
            <p className="text-xs text-artemisa-secondary font-medium">
              Número de Orden: <strong className="text-artemisa-primary font-mono text-sm">#{orderId}</strong>
            </p>
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