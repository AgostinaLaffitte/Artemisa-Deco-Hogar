interface CategoryCardProps {
  name: string;
  image: string;
}

export const CategoryCard = ({ name, image }: CategoryCardProps) => {
  return (
    <div className="group relative bg-artemisa-border/30 border border-artemisa-border rounded-2xl shadow-sm hover:shadow-xl hover:border-artemisa-accent transition-all duration-500 overflow-hidden cursor-pointer flex flex-col p-3 h-full">
      
      {/* Contenedor de Imagen con Marco de Pespunte (Costura) */}
      <div className="h-52 md:h-72 rounded-xl overflow-hidden bg-artemisa-border/40 relative border border-dashed border-artemisa-accent/40 p-1">
        <div className="w-full h-full rounded-lg overflow-hidden relative">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
          
          {/* Overlay cálido al pasar el mouse */}
          <div className="absolute inset-0 bg-gradient-to-t from-artemisa-neutral/70 via-artemisa-neutral/10 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
        </div>

        {/* Detalle Artesanal: Esquina troquelada / Sello decorativo */}
        <div className="absolute top-3 right-3 bg-artemisa-light/90 backdrop-blur-xs text-artemisa-secondary text-[9px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full border border-artemisa-border shadow-xs">
          Ver Colección
        </div>
      </div>
      
      {/* Etiqueta / Nombre Estilo Editorial */}
      <div className="pt-3.5 pb-1 px-2 flex flex-col items-center justify-center text-center">
        <h4 className="font-serif text-sm md:text-lg font-bold text-artemisa-primary group-hover:text-artemisa-secondary transition-colors leading-snug">
          {name}
        </h4>
        <span className="w-6 h-[1.5px] bg-artemisa-accent mt-1.5 transition-all duration-300 group-hover:w-12 rounded-full" />
      </div>
    </div>
  );
};