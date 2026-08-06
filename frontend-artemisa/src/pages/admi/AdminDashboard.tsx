import { Link } from 'react-router-dom';
import { ShoppingBag, FolderOpen, ReceiptText, Percent, Image } from 'lucide-react';

export const AdminDashboard = () => {
  return (
    <div className="space-y-8 text-artemisa-neutral">
      {/* Encabezado limpio */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-artemisa-border pb-6">
        <div>
          <h2 className="text-3xl font-black text-artemisa-primary uppercase tracking-tight italic">
            Panel de Control
          </h2>
          <p className="text-xs text-artemisa-secondary mt-0.5 font-bold uppercase tracking-wider">
            Gestión interna de catálogo, variantes, secciones y banners de Artemisa.
          </p>
        </div>
      </div>

      {/* Grid de Accesos Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Catálogo de Productos */}
        <Link 
          to="/admin/productos" 
          className="bg-white p-6 rounded-2xl border border-artemisa-border shadow-sm flex items-center gap-4 hover:border-artemisa-accent hover:shadow-md transition-all duration-200 group"
        >
          <div className="w-12 h-12 bg-artemisa-light rounded-xl flex items-center justify-center text-artemisa-secondary group-hover:bg-artemisa-primary group-hover:text-artemisa-light transition-all">
            <ShoppingBag size={22} />
          </div>
          <div>
            <span className="block font-black text-xl text-artemisa-primary">Catálogo</span>
            <span className="text-xs text-artemisa-secondary font-medium">Modificar precios y stock</span>
          </div>
        </Link>

        {/* Gestión de Categorías */}
        <Link 
          to="/admin/categorias" 
          className="bg-white p-6 rounded-2xl border border-artemisa-border shadow-sm flex items-center gap-4 hover:border-artemisa-accent hover:shadow-md transition-all duration-200 group"
        >
          <div className="w-12 h-12 bg-artemisa-light rounded-xl flex items-center justify-center text-artemisa-secondary group-hover:bg-artemisa-primary group-hover:text-artemisa-light transition-all">
            <FolderOpen size={22} />
          </div>
          <div>
            <span className="block font-black text-xl text-artemisa-primary">Categorías</span>
            <span className="text-xs text-artemisa-secondary font-medium">Administrar nombres y fotos</span>
          </div>
        </Link>

        {/* Órdenes de Pedidos */}
        <Link 
          to="/admin/ordenes" 
          className="bg-white p-6 rounded-2xl border border-artemisa-border shadow-sm flex items-center gap-4 hover:border-artemisa-accent hover:shadow-md transition-all duration-200 group"
        >
          <div className="w-12 h-12 bg-artemisa-light rounded-xl flex items-center justify-center text-artemisa-secondary group-hover:bg-artemisa-primary group-hover:text-artemisa-light transition-all">
            <ReceiptText size={22} />
          </div>
          <div>
            <span className="block font-black text-xl text-artemisa-primary">Órdenes</span>
            <span className="text-xs text-artemisa-secondary font-medium">Ver pedidos de clientes</span>
          </div>
        </Link>

        {/* Ofertas y Promociones */}
        <Link 
          to="/admin/ofertas" 
          className="bg-white p-6 rounded-2xl border border-artemisa-border shadow-sm flex items-center gap-4 hover:border-artemisa-accent hover:shadow-md transition-all duration-200 group"
        >
          <div className="w-12 h-12 bg-artemisa-light rounded-xl flex items-center justify-center text-artemisa-secondary group-hover:bg-artemisa-primary group-hover:text-artemisa-light transition-all">
            <Percent size={22} />
          </div>
          <div>
            <span className="block font-black text-xl text-artemisa-primary">Ofertas y Promos</span>
            <span className="text-xs text-artemisa-secondary font-medium">Configurar descuentos</span>
          </div>
        </Link>

        {/* Banners Inicio */}
        <Link 
          to="/admin/banners" 
          className="bg-white p-6 rounded-2xl border border-artemisa-border shadow-sm flex items-center gap-4 hover:border-artemisa-accent hover:shadow-md transition-all duration-200 group"
        >
          <div className="w-12 h-12 bg-artemisa-light rounded-xl flex items-center justify-center text-artemisa-secondary group-hover:bg-artemisa-primary group-hover:text-artemisa-light transition-all">
            <Image size={22} />
          </div>
          <div>
            <span className="block font-black text-xl text-artemisa-primary">Banners Inicio</span>
            <span className="text-xs text-artemisa-secondary font-medium">Cambiar carrusel principal</span>
          </div>
        </Link>

      </div>
    </div>
  );
};