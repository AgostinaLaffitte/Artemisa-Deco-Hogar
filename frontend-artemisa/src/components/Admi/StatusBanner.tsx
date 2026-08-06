import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface StatusBannerProps {
  type: 'success' | 'error' | null;
  message: string;
}

export const StatusBanner = ({ type, message }: StatusBannerProps) => {
  if (!type) return null;

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
      type === 'success' 
        ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
        : 'bg-rose-50 border-rose-200 text-rose-900'
    }`}>
      {type === 'success' ? (
        <CheckCircle2 className="text-emerald-700 shrink-0 mt-0.5" size={18} />
      ) : (
        <AlertCircle className="text-rose-700 shrink-0 mt-0.5" size={18} />
      )}
      <div className="text-xs md:text-sm font-medium leading-relaxed">{message}</div>
    </div>
  );
};