import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
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

export const UpdateProductPage = () => {
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // Formulario Estados Locales
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isOffer, setIsOffer] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Integración del Hook
  const {
    imageFiles,
    previewUrls,
    variants,
    setVariants,
    handleImageChange,
    removeNewImage,
    addVariant,
    removeVariant,
    changeVariant,
  } = useProductForm([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setPageLoading(true);
        const [categoriesRes, productRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/products/${productId}`)
        ]);

        setCategoriesList(categoriesRes.data);
        const p = productRes.data;
        setName(p.name);
        setPrice(String(p.price));
        setDescription(p.description || '');
        setIsOffer(p.isOffer);
        setOfferPrice(p.offerPrice ? String(p.offerPrice) : '');
        setExistingImages(p.images || []);
        
        if (p.categories?.length > 0) {
          setSelectedCategories(p.categories.map((cat: any) => String(cat.id)));
        }

        if (p.variants?.length > 0) {
          setVariants(p.variants.map((v: any) => ({
            id: v.id,
            name: v.name,
            stock: v.stock,
            price: v.price,
            images: v.images || (v.image ? [v.image] : []),
            files: [],
          })));
        } else {
          setVariants([{ name: '', stock: 1, price: null, images: [], files: [] }]);
        }
      } catch {
        setStatus({ type: 'error', message: 'Error al recuperar los datos del servidor.' });
      } finally {
        setPageLoading(false);
      }
    };
    if (productId) fetchInitialData();
  }, [productId, setVariants]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      setStatus({ type: 'error', message: 'Campos obligatorios vacíos.' });
      return;
    }

    try {
      setSubmitLoading(true);
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('price', price);
      formData.append('description', description.trim());
      formData.append('isOffer', String(isOffer));
      formData.append('offerPrice', isOffer && offerPrice ? offerPrice : '');
      selectedCategories.forEach(catId => formData.append('categories', catId));

      const validVariants = variants.filter(v => v.name.trim() !== '');

      const variantsPayload = validVariants.map((variant, index) => {
        if (variant.files && variant.files.length > 0) {
          variant.files.forEach(file => {
            formData.append(`variant_${index}`, file);
          });
        }
        return {
          id: variant.id,
          name: variant.name.trim(),
          stock: Number(variant.stock),
          price: variant.price ? Number(variant.price) : null,
          images: variant.images || [],
        };
      });

      formData.append('variants', JSON.stringify(variantsPayload));
      existingImages.forEach(url => formData.append('existingImages', url));
      imageFiles.forEach(file => formData.append('files', file));

      await api.patch(`/products/${productId}`, formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });

      setStatus({ type: 'success', message: '¡Artículo actualizado con éxito!' });
      setTimeout(() => navigate('/admin/productos'), 1500);
    } catch {
      setStatus({ type: 'error', message: 'Error de servidor al guardar la edición.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-3 text-artemisa-accent">
        <Loader2 className="animate-spin text-artemisa-primary" size={32} />
        <span className="text-xs font-bold uppercase tracking-wider text-artemisa-neutral">Cargando detalles del artículo...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-6 pb-12">
      <StatusBanner type={status.type} message={status.message} />
      
      <div className="flex items-center justify-between">
        <Link to="/admin/productos" className="inline-flex items-center gap-1.5 text-xs font-bold text-artemisa-secondary hover:text-artemisa-primary transition-colors">
          <ChevronLeft size={16} /> Volver al catálogo
        </Link>
        <SubmitButton isLoading={submitLoading} text="Actualizar Producto" loadingText="Actualizando..." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GeneralInfoSection
            isEditMode={true}
            productId={productId || ''}
            name={name}
            setName={setName}
            price={price}
            setPrice={setPrice}
            description={description}
            setDescription={setDescription}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            categoriesList={categoriesList}
          />

          <VariantMatrix 
            variants={variants}
            onAddVariant={addVariant}
            onRemoveVariant={removeVariant}
            onVariantChange={changeVariant}
          />
        </div>

        <div className="space-y-6">
          <MediaGallery 
            existingImages={existingImages}
            onRemoveExisting={(url) => setExistingImages(prev => prev.filter(img => img !== url))}
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