import React, { useState, useEffect, useCallback } from "react";
import NewTaskModal from "./NewTaskModal";
import TaskItem from "./TaskItem";
import TasksListDrawer from "./TasksListDrawer";
import { client as supabase } from "../../supabase/client";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

export default function MyTasksCard() {
  const { userProfile } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(async () => {
    if (!userProfile) return;
    const { data, error } = await supabase
      .from("Tareas")
      .select("*")
      .eq("id_usuario", userProfile.idUsuario);

    if (!error) setTasks(data || []);
  }, [userProfile]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleSaveTask = async (newTaskData) => {
    if (!userProfile) return;
    const { taskTitle, taskDescription, endDate, taskTime } = newTaskData;
    const { error } = await supabase.from("Tareas").insert([
      {
        nombreTarea: taskTitle,
        descripcion: taskDescription,
        fechaCreacion: endDate,
        fechaLimite: taskTime,
        fechaActual: new Date().toLocaleString("sv-SE"),
        id_usuario: userProfile.idUsuario,
        filtro: "por completar",
      },
    ]);
    if (error) {
      alert("Error al guardar la tarea: " + error.message);
      return;
    }
    await fetchTasks();
    handleCloseModal();
  };

  const handleTasksUpdate = () => {
    fetchTasks();
  };

  return (
    <>
      <div className="bg-gradient-to-r from-[#14141e] to-[#14141e] via-[#181825] border border-slate-700/50 rounded-3xl px-4 sm:px-6 md:px-9 py-4 sm:py-6 md:py-8 w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.02] flex flex-col ">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">
              Mis Tareas 📅
            </h3>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-sm sm:text-base text-gray-400 font-semibold hidden sm:inline">
              Ver Lista
            </span>
            <button
              className="transition-transform duration-200 hover:scale-125 focus:outline-none py-2 sm:py-4"
              aria-label="Más opciones"
              onClick={handleOpenDrawer}
            >
              <i className="bi bi-three-dots text-gray-300 hover:text-purple-600 transition-colors text-base sm:text-lg"></i>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:gap-3 mt-2 sm:mt-3 overflow-y-auto pb-3 sm:pb-4 flex-grow">
          {tasks.length === 0 ? (
            <div className="flex-grow flex">
              <p className="text-gray-500 text-sm sm:text-base">No tienes tareas pendientes.</p>
            </div>
          ) : (
            tasks.slice(0, 5).map((task) => (
              <TaskItem
                key={task.id_Tarea}
                task={{
                  taskTitle: task.nombreTarea,
                  createdAt: task.fechaActual,
                }}
              />
            ))
          )}
        </div>
        <div className="mt-auto flex justify-center pt-3 sm:pt-4">
          <button
            className="flex items-center gap-2 sm:gap-3 border-2 border-dashed border-purple-600 bg-[#14141d] text-purple-500 shadow-xl hover:border-purple-700 hover:scale-104 rounded-full px-4 sm:px-8 md:px-26 py-3 sm:py-4 font-semibold text-sm sm:text-base md:text-lg focus:outline-none"
            onClick={handleOpenModal}
          >
            <span className="bg-[#0f0f16] border-2 border-purple-600 rounded-lg w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-lg text-purple-600 font-bold">
              +
            </span>
            <span className="hidden sm:inline">Añade una nueva tarea</span>
            <span className="sm:hidden">Nueva tarea</span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <NewTaskModal onClose={handleCloseModal} onSave={handleSaveTask} />
      )}

      <TasksListDrawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        tasks={tasks}
        onTasksUpdate={handleTasksUpdate}
      />
    </>
  );
}