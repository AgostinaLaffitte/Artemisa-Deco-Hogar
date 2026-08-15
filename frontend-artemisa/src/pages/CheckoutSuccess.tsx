// src/pages/CheckoutSuccess.tsx
import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  
  // MP puede devolver 'external_reference' o tu backend 'orderId'
  const orderId = searchParams.get('orderId') || searchParams.get('external_reference');
  const paymentId = searchParams.get('payment_id');
  const { clearCart } = useCart();

  useEffect(() => {
    // Vaciamos el carrito cuando la compra se confirma al volver de MP
    clearCart();
  }, []);

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-lg shadow-md text-center">
      <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Gracias por tu compra!</h1>
      <p className="text-gray-600 mb-6">Tu pedido ha sido procesado con éxito.</p>

      {orderId && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 inline-block text-left border border-gray-200">
          <p className="text-sm text-gray-600"><strong>Número de Orden:</strong> #{orderId}</p>
          {paymentId && <p className="text-sm text-gray-600"><strong>ID de Pago (MP):</strong> {paymentId}</p>}
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