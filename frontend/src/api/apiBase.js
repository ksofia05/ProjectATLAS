const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

// Asegurar que termine sin slash para concatenación consistente
export const API_BASE_URL_CLEAN = API_BASE_URL.endsWith('/') 
  ? API_BASE_URL.slice(0, -1) 
  : API_BASE_URL;

export default API_BASE_URL_CLEAN;

console.log('API Base URL:', API_BASE_URL_CLEAN);
console.log('Environment:', {
  VITE_API_BASE: import.meta.env.VITE_API_BASE 
});