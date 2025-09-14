import React, { useState, useEffect, useCallback } from "react";
import { client as supabase } from "../../supabase/client";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import ButtonGrey from "../common/ButtonGrey";
import UserTaskRow from "../common/UserTaskRow";

export default function AdminPendingTasksCard({ className }) {
  const { userProfile } = useContext(AuthContext);
  const [adminTasks, setAdminTasks] = useState([]);
  const [collaboratorStats, setCollaboratorStats] = useState([]);
  const [totalStats, setTotalStats] = useState({
    totalCollaborators: 0,
    totalTasks: 0,
    totalPending: 0,
  });

  const fetchAdminTasks = useCallback(async () => {
    if (!userProfile) return;

    const { data, error } = await supabase
      .from("Tareas")
      .select("*")
      .eq("id_usuario", userProfile.idUsuario);

    if (!error) {
      setAdminTasks(data || []);
    }
  }, [userProfile]);

  const fetchCollaboratorStats = useCallback(async () => {
    if (!userProfile) return;

    const { data: users, error: usersError } = await supabase
      .from("Usuarios")
      .select("idUsuario, nombre, apellido")
      .neq("tipoUsuario", "admin");

    if (usersError) return;

    const { data: allTasks, error: tasksError } = await supabase
      .from("Tareas")
      .select("id_usuario, filtro");

    if (tasksError) return;

    const collaboratorData = users.map((user) => {
      const userTasks = allTasks.filter(
        (task) => task.id_usuario === user.idUsuario
      );
      const pendingTasks = userTasks.filter(
        (task) => task.filtro === "por completar"
      );

      return {
        id: user.idUsuario,
        name: `${user.nombre} ${user.apellido}`,
        initials: `${user.nombre.charAt(0)}${user.apellido.charAt(
          0
        )}`.toUpperCase(),
        totalTasks: userTasks.length,
        pending: pendingTasks.length,
      };
    });

    // Obtener los 3 colaboradores con más tareas pendientes
    const topCollaborators = collaboratorData
      .filter((col) => col.pending > 0)
      .sort((a, b) => b.pending - a.pending)
      .slice(0, 3);

    setCollaboratorStats(topCollaborators);

    setTotalStats({
      totalCollaborators: users.length,
      totalTasks: allTasks.length,
      totalPending: allTasks.filter((task) => task.filtro === "por completar")
        .length,
    });
  }, [userProfile]);

  useEffect(() => {
    fetchAdminTasks();
    fetchCollaboratorStats();
  }, [fetchAdminTasks, fetchCollaboratorStats]);

  const adminPendingTasks = adminTasks.filter(
    (task) => task.filtro === "por completar"
  );
  const adminCompletedTasks = adminTasks.filter(
    (task) => task.filtro === "completado"
  );

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
              Trabajos Pendientes
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-base text-gray-300 font-semibold">
                (Vista Admin)
              </span>
              <i className="bi bi-shield-check text-purple-400 text-lg"></i>
            </div>
          </div>
          <ButtonGrey className="px-5 py-2 font-semibold text-base">
            Ver detalles
          </ButtonGrey>
        </div>

        <div className="mb-4 p-3 bg-[#1a1a2e] rounded-lg border border-purple-500/20">
          <h4 className="text-sm font-semibold text-purple-400 mb-2">
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

        {/* Lista de colaboradores con más tareas pendientes  (AUN NO APARECE, LO ESTOY ARREGLNADO*/}
        <div className="flex flex-col gap-3 mb-3">
          <h4 className="text-sm font-semibold text-gray-400">
            Top Colaboradores con Tareas Pendientes
          </h4>
          {collaboratorStats.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No hay tareas pendientes</p>
            </div>
          ) : (
            collaboratorStats.map((col) => (
              <UserTaskRow
                key={col.id}
                initials={col.initials}
                name={col.name}
                rightContent={`${col.pending} Pendiente(s)`}
                rightContentClass="text-red-300"
              />
            ))
          )}
          {collaboratorStats.length > 0 && (
            <div className="flex items-center gap-2 pl-2">
              <span className="text-xl text-gray-400">•••</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#232336] pt-3 mt-1">
          <div className="flex items-center gap-2 text-gray-400 text-base font-normal">
            <i className="bi bi-people-fill text-lg"></i>
            <span className="text-gray-300 font-bold">
              {totalStats.totalCollaborators}
            </span>{" "}
            Colaboradores
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-base font-normal">
            <i className="bi bi-tools text-lg"></i>
            <span className="text-gray-300 font-bold">
              {totalStats.totalPending}
            </span>{" "}
            Pendientesss
          </div>
        </div>
      </div>
    </>
  );
}
