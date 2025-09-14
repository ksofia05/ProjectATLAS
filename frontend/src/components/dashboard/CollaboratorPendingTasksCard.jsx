import React, { useState, useEffect, useCallback } from "react";
import { client as supabase } from "../../supabase/client";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import ButtonGrey from "../common/ButtonGrey";

export default function CollaboratorPendingTasksCard({ className }) {
  const { userProfile } = useContext(AuthContext);
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

      // Tareas de esta semana (últimos 7 días)
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

  // Obtener las 3 tareas más recientes pendientes para mostrar
  const recentPendingTasks = tasks
    .filter((task) => task.filtro === "por completar")
    .sort((a, b) => new Date(b.fechaActual) - new Date(a.fechaActual))
    .slice(0, 3);

  return (
    <>
      <style>
        {`
          .no-backdrop-filter {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            filter: none !important;
          }
        `}
      </style>
      <div
        className={`bg-[#14141e] rounded-3xl border border-slate-700/50 px-9 py-8 w-[400px] no-backdrop-filter shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${className}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">
              Mis Trabajos
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-base text-gray-300 font-semibold">
                (Resumen Personal)
              </span>
              <i className="bi bi-person-check text-blue-400 text-lg"></i>
            </div>
          </div>
          <ButtonGrey className="px-5 py-2 font-semibold text-base">
            Ver detalles
          </ButtonGrey>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#1a1a2e] rounded-lg p-3 border border-red-500/20">
            <div className="flex items-center gap-2">
              <i className="bi bi-clock text-red-400"></i>
              <span className="text-sm text-gray-300">Pendientes</span>
            </div>
            <div className="text-2xl font-bold text-red-300 mt-1">
              {taskStats.pending}
            </div>
          </div>

          <div className="bg-[#1a1a2e] rounded-lg p-3 border border-green-500/20">
            <div className="flex items-center gap-2">
              <i className="bi bi-check-circle text-green-400"></i>
              <span className="text-sm text-gray-300">Completadas</span>
            </div>
            <div className="text-2xl font-bold text-green-300 mt-1">
              {taskStats.completed}
            </div>
          </div>
        </div>

          {/* Lista de tareas pendientes */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">
            Tareas Pendientes Recientes
          </h4>
          {recentPendingTasks.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">
                ¡No tienes tareas pendientes!
              </p>
              <p className="text-green-400 text-xs mt-1">¡Buen trabajo! 🎉</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentPendingTasks.map((task) => (
                <div
                  key={task.id_Tarea}
                  className="flex items-center justify-between bg-[#1a1a2e] rounded-lg p-2 border border-slate-700/30"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-sm text-gray-300 truncate max-w-[180px]">
                      {task.nombreTarea}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(task.fechaActual).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#232336] pt-3 mt-1">
          <div className="flex items-center gap-2 text-gray-400 text-base font-normal">
            <i className="bi bi-calendar-week text-lg"></i>
            <span className="text-gray-300 font-bold">
              {taskStats.thisWeek}
            </span>{" "}
            Esta semana
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-base font-normal">
            <i className="bi bi-list-task text-lg"></i>
            <span className="text-gray-300 font-bold">
              {taskStats.total}
            </span>{" "}
            Total
          </div>
        </div>
      </div>
    </>
  );
}
