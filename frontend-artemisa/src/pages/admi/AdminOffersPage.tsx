import { useState, useEffect } from 'react';
import { Plus, Tag, ToggleLeft, ToggleRight, Trash2, Loader2, Percent, Layers, ShoppingCart, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../api/axiosConfig';

interface Product {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Promotion {
  id: number;
  name: string;
  description?: string;
  type: 'PORCENTAJE' | 'CANTIDAD' | 'TOTAL_CARRITO';
  minQuantity: number;
  discountValue: number;
  active: boolean;
  productId?: number | null;
  categoryId?: number | null;
}

export const AdminOffersPage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Campos del Formulario
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'PORCENTAJE' | 'CANTIDAD' | 'TOTAL_CARRITO'>('PORCENTAJE');
  const [minQuantity, setMinQuantity] = useState(1);
  const [discountValue, setDiscountValue] = useState(0);
  const [wholesaleDiscount, setWholesaleDiscount] = useState(0);
  
  // Alcance de la promo
  const [scope, setScope] = useState<'GLOBAL' | 'PRODUCTO' | 'CATEGORIA'>('GLOBAL');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [promoToDelete, setPromoToDelete] = useState<number | null>(null);

  const notify = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

 const fetchInitialData = async () => {
  try {
    setLoading(true);
    const [promosRes, productsRes, categoriesRes] = await Promise.all([
      api.get('/promotions'),
      api.get('/products'),
      api.get('/categories')
    ]);

    // 🛡️ Protegemos todas las respuestas para asegurar que sean Arrays
    setPromotions(
      Array.isArray(promosRes.data) 
        ? promosRes.data 
        : (promosRes.data?.promotions || [])
    );
    
    setProducts(
      Array.isArray(productsRes.data) 
        ? productsRes.data 
        : (productsRes.data?.products || [])
    );

    setCategories(
      Array.isArray(categoriesRes.data) 
        ? categoriesRes.data 
        : (categoriesRes.data?.categories || [])
    );
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error);
    notify('Error al cargar los datos.', 'error');
    // Fallback de seguridad ante un error de red/servidor
    setPromotions([]);
    setProducts([]);
    setCategories([]);
  } finally {
    setLoading(false);
  }
};

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await api.patch(`/promotions/${id}/toggle`, { active: !currentStatus });
      setPromotions(prev => prev.map(p => p.id === id ? { ...p, active: !currentStatus } : p));
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      notify('No se pudo actualizar el estado.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!promoToDelete) return;
    try {
      await api.delete(`/promotions/${promoToDelete}`);
      setPromotions(prev => prev.filter(p => p.id !== promoToDelete));
      notify('Promoción eliminada con éxito.', 'success');
    } catch (error) {
      notify('Error al intentar eliminar la promoción.', 'error');
    } finally {
      setPromoToDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      const data = {
        name,
        description,
        type,
        minQuantity: type === 'TOTAL_CARRITO' ? minQuantity : minQuantity,
        discountValue: type === 'TOTAL_CARRITO' ? wholesaleDiscount : discountValue,
        active: true,
        productId: scope === 'PRODUCTO' && selectedProductId ? Number(selectedProductId) : null,
        categoryId: scope === 'CATEGORIA' && selectedCategoryId ? Number(selectedCategoryId) : null
      };

      const response = await api.post('/promotions', data);
      setPromotions(prev => [response.data, ...prev]);
      setShowModal(false);
      
      setName('');
      setDescription('');
      setType('PORCENTAJE');
      setMinQuantity(1);
      setDiscountValue(0);
      setWholesaleDiscount(0);
      setScope('GLOBAL');
      setSelectedProductId('');
      setSelectedCategoryId('');
    } catch (error) {
      console.error('Error al guardar promo:', error);
      notify('Error al guardar la regla.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-artemisa-neutral">
      {/* Notificación flotante */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl border animate-in slide-in-from-right-4 ${
          notification.type === 'success' 
            ? 'bg-white text-emerald-700 border-emerald-200' 
            : 'bg-white text-rose-700 border-rose-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <p className="font-bold text-sm">{notification.message}</p>
        </div>
      )}

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-artemisa-border shadow-sm">
        <div>
          <h1 className="text-xl font-black text-artemisa-primary uppercase tracking-tight">Estrategias de Descuento</h1>
          <p className="text-xs text-artemisa-secondary mt-1 font-medium">Configurá rebajas fijas, beneficios por cantidad o descuentos mayoristas.</p>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="h-10 px-5 rounded-xl bg-artemisa-primary text-artemisa-light hover:bg-artemisa-secondary transition-all font-black text-xs flex items-center gap-2 uppercase tracking-wider shadow-sm self-start sm:self-auto"
        >
          <Plus size={16} />
          Crear Regla / Promo
        </button>
      </div>

      {/* Listado */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-artemisa-secondary gap-3">
          <Loader2 size={32} className="animate-spin text-artemisa-accent" />
          <span className="text-sm font-medium">Sincronizando reglas comerciales...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promotions.map((promo) => (
            <div 
              key={promo.id} 
              className={`bg-white p-5 rounded-2xl border border-artemisa-border shadow-sm relative ${
                promo.active ? 'opacity-100' : 'opacity-60 bg-artemisa-light/20'
              }`}
            >
              <div className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1.5 bg-artemisa-light text-artemisa-secondary border border-artemisa-border">
                {promo.type === 'PORCENTAJE' && <Percent size={12} />}
                {promo.type === 'CANTIDAD' && <Layers size={12} />}
                {promo.type === 'TOTAL_CARRITO' && <ShoppingCart size={12} />}
                {promo.type}
              </div>

              <h3 className="text-lg font-black text-artemisa-primary uppercase pr-28 truncate">{promo.name}</h3>
              <p className="text-xs text-artemisa-secondary mt-1 min-h-[32px] font-medium">{promo.description || 'Sin descripción.'}</p>

              <div className="mt-2 text-[11px] font-bold uppercase tracking-wider">
                {promo.productId && <span className="text-artemisa-primary bg-artemisa-light border border-artemisa-border px-2 py-0.5 rounded-md">Producto ID: #{promo.productId}</span>}
                {promo.categoryId && <span className="text-artemisa-primary bg-artemisa-light border border-artemisa-border px-2 py-0.5 rounded-md">Categoría ID: #{promo.categoryId}</span>}
                {!promo.productId && !promo.categoryId && <span className="text-artemisa-secondary bg-artemisa-light px-2 py-0.5 rounded-md border border-artemisa-border">Aplica a Toda la Tienda</span>}
              </div>

              <div className="mt-4 bg-artemisa-light/50 border border-artemisa-border rounded-xl p-3 text-xs font-medium text-artemisa-neutral space-y-1">
                {promo.type === 'PORCENTAJE' && <p>Aplica un <span className="font-bold text-artemisa-secondary">{promo.discountValue}% OFF</span></p>}
                {promo.type === 'CANTIDAD' && <p>Llevando {promo.minQuantity}+ uds, cada una cuesta <span className="font-bold text-emerald-700">${promo.discountValue}</span>.</p>}
                {promo.type === 'TOTAL_CARRITO' && <p>Si el total supera <span className="font-bold text-artemisa-primary">${promo.minQuantity}</span>, aplica <span className="font-bold text-artemisa-secondary">{promo.discountValue}% OFF</span>.</p>}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-artemisa-border pt-4">
                <button onClick={() => handleToggleActive(promo.id, promo.active)} className="flex items-center gap-1.5 text-xs font-bold text-artemisa-neutral">
                  {promo.active ? <ToggleRight size={22} className="text-emerald-600" /> : <ToggleLeft size={22} className="text-artemisa-secondary" />}
                  {promo.active ? 'Activa' : 'Pausada'}
                </button>
                <button onClick={() => setPromoToDelete(promo.id)} className="text-artemisa-secondary hover:text-rose-600 p-1 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear Regla */}
      {showModal && (
        <div className="fixed inset-0 bg-artemisa-neutral/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-artemisa-border space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-artemisa-primary uppercase tracking-tight flex items-center gap-2 text-base">
              <Tag size={18} className="text-artemisa-accent" /> Nueva Regla Comercial
            </h3>

            <div>
              <label className="block text-xs font-bold text-artemisa-secondary uppercase mb-1">Nombre</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full border border-artemisa-border bg-artemisa-light/20 rounded-xl p-2.5 text-sm font-medium text-artemisa-neutral outline-none focus:border-artemisa-accent transition-all" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-artemisa-secondary uppercase mb-1">Tipo</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value as any)} 
                className="w-full border border-artemisa-border bg-artemisa-light/20 rounded-xl p-2.5 text-sm font-medium text-artemisa-neutral outline-none focus:border-artemisa-accent transition-all"
              >
                <option value="PORCENTAJE">Porcentaje Directo</option>
                <option value="CANTIDAD">Descuento por Volumen</option>
                <option value="TOTAL_CARRITO">Monto Mínimo (Mayorista)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-artemisa-secondary uppercase mb-1">¿A qué aplica?</label>
              <select 
                value={scope} 
                onChange={e => setScope(e.target.value as any)} 
                className="w-full border border-artemisa-border bg-artemisa-light/20 rounded-xl p-2.5 text-sm font-medium text-artemisa-neutral outline-none focus:border-artemisa-accent transition-all"
              >
                <option value="GLOBAL">Global</option>
                <option value="PRODUCTO">Producto ({products.length} cargados)</option>
                <option value="CATEGORIA">Categoría ({categories.length} cargadas)</option>
              </select>
            </div>

            {scope === 'PRODUCTO' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-artemisa-secondary uppercase">
                  ID del Producto
                </label>
                <input 
                  type="number" 
                  required 
                  placeholder="Ej: 123"
                  value={selectedProductId} 
                  onChange={e => setSelectedProductId(e.target.value)} 
                  className="w-full border border-artemisa-border bg-artemisa-light/20 rounded-xl p-2.5 text-sm font-medium text-artemisa-neutral outline-none focus:border-artemisa-accent transition-all" 
                />
                {selectedProductId && (
                  <p className="text-[10px] text-artemisa-secondary font-medium">
                    Buscando producto: {products.find(p => p.id === Number(selectedProductId))?.name || "Producto no encontrado"}
                  </p>
                )}
              </div>
            )}

            {scope === 'CATEGORIA' && (
              <div>
                <label className="block text-xs font-bold text-artemisa-secondary uppercase mb-1">Categoría</label>
                <select 
                  required 
                  value={selectedCategoryId} 
                  onChange={e => setSelectedCategoryId(e.target.value)} 
                  className="w-full border border-artemisa-border bg-artemisa-light/20 rounded-xl p-2.5 text-sm font-medium text-artemisa-neutral outline-none focus:border-artemisa-accent transition-all"
                >
                  <option value="">-- Seleccionar categoría --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 bg-artemisa-light/50 border border-artemisa-border p-4 rounded-xl">
              <div>
                <label className="text-[10px] font-bold uppercase text-artemisa-secondary block mb-1">
                  {type === 'TOTAL_CARRITO' ? 'Monto Mínimo' : 'Cant. Mínima'}
                </label>
                <input 
                  type="number" 
                  required 
                  value={minQuantity} 
                  onChange={e => setMinQuantity(+e.target.value)} 
                  className="w-full border border-artemisa-border bg-white rounded-lg p-2 text-sm font-bold text-artemisa-neutral outline-none focus:border-artemisa-accent" 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-artemisa-secondary block mb-1">
                  {type === 'TOTAL_CARRITO' ? '% Descuento' : 'Valor'}
                </label>
                <input 
                  type="number" 
                  required 
                  value={type === 'TOTAL_CARRITO' ? wholesaleDiscount : discountValue} 
                  onChange={e => type === 'TOTAL_CARRITO' ? setWholesaleDiscount(+e.target.value) : setDiscountValue(+e.target.value)} 
                  className="w-full border border-artemisa-border bg-white rounded-lg p-2 text-sm font-bold text-artemisa-neutral outline-none focus:border-artemisa-accent" 
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-bold text-artemisa-secondary hover:text-artemisa-neutral transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="px-5 py-2.5 bg-artemisa-primary text-artemisa-light rounded-xl font-black uppercase text-xs hover:bg-artemisa-secondary transition-all shadow-sm"
              >
                {isSubmitting ? 'Guardando...' : 'Crear Regla'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Confirmar Eliminar */}
      {promoToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-artemisa-neutral/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full border border-artemisa-border">
            <h3 className="font-black text-artemisa-primary uppercase text-lg mb-2">¿Estás segura?</h3>
            <p className="text-artemisa-secondary text-sm mb-6 font-medium">Esta promoción se eliminará permanentemente.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setPromoToDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-artemisa-light text-artemisa-neutral font-bold text-xs hover:bg-artemisa-border transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};