import { useState } from 'react';
import { LayoutDashboard, ShoppingBag, FolderOpen, ReceiptText, Percent, Image, ChevronLeft, ChevronRight, LogOut, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoArtemisa from '../../assets/logoArtemisa.png';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/admin' },
    { name: 'Catálogo', icon: <ShoppingBag size={18} />, path: '/admin/productos' },
    { name: 'Categorías', icon: <FolderOpen size={18} />, path: '/admin/categorias' },
    { name: 'Órdenes', icon: <ReceiptText size={18} />, path: '/admin/ordenes' },
    { name: 'Ofertas y Promos', icon: <Percent size={18} />, path: '/admin/ofertas' },
    { name: 'Banners Inicio', icon: <Image size={18} />, path: '/admin/banners' },
  ];

  return (
    <div className="min-h-screen bg-artemisa-light flex text-artemisa-neutral">
      {/* SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 text-artemisa-light flex flex-col justify-between transition-all duration-300 border-r border-artemisa-primary bg-cover bg-center 
        ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full'} 
        md:translate-x-0 md:sticky md:top-0 md:h-screen 
        ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-artemisa-primary/90 to-artemisa-neutral/95 z-0"></div>
        
        {/* Header del Sidebar */}
        <div className="relative z-10">
          <div className={`h-20 flex items-center px-4 border-b border-artemisa-secondary/40 ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}>
            
            {/* Muestra el logo ÚNICAMENTE cuando NO está colapsado */}
            {!isCollapsed && (
              <Link to="/" className="flex items-center justify-center py-1 group">
                <div 
                  className="h-7 md:h-10 w-30 md:w-45 bg-artemisa-light opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
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
            )}
            
            {/* Botón de cierre para menú mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="md:hidden p-2 text-artemisa-border"
            >
              <X size={20} />
            </button>
            
            {/* Botón para colapsar/expandir */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="hidden md:block p-2 rounded-xl bg-artemisa-primary/60 hover:bg-artemisa-accent/20 text-artemisa-accent transition-colors border border-artemisa-accent/30"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <nav className="p-3 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className={`flex items-center gap-3 h-11 px-3.5 rounded-xl font-medium text-xs tracking-wider uppercase transition-all ${
                    isActive 
                      ? 'bg-artemisa-accent text-artemisa-light shadow-md font-semibold' 
                      : 'text-artemisa-border/80 hover:text-artemisa-light hover:bg-artemisa-primary/50'
                  }`}
                >
                  {item.icon}
                  {(!isCollapsed || isMobileMenuOpen) && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="relative z-10 p-4 border-t border-artemisa-secondary/40">
          <button 
            onClick={() => { logout(); navigate('/'); }} 
            className="w-full flex items-center gap-3 text-rose-300 hover:text-rose-200 text-xs uppercase tracking-wider font-semibold p-2 rounded-xl hover:bg-rose-950/30 transition-colors"
          >
            <LogOut size={18} /> {(!isCollapsed || isMobileMenuOpen) && "Cerrar Sesión"}
          </button>
        </div>
      </aside>

      {/* Overlay para móvil */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-artemisa-neutral/60 backdrop-blur-xs z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 z-10 bg-artemisa-light">
        <header className="h-20 bg-artemisa-light/80 backdrop-blur-md border-b border-artemisa-border flex items-center px-4 md:px-8 justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-artemisa-primary">
              <Menu size={22} />
            </button>
            <h2 className="font-serif font-bold text-artemisa-primary text-lg tracking-normal">Panel de Control</h2>
          </div>
          <Link 
            to="/" 
            className="text-xs font-semibold uppercase tracking-wider border border-artemisa-secondary/30 text-artemisa-primary px-4 py-2 rounded-xl hover:bg-artemisa-border transition-colors whitespace-nowrap shadow-xs"
          >
            Ver Tienda
          </Link>
        </header>
        <main className="p-4 md:p-8 max-w-7xl">{children}</main>
      </div>
    </div>
  );
};