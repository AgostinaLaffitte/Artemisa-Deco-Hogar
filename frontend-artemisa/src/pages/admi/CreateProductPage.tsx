import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import api from '../../api/axiosConfig'; 
import type { Category } from '../../types/category'; 
import { useProductForm } from '../../hooks/useProductForm';

// Componentes Reutilizables
import { StatusBanner } from '../../components/Admi/StatusBanner';
import { OfferSection } from '../../components/Admi/OfferSection';
import { VariantMatrix } from '../../components/Admi/VariantMatrix';
import { MediaGallery } from '../../components/Admi/MediaGallery';
import { GeneralInfoSection } from '../../components/Admi/GeneralInfoSection';
import { SubmitButton } from '../../components/Admi/SubmitButton';

export const CreateProductPage = () => {
  const navigate = useNavigate();
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // Formulario Estados Locales
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isOffer, setIsOffer] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');

  // Integración del Hook
  const {
    imageFiles,
    previewUrls,
    variants,
    setVariants,
    handleImageChange,
    removeNewImage,
  } = useProductForm([{ name: '', stock: 1, price: null }]);

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategoriesList(res.data))
      .catch(() => setStatus({ type: 'error', message: 'No se pudieron cargar los rubros.' }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !name || !price) {
      setStatus({ type: 'error', message: 'Campos obligatorios incompletos.' });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('id', id.trim());
      formData.append('name', name.trim());
      formData.append('price', price);
      formData.append('description', description.trim());
      formData.append('isOffer', String(isOffer));
      if (isOffer && offerPrice) formData.append('offerPrice', offerPrice);
      if (selectedCategory) formData.append('categories[]', selectedCategory);

      const validVariants = variants
        .filter(v => v.name.trim() !== '')
        .map(v => ({ name: v.name.trim(), stock: Number(v.stock), price: v.price ? Number(v.price) : null }));
      
      formData.append('variants', JSON.stringify(validVariants));
      imageFiles.forEach(file => formData.append('files', file));

      await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setStatus({ type: 'success', message: '¡Producto guardado con éxito!' });
      setTimeout(() => navigate('/admin/productos'), 1500);
    } catch (error: any) {
      setStatus({ type: 'error', message: 'Error al salvar el artículo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Se asume que los subcomponentes (GeneralInfoSection, MediaGallery, etc.) 
    // ya usan internamente las clases de color correctas o bg-white/bg-transparent
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-6 pb-12 text-artemisa-neutral">
      <StatusBanner type={status.type} message={status.message} />
      
      <div className="flex items-center justify-between gap-4">
        <Link to="/admin/productos" className="inline-flex items-center gap-1.5 text-xs font-bold text-artemisa-secondary hover:text-artemisa-primary transition-colors">
          <ChevronLeft size={16} /> Volver al catálogo
        </Link>
        {/* SubmitButton debe manejar internamente bg-artemisa-primary hover:bg-artemisa-neutral */}
        <SubmitButton isLoading={loading} text="Guardar Producto" loadingText="Guardando..." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GeneralInfoSection
            isEditMode={false}
            productId={id}
            setProductId={setId}
            name={name}
            setName={setName}
            price={price}
            setPrice={setPrice}
            description={description}
            setDescription={setDescription}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categoriesList={categoriesList}
          />

          <VariantMatrix 
            variants={variants}
            onAddVariant={() => setVariants(prev => [...prev, { name: '', stock: 1, price: null }])}
            onRemoveVariant={(idx) => setVariants(prev => prev.filter((_, i) => i !== idx))}
            onVariantChange={(idx, field, val) => setVariants(prev => prev.map((v, i) => i === idx ? { ...v, [field]: val } : v))}
          />
        </div>

        <div className="space-y-6">
          <MediaGallery 
            previewUrls={previewUrls}
            onImageChange={handleImageChange}
            onRemoveNew={removeNewImage}
          />
          <OfferSection isOffer={isOffer} setIsOffer={setIsOffer} offerPrice={offerPrice} setOfferPrice={setOfferPrice} />
        </div>
      </div>
    </form>
  );
};