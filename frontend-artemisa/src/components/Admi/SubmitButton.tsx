import { Save, Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isLoading: boolean;
  text: string;
  loadingText: string;
}

export const SubmitButton = ({ isLoading, text, loadingText }: SubmitButtonProps) => (
  <button
    type="submit"
    disabled={isLoading}
    className="w-full sm:w-auto h-12 px-8 bg-artemisa-primary hover:bg-artemisa-neutral text-artemisa-light font-medium text-xs rounded-xl transition-all uppercase tracking-wider shadow-md flex items-center justify-center gap-2 border border-artemisa-accent/30 disabled:opacity-50"
  >
    {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
    {isLoading ? loadingText : text}
  </button>
);