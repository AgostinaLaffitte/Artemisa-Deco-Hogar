import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, RefreshCw, ShoppingBag, AlertTriangle } from 'lucide-react';

export const CheckoutFailure = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || searchParams.get('external_reference');

  return (
    <div className="min-h-screen bg-artemisa-light/50 py-10 md:py-16 flex items-center justify-center p-4">
      <div className="bg-white p-6 md:p-10 rounded-3xl border border-artemisa-border max-w-xl w-full space-y-8 shadow-sm text-center">
        
        {/* ENCABEZADO */}
        <div className="space-y-3">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-200">
            <XCircle size={36} className="text-red-500" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 rounded-full text-red-600 text-[10px] uppercase tracking-widest font-semibold border border-red-200/50">
            <AlertTriangle size={12} /> Pago Incompleto
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-artemisa-primary">
            No pudimos procesar tu pago
          </h1>
          
          <p className="text-xs md:text-sm text-artemisa-secondary max-w-md mx-auto">
            Hubo un inconveniente con el medio de pago o la transacción fue cancelada. No se ha realizado ningún cargo en tu cuenta.
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

        {/* ACCIONES */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Link
            to="/checkout"
            className="w-full sm:w-auto px-6 h-12 bg-artemisa-primary hover:bg-artemisa-neutral text-artemisa-light font-medium text-xs md:text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 border border-artemisa-accent/30 hover:scale-[1.01] active:scale-[0.99]"
          >
            <RefreshCw size={16} className="text-artemisa-accent" />
            <span>Reintentar pago</span>
          </Link>

          <Link
            to="/carrito"
            className="w-full sm:w-auto px-6 h-12 bg-transparent hover:bg-artemisa-light text-artemisa-secondary font-bold text-xs uppercase tracking-wider rounded-2xl border border-artemisa-border transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} />
            <span>Volver al carrito</span>
          </Link>
        </div>

      </div>
    </div>
  );
};