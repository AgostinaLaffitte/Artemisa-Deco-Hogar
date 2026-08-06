// src/types/auth.ts

// 1. Lo que el frontend envía al hacer Login
export interface LoginDto {
  email: string;
  password: string;
}

// 2. Lo que el frontend envía al Registrarse
export interface RegisterDto {
  email: string;
  password: string;
}

// 3. Estructura del usuario que devuelve el backend
export interface UserPayload {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN'; // Forzamos a que solo puedan ser estos dos strings
}

// 4. La respuesta completa que devuelve tu POST /auth/login
export interface AuthResponse {
  user: UserPayload;
  backend_token: string;
}