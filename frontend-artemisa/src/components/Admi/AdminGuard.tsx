// src/components/Auth/AdminGuard.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminGuard = () => {
  const { user, loading } = useAuth(); 
  if (loading) {
    return <div className="p-20 text-center font-bold">Verificando credenciales...</div>;
  }

  // Si no hay usuario o el rol no es ADMIN, lo mandamos derecho a la Home
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // Si es administrador, lo dejamos pasar al subárbol de rutas del panel
  return <Outlet />;
};