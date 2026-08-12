import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';
import { formatPrice } from '../utils/productUtils';
import { ProductService } from '../services/product.service';
import type { Product } from '../types/product';
import type { ProductVariant } from '../types/productVariant';
import { useCart } from '../context/CartContext';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  
  // Selección actual de Variante
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const { addToCart } = useCart();
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const notify = (message: any, type: 'success' | 'error') => {
    const finalMessage = Array.isArray(message) ? message.join(', ') : message;
    setNotification({ message: finalMessage, type });
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      if (!id) return;
      const productId = Number(id);
      if (isNaN(productId)) return;
      
      try {
        setLoading(true);
        const data = await ProductService.getById(productId);
        setProduct(data);
        
        let initialImage = '';
        if (data.images && data.images.length > 0) {
          initialImage = data.images[0];
        }

        if (data.variants && data.variants.length > 0) {
          const firstVariant = data.variants[0];
          setSelectedVariant(firstVariant);
          setSelectedSize(firstVariant.size || '');
          setSelectedColor(firstVariant.color || firstVariant.name);
          if (firstVariant.image) {
            initialImage = firstVariant.image;
          }
        }

        setActiveImage(initialImage);

        // Carga de productos similares
        if (data.categories && data.categories.length > 0) {
          try {
            const currentCategoryIds = data.categories.map((c: any) => 
              typeof c === 'object' ? c.id : c
            );
            const allProducts = await ProductService.getAll();
            const filtered = allProducts.filter((p: Product) => {
              if (p.id === productId) return false;
              if (!p.categories || p.categories.length === 0) return false;
              const productCatIds = p.categories.map((c: any) => 
                typeof c === 'object' ? c.id : c
              );
              return productCatIds.some((catId: number) => currentCategoryIds.includes(catId));
            });
            setRelatedProducts(filtered.slice(0, 4));
          } catch (err) {
            console.error('Error al cargar productos similares:', err);
          }
        }
      } catch (error) {
        console.error('Error al traer el detalle del producto:', error);
        notify('No se pudo cargar el producto. Intentá nuevamente más tarde.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndRelated();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-artemisa-light">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-artemisa-accent border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-artemisa-light p-4 text-center">
        <p className="text-artemisa-neutral/70 text-base font-medium">El producto no se encuentra disponible.</p>
        <Link to="/productos" className="mt-4 text-artemisa-secondary font-bold hover:underline text-sm">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  // Lista consolidada de todas las imágenes disponibles (producto + variantes)
  const productImages = product.images || [];
  const variantImages = (product.variants || [])
    .map((v) => v.image)
    .filter((img): img is string => Boolean(img));
  
  // Unificamos y quitamos duplicados respetando el orden
  const galleryImages = Array.from(new Set([...productImages, ...variantImages]));

  const currentImageIndex = galleryImages.indexOf(activeImage);

  const handlePrevImage = () => {
    if (galleryImages.length === 0) return;
    const nextIdx = currentImageIndex <= 0 ? galleryImages.length - 1 : currentImageIndex - 1;
    setActiveImage(galleryImages[nextIdx]);
  };

  const handleNextImage = () => {
    if (galleryImages.length === 0) return;
    const nextIdx = currentImageIndex >= galleryImages.length - 1 ? 0 : currentImageIndex + 1;
    setActiveImage(galleryImages[nextIdx]);
  };

  const availableSizes = Array.from(
    new Set(product.variants.map((v) => v.size).filter(Boolean))
  ) as string[];

  const availableColors = product.variants.filter((v) => {
    if (selectedSize && v.size) {
      return v.size === selectedSize;
    }
    return true;
  });

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    const match = product.variants.find((v) => v.size === size && (selectedColor ? (v.color === selectedColor || v.name.includes(selectedColor)) : true)) 
      || product.variants.find((v) => v.size === size);
    
    if (match) {
      setSelectedVariant(match);
      if (match.color) setSelectedColor(match.color);
      if (match.image) setActiveImage(match.image);
      setQuantity(1);
    }
  };

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSelectedColor(variant.color || variant.name);
    if (variant.size) setSelectedSize(variant.size);
    if (variant.image) setActiveImage(variant.image);
    setQuantity(1);
  };

  const currentPrice = selectedVariant?.price 
    ? selectedVariant.price 
    : (product.isOffer && product.offerPrice ? product.offerPrice : product.price);

  const maxStock = selectedVariant ? selectedVariant.stock : 0;

  const handleAddToCart = () => {
    if (!selectedVariant || maxStock === 0) return;
    addToCart([{
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      price: currentPrice,
      image: selectedVariant.image || (product.images.length > 0 ? product.images[0] : ''),
      quantity: quantity,
      stockMax: selectedVariant.stock
    }]);
    notify('Producto agregado al carrito', 'success');
  };

  const handleCustomOrderWhatsApp = () => {
    const phone = "542284690919";
    const variantName = selectedVariant ? selectedVariant.name : '';
    const sizeDetail = selectedSize ? ` / Talle: ${selectedSize}` : '';
    const colorDetail = selectedColor ? ` / Variante: ${selectedColor}` : ` / Variante: ${variantName}`;

    const message = encodeURIComponent(
      `¡Hola! Quisiera encargar el producto "${product.name}"${variantName ? ` (${variantName}${sizeDetail})` : colorDetail} que figura sin stock en la tienda web. ¿Podrían confirmarme la disponibilidad y el tiempo de confección?`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-artemisa-light py-8 md:py-12 pb-28 md:pb-12 text-artemisa-neutral">
      
      {/* NOTIFICACIÓN ALERTA EN LA PARTE INFERIOR */}
      {notification && (
        <div className={`fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[60] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border animate-in slide-in-from-bottom-4 ${
          notification.type === 'success' 
            ? 'bg-artemisa-primary text-artemisa-light border-artemisa-accent' 
            : 'bg-rose-950 text-rose-100 border-rose-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={18} className="text-artemisa-accent shrink-0" /> : <AlertCircle size={18} className="text-rose-400 shrink-0" />}
          <p className="font-semibold text-xs text-artemisa-light leading-none">{notification.message}</p>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-7xl">
        
        <Link to="/productos" className="inline-flex items-center gap-2 text-xs font-semibold text-artemisa-secondary hover:text-artemisa-primary transition-colors mb-6 group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver al catálogo
        </Link>

        {/* FICHA PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start bg-artemisa-border/20 p-4 md:p-8 rounded-2xl border border-artemisa-border shadow-sm relative">
          <div className="space-y-3">
            {/* Contenedor de Imagen Principal con Controles de Navegación */}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-artemisa-light p-1 border border-dashed border-artemisa-accent/40 group">
              <div className="w-full h-full rounded-lg overflow-hidden relative">
                <img 
                  src={activeImage || '/placeholder.jpg'} 
                  alt={product.name} 
                  className="w-full h-full object-cover rounded-lg transition-all duration-300" 
                />
              </div>

              {/* Botones para pasar imágenes */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-artemisa-primary/80 hover:bg-artemisa-primary text-white p-2 rounded-full shadow-md backdrop-blur-sm transition-all opacity-80 hover:opacity-100"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-artemisa-primary/80 hover:bg-artemisa-primary text-white p-2 rounded-full shadow-md backdrop-blur-sm transition-all opacity-80 hover:opacity-100"
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {product.isOffer && (
                <span className="absolute top-4 left-4 z-10 bg-artemisa-primary text-artemisa-accent border border-artemisa-accent/40 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  Oferta
                </span>
              )}
            </div>

            {/* Tira de Miniaturas (Muestra todas las imágenes consolidadas) */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border transition-all flex-shrink-0 p-0.5 bg-artemisa-light ${
                      activeImage === img
                        ? 'border-2 border-artemisa-accent scale-95 shadow-md'
                        : 'border-dashed border-artemisa-border opacity-70 hover:opacity-100 hover:border-artemisa-accent'
                    }`}
                  >
                    <div className="w-full h-full rounded-md overflow-hidden relative">
                      <img src={img} alt="" className="w-full h-full object-cover rounded-md" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETALLES Y OPCIONES DE SELECCIÓN */}
          <div className="flex flex-col justify-between h-full space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-artemisa-secondary block mb-1">
                Artemisa Confecciones
              </span>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-artemisa-primary leading-tight">
                {product.name}
              </h1>

              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl md:text-3xl font-bold text-artemisa-neutral">
                  {formatPrice(currentPrice)}
                </span>
              </div>

              <p className="mt-4 text-xs md:text-sm text-artemisa-neutral/80 leading-relaxed border-b border-artemisa-border pb-5">
                {product.description}
              </p>

              <div className="mt-6 space-y-5">
                {availableSizes.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-artemisa-primary mb-2">
                      Medida / Talle: <span className="text-artemisa-secondary font-normal">{selectedSize}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSelectSize(size)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${
                            selectedSize === size
                              ? 'border-artemisa-primary bg-artemisa-primary text-artemisa-light shadow-sm'
                              : 'border-artemisa-border bg-white text-artemisa-neutral hover:border-artemisa-accent'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variantes */}
                {product.variants && product.variants.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-artemisa-primary mb-2">
                      Modelo / Color: <span className="text-artemisa-secondary font-normal">{selectedColor || selectedVariant?.name}</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {availableColors.map((v) => {
                        const isSelected = selectedVariant?.id === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => handleSelectVariant(v)}
                            title={v.color || v.name}
                            className={`relative w-14 h-14 rounded-xl overflow-hidden border transition-all p-0.5 ${
                              isSelected
                                ? 'border-2 border-artemisa-accent scale-105 shadow-md'
                                : 'border-artemisa-border opacity-80 hover:opacity-100 hover:border-artemisa-accent/60'
                            }`}
                          >
                            <div className="w-full h-full rounded-lg overflow-hidden relative p-[1px]">
                              {v.image ? (
                                <img src={v.image} alt={v.name} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <div className="w-full h-full bg-artemisa-border/40 flex items-center justify-center text-[10px] font-bold text-artemisa-primary text-center p-1 rounded-lg">
                                  {v.color || v.name}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-artemisa-primary">
                      Cantidad
                    </label>
                    {maxStock > 0 ? (
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                        Stock disponible ({maxStock})
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider italic">
                        Sin stock • Confección a pedido
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Control de cantidad */}
                    {maxStock > 0 && (
                      <div className="flex items-center bg-white border border-artemisa-border rounded-xl h-11 w-32 px-1">
                        <button
                          type="button"
                          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                          disabled={quantity <= 1 || maxStock === 0}
                          className="w-9 h-9 flex items-center justify-center text-artemisa-neutral hover:text-artemisa-primary disabled:opacity-30"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="text"
                          readOnly
                          value={quantity}
                          className="w-full text-center font-bold text-xs text-artemisa-neutral bg-transparent outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity((prev) => Math.min(maxStock, prev + 1))}
                          disabled={quantity >= maxStock || maxStock === 0}
                          className="w-9 h-9 flex items-center justify-center text-artemisa-neutral hover:text-artemisa-primary disabled:opacity-30"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    )}

                    {/* BOTÓN AGREGAR AL CARRITO / ENCARGAR ESCRITORIO */}
                    {maxStock > 0 ? (
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="hidden md:flex flex-1 items-center justify-center gap-2 bg-artemisa-primary hover:bg-artemisa-neutral text-artemisa-light h-11 px-6 rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-sm cursor-pointer"
                      >
                        <ShoppingBag size={18} className="text-artemisa-accent shrink-0" />
                        <span className="text-artemisa-light font-bold text-xs tracking-wider uppercase whitespace-nowrap">
                          Agregar al carrito
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCustomOrderWhatsApp}
                        className="hidden md:flex flex-1 items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white h-11 px-6 rounded-xl font-bold uppercase text-xs tracking-wider transition-all shadow-sm cursor-pointer"
                      >
                        <MessageCircle size={18} className="shrink-0" />
                        <span className="font-bold text-xs tracking-wider uppercase whitespace-nowrap">
                          Encargar por WhatsApp
                        </span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN PRODUCTOS SIMILARES */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-artemisa-border pt-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-artemisa-secondary block mb-1">
                  Te puede interesar
                </span>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-artemisa-primary">
                  Productos Similares
                </h2>
              </div>
              <Link
                to="/productos"
                className="mt-2 md:mt-0 text-xs font-bold text-artemisa-secondary hover:underline"
              >
                Ver todos los productos →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relProduct) => {
                const displayPrice =
                  relProduct.isOffer && relProduct.offerPrice
                    ? relProduct.offerPrice
                    : relProduct.price;

                const imageSrc =
                  relProduct.images && relProduct.images.length > 0
                    ? relProduct.images[0]
                    : '/placeholder.jpg';

                return (
                  <Link
                    key={relProduct.id}
                    to={`/productos/${relProduct.id}`}
                    className="group relative bg-artemisa-border/20 border border-artemisa-border rounded-2xl shadow-sm hover:shadow-xl hover:border-artemisa-accent transition-all duration-500 overflow-hidden cursor-pointer flex flex-col p-3 h-full"
                  >
                    <div className="aspect-square w-full rounded-xl overflow-hidden bg-artemisa-light relative border border-dashed border-artemisa-accent/40 p-1 mb-3">
                      <div className="w-full h-full rounded-lg overflow-hidden relative">
                        <img
                          src={imageSrc}
                          alt={relProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-artemisa-primary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>

                      {relProduct.isOffer && (
                        <span className="absolute top-2 left-2 z-10 bg-artemisa-primary text-artemisa-accent border border-artemisa-accent/40 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                          Oferta
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        <h3 className="font-serif text-xs md:text-sm font-bold text-artemisa-primary leading-snug group-hover:text-artemisa-secondary transition-colors line-clamp-2">
                          {relProduct.name}
                        </h3>
                        <span className="w-4 h-[1.5px] bg-artemisa-accent mt-1.5 block transition-all duration-300 group-hover:w-8 rounded-full" />
                      </div>

                      <div className="pt-2 mt-3 border-t border-artemisa-border flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-widest text-artemisa-neutral/60 font-semibold">
                          Precio
                        </span>
                        <p className="text-xs md:text-sm font-bold text-artemisa-neutral">
                          {formatPrice(displayPrice)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* BOTÓN STICKY MOBILE */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-artemisa-light p-4 border-t border-artemisa-border z-50 shadow-2xl">
        {maxStock > 0 ? (
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full h-12 bg-artemisa-primary text-artemisa-light font-bold uppercase text-xs tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md px-4 cursor-pointer"
          >
            <ShoppingBag size={18} className="text-artemisa-accent shrink-0" />
            <span className="text-artemisa-light font-bold whitespace-nowrap">
              Agregar al carrito ({quantity})
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCustomOrderWhatsApp}
            className="w-full h-12 bg-emerald-700 text-white font-bold uppercase text-xs tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md px-4 cursor-pointer"
          >
            <MessageCircle size={18} className="shrink-0" />
            <span className="font-bold whitespace-nowrap">
              Encargar por WhatsApp
            </span>
          </button>
        )}
      </div>
    </div>
  );
};