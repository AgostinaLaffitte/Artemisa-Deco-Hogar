import { Layers, Plus, Trash2 } from 'lucide-react';

export interface LocalVariant {
  id?: number;
  name: string;
  stock: number;
  price: number | null;
}

interface VariantMatrixProps {
  variants: LocalVariant[];
  onAddVariant: () => void;
  onRemoveVariant: (index: number) => void;
  onVariantChange: (index: number, field: keyof LocalVariant, value: any) => void;
}

export const VariantMatrix = ({
  variants,
  onAddVariant,
  onRemoveVariant,
  onVariantChange,
}: VariantMatrixProps) => {
  return (
    <div className="bg-artemisa-border/30 rounded-2xl p-6 shadow-xs border border-artemisa-border space-y-4">
      <div className="flex items-center justify-between border-b border-artemisa-border pb-3">
        <h3 className="text-sm font-serif font-bold text-artemisa-primary uppercase tracking-wider flex items-center gap-2">
          <Layers size={16} className="text-artemisa-secondary" /> Matriz de Variantes
        </h3>
        <button
          type="button"
          onClick={onAddVariant}
          className="text-xs font-semibold text-artemisa-primary hover:text-artemisa-secondary flex items-center gap-1 bg-white hover:bg-artemisa-border px-3 py-1.5 rounded-lg border border-artemisa-border transition-all"
        >
          <Plus size={14} /> Añadir
        </button>
      </div>

      <p className="text-[11px] text-artemisa-secondary">
        Agregá variantes según medidas (ej. 1 Plaza, 2 Plazas) o tipo de tela/color.
      </p>

      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div key={index} className="bg-white p-4 rounded-xl border border-artemisa-border space-y-3">
            
            {/* Nombre y Eliminar */}
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-artemisa-secondary uppercase mb-1">Nombre Variante</label>
                <input
                  type="text"
                  placeholder="Ej: 2 Plazas (140x190)"
                  value={variant.name}
                  onChange={(e) => onVariantChange(index, 'name', e.target.value)}
                  className="w-full bg-artemisa-light border border-artemisa-border rounded-lg py-2.5 px-3 text-sm font-medium outline-none focus:border-artemisa-secondary text-artemisa-neutral"
                />
              </div>
              
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveVariant(index)}
                  className="mt-6 p-2 text-artemisa-secondary hover:text-rose-700 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {/* Stock y Precio */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-artemisa-secondary uppercase mb-1">Stock Disponible</label>
                <input
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) => onVariantChange(index, 'stock', +e.target.value)}
                  className="w-full bg-artemisa-light border border-artemisa-border rounded-lg py-2.5 px-3 text-sm font-semibold outline-none focus:border-artemisa-secondary text-center text-artemisa-neutral"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-artemisa-secondary uppercase mb-1">Precio Específico ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={variant.price || ''}
                  onChange={(e) => onVariantChange(index, 'price', e.target.value ? +e.target.value : null)}
                  className="w-full bg-artemisa-light border border-artemisa-border rounded-lg py-2.5 px-3 text-sm font-bold text-artemisa-primary outline-none focus:border-artemisa-secondary"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};