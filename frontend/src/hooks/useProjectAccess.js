// frontend/src/hooks/useProjectAccess.js
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthProvider"; //
import { API_BASE } from "../api/apiBase";

export const useProjectAccess = () => {
  const [isValidating, setIsValidating] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const { userProfile, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { id: id_proyecto } = useParams();
  
  // AGREGAR: Prevenir múltiples validaciones
  const validateOnce = useRef(false);

  useEffect(() => {
    // PREVENIR: Múltiples ejecuciones
    if (validateOnce.current) return;
    
    const validateAccess = async () => {
      // ✅ ESPERAR: AuthProvider termine de cargar
      if (authLoading) return;
      
      if (!isAuthenticated) {
        navigate("/iniciar-sesion");
        return;
      }

      const id_usuario = userProfile?.idUsuario || userProfile?.idusuario;

      if (!id_usuario) {
        console.error("No se pudo obtener ID de usuario");
        navigate("/iniciar-sesion");
        return;
      }

      if (!id_proyecto) {
        navigate("/404");
        return;
      }

      // MARCAR: Como validado para prevenir loops
      validateOnce.current = true;

      try {
        const response = await axios.get(
          `${API_BASE}tasks/api/v1/estado_colaborador_proyecto/?id_usuario=${id_usuario}&id_proyecto=${id_proyecto}`
        );

        if (response.status !== 200) {
          console.error("Error en la respuesta del servidor:", response.status);
          navigate("/404");
          return;
        }

        if (response.data.estado !== "Activo") {
          console.log("Usuario no tiene acceso activo al proyecto:", response.data.estado);
          navigate("/404");
          return;
        }

        setHasAccess(true);
      } catch (error) {
        console.error("Error validando acceso al proyecto:", error);
        navigate("/404");
        return;
      } finally {
        setIsValidating(false);
      }
    };

    validateAccess();
  }, [isAuthenticated, authLoading, userProfile, id_proyecto, navigate]);

  return { isValidating, hasAccess };
};
