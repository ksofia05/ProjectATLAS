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
  const timeoutRef = useRef();

  useEffect(() => {
    setTasks(initialTasks || []);
  }, [initialTasks]);

  useEffect(() => {
    if (open) {
      setMounted(true);
      timeoutRef.current = setTimeout(() => setShowDrawer(true), 10);
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
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id_Tarea === id_Tarea ? { ...task, descripcion: newDescription } : task
      )
    );
  };

  const handleCompleteSelectedTasks = async () => {
    //se busca con el filtro las tareas que estan como "completada"
    const toComplete = tasks.filter(
      (task) => selectedTaskIds.has(task.id_Tarea) && task.filtro !== "completado"
      
    );
    //se actualizan las tareas en la base de datos
    for (const task of toComplete) {
      console.log("Actualizando tarea", task.id_Tarea, "a filtro:", "completado");
      await supabase
        .from("Tareas")
        .update({ 
          filtro: "completado",
          fechaActual: new Date().toISOString() 
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

  const handleRestoreTask = async(taskId) => {
    // actualiza el filtro a "por completar"
    await supabase
      .from("Tareas")
      .update({ filtro: "por completar", fechaActual: new Date().toISOString() })
      .eq("id_Tarea", taskId);
    if (onTasksUpdate) onTasksUpdate();
    // vuelve a consultar la BD para  reflejar cambios
    const { data, error } = await supabase
      .from("Tareas")
      .select("*")
      .eq("id_usuario", tasks[0]?.id_usuario);
    if (!error) setTasks(data.map(task=>({
      ...task,
      fechaOriginal: task.fechaActual
    })) || []);
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
    const {data, error } = await supabase
      .from("Tareas")
      .select("*")
      .eq("id_usuario", idUsuario);

    if(onTasksUpdate) onTasksUpdate();
    
    if(!error) setTasks(data || []);
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
              ? "backdrop-blur-[2px] bg-black/5 pointer-events-auto"
              : "backdrop-blur-0 bg-transparent pointer-events-none"
          }
        `}
        onClick={onClose}
        aria-label="Cerrar lista de tareas"
      />
      <aside
        className={`
          fixed top-0 right-0 h-full w-full max-w-md bg-[#181825] shadow-2xl p-8 flex flex-col
          transition-transform duration-300 ease-in-out
          ${showDrawer ? "translate-x-0" : "translate-x-full"}
          rounded-l-3xl
          pointer-events-auto
        `}
        style={{
          boxShadow:
            "0 0 32px 0 rgba(255,255,255,0.08), 0 2px 8px 0 rgba(0,0,0,0.12)",
        }}
      >
        <div className="relative mb-5">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-400">Tareas</h2>
            <div>
              <h3 className="text-3xl font-bold text-white mt-2">
                Lista de Usuario
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-white transition-colors duration-200 hover:text-purple-600 text-2xl -mt-4 mr-0"
            tabIndex={0}
            aria-label="Cerrar panel de tareas"
          >
            &times;
          </button>
        </div>

        <hr className="border-gray-700 mb-6" />

        <div className="flex flex-col overflow-y-auto flex-grow">
          {tasks.filter(t=>t.filtro !== "completado").length > 0 ? (
            tasks
            .filter(t => t.filtro !== "completado")
            .map((task) => {
              const taskWithCreatedAt = {
                ...task,
                taskTitle: task.nombreTarea,
                createdAt: task.fechaCreacion && task.fechaLimite
                  ? `${task.fechaCreacion}T${task.fechaLimite}`
                  : task.fechaCreacion,
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
                  {/* <span className="text-[#813dff] text-xs font-medium ml-4">
                    {formatTimeAgo(taskWithCreatedAt.createdAt)}
                  </span> */}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No hay tareas disponibles.</p>
          )}
        </div>
        <hr className="border-gray-700 my-4" />
        <div className="mt-4">
          <h3 className="text-xs font-bold text-gray-400">
            Tareas Completadas ({tasks.filter(t => t.filtro ==="completado").length})
          </h3>
          <div className={`flex flex-col ${tasks.filter(t => t.filtro ==="completado").length > 0 ? "gap-3 mt-3" : ""}`}>
            {tasks.filter(t=> t.filtro === "completado").length > 0 ? (
              tasks
                .filter(t=> t.filtro === "completado")
                .map((task) => (
                  <div key={task.id_Tarea} className="flex flex-col">
                    <div className="bg-[#2A273A] rounded-2xl px-6 py-4 flex items-center justify-between">
                      <span className="text-white font-semibold">{task.nombreTarea}</span>
                      <button
                        onClick={() => handleRestoreTask(task.id_Tarea)}
                        className="text-gray-400 hover:text-purple-600 transition-colors duration-200"
                        aria-label="Restaurar tarea"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                    {task.fechaActual && (
                      <span className="text-[#813dff] text-xs font-medium ml-4">
                      Completado: {new Date(task.fechaActual).toLocaleString("es-CO",{
                        timeZone: "America/Bogota",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                    )}
                </div>
              ))
            ) : null}
          </div>
        </div>
        <div className="mt-auto flex justify-end items-end pt-2">
          {selectedTaskIds.size > 0 && (
            <ButtonBG
              onClick={handleCompleteSelectedTasks}
              className={`
                flex items-center gap-3 shadow-xl transition duration-500 hover:scale-104 rounded-xl px-6 py-3 font-semibold focus:outline-none
                ${isCompleteButtonDisabled ? 'bg-[#7c2ae8] text-white opacity-50 cursor-not-allowed' : 'bg-[#7c2ae8] hover:bg-[#5a1bb7] text-white mx-4'}
              `}
            >
              Completar
            </ButtonBG>
          )}
          {tasks.filter(t => t.filtro === "completado").length > 0 && (
            <button
              onClick={handleDeleteAllCompletedTasks}
              className="flex items-end gap-2 text-purple-500 hover:text-purple-700 transition-colors duration-200 text-xs"
            >
              <i className="bi bi-trash"></i> Eliminar todo
            </button>
          )}
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