import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/productUtils';
import type { Product } from '../types/product';

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link 
      to={`/productos/${product.id}`} 
      className="group relative bg-artemisa-border/30 border border-artemisa-border rounded-2xl shadow-sm hover:shadow-xl hover:border-artemisa-accent transition-all duration-500 overflow-hidden cursor-pointer flex flex-col p-3 h-full"
    >
      {/* Contenedor de Imagen con el fondo beige suave de la galería */}
      <div className="h-48 md:h-64 rounded-xl overflow-hidden bg-artemisa-border/30 relative border border-dashed border-artemisa-accent/40 p-1">
        <div className="w-full h-full rounded-lg overflow-hidden relative">
          <img 
            src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg'} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out" 
          />
          
          {/* Overlay cálido al pasar el mouse */}
          <div className="absolute inset-0 bg-gradient-to-t from-artemisa-neutral/50 via-transparent to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* Sello decorativo / Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-artemisa-secondary text-[9px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full border border-artemisa-border shadow-xs pointer-events-none">
          Ver detalle
        </div>
      </div>

      {/* Info del Producto */}
      <div className="pt-3.5 pb-1 px-1 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="font-serif text-sm md:text-base font-bold text-artemisa-primary leading-snug group-hover:text-artemisa-secondary transition-colors line-clamp-2">
            {product.name}
          </h3>
          <span className="w-5 h-[1.5px] bg-artemisa-accent mt-1.5 block transition-all duration-300 group-hover:w-10 rounded-full" />
        </div>
        
        {/* Bloque de Precio */}
        <div className="pt-3 mt-3 border-t border-artemisa-border flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-artemisa-secondary font-semibold">Precio</span>
          <p className="text-base md:text-xl font-bold text-artemisa-neutral">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
};