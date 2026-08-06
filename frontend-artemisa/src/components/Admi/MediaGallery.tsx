import { Image as ImageIcon, Plus, X } from 'lucide-react';

interface MediaGalleryProps {
  existingImages?: string[];
  onRemoveExisting?: (url: string) => void;
  previewUrls: string[];
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveNew: (index: number) => void;
}

export const MediaGallery = ({ 
  existingImages = [],
  onRemoveExisting,
  previewUrls,
  onImageChange,
  onRemoveNew,
}: MediaGalleryProps) => {
  return (
    <div className="bg-artemisa-border/30 rounded-2xl p-6 shadow-xs border border-artemisa-border space-y-4">
      <h3 className="text-sm font-serif font-bold text-artemisa-primary uppercase tracking-wider border-b border-artemisa-border pb-3 flex items-center gap-2">
        <ImageIcon size={16} className="text-artemisa-secondary" /> Galería Multimedia
      </h3>

      {/* 1. IMÁGENES EXISTENTES */}
      {existingImages.length > 0 && onRemoveExisting && (
        <div className="space-y-2">
          <span className="block text-[10px] font-bold text-artemisa-secondary uppercase tracking-wider">Imágenes Actuales</span>
          <div className="grid grid-cols-3 gap-2">
            {existingImages.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-artemisa-border">
                <img src={url} alt="Guardada" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onRemoveExisting(url)}
                  className="absolute top-1 right-1 bg-artemisa-neutral/80 text-artemisa-light p-1.5 rounded-full hover:bg-rose-700 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. UPLOAD ZONE */}
      <label className="border-2 border-dashed border-artemisa-accent/40 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-artemisa-secondary hover:bg-white/50 transition-all text-center">
        <input type="file" multiple accept="image/*" onChange={onImageChange} className="hidden" />
        <div className="w-10 h-10 bg-artemisa-light rounded-full flex items-center justify-center text-artemisa-secondary border border-artemisa-border">
          <Plus size={20} />
        </div>
        <span className="text-xs font-semibold text-artemisa-primary">
          {existingImages.length > 0 ? 'Agregar nuevas imágenes' : 'Subir imágenes del producto'}
        </span>
      </label>

      {/* 3. NUEVAS PREVISUALIZACIONES */}
      {previewUrls.length > 0 && (
        <div className="space-y-2">
          <span className="block text-[10px] font-bold text-artemisa-secondary uppercase tracking-wider">Nuevas a subir</span>
          <div className="grid grid-cols-3 gap-3">
            {previewUrls.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-artemisa-border bg-white group">
                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => onRemoveNew(idx)} 
                  className="absolute top-1 right-1 bg-artemisa-neutral/80 text-artemisa-light p-1.5 rounded-full hover:bg-rose-700 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};