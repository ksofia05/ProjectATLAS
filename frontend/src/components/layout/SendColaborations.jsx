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
import useInvitationsStore from "../../stores/useInvitationsStore";

const SendColaboration = ({ open = false, onClose, userName, projectId }) => {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(open);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState("miembros");

  const { projectName, fetchProjectInfo } = useProjectStore();
  const { collaborators, fetchCollaborators, forceRefresh } =
    useCollaboratorsStore();

  const invitationsStore = useInvitationsStore();
  const {
    invitacionesPendientes,
    invitacionesOptimistas,
    addOptimisticInvitation,
    confirmOptimisticInvitation,
    cancelOptimisticInvitation,
    syncInvitationsFromServer,
    filterPendingInvitations,
  } = invitationsStore;

  const colaboradoresActivos = useMemo(() => {
    return collaborators?.filter((colab) => colab.estado === "Activo") || [];
  }, [collaborators]);

  const getInvitacionesPendientes = () => {
    if (!projectId) return [];

    const pendientes = invitacionesPendientes[projectId] || [];
    const optimistas = invitacionesOptimistas[projectId] || [];

    // Combinar invitaciones reales + optimistas
    const todasLasInvitaciones = [...pendientes, ...optimistas];

    // Filtrar las que ya son colaboradores activos
    const emailsColaboradores = colaboradoresActivos
      .map((c) => (c.correo ? c.correo.toLowerCase() : ""))
      .filter((email) => email);

    return todasLasInvitaciones.filter(
      (inv) =>
        inv.email && !emailsColaboradores.includes(inv.email.toLowerCase())
    );
  };

  const invitacionesList = getInvitacionesPendientes();

  useEffect(() => {
    setShowModal(open);
    if (open && projectId) {
      fetchProjectInfo(projectId);
      fetchCollaborators(projectId);
      const loadInvitations = async () => {
        await syncInvitationsFromServer(projectId);
        filterPendingInvitations(projectId, colaboradoresActivos);
      };

      loadInvitations();
    }
  }, [
    open,
    projectId,
    fetchProjectInfo,
    fetchCollaborators,
    colaboradoresActivos,
    filterPendingInvitations,
    syncInvitationsFromServer, 
  ]);

  useEffect(() => {
    const handleStateChange = () => {
      if (open && projectId) {

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

    // Esto valida que el el input del email no quede vacío
    if (!email.trim()) {
      showErrorToast("Por favor ingresa un correo electrónico");
      return;
    }

    // Validacion de que el email tenga un formato correcto
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showErrorToast("Por favor ingresa un correo electrónico válido");
      return;
    }

    const emailExiste = colaboradoresActivos.some(
      (colab) =>
        colab.correo &&
        colab.correo.toLowerCase() === email.trim().toLowerCase()
    );

    if (emailExiste) {
      showErrorToast("Este usuario ya es colaborador del proyecto");
      return;
    }

    const invitacionExiste = invitacionesList.some(
      (inv) =>
        inv.email && inv.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (invitacionExiste) {
      showErrorToast("Ya hay una invitación pendiente para este correo");
      return;
    }

    const emailToSend = email.trim();

    // Agregar invitación optimista INMEDIATAMENTE
    addOptimisticInvitation(projectId, emailToSend, userName);

    // Cambiar a tab "enviados" y limpiar input inmediatamente
    setEmail("");
    setActiveTab("enviados");

    setIsSending(true);
    const toastId = showLoadingToast("Verificando y enviando invitación...");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/tasks/api/v1/invitacionColaborador/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailToSend,
            nombre_invitador: userName,
            id_proyecto: projectId,
          }),
        }
      );

      const data = await response.json();
      toast.dismiss(toastId);

      if (data.success) {
        confirmOptimisticInvitation(projectId, emailToSend);
        showSuccessToast("¡Invitación enviada!");
      } else {
        cancelOptimisticInvitation(projectId, emailToSend);
        showErrorToast(data.message || "Error al enviar invitación");
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Error enviando invitación:", error);
      cancelOptimisticInvitation(projectId, emailToSend);
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

        {/* Tabs */}
        <div className="flex mb-4 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("miembros")}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === "miembros"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Miembros Actuales ({colaboradoresActivos.length})
          </button>
          <button
            onClick={() => setActiveTab("enviados")}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === "enviados"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Enviados ({invitacionesList.length})
          </button>
        </div>

        <div className="flex flex-col gap-3 max-h-48 overflow-y-auto">
          {activeTab === "miembros" ? (
            colaboradoresActivos.length === 0 ? (
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
            )
          ) : invitacionesList.length === 0 ? (
            <div className="text-gray-400 text-center py-4">
              No hay invitaciones pendientes
            </div>
          ) : (
            invitacionesList.map((invitation, idx) => (
              <div
                className={`flex items-center gap-3 ${
                  invitation.isOptimistic ? "opacity-75" : ""
                }`}
                key={invitation.id || invitation.email || idx}
              >
                <div className="flex items-center justify-center rounded-full w-10 h-10 text-lg font-bold bg-orange-500 text-white">
                  {invitation.isOptimistic ? "⏳" : "?"}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">
                    {invitation.email}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {invitation.isOptimistic
                      ? "Enviando..."
                      : `Enviado ${new Date(
                          invitation.fecha_invitacion
                        ).toLocaleDateString()}`}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    invitation.isOptimistic
                      ? "bg-yellow-600 text-yellow-100"
                      : "bg-orange-600 text-orange-100"
                  }`}
                >
                  {invitation.isOptimistic ? "Enviando..." : "Pendiente"}
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
