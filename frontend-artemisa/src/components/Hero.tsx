import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import type { Banner } from '../types/banner';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface HeroProps {
  offers: Banner[];
}

export const Hero = ({ offers }: HeroProps) => {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-4 md:pt-8">
      {/* Marco contenedor artesanal */}
      <div className="w-full h-[320px] sm:h-[400px] md:h-[500px] bg-artemisa-light rounded-2xl md:rounded-3xl overflow-hidden relative group/hero border border-artemisa-border shadow-md p-1.5 md:p-2 bg-gradient-to-b from-artemisa-light to-artemisa-border/40">
        
        <div className="w-full h-full rounded-xl md:rounded-2xl overflow-hidden relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={{
              nextEl: '.hero-swiper-button-next',
              prevEl: '.hero-swiper-button-prev',
            }}
            pagination={{ 
              clickable: true,
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-artemisa-accent !w-6',
            }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            loop={offers.length > 1}
            className="h-full w-full"
          >
            {offers.map((banner) => {
              const slideContent = (
                <div className="w-full h-full relative group cursor-pointer">
                  <img 
                    src={banner.imageUrl} 
                    alt={banner.title || "Artemisa Confecciones"} 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay Gradiente Cálido */}
                  <div className="absolute inset-0 bg-gradient-to-t from-artemisa-neutral/80 via-artemisa-neutral/20 to-transparent md:bg-gradient-to-r md:from-artemisa-neutral/80 md:via-artemisa-neutral/30 md:to-transparent" />

                  {/* Tarjeta Flotante Informativa */}
                  {banner.title && (
                    <div className="absolute bottom-6 left-4 right-4 md:right-auto md:bottom-12 md:left-12 bg-artemisa-light/95 md:bg-artemisa-light/90 p-5 md:p-8 rounded-2xl shadow-xl max-w-md border border-artemisa-border backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-500">
                      <span className="text-artemisa-secondary text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] mb-1.5 block">
                        Destacado Artemisa
                      </span>
                      <h2 className="text-lg md:text-2xl font-serif font-bold text-artemisa-primary leading-tight">
                        {banner.title}
                      </h2>
                      {banner.link && (
                        <div className="mt-4 inline-flex items-center gap-2 text-artemisa-primary font-semibold text-xs group-hover:text-artemisa-secondary transition-colors">
                          <span className="uppercase text-[10px] tracking-widest border-b border-artemisa-accent pb-0.5">
                            Explorar propuesta
                          </span>
                          <ArrowRight size={14} className="text-artemisa-accent" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );

              return (
                <SwiperSlide key={banner.id}>
                  {banner.link ? (
                    <Link to={banner.link} className="block w-full h-full">
                      {slideContent}
                    </Link>
                  ) : (
                    slideContent
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Flechas de Navegación Estilo Bronce / Lino */}
          {offers.length > 1 && (
            <div className="hidden md:block">
              <button className="hero-swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-artemisa-light/90 hover:bg-artemisa-primary text-artemisa-primary hover:text-artemisa-light rounded-full flex items-center justify-center shadow-lg transition-all border border-artemisa-border opacity-0 group-hover/hero:opacity-100 cursor-pointer">
                <ChevronLeft size={22} />
              </button>
              <button className="hero-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-artemisa-light/90 hover:bg-artemisa-primary text-artemisa-primary hover:text-artemisa-light rounded-full flex items-center justify-center shadow-lg transition-all border border-artemisa-border opacity-0 group-hover/hero:opacity-100 cursor-pointer">
                <ChevronRight size={22} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};