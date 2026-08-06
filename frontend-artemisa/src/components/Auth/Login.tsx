import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface LoginProps {
  onSwitch: () => void;
  onSuccess: () => void;
}

export const Login = ({ onSwitch, onSuccess }: LoginProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      setLoading(true);
      await login({ email, password });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center animate-fadeIn">
      <div className="mb-6 text-center md:text-left">
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-artemisa-primary tracking-normal">
          Iniciar Sesión
        </h3>
        <p className="text-xs md:text-sm text-artemisa-secondary font-light mt-1">
          ¡Qué bueno verte de nuevo en Artemisa!
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 text-red-800 text-xs rounded-r-xl font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] md:text-xs font-semibold uppercase tracking-wider text-artemisa-primary mb-1.5">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tuemail@ejemplo.com"
            className="w-full bg-artemisa-light border border-artemisa-border rounded-xl py-3 px-4 text-base md:text-sm text-artemisa-neutral placeholder:text-artemisa-secondary/60 focus:border-artemisa-secondary focus:bg-white outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] md:text-xs font-semibold uppercase tracking-wider text-artemisa-primary mb-1.5">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-artemisa-light border border-artemisa-border rounded-xl py-3 px-4 text-base md:text-sm text-artemisa-neutral placeholder:text-artemisa-secondary/60 focus:border-artemisa-secondary focus:bg-white outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-artemisa-primary hover:bg-artemisa-neutral text-artemisa-light font-medium uppercase tracking-wider text-xs py-3.5 rounded-xl transition-all duration-300 shadow-md border border-artemisa-accent/30 disabled:opacity-50 mt-4 cursor-pointer"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-artemisa-border pt-5">
        <p className="text-xs md:text-sm text-artemisa-secondary">
          ¿Aún no tenés una cuenta?{' '}
          <button
            onClick={onSwitch}
            className="text-artemisa-primary font-semibold underline hover:text-artemisa-accent transition-colors block w-full mt-2 md:inline md:w-auto md:mt-0 cursor-pointer"
          >
            Registrate acá
          </button>
        </p>
      </div>
    </div>
  );
};