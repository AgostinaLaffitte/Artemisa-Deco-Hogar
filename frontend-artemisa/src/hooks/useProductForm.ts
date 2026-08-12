import { useState } from 'react';
import type { LocalVariant } from '../components/Admi/VariantMatrix';
const defaultVariant: LocalVariant = {
  name: '',
  stock: 1,
  price: null,
  images: [],
  files: [],
};

export const useProductForm = (initialVariants: LocalVariant[] = [defaultVariant]) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [variants, setVariants] = useState<LocalVariant[]>(initialVariants);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...filesArray]);
      setPreviewUrls(prev => [
        ...prev,
        ...filesArray.map(file => URL.createObjectURL(file))
      ]);
    }
  };

  const removeNewImage = (index: number) => {
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setImageFiles([]);
    setPreviewUrls([]);
  };

  const addVariant = () => setVariants(prev => [...prev, { name: '', stock: 1, price: null, images: [], files: [] }]);
  const removeVariant = (index: number) => setVariants(prev => prev.filter((_, i) => i !== index));
  const changeVariant = (index: number, field: keyof LocalVariant, value: any) => {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };

  return {
    imageFiles,
    previewUrls,
    variants,
    setVariants,
    handleImageChange,
    removeNewImage,
    clearImages,
    addVariant,
    removeVariant,
    changeVariant,
  };
};