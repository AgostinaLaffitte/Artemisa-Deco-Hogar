import { useEffect, useState } from 'react';
import { ProductService } from '../services/product.service';
import { BannerService } from '../services/banner.service';
import { Hero } from '../components/Hero';
import { CategoryCard } from '../components/CategoryCard';
import type { Banner } from '../types/banner';
import type { Product } from '../types/product';
import { Link } from 'react-router-dom';
import { Sparkles, Scissors, ShieldCheck, Truck, MessageCircle, BedDouble } from 'lucide-react';

export const Home = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerData, productData] = await Promise.all([
          BannerService.getAll(),
          ProductService.getAll()
        ]);
        setBanners(bannerData);
        setProducts(productData);
      } catch (error) {
        console.error("Error cargando la Home:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Mapeo dinámico de categorías basado en los productos existentes
  const categoriesMap = new Map<number, { id: number; name: string; image: string }>();

  products.forEach(product => {
    product.categories?.forEach(cat => {
      if (!categoriesMap.has(cat.id)) {
        categoriesMap.set(cat.id, {
          id: cat.id,
          name: cat.name,
          // Prioriza la imagen de la categoría; si no tiene, usa la del producto como fallback
          image: cat.image || product.images?.[0] || '' 
        });
      }
    });
  });

  const categories = Array.from(categoriesMap.values());

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-artemisa-light text-artemisa-primary gap-3">
        <div className="w-10 h-10 border-2 border-artemisa-secondary border-t-transparent rounded-full animate-spin" />
        <span className="font-serif italic text-sm tracking-widest uppercase text-artemisa-secondary animate-pulse">
          Cargando Artemisa...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-artemisa-light min-h-screen text-artemisa-neutral relative">
      
      {/* SECCIÓN HERO DINÁMICA CON SWIPER SLIDER */}
      {banners.length > 0 ? (
        <Hero offers={banners} />
      ) : (
        <section className="relative w-full h-[280px] md:h-[380px] bg-artemisa-primary flex flex-col items-center justify-center text-artemisa-light px-4 text-center border-b border-dashed border-artemisa-secondary overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-artemisa-neutral/80" />
          <div className="relative z-10 max-w-2xl">
            <span className="text-artemisa-accent uppercase text-[10px] md:text-xs tracking-[0.3em] font-semibold mb-2 block">
              Confección & Diseño Artesanal
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-artemisa-light tracking-tight leading-tight mb-4">
              Bienvenidos a Artemisa
            </h1>
            <p className="text-xs md:text-sm text-artemisa-border max-w-md mx-auto font-light">
              Productos textiles hechos con dedicación, cuidando cada detalle y selección de materiales.
            </p>
          </div>
        </section>
      )}

     {/* BANNER DE PROPUESTA DE VALOR / BENEFICIOS ARTESANALES */}
{/* BANNER DE PROPUESTA DE VALOR / BENEFICIOS ARTESANALES */}
<section className="border-b border-artemisa-border bg-artemisa-border/30 py-3 md:py-6 px-4">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 divide-y md:divide-y-0 divide-artemisa-border/40">
    
    <div className="flex items-center md:justify-center gap-3 pt-2 first:pt-0 md:pt-0">
      <Scissors className="text-artemisa-secondary shrink-0" size={20} />
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-artemisa-primary">Trabajo Artesanal</h4>
        <p className="text-[11px] text-artemisa-secondary leading-tight">Atención en cada detalle y confección</p>
      </div>
    </div>
    
    <div className="flex items-center md:justify-center gap-3 pt-2 md:pt-0">
      <ShieldCheck className="text-artemisa-secondary shrink-0" size={20} />
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-artemisa-primary">Materiales Seleccionados</h4>
        <p className="text-[11px] text-artemisa-secondary leading-tight">Telas resistentes de primera línea</p>
      </div>
    </div>

    <div className="flex items-center md:justify-center gap-3 pt-2 md:pt-0">
      <Truck className="text-artemisa-secondary shrink-0" size={20} />
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-artemisa-primary">Envíos Cuidados</h4>
        <p className="text-[11px] text-artemisa-secondary leading-tight">Empaquetado listo para disfrutar o regalar</p>
      </div>
    </div>

  </div>
</section>

      {/* CONTENIDO PRINCIPAL: CATEGORÍAS */}
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-20 pb-28">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-artemisa-border/50 rounded-full text-artemisa-secondary text-[10px] uppercase tracking-widest font-semibold mb-3">
            <Sparkles size={12} /> Explora Nuestra Colección
          </div>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-artemisa-primary tracking-normal">
            Nuestras Categorías
          </h2>
          <div className="w-16 h-[2px] bg-artemisa-accent mx-auto mt-3 mb-2 rounded-full" />
          <p className="text-xs md:text-sm text-artemisa-secondary font-light max-w-sm mx-auto">
            Encontrá el producto ideal confeccionado a tu medida
          </p>
        </div>
        
        {/* GRILLA DE CATEGORÍAS */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {categories.map(cat => (
              <Link 
                key={cat.id} 
                to={`/productos?category=${cat.id}`}
                className="block h-full group"
              >
                <CategoryCard name={cat.name} image={cat.image} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-sm text-artemisa-secondary italic font-serif">
            Próximamente estaremos publicando nuevas secciones...
          </div>
        )}
      </main>

      {/* BOTÓN FLOTANTE DE PERSONALIZACIÓN */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 group">
        <div className="bg-artemisa-primary text-artemisa-light text-[11px] py-1.5 px-3 rounded-xl shadow-lg opacity-90 transition-all duration-300 pointer-events-none hidden sm:block border border-artemisa-secondary/30">
          <p className="font-light">¿Buscás respaldar de cama o trabajo a medida?</p>
        </div>

        <a
          href="https://wa.me/5492284690919?text=¡Hola!%20Me%20gustaría%20consultar%20por%20un%20pedido%20personalizado%20(medidas,%20respaldares,%20modelos%20especiales)."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-artemisa-primary hover:bg-artemisa-neutral text-artemisa-light px-4 py-3 rounded-full shadow-xl transition-all duration-300 border border-artemisa-accent/40 hover:scale-105 active:scale-95 group"
          aria-label="Personalizá tu pedido por WhatsApp"
        >
          <div className="relative">
            <BedDouble size={20} className="text-artemisa-accent" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-artemisa-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-artemisa-accent"></span>
            </span>
          </div>

          <span className="text-xs font-medium tracking-wide uppercase font-sans">
            Personalizá tu pedido
          </span>

          <MessageCircle size={16} className="text-artemisa-accent group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

    </div>
  );
};