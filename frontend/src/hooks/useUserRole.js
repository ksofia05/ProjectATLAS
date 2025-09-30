import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { client } from "../supabase/client";

export const useUserRole = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchUserRole = async () => {
    if (!user?.email) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data: usuarioResponse, error } = await client
        .from("Usuario")
        .select("rol_idRol")
        .eq("correoElectronico", user.email) // <-- filtro por email
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        setError(error);
        return;
      }

      if (usuarioResponse) {
        setUserRole(usuarioResponse.rol_idRol);
        console.log("Rol obtenido desde BD:", usuarioResponse.rol_idRol);
      }
    } catch (error) {
      console.error("Error en fetchUserRole:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserRole();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const isAdmin = () => {
    return userRole === 1;
  };

  const hasRole = (roleId) => {
    return userRole === roleId;
  };

  const refreshUserRole = () => {
    fetchUserRole();
  };

  return {
    userRole,
    isLoading,
    error,
    isAdmin,
    hasRole,
    refreshUserRole
  };
};