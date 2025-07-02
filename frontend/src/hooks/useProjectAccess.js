import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import useUserStore from "../stores/useUserStore";

export const useProjectAccess = () => {
  const [isValidating, setIsValidating] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const { id: id_proyecto } = useParams();

  useEffect(() => {
    const validateAccess = async () => {
      // Si no hay usuario, redirigir al login
      if (!user) {
        navigate("/iniciar-sesion");
        return;
      }

      const id_usuario = user?.idUsuario || user?.idusuario;

      // Si no hay id de usuario, redirigir al login
      if (!id_usuario) {
        navigate("/iniciar-sesion");
        return;
      }

      // Si no hay id de proyecto, redirigir a error 404 (me voy a pegar un tiro)
      if (!id_proyecto) {
        navigate("/404");
        return;
      }

      try {
        // Verificar el estado del colaborador en el proyecto
        const response = await axios.get(
          `http://localhost:8000/tasks/api/v1/estado_colaborador_proyecto/?id_usuario=${id_usuario}&id_proyecto=${id_proyecto}`
        );

        // Verificar si la respuesta es exitosa
        if (response.status !== 200) {
          console.error("Error en la respuesta del servidor:", response.status);
          navigate("/404");
          return;
        }

        // Si el estado no es "Activo", redirigir a error 404
        if (response.data.estado !== "Activo") {
          console.log(
            "Usuario no tiene acceso activo al proyecto:",
            response.data.estado
          );
          navigate("/404");
          return;
        }

        // Si todo está bien, permitir acceso
        setHasAccess(true);
      } catch (error) {
        console.error("Error validando acceso al proyecto:", error);
        // En caso de error, redirigir a error 404
        navigate("/404");
        return;
      } finally {
        setIsValidating(false);
      }
    };

    validateAccess();
  }, [user, id_proyecto, navigate]);

  return { isValidating, hasAccess };
};
