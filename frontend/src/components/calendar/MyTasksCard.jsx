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
      <div className="bg-gradient-to-br from-[#08080e]/95 to-[#0c0c14]/95 via-[#0a0a12]/95 border border-slate-800/40 rounded-3xl px-4 sm:px-6 md:px-9 py-4 sm:py-6 md:py-8 w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.02] flex flex-col ">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">
              Mis Tareas 📅
            </h3>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-slate-700/30 group"
              onClick={handleOpenDrawer}
            >
              <span className="text-xs sm:text-sm font-medium">
                Ver todas ({tasks.length})
              </span>
              <i className="bi bi-arrow-right text-sm sm:text-base group-hover:translate-x-1 transition-transform"></i>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:gap-3 mt-2 sm:mt-3 overflow-y-auto pb-3 sm:pb-4 flex-grow">
          {tasks.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center py-8">
              <div className="text-4xl mb-3 opacity-50">📝</div>
              <p className="text-gray-400 text-sm sm:text-base text-center">
                No tienes tareas pendientes.
              </p>
              <p className="text-gray-500 text-xs sm:text-sm text-center mt-1">
                ¡Perfecto momento para relajarte!
              </p>
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
            className="group flex items-center gap-2 sm:gap-3 border-2 border-dashed border-purple-500/60 hover:border-purple-400/80 text-purple-400 hover:text-purple-300 rounded-2xl px-4 sm:px-6 md:px-8 py-3 sm:py-4 font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:ring-offset-2 focus:ring-offset-transparent"
            onClick={handleOpenModal}
          >
            <span className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-lg text-white font-bold transition-transform duration-300 group-hover:scale-110">
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
