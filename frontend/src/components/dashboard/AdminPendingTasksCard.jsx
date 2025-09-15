import React, { useState, useEffect, useCallback } from "react";
import { client as supabase } from "../../supabase/client";
import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import ButtonGrey from "../common/ButtonGrey";
import UserTaskRow from "../common/UserTaskRow";
import axios from "axios";

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
      console.log("Fetching admin tasks for user:", userProfile.idUsuario);

      const { data, error } = await supabase
        .from("Tareas")
        .select("*")
        .eq("id_usuario", userProfile.idUsuario);

      if (!error) {
        setAdminTasks(data || []);
        console.log("Admin tasks loaded:", data);
      } else {
        console.error("Error cargando tareas del admin:", error);
      }
    } catch (error) {
      console.error("Error cargando tareas del admin:", error);
    }
  }, [userProfile]);

  const fetchCollaboratorStats = useCallback(async () => {
    if (!userProfile || !projectId) {
      console.log("No userProfile o projectId:", {
        userProfile: !!userProfile,
        projectId,
      });
      return;
    }

    try {
      console.log("Fetching collaborators for project:", projectId);

      
      const response = await axios.get(
        `http://localhost:8000/tasks/api/v1/filtro_colaborador/?id_proyecto=${projectId}`
      );

      console.log("Colaboradores response:", response.data);

      const colaboradores = response.data.colaboradores || [];

      if (colaboradores.length === 0) {
        console.log("No hay colaboradores en el proyecto");
        setTotalStats({
          totalCollaborators: 0,
          totalTasks: 0,
          totalPending: 0,
        });
        setCollaboratorStats([]);
        return;
      }

      // Filtrar colaboradores activos (excluyendo al admin actual)
      const colaboradoresActivos = colaboradores.filter((colab) => {
        const isNotCurrentUser =
          (colab.id || colab.idusuario || colab.idUsuario) !==
          userProfile.idUsuario;
        const isActive = colab.estado === "Activo";
        return isNotCurrentUser && isActive;
      });

      console.log("Colaboradores activos filtrados:", colaboradoresActivos);

      if (colaboradoresActivos.length === 0) {
        console.log("No hay colaboradores activos (excluyendo admin)");
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

            console.log(
              `Fetching tasks for colaborador ${colab.nombre} (ID: ${userId})`
            );

            const { data: userTasks, error: tasksError } = await supabase
              .from("Tareas")
              .select("*")
              .eq("id_usuario", userId);

            console.log(
              `Tareas para ${colab.nombre}:`,
              userTasks,
              "Error:",
              tasksError
            );

            if (tasksError) {
              console.error(
                `Error obteniendo tareas para colaborador ${userId}:`,
                tasksError
              );
              return null; // No incluir colaboradores con errores
            }

            const tasks = userTasks || [];

            // Por temas de espacio, solo se van a mostrar los colaboradores que ya tienen almenos una tarea relacionada
            if (tasks.length === 0) {
              return null;
            }

            const pendingTasks = tasks.filter(
              (task) => task.filtro === "por completar"
            );
            const completedTasks = tasks.filter(
              (task) => task.filtro === "completado"
            );

            const result = {
              id: userId,
              name: `${colab.nombre} ${colab.apellido}`,
              initials: `${colab.nombre?.charAt(0) || ""}${
                colab.apellido?.charAt(0) || ""
              }`.toUpperCase(),
              totalTasks: tasks.length,
              pending: pendingTasks.length,
              completed: completedTasks.length,
            };

            console.log(`Stats for ${colab.nombre}:`, result);
            return result;
          } catch (error) {
            console.error(
              `Error obteniendo tareas para colaborador ${colab.id}:`,
              error
            );
            return null;
          }
        })
      );

      const validCollaboratorData = collaboratorData.filter(
        (data) => data !== null
      );

      console.log("Valid collaborator data:", validCollaboratorData);

      // Ordenar por total de tareas
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

      console.log("Final stats:", {
        totalCollaborators: validCollaboratorData.length,
        totalTasks: totalTasks,
        totalPending: totalPending,
        sortedCollaborators,
      });
    } catch (error) {
      console.error("Error cargando estadísticas de colaboradores:", error);
      console.error("Error details:", error.response?.data || error.message);
    }
  }, [userProfile, projectId]);

  useEffect(() => {
    console.log("AdminPendingTasksCard useEffect triggered", {
      userProfile: !!userProfile,
      projectId,
    });

    fetchAdminTasks();
    fetchCollaboratorStats();
  }, [fetchAdminTasks, fetchCollaboratorStats]);

  const adminPendingTasks = adminTasks.filter(
    (task) => task.filtro === "por completar"
  );
  const adminCompletedTasks = adminTasks.filter(
    (task) => task.filtro === "completado"
  );

  const handleNavigateToCalendar = () => {
    navigate("/dashboard/84/calendario-avanzado");
  };

  return (
    <>
      <style>
        {`
          .no-backdrop-filter {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            filter: none !important;
          }
          .collaborators-scroll {
            max-height: 180px;
            overflow-y: auto;
          }
          .collaborators-scroll::-webkit-scrollbar {
            width: 4px;
          }
          .collaborators-scroll::-webkit-scrollbar-track {
            background: #1a1a2e;
            border-radius: 2px;
          }
          .collaborators-scroll::-webkit-scrollbar-thumb {
            background: #6366f1;
            border-radius: 2px;
          }
          .collaborators-scroll::-webkit-scrollbar-thumb:hover {
            background: #8b5cf6;
          }
        `}
      </style>
      <div
        className={`bg-[#14141e] rounded-3xl border border-slate-700/50 px-9 py-8 w-[400px] no-backdrop-filter shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${className}`}
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
            <h4 className="text-sm font-semibold text-gray-400">
              Colaboradores
            </h4>
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
                            <span className="text-xs text-gray-400">
                              tareas
                            </span>
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
    </>
  );
}
