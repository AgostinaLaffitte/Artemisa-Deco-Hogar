import { useState } from 'react';
import { AuthService } from '../../services/auth.service';

interface RegisterProps {
  onSwitch: () => void;
  onSuccess: () => void;
}

export const Register = ({ onSwitch, onSuccess }: RegisterProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      setLoading(true);
      await AuthService.register({ email, password });
      setSuccess(true);
      setTimeout(() => {
        onSuccess(); 
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al intentar registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center animate-fadeIn">
      <div className="mb-5 text-center md:text-left">
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-artemisa-primary tracking-normal">
          Crear Cuenta
        </h3>
        <p className="text-xs md:text-sm text-artemisa-secondary font-light mt-1">
          Sumate a Artemisa para realizar tus pedidos.
        </p>
      </div>

      {error && (
        <div className="mb-3 p-3 bg-red-50 border-l-4 border-red-500 text-red-800 text-xs rounded-r-xl font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-3 p-3 bg-emerald-50 border-l-4 border-emerald-600 text-emerald-800 text-xs rounded-r-xl font-medium">
          ¡Cuenta creada con éxito! Redirigiendo...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-[10px] md:text-xs font-semibold uppercase tracking-wider text-artemisa-primary mb-1">
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
          <label className="block text-[10px] md:text-xs font-semibold uppercase tracking-wider text-artemisa-primary mb-1">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className="w-full bg-artemisa-light border border-artemisa-border rounded-xl py-3 px-4 text-base md:text-sm text-artemisa-neutral placeholder:text-artemisa-secondary/60 focus:border-artemisa-secondary focus:bg-white outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] md:text-xs font-semibold uppercase tracking-wider text-artemisa-primary mb-1">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repetí tu contraseña"
            className="w-full bg-artemisa-light border border-artemisa-border rounded-xl py-3 px-4 text-base md:text-sm text-artemisa-neutral placeholder:text-artemisa-secondary/60 focus:border-artemisa-secondary focus:bg-white outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading || success}
          className="w-full bg-artemisa-primary hover:bg-artemisa-neutral text-artemisa-light font-medium uppercase tracking-wider text-xs py-3.5 rounded-xl transition-all duration-300 shadow-md border border-artemisa-accent/30 disabled:opacity-50 mt-3 cursor-pointer"
        >
          {loading ? 'Creando cuenta...' : 'Registrarme'}
        </button>
      </form>

      <div className="mt-6 text-center border-t border-artemisa-border pt-4">
        <p className="text-xs md:text-sm text-artemisa-secondary">
          ¿Ya tenés una cuenta?{' '}
          <button
            onClick={onSwitch}
            className="text-artemisa-primary font-semibold underline hover:text-artemisa-accent transition-colors cursor-pointer"
          >
            Iniciá sesión acá
          </button>
        </p>
      </div>
    </div>
  );
};