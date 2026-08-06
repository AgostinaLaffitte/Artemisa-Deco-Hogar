interface OfferSectionProps {
  isOffer: boolean;
  setIsOffer: (value: boolean) => void;
  offerPrice: string;
  setOfferPrice: (value: string) => void;
}

export const OfferSection = ({ 
  isOffer, 
  setIsOffer, 
  offerPrice, 
  setOfferPrice 
}: OfferSectionProps) => {
  return (
    <div className="bg-artemisa-border/30 rounded-2xl p-6 shadow-xs border border-artemisa-border space-y-4">
      <h3 className="text-sm font-serif font-bold text-artemisa-primary uppercase tracking-wider border-b border-artemisa-border pb-3">
        Promociones & Ofertas
      </h3>
      
      <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-white/50 transition-colors">
        <input
          type="checkbox"
          checked={isOffer}
          onChange={(e) => setIsOffer(e.target.checked)}
          className="w-5 h-5 rounded text-artemisa-secondary focus:ring-artemisa-secondary border-artemisa-border cursor-pointer"
        />
        <span className="text-xs font-semibold text-artemisa-primary uppercase tracking-wider">
          Activar precio promocional
        </span>
      </label>

      {isOffer && (
        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <label className="block text-[10px] font-bold text-artemisa-secondary uppercase tracking-wider">
            Precio de Oferta ($)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="Ej: 15000"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            className="w-full bg-white border border-artemisa-accent/50 rounded-xl py-3 px-4 outline-none focus:border-artemisa-secondary text-base sm:text-sm font-bold text-artemisa-secondary"
          />
        </div>
      )}
    </div>
  );
};