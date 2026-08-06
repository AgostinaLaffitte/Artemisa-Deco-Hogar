import { ProductCard } from './ProductCard';
import type { Product } from '../types/product';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';

interface ProductListProps {
  products: Product[];
}

export const ProductList = ({ products }: ProductListProps) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Todos');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = ['Todos', ...Array.from(new Set(
    products.flatMap(p => p.categories?.map(c => c.name) || [])
  ))];
  
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCat === 'Todos' || 
      product.categories?.some(c => c.name === selectedCat);
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-0 md:px-4 py-4">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* ASIDE - FILTROS POR CATEGORÍA */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden w-full bg-artemisa-light/80 p-4 rounded-xl border border-artemisa-border flex justify-between items-center font-bold text-sm text-artemisa-neutral shadow-sm mb-4 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Filter size={16} className="text-artemisa-accent" />
              Filtrar por categoría
            </span>
            {isFilterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {/* Panel Lateral Desktop / Mobile */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block bg-artemisa-light/80 p-6 rounded-2xl border border-artemisa-border shadow-sm sticky top-28`}>
            <h3 className="font-bold text-artemisa-neutral uppercase tracking-widest text-xs mb-4 pb-2 border-b border-artemisa-border">
              Categorías
            </h3>
            
            {/* Buscador interno de categorías */}
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Buscar categoría..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-artemisa-light border border-artemisa-border rounded-xl pl-3 pr-8 py-2.5 text-xs text-artemisa-neutral placeholder:text-artemisa-secondary/60 outline-none focus:border-artemisa-accent transition-colors"
              />
              <Search size={14} className="absolute right-3 top-3 text-artemisa-secondary" />
            </div>

            <ul className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
              {categories.filter(c => c.toLowerCase().includes(search.toLowerCase())).map(cat => (
                <li 
                  key={cat} 
                  onClick={() => setSelectedCat(cat)}
                  className={`text-xs font-semibold cursor-pointer px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                    selectedCat === cat 
                      ? 'bg-artemisa-neutral text-artemisa-light shadow-sm' 
                      : 'text-artemisa-secondary hover:bg-artemisa-border/50'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCat === cat && <span className="w-1.5 h-1.5 rounded-full bg-artemisa-accent"></span>}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* GRILLA DE PRODUCTOS */}
        <div className="flex-1 w-full">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full bg-artemisa-light/80 border border-artemisa-border rounded-2xl p-12 text-center">
                <p className="text-artemisa-secondary text-sm font-medium">No se encontraron productos en esta categoría.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};