import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import api from '../../api/axiosConfig'; 
import type { Category } from '../../types/category'; 
import { useProductForm } from '../../hooks/useProductForm';

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

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isOffer, setIsOffer] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');

  const {
    imageFiles,
    previewUrls,
    variants,
    handleImageChange,
    removeNewImage,
    addVariant,
    removeVariant,
    changeVariant,
  } = useProductForm([{ name: '', stock: 1, price: null, images: [], files: [] }]);

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategoriesList(res.data))
      .catch(() => setStatus({ type: 'error', message: 'No se pudieron cargar las categorías.' }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) {
      setStatus({ type: 'error', message: 'El nombre y el precio son obligatorios.' });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      
      // Datos Generales
      formData.append('name', name.trim());
      formData.append('price', price);
      formData.append('description', description.trim());
      formData.append('isOffer', String(isOffer));
      if (isOffer && offerPrice) formData.append('offerPrice', offerPrice);

      // Categorías
      selectedCategories.forEach(catId => formData.append('categories', catId));

      // Archivos del producto principal
      imageFiles.forEach(file => formData.append('files', file));

      // Procesar Variantes y sus archivos asociados (`variant_0`, `variant_1`, etc.)
      const validVariants = variants.filter(v => v.name.trim() !== '');

      const variantsPayload = validVariants.map((variant, index) => {
        if (variant.files && variant.files.length > 0) {
          variant.files.forEach(file => {
            formData.append(`variant_${index}`, file);
          });
        }
        return {
          name: variant.name.trim(),
          stock: Number(variant.stock),
          price: variant.price ? Number(variant.price) : null,
          images: variant.images || [],
        };
      });

      formData.append('variants', JSON.stringify(variantsPayload));

      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStatus({ type: 'success', message: '¡Producto creado con éxito!' });
      setTimeout(() => navigate('/admin/productos'), 1500);
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Error al crear el producto.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-6 pb-12 text-artemisa-neutral">
      <StatusBanner type={status.type} message={status.message} />
      
      <div className="flex items-center justify-between gap-4">
        <Link to="/admin/productos" className="inline-flex items-center gap-1.5 text-xs font-bold text-artemisa-secondary hover:text-artemisa-primary transition-colors">
          <ChevronLeft size={16} /> Volver al catálogo
        </Link>
        <SubmitButton isLoading={loading} text="Guardar Producto" loadingText="Guardando..." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GeneralInfoSection
            isEditMode={false}
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