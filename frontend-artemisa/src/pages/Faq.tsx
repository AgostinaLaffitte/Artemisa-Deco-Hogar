import { useState } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  RefreshCw, 
  ArrowRight,
  Scissors
} from 'lucide-react';

interface FaqItem {
  id: number;
  category: 'compra' | 'envio' | 'pago' | 'cambios';
  question: string;
  answer: string;
}

export const Faq = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const faqs: FaqItem[] = [
    {
      id: 1,
      category: 'compra',
      question: '¿Cómo realizo una compra en la tienda?',
      answer: 'Es súper simple: elegís tus productos favoritos, seleccionás las variantes (colores, telas o medidas) y los agregás al carrito. Al momento de finalizar la compra, el sistema te guiará para ingresar tu dirección, calcular el envío e ingresar el pago de forma rápida y segura.'
    },
    {
      id: 2,
      category: 'compra',
      question: '¿Tienen compra mínima o precios mayoristas?',
      answer: 'No exigimos un monto mínimo para compras minoristas.'
    },
    {
      id: 3,
      category: 'envio',
      question: '¿Cuáles son las opciones de envío y costo?',
      answer: 'Hacemos envíos a todo el país. Podés calcular el costo y tiempo estimado de entrega ingresando tu Código Postal directo en el carrito o durante el checkout. También tenés la opción de retirar sin cargo por nuestro taller.'
    },
    {
      id: 4,
      category: 'envio',
      question: '¿Cuánto demora en estar listo mi pedido?',
      answer: 'Los productos en stock y retirados por local suelen estar listos en 24 a 48 hs hábiles. En caso de envíos, una vez despachado te llegará un código de seguimiento por e-mail para que veas el recorrido de tu paquete en tiempo real.'
    },
    {
      id: 5,
      category: 'pago',
      question: '¿Qué medios de pago aceptan?',
      answer: 'Procesamos nuestros pagos de forma directa y 100% segura a través de Mercado Pago. Podés abonar con tarjetas de crédito, débito, dinero disponible en cuenta o mediante efectivización en puntos de pago (Rapipago/Pago Fácil).'
    },
    {
      id: 6,
      category: 'cambios',
      question: '¿Los productos tienen cambio?',
      answer: '¡Sí! Al ser confecciones artesanales cuidamos cada detalle, pero si el producto presenta alguna falla de fábrica o necesitás cambiarlo por otra variante, tenés hasta 15 días posteriores a la recepción. El producto debe estar sin uso y en su empaque original.'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'compra': return <ShoppingBag size={18} className="text-artemisa-primary" />;
      case 'envio': return <Truck size={18} className="text-artemisa-primary" />;
      case 'pago': return <CreditCard size={18} className="text-artemisa-primary" />;
      default: return <RefreshCw size={18} className="text-artemisa-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-artemisa-light py-12 md:py-16 text-artemisa-neutral">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Encabezado Principal estilo Artemisa */}
        <div className="text-center mb-12 space-y-3">
          <div className="w-14 h-14 bg-artemisa-primary text-artemisa-light rounded-full flex items-center justify-center mx-auto shadow-md transition-transform hover:scale-105">
            <HelpCircle size={26} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-normal text-artemisa-primary tracking-tight">
            Preguntas Frecuentes
          </h1>
          <div className="w-12 h-0.5 bg-artemisa-accent mx-auto rounded-full" />
          <p className="text-sm text-artemisa-secondary font-sans max-w-md mx-auto leading-relaxed">
            Resolvemos tus dudas sobre el proceso de compra, la logística automatizada y los métodos de pago en Artemisa.
          </p>
        </div>

        {/* Listado de Acordeones */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div 
                key={faq.id} 
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-artemisa-border shadow-sm overflow-hidden transition-all duration-200 hover:border-artemisa-accent"
              >
                {/* Botón de la Pregunta */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none group select-none"
                >
                  <div className="flex items-center gap-4 pr-4">
                    <div className="p-2.5 bg-artemisa-light rounded-xl flex-shrink-0 group-hover:bg-artemisa-border/60 transition-colors">
                      {getCategoryIcon(faq.category)}
                    </div>
                    <span className="font-serif font-medium text-artemisa-primary text-base md:text-lg group-hover:text-artemisa-secondary transition-colors">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown 
                    size={20} 
                    className={`text-artemisa-secondary flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-artemisa-primary' : ''}`}
                  />
                </button>

                {/* Contenedor Animado de la Respuesta */}
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-60 border-t border-artemisa-border' : 'max-h-0'}`}
                >
                  <div className="p-5 md:p-6 bg-artemisa-light/60 text-sm text-artemisa-neutral font-sans leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner para Personalizados & Contacto con Costura Discontinua */}
        <div className="bg-artemisa-primary text-artemisa-light rounded-3xl mt-12 shadow-lg relative overflow-hidden">
          
          {/* COSTURA DISCONTINUA */}
          <div 
            className="w-full h-[1px] relative z-20 opacity-60"
            style={{
              backgroundImage: 'linear-gradient(to right, #c48b5e 50%, transparent 0%)',
              backgroundPosition: 'top',
              backgroundSize: '8px 1px',
              backgroundRepeat: 'repeat-x'
            }}
          />

          <div className="p-8 text-center space-y-4 relative z-10">
            {/* Elemento decorativo sutil */}
            <Scissors size={120} className="absolute -right-8 -bottom-8 opacity-5 text-white pointer-events-none rotate-12" />

            <h3 className="text-xl md:text-2xl font-serif tracking-wide">
              ¿Buscás un trabajo a medida o personalizado?
            </h3>
            <p className="text-xs md:text-sm text-artemisa-accent max-w-md mx-auto font-sans leading-relaxed">
              Si tenés un diseño en mente o necesitás confecciones en medidas especiales, podés ponerte en contacto directo con el taller.
            </p>
            
            <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a 
                href="https://wa.me/5492284690919" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 bg-artemisa-accent text-artemisa-primary font-sans font-medium px-6 rounded-xl text-xs uppercase tracking-wider hover:bg-artemisa-secondary hover:text-artemisa-light transition-colors shadow-sm"
              >
                Consultar por WhatsApp
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* PESPUNTE INFERIOR */}
          <div 
            className="w-full h-[1px] relative z-20 opacity-60"
            style={{
              backgroundImage: 'linear-gradient(to right, #c48b5e 50%, transparent 0%)',
              backgroundPosition: 'bottom',
              backgroundSize: '8px 1px',
              backgroundRepeat: 'repeat-x'
            }}
          />
        </div>

      </div>
    </div>
  );
};