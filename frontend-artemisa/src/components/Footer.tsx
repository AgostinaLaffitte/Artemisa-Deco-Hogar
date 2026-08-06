import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, ShieldCheck, Phone, Mail } from 'lucide-react';
import { Camera as Instagram } from 'lucide-react';
import logoArtemisa from '../assets/logoArtemisa.png';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Puntada de costura ultra fina
  const FineStitchLine = () => (
    <div 
      className="w-full h-[1px] opacity-30"
      style={{
        backgroundImage: 'linear-gradient(to right, var(--color-artemisa-accent) 40%, transparent 0%)',
        backgroundPosition: 'center',
        backgroundSize: '5px 1px',
        backgroundRepeat: 'repeat-x'
      }}
    />
  );

  return (
    <footer className="relative w-full bg-artemisa-neutral text-artemisa-light mt-auto">
      {/* PESPUNTE SUPERIOR FINO */}
      <FineStitchLine />

      <div className="relative z-10 w-full">
        {/* Beneficios */}
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: ShoppingBag, title: "Descuento", text: "15% OFF mayorista" },
              { icon: Truck, title: "Envíos", text: "Retiro o despacho" },
              { icon: ShieldCheck, title: "Seguridad", text: "Pago 100% seguro" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 justify-center sm:justify-start">
                <item.icon size={18} strokeWidth={1.3} className="text-artemisa-accent" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-artemisa-light">{item.title}</h4>
                  <p className="text-[11px] text-artemisa-border/80 font-light">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pespunte intermedio */}
        <FineStitchLine />

        {/* Navegación principal */}
        <div className="container mx-auto px-6 py-8 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Logo e Info */}
            <div className="flex flex-col items-center md:items-start space-y-3">
             <Link to="/" className="flex items-center justify-center py-1 group">
            <div 
              className="h-11 md:h-12 w-36 md:w-45 bg-artemisa-light opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
              style={{
                maskImage: `url(${logoArtemisa})`,
                WebkitMaskImage: `url(${logoArtemisa})`,
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
              }}
              aria-label="Artemisa Confecciones"
            />
          </Link>
              <p className="text-xs text-artemisa-border/80 font-light max-w-xs leading-relaxed">
                Confecciones textiles artesanales hechas con dedicación para tu hogar.
              </p>
            </div>

            {/* Explorar */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-artemisa-accent tracking-widest">
                Explorar
              </h4>
              <div className="w-8 mx-auto md:mx-0">
                <FineStitchLine />
              </div>
              <ul className="space-y-2 text-xs font-light text-artemisa-border/90 pt-1">
                <li><Link to="/productos" className="hover:text-artemisa-accent transition-colors" onClick={() => window.scrollTo(0, 0)}>Catálogo</Link></li>
                <li><Link to="/ayuda" className="hover:text-artemisa-accent transition-colors" onClick={() => window.scrollTo(0, 0)}>Preguntas Frecuentes</Link></li>
                <li><Link to="/carrito" className="hover:text-artemisa-accent transition-colors" onClick={() => window.scrollTo(0, 0)}>Mi Carrito</Link></li>
              </ul>
            </div>

            {/* Contacto */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-artemisa-accent tracking-widest">
                Contacto
              </h4>
              <div className="w-8 mx-auto md:mx-0">
                <FineStitchLine />
              </div>
              <ul className="space-y-2 text-xs font-light text-artemisa-border/90 flex flex-col items-center md:items-start pt-1">
                <li>
                  <a href="https://wa.me/5492284690919" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-artemisa-light transition-colors">
                    <Phone size={13} strokeWidth={1.3} className="text-artemisa-accent" /> WhatsApp
                  </a>
                </li>
                <li>
                  <a href="mailto:Artemisa@gmail.com" className="flex items-center gap-2 hover:text-artemisa-light transition-colors">
                    <Mail size={13} strokeWidth={1.3} className="text-artemisa-accent" /> Gmail
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/artemisa_costura" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-artemisa-light transition-colors">
                    <Instagram size={13} strokeWidth={1.3} className="text-artemisa-accent" /> Instagram
                  </a>
                </li>
              </ul>
            </div>

            {/* Medios de Pago */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-artemisa-accent tracking-widest">
                Medios de Pago
              </h4>
              <div className="w-8 mx-auto md:mx-0">
                <FineStitchLine />
              </div>
              <p className="text-xs text-artemisa-border/80 font-light pt-1">
                Mercado Pago, transferencias y tarjetas de crédito o débito.
              </p>
            </div>

          </div>
        </div>

        {/* Pespunte inferior */}
        <FineStitchLine />

        {/* Copyright */}
        <div className="py-4 text-center text-[10px] text-artemisa-accent/70 font-light tracking-widest">
          © {currentYear} ARTEMISA DECO & HOGAR
        </div>
      </div>
    </footer>
  );
};