import type { Category } from '../../types/category';

interface GeneralInfoProps {
  isEditMode?: boolean;
  productId?: string; // <-- Opcional para que no falle en CreateProductPage
  setProductId?: (val: string) => void;
  name: string;
  setName: (val: string) => void;
  price: string;
  setPrice: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (val: string[]) => void;
  categoriesList: Category[];
}

export const GeneralInfoSection = ({
  isEditMode = false,
  productId = '',
  setProductId,
  name,
  setName,
  price,
  setPrice,
  description,
  setDescription,
  selectedCategories,
  setSelectedCategories,
  categoriesList,
}: GeneralInfoProps) => {

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  return (
    <div className="bg-artemisa-border/30 rounded-2xl p-6 shadow-xs border border-artemisa-border space-y-4">
      <h3 className="text-sm font-serif font-bold text-artemisa-primary uppercase tracking-wider border-b border-artemisa-border pb-3">
        {isEditMode ? 'Editar Información General' : 'Información General'}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isEditMode && (
          <div>
            <label className="block text-[10px] font-bold text-artemisa-secondary uppercase tracking-wider mb-1.5">
              Código Único (ID)
            </label>
            <input
              type="text"
              disabled
              value={productId}
              onChange={(e) => setProductId?.(e.target.value)}
              className="w-full border rounded-xl py-3 px-4 outline-none text-base sm:text-sm font-semibold border-artemisa-border bg-artemisa-border/40 text-artemisa-secondary/60 cursor-not-allowed"
            />
          </div>
        )}

        <div className={isEditMode ? 'sm:col-span-2' : 'sm:col-span-3'}>
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

        {/* Selección múltiple de categorías */}
        <div>
          <label className="block text-[10px] font-bold text-artemisa-secondary uppercase tracking-wider mb-1.5">
            Categorías
          </label>
          <div className="flex flex-wrap gap-1.5 p-2 bg-white border border-artemisa-border rounded-xl min-h-[46px] items-center">
            {categoriesList.length === 0 ? (
              <span className="text-xs text-artemisa-secondary/60 px-2">Cargando categorías...</span>
            ) : (
              categoriesList.map(cat => {
                const isSelected = selectedCategories.includes(String(cat.id));
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryToggle(String(cat.id))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-artemisa-primary text-white shadow-xs'
                        : 'bg-artemisa-border/30 text-artemisa-neutral hover:bg-artemisa-border'
                    }`}
                  >
                    {cat.name} {isSelected && '✓'}
                  </button>
                );
              })
            )}
          </div>
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