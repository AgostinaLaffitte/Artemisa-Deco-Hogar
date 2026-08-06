import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, Loader2, AlertCircle, CheckCircle2, Image as ImageIcon, Upload } from 'lucide-react';
import api from '../../api/axiosConfig';
import type { Category } from '../../types/category';

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Control del Modal (Crear / Editar)
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');

  // Manejo de Archivo de Imagen
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados de feedback y carga
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalFeedback, setModalFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const notify = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error al traer las categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setCategoryName('');
    setSelectedFile(null);
    setPreviewUrl('');
    setModalFeedback(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setSelectedFile(null);
    setPreviewUrl(category.image || '');
    setModalFeedback(null);
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      setIsSubmitting(true);
      setModalFeedback(null);

      const formData = new FormData();
      formData.append('name', categoryName.trim());
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      if (editingCategory) {
        const response = await api.patch(`/categories/${editingCategory.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setCategories((prev) =>
          prev.map((cat) => (cat.id === editingCategory.id ? response.data : cat))
        );
        setModalFeedback({ type: 'success', message: 'Categoría modificada con éxito.' });
      } else {
        const response = await api.post('/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setCategories((prev) => [...prev, response.data]);
        setModalFeedback({ type: 'success', message: `Categoría "${categoryName}" creada con éxito.` });
      }

      setTimeout(() => {
        setShowModal(false);
        setModalFeedback(null);
      }, 1200);
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
      setModalFeedback({
        type: 'error',
        message: 'No se pudo procesar la solicitud. Verificá los campos.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      setIsDeleting(true);
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      notify('Categoría eliminada con éxito', 'success');
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      notify('Error: Desvinculá los productos asociados primero.', 'error');
    } finally {
      setIsDeleting(false);
      setDeletingCategoryId(null);
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-artemisa-neutral">
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
          <h1 className="text-xl font-black text-artemisa-primary uppercase tracking-tight">Gestión de Categorías</h1>
          <p className="text-xs text-artemisa-secondary mt-1 font-medium">Administrá las secciones y subí las portadas del catálogo artesanal.</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="h-10 px-5 rounded-xl bg-artemisa-primary text-artemisa-light hover:bg-artemisa-secondary transition-all font-black text-xs flex items-center gap-2 uppercase tracking-wider shadow-sm self-start sm:self-auto"
        >
          <Plus size={16} />
          Nueva Categoría
        </button>
      </div>

      {/* Buscador */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Buscar categoría por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-artemisa-border rounded-xl py-3 pl-4 pr-12 focus:border-artemisa-accent outline-none transition-all text-sm font-medium shadow-sm text-artemisa-neutral"
        />
        <Search className="absolute right-4 top-3.5 text-artemisa-secondary" size={18} />
      </div>

      {/* Tabla de Categorías */}
      <div className="bg-white rounded-2xl border border-artemisa-border shadow-sm overflow-hidden">
        {/* VISTA MÓVIL */}
        <div className="block lg:hidden divide-y divide-artemisa-border">
          {loading ? (
            <div className="py-10 text-center text-artemisa-secondary text-sm">Cargando...</div>
          ) : filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div key={category.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-artemisa-light/60 border border-artemisa-border overflow-hidden flex items-center justify-center">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={18} className="text-artemisa-secondary" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-artemisa-primary text-sm">{category.name}</p>
                    <p className="text-[10px] text-artemisa-secondary font-mono">#{category.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleOpenEditModal(category)} className="p-2 text-artemisa-secondary hover:text-artemisa-accent">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => setDeletingCategoryId(category.id)} className="p-2 text-artemisa-secondary hover:text-rose-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-artemisa-secondary text-sm">No hay categorías cargadas.</div>
          )}
        </div>

        {/* VISTA ESCRITORIO */}
        <div className="hidden lg:block overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-artemisa-secondary">
              <Loader2 size={32} className="animate-spin text-artemisa-accent" />
              <span className="text-sm font-medium">Cargando categorías...</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-artemisa-light/50 border-b border-artemisa-border text-artemisa-secondary font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-4 px-6 w-24">Código</th>
                  <th className="py-4 px-6 w-28">Imagen</th>
                  <th className="py-4 px-6">Nombre de Categoría</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-artemisa-border text-sm font-medium text-artemisa-neutral">
                {filteredCategories.map((category) => {
                  const isConfirmingDelete = deletingCategoryId === category.id;
                  return (
                    <tr key={category.id} className="hover:bg-artemisa-light/30 transition-colors">
                      <td className="py-4 px-6 text-artemisa-secondary font-mono font-bold">#{category.id}</td>
                      <td className="py-4 px-6">
                        <div className="w-12 h-12 rounded-lg bg-artemisa-light/60 border border-artemisa-border overflow-hidden flex items-center justify-center text-artemisa-secondary shadow-inner">
                          {category.image ? <img src={category.image} alt={category.name} className="w-full h-full object-cover" /> : <ImageIcon size={18} />}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-artemisa-primary text-base">{category.name}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditModal(category)}
                            className="p-2 inline-flex items-center justify-center text-artemisa-secondary hover:text-artemisa-accent hover:bg-artemisa-light/60 rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          {isConfirmingDelete ? (
                            <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                              <button
                                onClick={() => handleDeleteCategory(category.id)}
                                disabled={isDeleting}
                                className="px-2 py-1 text-[10px] font-black uppercase text-rose-700 hover:bg-rose-200 rounded-md"
                              >
                                {isDeleting ? '...' : 'Sí'}
                              </button>
                              <button
                                onClick={() => setDeletingCategoryId(null)}
                                disabled={isDeleting}
                                className="px-2 py-1 text-[10px] font-bold uppercase text-artemisa-secondary hover:text-artemisa-neutral rounded-md"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeletingCategoryId(category.id)}
                              className="p-2 inline-flex items-center justify-center text-artemisa-secondary hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredCategories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-artemisa-secondary font-medium">
                      No se encontraron categorías cargadas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL PARA CREAR O EDITAR */}
      {showModal && (
        <div className="fixed inset-0 bg-artemisa-neutral/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-artemisa-border max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-black text-artemisa-primary uppercase tracking-tight">
              {editingCategory ? 'Modificar Categoría' : 'Crear Nueva Categoría'}
            </h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-artemisa-secondary uppercase mb-1.5">
                  Nombre de la Categoría
                </label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  placeholder="Ej: Tusor, Silver, Linos..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full border border-artemisa-border rounded-xl py-2.5 px-4 outline-none focus:border-artemisa-accent transition-all text-sm font-medium text-artemisa-neutral bg-artemisa-light/20 disabled:bg-artemisa-light/60"
                />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              <div>
                <label className="block text-xs font-bold text-artemisa-secondary uppercase mb-1.5">
                  Imagen de Portada
                </label>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full min-h-[120px] border-2 border-dashed border-artemisa-border rounded-xl flex flex-col items-center justify-center gap-2 p-4 hover:bg-artemisa-light/50 transition-colors bg-artemisa-light/20 outline-none disabled:opacity-50"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview de categoría" className="max-h-28 object-contain rounded-lg shadow-sm" />
                  ) : (
                    <>
                      <Upload size={24} className="text-artemisa-secondary" />
                      <span className="text-xs font-bold text-artemisa-secondary">Hacé clic para elegir una imagen local</span>
                    </>
                  )}
                </button>
              </div>

              {modalFeedback && (
                <div
                  className={`flex items-start gap-2 p-3 rounded-xl text-xs font-medium ${
                    modalFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {modalFeedback.type === 'success' ? (
                    <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
                  )}
                  <span>{modalFeedback.message}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-artemisa-secondary hover:text-artemisa-neutral transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 px-5 bg-artemisa-primary text-artemisa-light font-black text-xs rounded-xl hover:bg-artemisa-secondary transition-all uppercase tracking-wider flex items-center justify-center"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};