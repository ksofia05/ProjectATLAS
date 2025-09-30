import { useAuth as useAuthContext } from '../context/AuthProvider';

// DEPRECAR: Redirigir al AuthProvider
export const useAuth = (options = {}) => {
  console.warn('useAuth hook está deprecado. Usa useAuth de AuthProvider.');
  
  const context = useAuthContext();
  
  // Compatibilidad temporal con opciones
  if (options.redirectOnAuth === false) {
    return context;
  }
  
  return context;
};