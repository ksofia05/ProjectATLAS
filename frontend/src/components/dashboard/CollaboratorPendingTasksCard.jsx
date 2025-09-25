import React, { useState, useEffect, useCallback, useContext } from "react";
import { client as supabase } from "../../supabase/client";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import ButtonGrey from "../common/ButtonGrey";

function filterTasks(tasks, filtro) {
  return tasks.filter((task) => task.filtro === filtro);
}

export default function CollaboratorPendingTasksCard({ className }) {
  const { userProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [taskStats, setTaskStats] = useState({
    pending: 0,
    completed: 0,
    total: 0,
    thisWeek: 0,
  });

  const fetchTasks = useCallback(async () => {
    if (!userProfile) return;

    const { data, error } = await supabase
      .from("Tareas")
      .select("*")
      .eq("id_usuario", userProfile.idUsuario);

    if (!error) {
      const tasksData = data || [];
      setTasks(tasksData);

      const pending = tasksData.filter(
        (task) => task.filtro === "por completar"
      ).length;
      const completed = tasksData.filter(
        (task) => task.filtro === "completado"
      ).length;

      // Solo se mostraran tareas de los ultimos 7 dias, quizas lo cambie a un mes
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const thisWeek = tasksData.filter((task) => {
        const taskDate = new Date(task.fechaActual);
        return taskDate >= oneWeekAgo;
      }).length;

      setTaskStats({
        pending,
        completed,
        total: tasksData.length,
        thisWeek,
      });
    }
  }, [userProfile]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Funcion para filtrar tareas por estado
  const pendingTasks = filterTasks(tasks, "por completar");
  const completedTasks = filterTasks(tasks, "completado");

  // Obtener las tareas pendientes más recientes (Limitado a 3)
  const recentPendingTasks = pendingTasks
    .sort((a, b) => new Date(b.fechaActual) - new Date(a.fechaActual))
    .slice(0, 3);

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
            Mis Trabajos
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-400 font-semibold">
              (Resumen Personal)
            </span>
            <i className="bi bi-person-check text-blue-400 text-sm"></i>
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

      {/* Estadísticas principales */}
      <div className="mb-4 p-3 bg-[#1a1a2e] rounded-lg border border-slate-700/30">
        <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
          <i className="bi bi-list-task text-blue-400 text-sm"></i>
          Resumen de Tareas
        </h4>
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">
            Pendientes:{" "}
            <span className="text-red-300 font-semibold">
              {taskStats.pending}
            </span>
          </span>
          <span className="text-gray-300">
            Completadas:{" "}
            <span className="text-green-300 font-semibold">
              {taskStats.completed}
            </span>
          </span>
        </div>
      </div>

      {/* Lista de tareas pendientes */}
      <div className="flex flex-col gap-3 mb-3">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold text-gray-400">
            Tareas Pendientes Recientes
          </h4>
          {recentPendingTasks.length > 0 && (
            <span className="text-xs text-gray-500">
              {recentPendingTasks.length} pendiente
              {recentPendingTasks.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {recentPendingTasks.length === 0 ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto mb-2 bg-green-500/10 rounded-full flex items-center justify-center">
              <i className="bi bi-check-circle text-green-400"></i>
            </div>
            <p className="text-green-400 text-sm font-medium">
              ¡No tienes tareas pendientes!
            </p>
            <p className="text-gray-500 text-xs mt-1">¡Buen trabajo! 🎉</p>
          </div>
        ) : (
          <div className="tasks-scroll">
            <div className="space-y-2 pr-2">
              {recentPendingTasks.map((task) => (
                <div
                  key={task.id_Tarea}
                  className="flex items-center justify-between bg-[#1a1a2e] rounded-lg p-2 border border-slate-700/30 hover:border-blue-500/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-gray-300 truncate">
                      {task.nombreTarea}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {new Date(task.fechaActual).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[#232336] pt-3 mt-1">
        <div className="flex items-center gap-2 text-gray-400 text-base font-normal group">
          <i className="bi bi-calendar-week text-lg group-hover:text-blue-400 transition-colors"></i>
          <span className="text-gray-300 font-bold group-hover:text-white transition-colors">
            {taskStats.thisWeek}
          </span>
          <span className="group-hover:text-gray-200 transition-colors">
            Esta semana
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-base font-normal group">
          <i className="bi bi-list-task text-lg group-hover:text-blue-400 transition-colors"></i>
          <span className="text-gray-300 font-bold group-hover:text-white transition-colors">
            {taskStats.total}
          </span>
          <span className="group-hover:text-gray-200 transition-colors">
            Total
          </span>
        </div>
      </div>
    </div>
  );
}
