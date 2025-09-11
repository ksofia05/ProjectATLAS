import React, { useState,useEffect } from "react";

const TaskDetailModal = ({ task, onClose, onDelete,onDeleteFromDB, onUpdateInfo, onToggleComplete }) => {
  if (!task) return null;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.nombreTarea || "");
  const [editDescription, setEditDescription] = useState(task.descripcion || "");

  

  const handleSave = () => {
    if (onUpdateInfo) {
      onUpdateInfo(task.id_Tarea, editTitle, editDescription);
    }
    setIsEditing(false);
  };

  useEffect(() => {
    setEditTitle(task.nombreTarea || "");
    setEditDescription(task.descripcion || "");
    setIsEditing(false);
  }, [task]);



  // Estado de completado
  const completed = !!task.completed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
      <div className="bg-gradient-to-br from-[#181825] to-[#232335] rounded-2xl shadow-xl p-6 w-[400px] relative border border-gray-800">
        {/* Botones cerrar, editar y borrar */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
          <button
            className="text-gray-400 hover:text-blue-400"
            title="Editar tarea"
            onClick={() => setIsEditing(!isEditing)}
          >
            <i className="bi bi-pencil-square text-xl" />
          </button>
          <button
            className="text-gray-400 hover:text-red-400"
            title="Eliminar tarea"
            onClick={() => {
              // if (onDeleteFromDB) onDeleteFromDB(task);
              // if (onDelete) onDelete(task);
              onDelete(task)
              
            }}
          >
            <i className="bi bi-trash3 text-xl" />
          </button>
          <button
            className="text-gray-400 hover:text-purple-400"
            onClick={onClose}
          >
            <i className="bi bi-x-lg text-xl" />
          </button>
        </div>
        {/* Título y estado */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block w-3 h-3 rounded-full bg-purple-400" />
          <span className={`text-lg font-semibold text-white relative w-full ${completed ? "line-through" : ""}`}>
            {isEditing ? (
              <input
                className="bg-transparent border-b border-gray-600 text-white font-semibold text-lg pl-1 py-1 pr-10 max-w-[70%] rounded transition"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                autoFocus
              />
            ) : (
              task.nombreTarea || "(Sin título)"
            )}
          </span>
        </div>
        {/* Fecha y hora */}
        <div className="flex items-center gap-2 text-purple-200 mb-1">
          <i className="bi bi-clock text-purple-300" />
          <span>{task.fechaCreacion}</span>
          <span>{task.fechaLimite?.slice(0,5)}</span>
        </div>
        {/* Descripción */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <i className="bi bi-card-text text-lg text-purple-300" />
            <span className="text-sm text-white">Descripción</span>
          </div>
          {isEditing ? (
            <textarea
              className="w-full bg-[#232335] border border-gray-700 rounded-lg p-2 text-sm text-purple-100 min-h-[40px] focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              rows={3}
            />
          ) : (
            <div className={`bg-[#232335] rounded-lg p-2 text-sm min-h-[40px] border border-gray-700 ${completed ? "line-through text-purple-400" : "text-purple-100"}`}>
              {task.descripcion || "Sin descripción"}
            </div>
          )}
        </div>
        {/* Botones de edición */}
        {isEditing && (
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="bg-[#343149] hover:bg-[#3c3a4b] text-white font-semibold px-6 py-2 rounded-xl shadow transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={editTitle.trim() === "" || editDescription.trim() === ""}
              className={`font-semibold px-6 py-2 rounded-xl shadow transition ${
                editTitle.trim() === "" || editDescription.trim() === ""
                  ? "bg-[#7c2ae8] text-white opacity-50 cursor-not-allowed"
                  : "bg-[#7c2ae8] hover:bg-[#5a1bb7] text-white"
              }`}
            >
              Guardar
            </button>
          </div>
        )}
        {/* Botón completar/no completado ABAJO */}
        {!isEditing && (
          <div className="flex justify-end mt-6">
            <button
  className={`mt-4 px-6 py-2 rounded-lg font-semibold transition ${
    task.filtro === "completado"
      ? "bg-purple-600 text-white hover:bg-purple-700"
      : "bg-purple-600 text-white hover:bg-purple-700"
  }`}
  onClick={() => onToggleComplete && onToggleComplete(task.id_Tarea)}
>
  {task.filtro === "completado" ? "No completada" : "Completar"}
</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailModal;