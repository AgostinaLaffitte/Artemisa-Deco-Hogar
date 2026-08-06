import axios from 'axios';

const api = axios.create({
  // Vite usa import.meta.env en lugar de process.env
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;