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
    <section className="max-w-7xl mx-auto px-3 sm:px-4 pt-3 md:pt-8">
      {/* Marco contenedor con aspect-ratio responsivo */}
      <div className="w-full bg-artemisa-light rounded-2xl md:rounded-3xl overflow-hidden relative group/hero border border-artemisa-border shadow-md p-1 md:p-2 bg-gradient-to-b from-artemisa-light to-artemisa-border/40">
        
        <div className="w-full rounded-xl md:rounded-2xl overflow-hidden relative">
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
            className="w-full h-auto"
          >
            {offers.map((banner) => {
              const slideContent = (
                <div className="w-full relative group cursor-pointer flex flex-col justify-end">
                  
                  {/* Imagen con aspect ratio adaptable: 
                      - Mobile: aspect-[16/9] o aspect-[4/3] (se ve toda la foto completa)
                      - Desktop: aspect-[21/9] o altura fija md:h-[500px]
                  */}
                  <div className="w-full aspect-[4/3] sm:aspect-[16/9] md:h-[500px] relative overflow-hidden">
                    <img 
                      src={banner.imageUrl} 
                      alt={banner.title || "Artemisa Confecciones"} 
                      className="w-full h-full object-cover object-center"
                    />
                    
                    {/* Overlay sutil para legibilidad de textos */}
                    <div className="absolute inset-0 bg-gradient-to-t from-artemisa-neutral/70 via-transparent to-transparent md:bg-gradient-to-r md:from-artemisa-neutral/80 md:via-artemisa-neutral/30 md:to-transparent" />
                  </div>

                  {/* Tarjeta Informativa Adaptada para Mobile */}
                  {banner.title && (
                    <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 md:left-12 md:bottom-12 md:right-auto bg-artemisa-light/95 md:bg-artemisa-light/90 p-3 sm:p-5 md:p-8 rounded-xl md:rounded-2xl shadow-lg max-w-xs sm:max-w-md border border-artemisa-border/80 backdrop-blur-md transition-all">
                      <span className="text-artemisa-secondary text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 sm:mb-1.5 block">
                        Destacado Artemisa
                      </span>
                      <h2 className="text-sm sm:text-lg md:text-2xl font-serif font-bold text-artemisa-primary leading-snug sm:leading-tight">
                        {banner.title}
                      </h2>
                      {banner.link && (
                        <div className="mt-2 sm:mt-4 inline-flex items-center gap-1.5 text-artemisa-primary font-semibold text-[10px] sm:text-xs group-hover:text-artemisa-secondary transition-colors">
                          <span className="uppercase tracking-widest border-b border-artemisa-accent pb-0.5">
                            Explorar propuesta
                          </span>
                          <ArrowRight size={12} className="text-artemisa-accent" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );

              return (
                <SwiperSlide key={banner.id}>
                  {banner.link ? (
                    <Link to={banner.link} className="block w-full">
                      {slideContent}
                    </Link>
                  ) : (
                    slideContent
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Flechas de Navegación (Solo en Desktop) */}
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