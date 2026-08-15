// src/pages/CheckoutFailure.tsx
import { useSearchParams, Link } from 'react-router-dom';

export const CheckoutFailure = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || searchParams.get('external_reference');

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-lg shadow-md text-center">
      <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Pago no completado</h1>
      <p className="text-gray-600 mb-6">Hubo un problema al procesar tu pago o la transacción fue cancelada.</p>

      {orderId && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 inline-block text-left border border-gray-200">
          <p className="text-sm text-gray-600"><strong>Número de Orden:</strong> #{orderId}</p>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <Link
          to="/checkout"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 transition-colors"
        >
          Reintentar pago
        </Link>
        <Link
          to="/carrito"
          className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition-colors"
        >
          Volver al carrito
        </Link>
      </div>
    </div>
  );
};