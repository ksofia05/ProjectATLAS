import React, { useEffect, useRef, useState } from "react";
import { useParams, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import NoTenerCuenta from "../common/NoTenerCuenta";
import { showErrorToast, showSuccessToast, showLoadingToast } from "./popUp/Loading";
import { actualizarHistorialColaborador } from "./historialColaboradores";

const InvitacionProyectoRoute = () => {
  const { id } = useParams();
  const cleanId = id.replace(":","");
  const [asociando, setAsociando] = useState(false);
  const [asociado, setAsociado] = useState(false);
  const { isAuthenticated, isLoading, userProfile, user, recheckAuth } = useAuth();
  const navigate = useNavigate();
  const asociacionIntentada = useRef(false);

  useEffect(() => {
    if (
      isAuthenticated &&
      !isLoading &&
      id &&
      userProfile &&
      (!userProfile.proyectos || userProfile.proyectos.length === 0) &&
      !asociacionIntentada.current
    ) {
      asociacionIntentada.current = true;
      const asociar = async () => {
        try {
          setAsociando(true);
          const response = await fetch("http://localhost:8000/tasks/api/v1/asociar_colaborador/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_proyecto: cleanId,
              email: userProfile.correoelectronico || userProfile.email || user?.email,
            }),
          });
          const data = await response.json();
          console.log("Respuesta del backend:", data, response.status);

          if (response.ok && data.success) {
              localStorage.removeItem("showProjectLimitModal");
              localStorage.removeItem("projectLimitMessage");
              showSuccessToast("Te has unido a un nuevo proyecto");
              const idUsuario =
                user?.idUsuario ??
                userProfile?.idUsuario ??
                userProfile?.id ??
                null;
              if (idUsuario && !isNaN(Number(idUsuario))) {
                await actualizarHistorialColaborador(
                  Number(idUsuario),
                  Number(cleanId),
                  "activo"
                );
              } else {
                console.error("No se encontró un idUsuario válido", { user, userProfile });
              }
              if (typeof recheckAuth === "function") {
                await recheckAuth();
              }
              setAsociado(true);
              return;
          }
          if (response.status === 400 && data.error) {
            if (data.error === "Este usuario ya hace parte de este proyecto.") {
              localStorage.setItem("showAlreadyInProjectModal", "1");
              localStorage.setItem("alreadyInProjectMessage", data.error);
              setTimeout(() => {
                navigate("/dashboard-create-project", { replace: true });
              }, 100);
              return;
            }
            if (
              data.error === "Un colaborador no puede estar en más de un proyecto." ||
              data.error === "Un administrador no puede asociarse como colaborador."
            ) {
              localStorage.setItem("showProjectLimitModal", "1");
              localStorage.setItem("projectLimitMessage", data.error);
              setTimeout(() => {
                navigate("/dashboard-create-project", { replace: true });
              }, 100);
              return;
            }
            showErrorToast(data.error || "No se pudo asociar al proyecto.");
            setAsociado(true);
            return;
          }
          showErrorToast("No se pudo asociar al proyecto.");
          setAsociado(true);
        } catch (err) {
          showErrorToast("Error al asociar al proyecto");
          setAsociado(true);
        } finally {
          setAsociando(false);
        }
      };
      asociar();
    }
  }, [isAuthenticated, isLoading, id, userProfile, user, recheckAuth]);

  if (asociando) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Uniéndote al proyecto...</p>
        </div>
      </div>
    );
  }

  // Si ya se asoció o ya intentó asociar, redirige al dashboard
  if (asociado || (isAuthenticated && !isLoading && asociacionIntentada.current)) {
    return <Navigate to={`/dashboard-create-project`} replace />;
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Validando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={`/dashboard-create-project`} replace />;
  }

  // PASA EL ID COMO QUERY PARAM EN NEXT
  return <NoTenerCuenta next={`/dashboard-create-project?id_proyecto=${id}`} />;
};

export default InvitacionProyectoRoute;