import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, FolderOpen, Loader2, AlertCircle,CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig'; 
import type { Product } from '../../types/product';


export const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // ID del producto que está en estado de "confirmación de borrado"
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const notify = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };


  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error al traer productos de la base de datos:', error);
      notify('Error al cargar los productos.', 'error');
    } finally {
      setLoading(false);
    }
  };
    useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: number) => {
    try {
      setIsDeleting(true);
      await api.delete(`/products/${id}`);
      notify('Producto eliminado con éxito.', 'success');
      setProducts((prev) => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      notify('No se pudo eliminar el producto. Comprobá las dependencias o variantes.', 'error');
    } finally {
      setIsDeleting(false);
      setDeletingProductId(null);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchName = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchId = product.id.toString() === searchTerm.trim();
    return matchName || matchId;
  });

  return (
    <div className="space-y-6 text-artemisa-neutral">
      {notification && (
        <div className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border animate-in slide-in-from-right-4 ${
          notification.type === 'success' 
            ? 'bg-artemisa-light text-artemisa-primary border-artemisa-border' 
            : 'bg-white text-artemisa-neutral border-artemisa-neutral'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} className="text-artemisa-secondary" /> : <AlertCircle size={20} className="text-artemisa-accent" />}
          <p className="font-bold text-sm">{notification.message}</p>
        </div>
      )}
      {/* Encabezado con Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-artemisa-border shadow-sm">
        <div>
          <h1 className="text-xl font-black text-artemisa-primary uppercase tracking-tight">Gestión de Catálogo</h1>
          <p className="text-xs text-artemisa-secondary mt-1 font-medium">Buscá, editá precios, stock y variantes de tus productos.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            to="/admin/categorias"
            className="h-10 px-4 rounded-xl border-2 border-artemisa-border text-artemisa-secondary hover:border-artemisa-secondary hover:text-artemisa-primary transition-all font-bold text-xs flex items-center gap-2 bg-white"
          >
            <FolderOpen size={16} />
            Ver Categorías
          </Link>

          <Link
            to="/admin/productos/nuevo"
            className="h-10 px-5 rounded-xl bg-artemisa-primary text-artemisa-light hover:bg-artemisa-neutral transition-all font-black text-xs flex items-center gap-2 uppercase tracking-wider shadow-sm"
          >
            <Plus size={16} />
            Nuevo Producto
          </Link>
        </div>
      </div>

      {/* Barra de Búsqueda Inteligente */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Buscar por nombre o código ID (ej: 1)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-artemisa-border rounded-xl py-3 pl-4 pr-12 focus:border-artemisa-secondary focus:ring-1 focus:ring-artemisa-secondary outline-none transition-all text-sm font-medium shadow-sm text-artemisa-neutral focus:bg-artemisa-light/30"
        />
        <Search className="absolute right-4 top-3.5 text-artemisa-secondary" size={18} />
      </div>

    
      <div className="bg-white rounded-2xl border border-artemisa-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-artemisa-secondary">
            <Loader2 size={32} className="animate-spin text-artemisa-accent" />
            <span className="text-sm font-medium">Conectando con la base de datos...</span>
          </div>
        ) : (
          <div className="w-full">
            {/* Encabezados - Se ocultan en mobile */}
            <div className="hidden md:grid grid-cols-6 bg-artemisa-light/50 border-b border-artemisa-border text-artemisa-secondary font-bold text-[11px] uppercase tracking-wider p-4">
              <div className="col-span-1">Código</div>
              <div className="col-span-1">Producto</div>
              <div className="col-span-1">Categorías</div>
              <div className="col-span-1">Precio</div>
              <div className="col-span-1">Stock</div>
              <div className="col-span-1 text-right">Acciones</div>
            </div>

            {/* Listado de Productos */}
            <div className="flex flex-col gap-4 py-4 bg-artemisa-light/20 rounded-2xl p-2">
              {filteredProducts.map((product) => {
                const totalStock = product.variants?.reduce((acc, curr) => acc + curr.stock, 0) || 0;
                const isConfirmingDelete = deletingProductId === product.id;

                return (
                  <div key={product.id} className="grid md:grid-cols-6 items-center p-5 bg-white border border-artemisa-border rounded-2xl shadow-sm hover:shadow-md transition-shadow gap-2 md:gap-0">
                    
                    {/* Código e ID - Visible siempre */}
                    <div className="col-span-1 text-artemisa-secondary font-mono font-bold text-xs">#{product.id}</div>
                    
                    {/* Nombre - Visible siempre */}
                    <div className="col-span-1 font-bold text-artemisa-neutral text-sm">{product.name}</div>
                    
                    {/* Categorías - Ocultas o ajustadas en móvil */}
                    <div className="col-span-1 flex flex-wrap gap-1">
                      {product.categories?.map(cat => (
                        <span key={cat.id} className="bg-artemisa-light text-artemisa-secondary px-2 py-0.5 rounded text-[10px] font-bold border border-artemisa-border">{cat.name}</span>
                      ))}
                    </div>

                    {/* Precio - Visible siempre */}
                    <div className="col-span-1 font-black text-artemisa-primary">${product.price.toLocaleString('es-AR')}</div>

                    {/* Stock - Visible siempre */}
                    <div className="col-span-1 text-xs font-black text-artemisa-secondary">
                      {totalStock > 0 ? `${totalStock} unidades` : 'Sin stock'}
                    </div>

                    {/* Acciones */}
                    <div className="col-span-1 text-right flex justify-end items-center gap-1">
                      <Link
                        to={`/admin/productos/editar/${product.id}`}
                        className="p-2 text-artemisa-secondary hover:text-artemisa-primary hover:bg-artemisa-light rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </Link>

                      {isConfirmingDelete ? (
                        <div className="flex items-center gap-1 bg-artemisa-light p-1 rounded-lg border border-artemisa-border animate-in fade-in zoom-in-95 duration-100">
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={isDeleting}
                            className="px-2 py-1 text-[10px] font-black uppercase bg-artemisa-accent text-artemisa-neutral hover:bg-artemisa-secondary rounded-md transition-colors"
                          >
                            {isDeleting ? '...' : 'Sí, borrar'}
                          </button>
                          <button
                            onClick={() => setDeletingProductId(null)}
                            disabled={isDeleting}
                            className="px-2 py-1 text-[10px] font-bold uppercase text-artemisa-secondary hover:text-artemisa-primary rounded-md transition-colors"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingProductId(product.id)}
                          className="p-2 text-artemisa-secondary hover:text-artemisa-accent hover:bg-artemisa-light/50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};