import { useEffect, useState } from 'react';
import { ProductService } from '../services/product.service';
import { ProductList } from '../components/ProductList';
import type { Product } from '../types/product';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, CheckCircle2, AlertCircle } from 'lucide-react';

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [searchParams] = useSearchParams();
  const searchFilter = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';

  const notify = (message: any, type: 'success' | 'error') => {
    const finalMessage = Array.isArray(message) ? message.join(', ') : message;
    setNotification({ message: finalMessage, type });
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    const loadFilteredProducts = async () => {
      try {
        setLoading(true);
        const catId = categoryFilter ? Number(categoryFilter) : undefined;
        const data = await ProductService.getAll(searchFilter, catId);
        setProducts(data);
      } catch (error) {
        console.error('Error al filtrar el catálogo de productos:', error);
        notify('No se pudieron cargar los productos. Intentá nuevamente más tarde.', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadFilteredProducts(); 
  }, [searchFilter, categoryFilter]);

  return (
    <div className="min-h-screen bg-artemisa-light py-8 md:py-12 text-artemisa-neutral">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border animate-in slide-in-from-right-4 ${
          notification.type === 'success' 
            ? 'bg-artemisa-primary text-artemisa-light border-artemisa-accent' 
            : 'bg-rose-950 text-rose-100 border-rose-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} className="text-artemisa-accent" /> : <AlertCircle size={20} className="text-rose-400" />}
          <p className="font-semibold text-xs tracking-wide">{notification.message}</p>
        </div>
      )}

      <div className="container mx-auto px-4">
        
        {/* Cabecera del catálogo */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-artemisa-border pb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-artemisa-accent block mb-1">
              Colección Artemisa
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-artemisa-primary tracking-tight">
              {searchFilter ? `Resultados para: "${searchFilter}"` : 'Catálogo de Confecciones'}
            </h2>
            <p className="text-xs text-artemisa-secondary mt-1">
              {products.length} {products.length === 1 ? 'diseño disponible' : 'diseños disponibles'}.
            </p>
          </div>
          
          {/* Indicador visual de filtros activos */}
          {(searchFilter || categoryFilter) && (
            <div className="flex items-center gap-2 self-start bg-white border border-artemisa-border px-4 py-2 rounded-xl shadow-sm text-xs text-artemisa-secondary font-medium">
              <SlidersHorizontal size={14} className="text-artemisa-accent" />
              Filtro activo
            </div>
          )}
        </div>

        {/* Zona de Renderizado */}
        {loading ? (
          <div className="py-24 flex justify-center items-center flex-col gap-3">
            <div className="animate-spin rounded-full h-9 w-9 border-2 border-artemisa-accent border-t-transparent"></div>
            <span className="text-xs text-artemisa-secondary font-medium">Cargando catálogo...</span>
          </div>
        ) : (
          <ProductList products={products} />
        )}

      </div>
    </div>
  );
};