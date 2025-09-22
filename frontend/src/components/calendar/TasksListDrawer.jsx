import React, { useEffect, useRef, useState } from "react";
import DrawerTaskItem, { formatTimeAgo } from "./DrawerTaskItem";
import ButtonBG from "../common/ButtonBG";
import EstateAdEquipmentModal from "../dashboard/EstateAdEquipmentModal";
import { client as supabase } from "../../supabase/client";

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

export default function TasksListDrawer({
  open,
  onClose,
  tasks: initialTasks,
  onTasksUpdate,
}) {
  const [mounted, setMounted] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState(new Set());
  const [tasks, setTasks] = useState(initialTasks || []);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [restoringTaskIds, setRestoringTaskIds] = useState(new Set()); // Nuevo estado
  const timeoutRef = useRef();

  useEffect(() => {
    setTasks(initialTasks || []);
  }, [initialTasks]);

  useEffect(() => {
    if (open) {
      setMounted(true);
      timeoutRef.current = setTimeout(() => setShowDrawer(true), 50);
    } else if (mounted) {
      setShowDrawer(false);
      setSelectedTaskIds(new Set());
      timeoutRef.current = setTimeout(() => setMounted(false), 300);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [open, mounted]);

  const handleToggleSelectTask = (taskId, isSelected) => {
    setSelectedTaskIds((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (isSelected) {
        newSelected.add(taskId);
      } else {
        newSelected.delete(taskId);
      }
      return newSelected;
    });
  };

  const handleUpdateComment = (id_Tarea, newDescription) => {
    //deja observar la descripcion
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id_Tarea === id_Tarea
          ? { ...task, descripcion: newDescription }
          : task
      )
    );
  };

  const handleCompleteSelectedTasks = async () => {
    //se busca con el filtro las tareas que estan como "completada"
    const toComplete = tasks.filter(
      (task) =>
        selectedTaskIds.has(task.id_Tarea) && task.filtro !== "completado"
    );
    //se actualizan las tareas en la base de datos
    for (const task of toComplete) {
      console.log(
        "Actualizando tarea",
        task.id_Tarea,
        "a filtro:",
        "completado"
      );
      await supabase
        .from("Tareas")
        .update({
          filtro: "completado",
          fechaActual: new Date().toISOString(),
        })
        .eq("id_Tarea", task.id_Tarea);
    }
    if (onTasksUpdate) onTasksUpdate();
    //se vuelve a consultar la BD para  reflejar cambios
    const { data, error } = await supabase
      .from("Tareas")
      .select("*")
      .eq("id_usuario", tasks[0]?.id_usuario);

    if (!error) setTasks(data || []);
    setSelectedTaskIds(new Set());
  };

  const handleRestoreTask = async (taskId) => {
    setRestoringTaskIds((prev) => new Set(prev).add(taskId));

    setTimeout(async () => {
      await supabase
        .from("Tareas")
        .update({
          filtro: "por completar",
          fechaActual: new Date().toISOString(),
        })
        .eq("id_Tarea", taskId);

      if (onTasksUpdate) onTasksUpdate();

      // vuelve a consultar la BD para reflejar cambios
      const { data, error } = await supabase
        .from("Tareas")
        .select("*")
        .eq("id_usuario", tasks[0]?.id_usuario);

      if (!error) {
        setTasks(
          data.map((task) => ({
            ...task,
            fechaOriginal: task.fechaActual,
          })) || []
        );
      }

      // Remover de la lista de restaurando
      setRestoringTaskIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }, 300); // Animacion (se traba no se pq)
  };

  const handleDeleteAllCompletedTasks = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAllCompletedTasks = async () => {
    const idUsuario = tasks[0]?.id_usuario;
    if (!idUsuario) return;
    // busca en la BD y elimina la tarea
    await supabase
      .from("Tareas")
      .delete()
      .eq("id_usuario", idUsuario)
      .eq("filtro", "completado");
    // se vuelve a consultar la BD para  reflejar cambios
    const { data, error } = await supabase
      .from("Tareas")
      .select("*")
      .eq("id_usuario", idUsuario);

    if (onTasksUpdate) onTasksUpdate();

    if (!error) setTasks(data || []);
    setShowDeleteModal(false);
  };

  const isCompleteButtonDisabled = selectedTaskIds.size === 0;

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        className={`
          fixed inset-0 transition-all duration-300
          ${
            showDrawer
              ? "backdrop-blur-[2px] bg-black/20 pointer-events-auto"
              : "backdrop-blur-0 bg-transparent pointer-events-none"
          }
        `}
        onClick={onClose}
        aria-label="Cerrar lista de tareas"
      />
      <aside
        className={`
          fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-br from-[#08080e]/98 to-[#0c0c14]/98 via-[#0a0a12]/98 backdrop-blur-xl shadow-2xl p-8 flex flex-col border-l border-slate-800/40
          transition-transform duration-500 ease-out
          ${showDrawer ? "translate-x-0" : "translate-x-full"}
          rounded-l-3xl
          pointer-events-auto
        `}
        style={{
          boxShadow:
            "0 0 32px 0 rgba(139, 92, 246, 0.1), 0 2px 8px 0 rgba(0,0,0,0.3), -10px 0 30px 0 rgba(139, 92, 246, 0.05)",
        }}
      >
        <div className="relative mb-5">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-purple-400/80">Tareas</h2>
            <div>
              <h3 className="text-3xl font-bold text-white mt-2">
                Lista de Tareas
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-400 hover:text-white transition-colors duration-200 text-2xl -mt-4 mr-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-700/30"
            tabIndex={0}
            aria-label="Cerrar panel de tareas"
          >
            &times;
          </button>
        </div>

        <hr className="border-slate-700/50 mb-6" />

        <div className="flex flex-col overflow-y-auto flex-grow space-y-3">
          {tasks.filter((t) => t.filtro !== "completado").length > 0 ? (
            tasks
              .filter((t) => t.filtro !== "completado")
              .map((task) => {
                const taskWithCreatedAt = {
                  ...task,
                  taskTitle: task.nombreTarea,
                  createdAt: task.fechaActual,
                  descripcion: task.descripcion,
                };
                return (
                  <div key={task.id_Tarea} className="flex flex-col">
                    <DrawerTaskItem
                      task={taskWithCreatedAt}
                      onToggleSelect={handleToggleSelectTask}
                      isSelected={selectedTaskIds.has(task.id_Tarea)}
                      onUpdateComment={handleUpdateComment}
                    />
                  </div>
                );
              })
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center py-12">
              <div className="text-5xl mb-4 opacity-40">✨</div>
              <p className="text-gray-400 text-center text-lg font-medium">
                No hay tareas disponibles
              </p>
              <p className="text-gray-500 text-center text-sm mt-2">
                ¡Momento perfecto para crear una nueva!
              </p>
            </div>
          )}
        </div>

        <hr className="border-slate-700/50 my-6" />

        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-400">
              Tareas Completadas
            </h3>
            <span className="bg-slate-700/40 text-purple-400 text-xs font-bold px-2 py-1 rounded-full">
              {tasks.filter((t) => t.filtro === "completado").length}
            </span>
          </div>
          <div
            className={`flex flex-col ${
              tasks.filter((t) => t.filtro === "completado").length > 0
                ? "gap-3"
                : ""
            }`}
          >
            {tasks.filter((t) => t.filtro === "completado").length > 0 ? (
              tasks
                .filter((t) => t.filtro === "completado")
                .map((task) => (
                  <div
                    key={task.id_Tarea}
                    className={`flex flex-col transition-all duration-300 ease-out ${
                      restoringTaskIds.has(task.id_Tarea)
                        ? "opacity-0 transform -translate-y-4 scale-95"
                        : "opacity-100 transform translate-y-0 scale-100"
                    }`}
                  >
                    <div className="bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-200 group">
                      <span className="text-gray-300 font-medium text-sm line-through opacity-75 group-hover:opacity-90 transition-opacity">
                        {task.nombreTarea}
                      </span>
                      <button
                        onClick={() => handleRestoreTask(task.id_Tarea)}
                        disabled={restoringTaskIds.has(task.id_Tarea)}
                        className={`transition-all duration-200 p-1 rounded-full ${
                          restoringTaskIds.has(task.id_Tarea)
                            ? "text-gray-600 cursor-not-allowed"
                            : "text-gray-400 hover:text-purple-400 hover:bg-slate-600/40 hover:scale-110"
                        }`}
                        aria-label="Restaurar tarea"
                      >
                        <i
                          className={`bi ${
                            restoringTaskIds.has(task.id_Tarea)
                              ? "bi-arrow-repeat animate-spin"
                              : "bi-arrow-counterclockwise"
                          } text-sm transition-transform`}
                        ></i>
                      </button>
                    </div>
                    {task.fechaActual && (
                      <span className="text-purple-400/70 text-xs font-medium ml-4 mt-1">
                        Completado:{" "}
                        {new Date(task.fechaActual).toLocaleString("es-CO", {
                          timeZone: "America/Bogota",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4 font-medium">
                No hay tareas completadas aún
              </p>
            )}
          </div>
        </div>

        <div className="mt-auto pt-4 gap-3">
          {/* Contenedor con animación para el botón de completar */}
          <div
            className={`transition-all duration-300 ease-out transform ${
              selectedTaskIds.size > 0
                ? "opacity-100 translate-y-0 max-h-20 mb-3"
                : "opacity-0 translate-y-4 max-h-0 mb-0"
            } overflow-hidden`}
          >
            <div
              className={`transition-all duration-300 ease-out ${
                selectedTaskIds.size > 0 ? "scale-100" : "scale-95"
              }`}
            >
              <ButtonBG
                onClick={handleCompleteSelectedTasks}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-purple-500/25"
              >
                <i className="bi bi-check-circle text-sm"></i>
                Completar ({selectedTaskIds.size}) tarea
                {selectedTaskIds.size > 1 ? "s" : ""}
              </ButtonBG>
            </div>
          </div>

          {/* Botón de eliminar completadas abajito */}
          <div className="flex justify-center">
            {tasks.filter((t) => t.filtro === "completado").length > 0 && (
              <button
                onClick={handleDeleteAllCompletedTasks}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-500/10"
              >
                <i className="bi bi-trash text-sm"></i>
                Eliminar completadas
              </button>
            )}
          </div>
        </div>
      </aside>

      {showDeleteModal && (
        <EstateAdEquipmentModal
          onClose={() => setShowDeleteModal(false)}
          onSave={confirmDeleteAllCompletedTasks}
        />
      )}
    </div>
  );
}
