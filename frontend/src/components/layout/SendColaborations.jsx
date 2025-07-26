import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "../common/popUp/Loading";
import toast from "react-hot-toast";
import FloatingModal from "../common/popUp/FloatingModal";
import useProjectStore from "../../stores/useProjectsStore";
import useCollaboratorsStore from "../../stores/useCollaboratorsStore";

const SendColaboration = ({ open = false, onClose, userName, projectId }) => {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(open);
  const [isSending, setIsSending] = useState(false);

  const { projectName, fetchProjectInfo } = useProjectStore();
  const { collaborators, fetchCollaborators, forceRefresh } =
    useCollaboratorsStore();

  // Filtrar solo colaboradores activos
  const colaboradoresActivos = useMemo(() => {
    return collaborators.filter((colab) => colab.estado === "Activo");
  }, [collaborators]);

  useEffect(() => {
    setShowModal(open);
    if (open && projectId) {
      // Solo cargar si no están en cache
      fetchProjectInfo(projectId);
      fetchCollaborators(projectId);
    }
  }, [open, projectId, fetchProjectInfo, fetchCollaborators]);

  // Listener para cambios en tiempo real
  useEffect(() => {
    const handleStateChange = () => {
      if (open && projectId) {
        console.log("Actualizando colaboradores por cambio de estado");
        forceRefresh(projectId);
      }
    };

    window.addEventListener("collaboratorStateChanged", handleStateChange);
    return () =>
      window.removeEventListener("collaboratorStateChanged", handleStateChange);
  }, [open, projectId, forceRefresh]);

  const handleClose = () => {
    setShowModal(false);
    setEmail("");
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que el email no esté vacío
    if (!email.trim()) {
      showErrorToast("Por favor ingresa un correo electrónico");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showErrorToast("Por favor ingresa un correo electrónico válido");
      return;
    }

    setIsSending(true);
    const toastId = showLoadingToast("Verificando y enviando invitación...");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/tasks/api/v1/invitacionColaborador/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            nombre_invitador: userName,
            id_proyecto: projectId,
          }),
        }
      );

      const data = await response.json();
      toast.dismiss(toastId);

      if (response.ok && data.success) {
        showSuccessToast("¡Invitación enviada exitosamente!");
        setEmail("");
        forceRefresh(projectId);
      } else {
        showErrorToast(data.message || "Error al enviar invitación");
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Error enviando invitación:", error);
      showErrorToast("Error de conexión. Intenta nuevamente.");
    }

    setIsSending(false);
  };

  if (!showModal) return null;

  return ReactDOM.createPortal(
    <FloatingModal onClose={handleClose}>
      <div className="p-1">
        <h2 className="text-xl font-bold mb-4 text-white">
          Compartir Proyecto
        </h2>
        <p className="text-gray-400 mb-6">
          Proyecto:{" "}
          <span className="font-semibold text-white">
            {projectName || "Cargando..."}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="email"
            className="flex-1 border border-gray-700 bg-[#232136] rounded px-3 py-2 text-white placeholder-gray-400"
            placeholder="Correo del colaborador"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSending}
          />
          <button
            type="submit"
            className={`bg-purple-600 text-white px-4 py-2 rounded transition ${
              isSending
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-purple-700"
            }`}
            disabled={isSending}
          >
            {isSending ? "Enviando..." : "Invitar"}
          </button>
        </form>

        <h3 className="text-white font-semibold mb-2">Miembros Actuales</h3>
        <hr className="my-2 border-gray-700" />

        <div className="flex flex-col gap-3 max-h-48 overflow-y-auto">
          {colaboradoresActivos.length === 0 ? (
            <div className="text-gray-400 text-center py-4">
              Sin colaboradores aún
            </div>
          ) : (
            colaboradoresActivos.map((colab, idx) => (
              <div
                className="flex items-center gap-3"
                key={colab.correo || idx}
              >
                <div className="flex items-center justify-center rounded-full w-10 h-10 text-lg font-bold bg-purple-400 text-white">
                  {colab.nombre?.charAt(0)}
                  {colab.apellido?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">
                    {colab.nombre} {colab.apellido}
                  </div>
                  <div className="text-gray-400 text-xs">{colab.correo}</div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    colab.rol === "Administrador"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  {colab.rol || "Colaborador"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </FloatingModal>,
    document.body
  );
};

export default SendColaboration;
