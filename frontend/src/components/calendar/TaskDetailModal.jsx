import React, { useState, useEffect } from "react";

const TaskDetailModal = ({
  task,
  onClose,
  onDelete,
  onDeleteFromDB,
  onUpdateInfo,
  onToggleComplete,
}) => {
  if (!task) return null;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.nombreTarea || "");
  const [editDescription, setEditDescription] = useState(
    task.descripcion || ""
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setEditTitle(task.nombreTarea || "");
    setEditDescription(task.descripcion || "");
    setIsEditing(false);
  }, [task]);

  // Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 20);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    if (onUpdateInfo) {
      onUpdateInfo(task.id_Tarea, editTitle, editDescription);
    }
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Estado de completado
  const completed = !!task.completed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 transition-all duration-400 ${
          isVisible
            ? "bg-black/5 backdrop-blur-[2px] opacity-100"
            : "bg-black/0 backdrop-blur-0 opacity-0"
        }`}
        onClick={handleClose}
      />

      <div
        className={`relative z-10 w-full max-w-md transition-all duration-400 ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-12 scale-95"
        }`}
        style={{
          transitionTimingFunction: isVisible
            ? "cubic-bezier(0.34, 1.56, 0.64, 1)"
            : "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
        onClick={handleBackdropClick}
      >
        <div className="bg-[#14141e] border border-slate-700/50 rounded-2xl shadow-2xl p-8 w-full relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-6 right-6 flex items-center gap-2 z-50">
            <button
              className="text-gray-400 hover:text-purple-400 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-700/50 transition-all duration-200"
              title="Editar tarea"
              onClick={() => setIsEditing(!isEditing)}
            >
              <i className="bi bi-pencil-square text-lg" />
            </button>
            <button
              className="text-gray-400 hover:text-red-400 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-all duration-200"
              title="Eliminar tarea"
              onClick={() => onDelete(task)}
            >
              <i className="bi bi-trash3 text-lg" />
            </button>
            <button
              className="text-gray-400 hover:text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-700/50 transition-all duration-200"
              onClick={handleClose}
            >
              <i className="bi bi-x-lg text-lg" />
            </button>
          </div>
          {/* Título y estado */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`inline-block w-4 h-4 rounded-full ${
                task.filtro === "completado"
                  ? "bg-emerald-400"
                  : "bg-purple-400"
              }`}
            />
            <span
              className={`text-lg font-semibold text-white relative w-full ${
                completed ? "line-through" : ""
              }`}
            >
              {isEditing ? (
                <input
                  className="bg-transparent border-b border-slate-600 text-white font-semibold text-lg pl-1 py-1 pr-10 max-w-[70%] rounded transition"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  autoFocus
                />
              ) : (
                task.nombreTarea || "(Sin título)"
              )}
            </span>
          </div>
          {/* Fecha y hora */}
          <div className="flex items-center gap-2 text-purple-200 mb-2">
            <i className="bi bi-clock text-purple-300" />
            <span>{task.fechaCreacion}</span>
            <span>{task.fechaLimite?.slice(0, 5)}</span>
          </div>
          {/* Descripción */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <i className="bi bi-card-text text-lg text-purple-300" />
              <span className="text-sm text-white">Descripción</span>
            </div>
            {isEditing ? (
              <textarea
                className="w-full bg-[#1a1a26] border border-slate-600/40 rounded-xl p-2 text-sm text-white min-h-[40px] focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
            ) : (
              <div
                className={`bg-[#1a1a26] rounded-xl p-2 text-sm min-h-[40px] border border-slate-600/40 ${
                  completed ? "line-through text-purple-400" : "text-white"
                }`}
              >
                {task.descripcion || "Sin descripción"}
              </div>
            )}
          </div>
          {/* Botones de edición */}
          {isEditing && (
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-[#1a1a26] hover:bg-[#20202e] text-gray-300 hover:text-white font-medium px-6 py-2 rounded-xl border border-slate-600/40 hover:border-slate-500/50 transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={
                  editTitle.trim() === "" || editDescription.trim() === ""
                }
                className={`font-medium px-6 py-2 rounded-xl transition-all duration-200 ${
                  editTitle.trim() === "" || editDescription.trim() === ""
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white opacity-50 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg"
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
                className={`mt-4 px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                  task.filtro === "completado"
                    ? "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white"
                    : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                }`}
                onClick={() =>
                  onToggleComplete && onToggleComplete(task.id_Tarea)
                }
              >
                {task.filtro === "completado"
                  ? "Marcar pendiente"
                  : "Completar"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
