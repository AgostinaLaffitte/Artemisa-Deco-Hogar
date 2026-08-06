import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { AuthModal } from './Auth/AuthModal'; 
import logoArtemisa from '../assets/logoArtemisa.png';
import { Search, ShoppingCart, User, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { totalQuantity } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/productos');
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-artemisa-neutral text-artemisa-light shadow-md relative">
      {/* Fondo con leve degradado orgánico estilo cuero/madera */}
      <div className="absolute inset-0 bg-gradient-to-r from-artemisa-neutral via-artemisa-primary to-artemisa-neutral opacity-90 z-0"></div>

      <div className="relative z-10 w-full px-4 md:px-10 h-20 md:h-24 flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* IZQUIERDA: Menú Hamburguesa (Mobile) y Navegación (Desktop) */}
        <div className="flex items-center gap-3 flex-1">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden p-2 text-artemisa-border hover:bg-artemisa-primary rounded-xl transition-colors cursor-pointer"
            aria-label="Abrir menú"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <nav className="hidden md:flex items-center gap-6 font-semibold text-xs uppercase tracking-widest text-artemisa-border">
            <Link to="/" className="hover:text-artemisa-accent transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-artemisa-accent hover:after:w-full after:transition-all">
              Inicio
            </Link>
            <Link to="/productos" className="hover:text-artemisa-accent transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-artemisa-accent hover:after:w-full after:transition-all">
              Productos
            </Link>
            <Link to="/ayuda" className="hover:text-artemisa-accent transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-artemisa-accent hover:after:w-full after:transition-all">
              Ayuda
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-artemisa-accent flex items-center gap-1.5 hover:text-white transition-colors bg-artemisa-primary/50 px-2.5 py-1 rounded-full border border-artemisa-secondary/40">
                <LayoutDashboard size={13} /> Admin
              </Link>
            )}
          </nav>
        </div>

        {/* CENTRO: Logo Artemisa Destacado */}
        <div className="flex justify-center flex-shrink-0">
          <Link to="/" className="flex items-center justify-center py-1 group">
            <div 
              className="h-11 md:h-16 w-36 md:w-52 bg-artemisa-light opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
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
        </div>

        {/* DERECHA: Buscador y Cuenta / Carrito */}
        <div className="flex items-center justify-end gap-3 md:gap-5 flex-1">
          {/* Buscador estilizado */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:block relative w-48 xl:w-60">
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-artemisa-neutral/70 border border-artemisa-secondary/40 text-artemisa-light placeholder:text-artemisa-secondary/70 rounded-full py-1.5 pl-3.5 pr-8 text-xs focus:border-artemisa-accent focus:bg-artemisa-neutral outline-none transition-all"
            />
            <button type="submit" className="absolute right-2.5 top-2 text-artemisa-secondary hover:text-artemisa-accent transition-colors cursor-pointer">
              <Search size={14} />
            </button>
          </form>

          {/* Iconos de Acción */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden md:flex items-center gap-2 bg-artemisa-neutral/60 px-3 py-1 rounded-full border border-artemisa-secondary/40">
                <span className="text-[11px] truncate max-w-[80px] text-artemisa-border font-medium">{user.email}</span>
                <button onClick={logout} className="text-red-400 hover:text-red-300 transition-colors cursor-pointer" title="Cerrar Sesión">
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)} 
                className="hidden md:flex items-center gap-1.5 text-xs font-medium tracking-wider text-artemisa-border hover:text-artemisa-accent transition-colors px-2.5 py-1 cursor-pointer"
              >
                <User size={15} /> <span className="uppercase text-[11px]">Ingresar</span>
              </button>
            )}

            {/* Botón Carrito */}
            <Link 
              to="/carrito" 
              className="relative p-2.5 text-artemisa-light bg-artemisa-primary hover:bg-artemisa-secondary/80 rounded-full transition-all border border-artemisa-secondary/40 shadow-sm hover:scale-105"
            >
              <ShoppingCart size={18} />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-artemisa-accent text-artemisa-neutral font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-artemisa-neutral shadow-md animate-pulse">
                  {totalQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* COSTURA ULTRA FINA (1px de alto, puntada corta de 4px) */}
      <div 
        className="w-full h-[1px] relative z-20 opacity-60"
        style={{
          backgroundImage: 'linear-gradient(to right, var(--color-artemisa-accent) 50%, transparent 0%)',
          backgroundPosition: 'bottom',
          backgroundSize: '8px 1px',
          backgroundRepeat: 'repeat-x'
        }}
      />

      {/* Menú Mobile Desplegable */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-artemisa-neutral border-b border-artemisa-primary p-5 flex flex-col gap-4 shadow-2xl z-50">
          <form onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Buscar confecciones..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-artemisa-primary border border-artemisa-secondary/40 text-artemisa-light rounded-xl py-2 px-4 text-sm outline-none focus:border-artemisa-accent"
            />
          </form>
          <div className="flex flex-col gap-3.5 text-sm font-medium border-t border-artemisa-primary pt-4 text-artemisa-border">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
            <Link to="/productos" onClick={() => setIsMenuOpen(false)}>Productos</Link>
            <Link to="/ayuda" onClick={() => setIsMenuOpen(false)}>Ayuda</Link>
            
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-artemisa-accent flex items-center gap-2">
                <LayoutDashboard size={16} /> Panel Admin
              </Link>
            )}
            
            {user ? (
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-left text-red-400 pt-2 cursor-pointer">
                Cerrar Sesión
              </button>
            ) : (
              <button onClick={() => { setIsAuthModalOpen(true); setIsMenuOpen(false); }} className="text-left text-artemisa-accent pt-2 cursor-pointer">
                Ingresar
              </button>
            )}
          </div>
        </div>
      )}
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};