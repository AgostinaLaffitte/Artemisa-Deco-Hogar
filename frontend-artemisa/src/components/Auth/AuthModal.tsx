import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Login } from './Login';
import { Register } from './Register';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-artemisa-neutral/60 backdrop-blur-sm p-4 animate-fadeIn overflow-y-auto">
      
      <div className="relative w-full max-w-4xl bg-artemisa-light rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row md:h-[620px] max-h-[90vh] border border-artemisa-border">
        
        {/* Botón de Cierre */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 z-10 p-2 bg-artemisa-light/80 hover:bg-artemisa-border text-artemisa-secondary rounded-full transition-colors shadow-sm border border-artemisa-border"
          aria-label="Cerrar modal"
        >
          <X size={18} />
        </button>

        {/* Columna Izquierda: Branding e Imagen de Artemisa */}
        <div className="hidden md:block md:w-1/2 relative h-full">
          <img 
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover"
            alt="Artemisa Confecciones"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-artemisa-neutral/90 via-artemisa-neutral/40 to-transparent flex flex-col justify-end p-10 text-artemisa-light">
            <div className="inline-flex items-center gap-1.5 text-artemisa-accent text-xs font-semibold uppercase tracking-widest mb-1">
              <Sparkles size={14} /> Artemisa Deco
            </div>
            <h2 className="text-3xl font-serif font-bold tracking-tight text-artemisa-light">
              Diseño & Confección
            </h2>
            <p className="text-xs text-artemisa-border font-light italic mt-1">
              Guardá tus productos favoritos y realizá tus pedidos a medida.
            </p>
          </div>
        </div>

        {/* Columna Derecha: Formulario */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-artemisa-light h-full overflow-y-auto">
          {isLogin ? (
            <Login onSwitch={() => setIsLogin(false)} onSuccess={onClose} />
          ) : (
            <Register onSwitch={() => setIsLogin(true)} onSuccess={onClose} />
          )}
        </div>

      </div>
    </div>
  );
};