// src/pages/CheckoutPending.tsx
import { useSearchParams, Link } from 'react-router-dom';

export const CheckoutPending = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || searchParams.get('external_reference');

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-lg shadow-md text-center">
      <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Pago en proceso</h1>
      <p className="text-gray-600 mb-6">Tu pago está siendo procesado o requiere acreditación (por ejemplo, si pagaste en un punto de cobro o transferencia tardía).</p>

      {orderId && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 inline-block text-left border border-gray-200">
          <p className="text-sm text-gray-600"><strong>Número de Orden:</strong> #{orderId}</p>
        </div>
      )}

      <div>
        <Link
          to="/productos"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 transition-colors"
        >
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
};