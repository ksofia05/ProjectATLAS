// contexts/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { client } from '../supabase/client';

// Context
const AuthContext = createContext();

// Reducer para manejar el estado
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_AUTH_DATA':
      return {
        ...state,
        user: action.payload.user,
        userRole: action.payload.userRole,
        isAuthenticated: !!action.payload.user,
        isLoading: false,
        error: null
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case 'LOGOUT':
      return {
        user: null,
        userRole: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case 'UPDATE_ROLE':
      return {
        ...state,
        userRole: action.payload
      };
    
    default:
      return state;
  }
};

// Estado inicial
const initialState = {
  user: null,
  userRole: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Función para obtener el rol del usuario
  const fetchUserRole = async (userEmail) => {
    if (!userEmail) return null;
    
    try {
      const { data: usuarioResponse, error } = await client
        .from("Usuario")
        .select("rol_idRol")
        .eq("correoElectronico", userEmail)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }

      return usuarioResponse?.rol_idRol || null;
    } catch (error) {
      console.error("Error en fetchUserRole:", error);
      return null;
    }
  };

  // Función para establecer usuario y cargar su rol
  const setUserAndRole = async (authUser) => {
    try {
      let userRole = null;
      
      if (authUser?.email) {
        userRole = await fetchUserRole(authUser.email);
        console.log("Usuario y rol cargados:", { user: authUser.email, role: userRole });
      }

      dispatch({
        type: 'SET_AUTH_DATA',
        payload: {
          user: authUser,
          userRole: userRole
        }
      });
    } catch (error) {
      console.error('Error setting user and role:', error);
      dispatch({ type: 'SET_ERROR', payload: error });
    }
  };

  // Inicialización y listener de cambios de auth
  useEffect(() => {
    let subscription = null;

    const initializeAuth = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        // Verificar usuario actual
        const { data: { user } } = await client.auth.getUser();
        await setUserAndRole(user);
        
        // Escuchar cambios en el estado de autenticación
        const { data: { subscription: authSubscription } } = client.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event);
            dispatch({ type: 'SET_LOADING', payload: true });
            await setUserAndRole(session?.user || null);
          }
        );
        
        subscription = authSubscription;
      } catch (error) {
        console.error('Error initializing auth:', error);
        dispatch({ type: 'SET_ERROR', payload: error });
      }
    };

    initializeAuth();

    // Cleanup
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Funciones de autenticación
  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // El listener onAuthStateChange se encargará de actualizar el estado
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      dispatch({ type: 'SET_ERROR', payload: error });
      return { success: false, error };
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error al registrarse:', error);
      dispatch({ type: 'SET_ERROR', payload: error });
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      const { error } = await client.auth.signOut();
      if (error) throw error;
      
      // Limpiar localStorage
      localStorage.clear();
      
      // El listener se encargará de limpiar el estado
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return { success: false, error };
    }
  };

  // Funciones de rol
  const refreshUserRole = async () => {
    if (state.user?.email) {
      const role = await fetchUserRole(state.user.email);
      dispatch({ type: 'UPDATE_ROLE', payload: role });
      return role;
    }
    return null;
  };

  // Funciones de utilidad
  const isAdmin = () => state.userRole === 1;
  const hasRole = (roleId) => state.userRole === roleId;
  const hasAnyRole = () => state.userRole !== null;
  const canAccess = () => state.isAuthenticated;
  const needsRoleSetup = () => state.isAuthenticated && !hasAnyRole();

  // Valor del contexto
  const contextValue = {
    // Estado
    ...state,
    
    // Funciones de autenticación
    login,
    logout,
    signUp,
    
    // Funciones de rol
    refreshUserRole,
    isAdmin,
    hasRole,
    hasAnyRole,
    canAccess,
    needsRoleSetup
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook para componentes que requieren autenticación
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirigir al login
      window.location.href = '/login';
    }
  }, [isAuthenticated, isLoading]);
  
  return { isAuthenticated, isLoading };
};

// Hook para componentes que requieren un rol específico
export const useRequireRole = (roleId) => {
  const { hasRole, isLoading, needsRoleSetup } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      if (needsRoleSetup()) {
        window.location.href = '/setup-profile';
      } else if (!hasRole(roleId)) {
        window.location.href = '/unauthorized';
      }
    }
  }, [hasRole, isLoading, needsRoleSetup, roleId]);
  
  return { hasRole: hasRole(roleId), isLoading };
};