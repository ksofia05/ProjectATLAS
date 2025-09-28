import React, { useState, useEffect, useCallback, useContext } from "react";
import { client as supabase } from "../../supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import ButtonGrey from "../common/ButtonGrey";
import UserTaskRow from "../common/UserTaskRow";
import axios from "axios";
import { API_BASE } from "../../api/apiBase";

// Función auxiliar para filtrar tareas por estado
function filterTasks(tasks, filtro) {
  return tasks.filter((task) => task.filtro === filtro);
}

export default function AdminPendingTasksCard({ className }) {
  const { userProfile } = useContext(AuthContext);
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [adminTasks, setAdminTasks] = useState([]);
  const [collaboratorStats, setCollaboratorStats] = useState([]);
  const [totalStats, setTotalStats] = useState({
    totalCollaborators: 0,
    totalTasks: 0,
    totalPending: 0,
  });

  const fetchAdminTasks = useCallback(async () => {
    if (!userProfile) return;
    try {
      const { data, error } = await supabase
        .from("Tareas")
        .select("*")
        .eq("id_usuario", userProfile.idUsuario);

      if (!error) {
        setAdminTasks(data || []);
      }
    } catch (error) {
    }
  }, [userProfile]);

  const fetchCollaboratorStats = useCallback(async () => {
    if (!userProfile || !projectId) return;
    try {
      const response = await axios.get(
        `${API_BASE}/tasks/api/v1/filtro_colaborador/?id_proyecto=${projectId}`
      );
      const colaboradores = response.data.colaboradores || [];

      // Filtrar colaboradores activos (excluyendo al admin actual)
      const colaboradoresActivos = colaboradores.filter((colab) => {
        const isNotCurrentUser =
          (colab.id || colab.idusuario || colab.idUsuario) !==
          userProfile.idUsuario;
        const isActive = colab.estado === "Activo";
        return isNotCurrentUser && isActive;
      });

      if (colaboradoresActivos.length === 0) {
        setTotalStats({
          totalCollaborators: 0,
          totalTasks: 0,
          totalPending: 0,
        });
        setCollaboratorStats([]);
        return;
      }

      // Estadisticas de cada colaborador para mostrar
      const collaboratorData = await Promise.all(
        colaboradoresActivos.map(async (colab) => {
          try {
            const userId = colab.id || colab.idusuario || colab.idUsuario;
            const { data: userTasks, error: tasksError } = await supabase
              .from("Tareas")
              .select("*")
              .eq("id_usuario", userId);

            if (tasksError) return null;
            const tasks = userTasks || [];
            if (tasks.length === 0) return null;

            const pendingTasks = tasks.filter(
              (task) => task.filtro === "por completar"
            );
            const completedTasks = tasks.filter(
              (task) => task.filtro === "completado"
            );

            return {
              id: userId,
              name: `${colab.nombre} ${colab.apellido}`,
              initials: `${colab.nombre?.charAt(0) || ""}${
                colab.apellido?.charAt(0) || ""
              }`.toUpperCase(),
              totalTasks: tasks.length,
              pending: pendingTasks.length,
              completed: completedTasks.length,
            };
          } catch (error) {
            return null;
          }
        })
      );

      const validCollaboratorData = collaboratorData.filter(
        (data) => data !== null
      );
      const sortedCollaborators = validCollaboratorData.sort(
        (a, b) => b.totalTasks - a.totalTasks
      );

      setCollaboratorStats(sortedCollaborators);

      const totalPending = validCollaboratorData.reduce(
        (sum, col) => sum + col.pending,
        0
      );
      const totalTasks = validCollaboratorData.reduce(
        (sum, col) => sum + col.totalTasks,
        0
      );

      setTotalStats({
        totalCollaborators: validCollaboratorData.length,
        totalTasks: totalTasks,
        totalPending: totalPending,
      });
    } catch (error) {
    }
  }, [userProfile, projectId]);

  useEffect(() => {
    fetchAdminTasks();
    fetchCollaboratorStats();
  }, [fetchAdminTasks, fetchCollaboratorStats]);

  const adminPendingTasks = filterTasks(adminTasks, "por completar");
  const adminCompletedTasks = filterTasks(adminTasks, "completado");

  const handleNavigateToCalendar = () => {
    navigate("/dashboard/84/calendario-avanzado");
  };

  return (
    <div
      className={`bg-gradient-to-br from-[#08080e]/95 to-[#0c0c14]/95 via-[#0a0a12]/95 backdrop-blur-md border border-slate-800/40 rounded-3xl px-9 py-8 w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white leading-tight">
            Trabajos Pendientes
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-purple-400 font-semibold">
              (Vista Admin)
            </span>
            <i className="bi bi-shield-check text-purple-400 text-sm"></i>
          </div>
        </div>
        <ButtonGrey
          className="px-4 py-2 text-sm font-semibold hover:bg-gray-600/50 transition-colors"
          onClick={handleNavigateToCalendar}
        >
          <i className="bi bi-calendar-check text-sm mr-2"></i>
          Mis Tareas
        </ButtonGrey>
      </div>

      <div className="mb-4 p-3 bg-[#1a1a2e] rounded-lg border border-slate-700/30">
        <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
          <i className="bi bi-person-workspace text-purple-400 text-sm"></i>
          Mis Tareas
        </h4>
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">
            Pendientes:{" "}
            <span className="text-red-300 font-semibold">
              {adminPendingTasks.length}
            </span>
          </span>
          <span className="text-gray-300">
            Completadas:{" "}
            <span className="text-green-300 font-semibold">
              {adminCompletedTasks.length}
            </span>
          </span>
        </div>
      </div>

      {/* Lista de colaboradores con tareas (necesito cambiar unas cosas del la forma en la que se muestran) */}
      <div className="flex flex-col gap-3 mb-3">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold text-gray-400">Colaboradores</h4>
          <span className="text-xs text-gray-500">Tareas Pendientes</span>
        </div>
        {collaboratorStats.length === 0 ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto mb-2 bg-blue-500/10 rounded-full flex items-center justify-center">
              <i className="bi bi-people text-blue-400"></i>
            </div>
            <p className="text-blue-400 text-sm font-medium">
              Sin colaboradores
            </p>
            <p className="text-gray-500 text-xs">
              No hay colaboradores con tareas
            </p>
          </div>
        ) : (
          <div className="collaborators-scroll">
            <div className="flex flex-col gap-3 pr-2">
              {collaboratorStats.map((col) => (
                <UserTaskRow
                  key={col.id}
                  initials={col.initials}
                  name={col.name}
                  rightContent={
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <span
                            className={`
                              px-2 py-0.5 rounded text-xs font-medium
                              ${
                                col.pending > 3
                                  ? "bg-red-900/30 text-red-300"
                                  : col.pending > 1
                                  ? "bg-yellow-900/30 text-yellow-300"
                                  : col.pending === 0
                                  ? "bg-green-900/30 text-green-300"
                                  : "bg-gray-700/50 text-gray-300"
                              }
                            `}
                          >
                            {col.pending}/{col.totalTasks}
                          </span>
                          <span className="text-xs text-gray-400">tareas</span>
                        </div>
                      </div>
                      {col.pending > 3 && (
                        <div className="flex items-center gap-1">
                          <i className="bi bi-exclamation-triangle text-red-400 text-xs"></i>
                          <span className="text-xs text-red-300">
                            Alta carga
                          </span>
                        </div>
                      )}
                    </div>
                  }
                  rightContentClass=""
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[#232336] pt-3 mt-1">
        <div className="flex items-center gap-2 text-gray-400 text-base font-normal group">
          <i className="bi bi-people-fill text-lg group-hover:text-purple-400 transition-colors"></i>
          <span className="text-gray-300 font-bold group-hover:text-white transition-colors">
            {totalStats.totalCollaborators}
          </span>
          <span className="group-hover:text-gray-200 transition-colors">
            Colaboradores
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-base font-normal group">
          <i className="bi bi-tools text-lg group-hover:text-yellow-400 transition-colors"></i>
          <span className="text-gray-300 font-bold group-hover:text-white transition-colors">
            {totalStats.totalPending}
          </span>
          <span className="group-hover:text-gray-200 transition-colors">
            Pendientes
          </span>
        </div>
      </div>
    </div>
  );
}
