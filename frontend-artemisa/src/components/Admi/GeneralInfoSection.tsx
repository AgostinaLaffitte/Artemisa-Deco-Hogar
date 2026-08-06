import type { Category } from '../../types/category';

interface GeneralInfoProps {
  isEditMode?: boolean;
  productId: string;
  setProductId?: (val: string) => void;
  name: string;
  setName: (val: string) => void;
  price: string;
  setPrice: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  categoriesList: Category[];
}

export const GeneralInfoSection = ({
  isEditMode = false,
  productId,
  setProductId,
  name,
  setName,
  price,
  setPrice,
  description,
  setDescription,
  selectedCategory,
  setSelectedCategory,
  categoriesList,
}: GeneralInfoProps) => {
  return (
    <div className="bg-artemisa-border/30 rounded-2xl p-6 shadow-xs border border-artemisa-border space-y-4">
      <h3 className="text-sm font-serif font-bold text-artemisa-primary uppercase tracking-wider border-b border-artemisa-border pb-3">
        {isEditMode ? 'Editar Información General' : 'Información General'}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-artemisa-secondary uppercase tracking-wider mb-1.5">
            Código Único {isEditMode ? '(No editable)' : '*'}
          </label>
          <input
            type="number"
            required={!isEditMode}
            disabled={isEditMode}
            placeholder="Ej: 4001"
            value={productId}
            onChange={(e) => setProductId?.(e.target.value)}
            className={`w-full border rounded-xl py-3 px-4 outline-none text-base sm:text-sm font-semibold transition-all ${
              isEditMode 
                ? 'border-artemisa-border bg-artemisa-border/40 text-artemisa-secondary/60 cursor-not-allowed' 
                : 'border-artemisa-border bg-white text-artemisa-neutral focus:border-artemisa-secondary'
            }`}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold text-artemisa-secondary uppercase tracking-wider mb-1.5">Nombre del Producto *</label>
          <input
            type="text"
            required
            placeholder="Ej: Respaldar de Cama Tusor Lino"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-artemisa-border rounded-xl py-3 px-4 outline-none focus:border-artemisa-secondary text-base sm:text-sm font-medium text-artemisa-neutral"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold text-artemisa-secondary uppercase tracking-wider mb-1.5">Precio Base ($) *</label>
          <input
            type="number"
            required
            step="0.01"
            placeholder="Ej: 18500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-white border border-artemisa-border rounded-xl py-3 px-4 outline-none focus:border-artemisa-secondary text-base sm:text-sm font-semibold text-artemisa-primary"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-artemisa-secondary uppercase tracking-wider mb-1.5">Categoría</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-white border border-artemisa-border rounded-xl py-2.5 px-3 outline-none focus:border-artemisa-secondary text-sm font-medium text-artemisa-neutral"
          >
            <option value="">Seleccionar categoría...</option>
            {categoriesList.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-artemisa-secondary uppercase tracking-wider mb-1.5">Descripción & Especificaciones</label>
        <textarea
          rows={3}
          placeholder="Detalles del producto (medidas, tipo de tela, cuidados)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-white border border-artemisa-border rounded-xl py-2.5 px-3 outline-none focus:border-artemisa-secondary text-sm font-normal text-artemisa-neutral"
        />
      </div>
    </div>
  );
};