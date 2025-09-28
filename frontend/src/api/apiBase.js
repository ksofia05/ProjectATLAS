// Detectar entorno automáticamente
const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

export const API_BASE = isProduction 
  ? 'https://projectatlas-backend.onrender.com/'
  : import.meta.env.VITE_API_BASE || 'http://localhost:8000/';

// Debug para desarrollo
if (isDevelopment) {
  console.log('🔧 Entorno:', { 
    isProduction, 
    isDevelopment, 
    API_BASE,
    VITE_API_BASE: import.meta.env.VITE_API_BASE 
  });
}