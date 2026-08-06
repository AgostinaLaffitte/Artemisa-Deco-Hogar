import api from '../api/axiosConfig';
import {  type LoginDto, type RegisterDto, type AuthResponse } from '../types/auth'; // Ahora creamos estos tipos

export const AuthService = {
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    // Guardamos el token en el almacenamiento local del navegador
    localStorage.setItem('aquiles_token', data.backend_token);
    return data;
  },

  register: async (userData: RegisterDto) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  logout: () => {
    localStorage.removeItem('aquiles_token');
  }
};