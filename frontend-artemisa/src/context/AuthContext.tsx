import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { AuthService } from '../services/auth.service';

interface User {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al cargar la app, nos fijamos si hay un token guardado
    const token = localStorage.getItem('aquiles_token');
    if (token) {
      try {
        // Decodificamos el JWT de forma simple para recuperar el usuario (o podés hacer un endpoint /auth/me)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        
        setUser({ id: payload.sub, email: payload.email, role: payload.role });
      } catch (e) {
        AuthService.logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: any) => {
    const data = await AuthService.login(credentials);
    setUser(data.user);
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};