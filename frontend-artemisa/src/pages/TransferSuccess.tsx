import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { formatPrice } from '../utils/productUtils';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  MessageCircle, 
  ArrowLeft, 
  Landmark,  
  Sparkles 
} from 'lucide-react';

export const TransferSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const transferData = {
    cbu: '0000003100005625606408',
    alias: 'agostina.laffitte',
    titular: 'Agostina Laffitte',
    banco: 'Mercado Pago'
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Generamos mensaje preconfigurado para WhatsApp
  const phone = '5492284690919';
  const orderId = order?.id || 'S/N';
  const orderTotal = formatPrice(order?.total || 0);
  
  const whatsappMessage = encodeURIComponent(
    `¡Hola! 👋 Realicé la orden #${orderId} por un total de ${orderTotal} mediante transferencia.\n\nAquí adjunto mi comprobante de pago. 📄`
  );
  
  const whatsappUrl = `https://wa.me/${phone}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-artemisa-light/50 py-10 md:py-16 flex items-center justify-center p-4">
      <div className="bg-white p-6 md:p-10 rounded-3xl border border-artemisa-border max-w-xl w-full space-y-8 shadow-sm">
        
        {/* ENCABEZADO */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-artemisa-border/40 text-artemisa-primary rounded-full flex items-center justify-center mx-auto border border-artemisa-accent/30">
            <CheckCircle2 size={36} className="text-artemisa-accent" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-artemisa-border/40 rounded-full text-artemisa-secondary text-[10px] uppercase tracking-widest font-semibold">
            <Sparkles size={12} /> Orden Registrada
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-bold text-artemisa-primary">
            ¡Gracias por tu compra!
          </h1>
          
          <p className="text-xs md:text-sm text-artemisa-secondary max-w-md mx-auto">
            Tu pedido <strong className="text-artemisa-neutral">#{orderId}</strong> está reservado. Realizá la transferencia para completar la orden.
          </p>
        </div>

        {/* PASOS DE UX */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-artemisa-light/60 border border-artemisa-border rounded-2xl flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-artemisa-primary text-artemisa-light flex items-center justify-center font-bold text-[11px] shrink-0">
              1
            </div>
            <div>
              <p className="font-bold text-artemisa-primary uppercase text-[10px] tracking-wider">Transferí el monto</p>
              <p className="text-artemisa-secondary text-[11px]">Utilizá los datos bancarios que figuran abajo.</p>
            </div>
          </div>

          <div className="p-3.5 bg-artemisa-light/60 border border-artemisa-border rounded-2xl flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-artemisa-primary text-artemisa-light flex items-center justify-center font-bold text-[11px] shrink-0">
              2
            </div>
            <div>
              <p className="font-bold text-artemisa-primary uppercase text-[10px] tracking-wider">Enviá el comprobante</p>
              <p className="text-artemisa-secondary text-[11px]">Confirmamos tu pago por WhatsApp y preparamos tu pedido.</p>
            </div>
          </div>
        </div>

        {/* TARJETA DE DATOS BANCARIOS */}
        <div className="bg-artemisa-light/80 border border-artemisa-border rounded-3xl p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-artemisa-border pb-3">
            <div className="flex items-center gap-2 text-artemisa-primary font-bold text-xs uppercase tracking-wider">
              <Landmark size={18} className="text-artemisa-accent" />
              <span>Datos Bancarios</span>
            </div>
            <span className="text-[11px] bg-white text-artemisa-secondary px-2.5 py-1 rounded-full border border-artemisa-border font-medium">
              {transferData.banco}
            </span>
          </div>

          <div className="space-y-3 text-xs md:text-sm">
            {/* Alias */}
            <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-artemisa-border/80">
              <div>
                <p className="text-[10px] uppercase font-bold text-artemisa-secondary tracking-wider">Alias</p>
                <p className="font-mono font-bold text-artemisa-primary">{transferData.alias}</p>
              </div>
              <button 
                onClick={() => handleCopy(transferData.alias, 'alias')}
                className="flex items-center gap-1.5 text-xs text-artemisa-primary hover:text-artemisa-accent font-bold px-3 py-1.5 bg-artemisa-light rounded-xl border border-artemisa-border transition-colors"
              >
                {copiedField === 'alias' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                <span>{copiedField === 'alias' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            {/* CBU */}
            <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-artemisa-border/80">
              <div>
                <p className="text-[10px] uppercase font-bold text-artemisa-secondary tracking-wider">CBU</p>
                <p className="font-mono text-xs font-semibold text-artemisa-neutral">{transferData.cbu}</p>
              </div>
              <button 
                onClick={() => handleCopy(transferData.cbu, 'cbu')}
                className="flex items-center gap-1.5 text-xs text-artemisa-primary hover:text-artemisa-accent font-bold px-3 py-1.5 bg-artemisa-light rounded-xl border border-artemisa-border transition-colors"
              >
                {copiedField === 'cbu' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                <span>{copiedField === 'cbu' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            {/* Titular */}
            <div className="px-1 pt-1 flex justify-between items-center text-xs text-artemisa-secondary">
              <span>Titular de la cuenta:</span>
              <strong className="text-artemisa-neutral">{transferData.titular}</strong>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-artemisa-border flex justify-between items-center">
              <span className="font-serif font-bold text-sm text-artemisa-primary">Total con 5% OFF:</span>
              <span className="text-xl font-serif font-black text-artemisa-accent">{orderTotal}</span>
            </div>
          </div>
        </div>

        {/* ACCIONES PRINCIPALES */}
        <div className="space-y-3 pt-2">
          {/* Botón WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-13 bg-artemisa-primary hover:bg-artemisa-neutral text-artemisa-light font-medium text-xs md:text-sm uppercase tracking-wider rounded-2xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 border border-artemisa-accent/30 hover:scale-[1.01] active:scale-[0.99]"
          >
            <MessageCircle size={18} className="text-artemisa-accent" />
            <span>Enviar Comprobante por WhatsApp</span>
          </a>

          {/* Botón Volver al catálogo / Home */}
          <Link 
            to="/productos" 
            className="w-full h-11 bg-transparent hover:bg-artemisa-light text-artemisa-secondary font-bold text-xs uppercase tracking-wider rounded-2xl transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Volver a la Tienda</span>
          </Link>
        </div>

      </div>
    </div>
  );
};