import { useState, useEffect } from 'react';
import { BannerService } from '../../services/banner.service';
import type { Banner } from '../../types/banner';
import { Trash2, PlusCircle, Upload, Link2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AdminBannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [order, setOrder] = useState('0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<number | null>(null);

  const notify = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await BannerService.getAll();
      setBanners(data);
    } catch (err: any) {
      setError('Error al cargar la lista de banners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError('Tenés que seleccionar una imagen de banner para subir.');
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      if (title.trim()) formData.append('title', title.trim());
      if (link.trim()) formData.append('link', link.trim());
      formData.append('order', order.toString());
      formData.append('files', file);

      await BannerService.create(formData);

      setTitle('');
      setFile(null);
      setLink('');
      setOrder('0');

      const fileInput = document.getElementById('banner-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      await loadBanners();
      notify('Banner cargado correctamente', 'success');
    } catch (err: any) {
      const serverMessage = err.response?.data?.message;
      setError(Array.isArray(serverMessage) ? serverMessage.join(', ') : serverMessage || 'Error al subir el banner.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id: number) => {
    setBannerToDelete(id);
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;
    try {
      await BannerService.remove(bannerToDelete);
      setBanners(prev => prev.filter(b => b.id !== bannerToDelete));
      notify('Banner eliminado con éxito', 'success');
    } catch (err) {
      notify('No se pudo eliminar el banner.', 'error');
    } finally {
      setBannerToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-artemisa-light/50 py-8 text-artemisa-neutral">
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

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-artemisa-primary uppercase tracking-tight italic">
            Gestión de Banners
          </h2>
          <p className="text-xs text-artemisa-secondary mt-0.5 uppercase tracking-wider font-bold">
            Subí y ordená las imágenes rotativas de la Home en la carpeta global de uploads
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2.5 bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-sm font-medium">
            <AlertCircle size={18} className="flex-shrink-0 text-rose-600" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-artemisa-border shadow-sm space-y-4">
            <h3 className="text-base font-black text-artemisa-primary uppercase tracking-tight border-b border-artemisa-border pb-2 mb-4 flex items-center gap-2">
              <PlusCircle size={18} className="text-artemisa-accent" />
              Nuevo Banner
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase text-artemisa-secondary mb-1">Título (Opcional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: 3 cuotas sin interés"
                className="w-full h-11 bg-artemisa-light/40 border-2 border-artemisa-border rounded-xl px-3 text-sm font-medium text-artemisa-neutral outline-none focus:border-artemisa-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-artemisa-secondary mb-1">Imagen del Banner</label>
              <div className="relative bg-artemisa-light/40 border-2 border-dashed border-artemisa-border rounded-xl p-4 text-center hover:bg-artemisa-light transition-colors cursor-pointer">
                <input
                  id="banner-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload size={20} className="mx-auto text-artemisa-secondary mb-1.5" />
                <span className="text-xs font-bold text-artemisa-neutral block truncate">
                  {file ? file.name : 'Seleccionar archivo local...'}
                </span>
                <span className="text-[10px] text-artemisa-secondary font-medium">JPG, PNG, WEBP</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-artemisa-secondary mb-1">Link de Destino (Opcional)</label>
              <div className="relative">
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Ej: /productos?category=3"
                  className="w-full h-11 bg-artemisa-light/40 border-2 border-artemisa-border rounded-xl pl-9 pr-3 text-sm font-medium text-artemisa-neutral outline-none focus:border-artemisa-accent transition-colors"
                />
                <Link2 size={16} className="absolute left-3 top-3.5 text-artemisa-secondary" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-artemisa-secondary mb-1">Orden de Prioridad</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                min="0"
                className="w-24 h-11 bg-artemisa-light/40 border-2 border-artemisa-border rounded-xl px-3 text-sm font-black text-artemisa-neutral text-center outline-none focus:border-artemisa-accent transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-artemisa-primary text-artemisa-light font-black uppercase tracking-wider text-xs rounded-xl hover:bg-artemisa-secondary transition-all shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando en uploads...' : 'Publicar Banner'}
            </button>
          </form>

          {/* LISTADO */}
          <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-3xl border border-artemisa-border shadow-sm">
            <h3 className="text-base font-black text-artemisa-primary uppercase tracking-tight border-b border-artemisa-border pb-2 mb-4">
              Banners Activos ({banners.length})
            </h3>

            {loading ? (
              <div className="py-12 text-center text-artemisa-secondary text-sm font-medium">Cargando banners...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {banners.map((banner) => (
                  <div key={banner.id} className="border border-artemisa-border bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative aspect-video w-full bg-artemisa-light/60">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title || 'Banner'}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-artemisa-primary/90 text-artemisa-light text-[10px] font-black px-2 py-0.5 rounded-full">
                        Orden: {banner.order ?? 0}
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="font-bold text-artemisa-neutral text-sm truncate">{banner.title || 'Banner sin título'}</h4>
                      {banner.link && (
                        <p className="text-[11px] text-artemisa-secondary truncate mt-1 flex items-center gap-1">
                          <Link2 size={12} /> {banner.link}
                        </p>
                      )}

                      <button
                        onClick={() => confirmDelete(banner.id)}
                        className="w-full mt-4 flex items-center justify-center gap-2 px-3 h-10 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                      >
                        <Trash2 size={14} /> Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL ELIMINAR */}
      {bannerToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-artemisa-neutral/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full border border-artemisa-border">
            <h3 className="font-black text-artemisa-primary uppercase text-lg mb-2">¿Estás segura?</h3>
            <p className="text-artemisa-secondary text-sm mb-6">Esta acción borrará el banner permanentemente del sistema.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setBannerToDelete(null)}
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