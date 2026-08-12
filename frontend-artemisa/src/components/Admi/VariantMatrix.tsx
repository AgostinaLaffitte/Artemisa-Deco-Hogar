import { Layers, Plus, Trash2, Upload, X, Film, Image as ImageIcon } from 'lucide-react';

export interface LocalVariant {
  id?: number;
  name: string;
  stock: number;
  price: number | null;
  size?: string;
  color?: string;
  images: string[];     // URLs de imágenes/videos existentes o ya subidos
  files?: File[];       // Nuevos archivos de la variante a subir al backend
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

  const handleVariantFiles = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const existingFiles = variants[index].files || [];
      onVariantChange(index, 'files', [...existingFiles, ...newFiles]);
    }
  };

  const removeVariantFile = (variantIndex: number, fileIndex: number) => {
    const updatedFiles = (variants[variantIndex].files || []).filter((_, i) => i !== fileIndex);
    onVariantChange(variantIndex, 'files', updatedFiles);
  };

  const removeVariantUrl = (variantIndex: number, urlIndex: number) => {
    const updatedImages = (variants[variantIndex].images || []).filter((_, i) => i !== urlIndex);
    onVariantChange(variantIndex, 'images', updatedImages);
  };

  return (
    <div className="bg-artemisa-border/30 rounded-2xl p-6 shadow-xs border border-artemisa-border space-y-4">
      <div className="flex items-center justify-between border-b border-artemisa-border pb-3">
        <h3 className="text-sm font-serif font-bold text-artemisa-primary uppercase tracking-wider flex items-center gap-2">
          <Layers size={16} className="text-artemisa-secondary" /> Matriz de Variantes
        </h3>
        <button
          type="button"
          onClick={onAddVariant}
          className="text-xs font-semibold text-artemisa-primary hover:text-artemisa-secondary flex items-center gap-1 bg-white hover:bg-artemisa-border px-3 py-1.5 rounded-lg border border-artemisa-border transition-all cursor-pointer"
        >
          <Plus size={14} /> Añadir
        </button>
      </div>

      <p className="text-[11px] text-artemisa-secondary">
        Agregá variantes según medidas (ej. 1 Plaza, 2 Plazas) o tipo de tela/color y asignales sus fotos o videos específicos.
      </p>

      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div key={index} className="bg-white p-4 rounded-xl border border-artemisa-border space-y-4">
            
            {/* Nombre y Eliminar */}
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-artemisa-secondary uppercase mb-1">Nombre Variante *</label>
                <input
                  type="text"
                  placeholder="Ej: 2 Plazas (140x190) - Tusor Lino"
                  value={variant.name}
                  onChange={(e) => onVariantChange(index, 'name', e.target.value)}
                  className="w-full bg-artemisa-light border border-artemisa-border rounded-lg py-2.5 px-3 text-sm font-medium outline-none focus:border-artemisa-secondary text-artemisa-neutral"
                />
              </div>
              
              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveVariant(index)}
                  className="mt-6 p-2 text-artemisa-secondary hover:text-rose-700 transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {/* Stock y Precio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-artemisa-secondary uppercase mb-1">Stock Disponible</label>
                <input
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) => onVariantChange(index, 'stock', +e.target.value)}
                  className="w-full bg-artemisa-light border border-artemisa-border rounded-lg py-2.5 px-3 text-sm font-semibold outline-none focus:border-artemisa-secondary text-artemisa-neutral"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-artemisa-secondary uppercase mb-1">Precio Específico ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Dejar vacío si aplica precio base"
                  value={variant.price || ''}
                  onChange={(e) => onVariantChange(index, 'price', e.target.value ? +e.target.value : null)}
                  className="w-full bg-artemisa-light border border-artemisa-border rounded-lg py-2.5 px-3 text-sm font-bold text-artemisa-primary outline-none focus:border-artemisa-secondary"
                />
              </div>
            </div>

            {/* Subida de Archivos de la Variante (Fotos / Videos) */}
            <div>
              <label className="block text-[10px] font-bold text-artemisa-secondary uppercase mb-1.5 flex items-center gap-1">
                <ImageIcon size={12} /> Archivos de la Variante (Imágenes / Videos)
              </label>

              <div className="flex flex-wrap items-center gap-2">
                {/* Botón para subir archivos */}
                <label className="flex items-center gap-1.5 px-3 py-2 bg-artemisa-light border border-dashed border-artemisa-secondary/40 hover:border-artemisa-secondary rounded-lg text-xs font-semibold text-artemisa-primary cursor-pointer transition-colors">
                  <Upload size={14} /> Subir Archivo
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => handleVariantFiles(index, e)}
                    className="hidden"
                  />
                </label>

                {/* Previsualización de imágenes/videos existentes (URLs) */}
                {variant.images?.map((url, imgIdx) => (
                  <div key={`url-${imgIdx}`} className="relative w-12 h-12 rounded-md overflow-hidden border border-artemisa-border group">
                    {url.match(/\.(mp4|webm|mov)$/i) ? (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                        <Film size={16} />
                      </div>
                    ) : (
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeVariantUrl(index, imgIdx)}
                      className="absolute top-0.5 right-0.5 bg-black/70 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}

                {/* Previsualización de nuevos archivos seleccionados (Files) */}
                {variant.files?.map((file, fileIdx) => {
                  const isVideo = file.type.startsWith('video/');
                  const previewUrl = URL.createObjectURL(file);
                  return (
                    <div key={`file-${fileIdx}`} className="relative w-12 h-12 rounded-md overflow-hidden border border-artemisa-secondary group">
                      {isVideo ? (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                          <Film size={16} />
                        </div>
                      ) : (
                        <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeVariantFile(index, fileIdx)}
                        className="absolute top-0.5 right-0.5 bg-rose-600 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};