import React, { useEffect, useRef, useState } from "react";
import ButtonBG from "../common/ButtonBG";
import { client as supabase } from "../../supabase/client";
import dayjs from "dayjs";

export function formatTimeAgo(dateString) {
  if (!dateString) return "";
  const now = dayjs();
  const createdDate = dayjs(dateString);

  let diffInSeconds = now.diff(createdDate, "second");
  if (diffInSeconds < 0) diffInSeconds = 0;

  if (now.isSame(createdDate, "day")) {
    if (diffInSeconds < 60) return `recientemente`;
    if (diffInSeconds < 3600)
      return `Hoy, hace ${Math.floor(diffInSeconds / 60)} min(s)`;
    return `Hoy, hace ${Math.floor(diffInSeconds / 3600)} h(s)`;
  }

  if (diffInSeconds < 60) return `Hace ${diffInSeconds} seg(s)`;
  if (diffInSeconds < 3600)
    return `Hace ${Math.floor(diffInSeconds / 60)} min(s)`;
  if (diffInSeconds < 86400)
    return `Hace ${Math.floor(diffInSeconds / 3600)} h(s)`;
  if (diffInSeconds < 604800)
    return `Hace ${Math.floor(diffInSeconds / 86400)} día(s)`;
  if (diffInSeconds < 2592000)
    return `Hace ${Math.floor(diffInSeconds / 604800)} sem(s)`;
  if (diffInSeconds < 31536000)
    return `Hace ${Math.floor(diffInSeconds / 2592000)} mes(es)`;
  return `Hace ${Math.floor(diffInSeconds / 31536000)} año(s)`;
}
export default function DrawerTaskItem({
  task,
  onToggleSelect,
  onUpdateComment,
  isSelected: initialSelected,
}) {
  const [isSelected, setIsSelected] = useState(initialSelected);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [commentText, setCommentText] = useState(task.descripcion || "");
  const [justSelected, setJustSelected] = useState(false);
  const textareaRef = useRef(null);
  const [timeAgo, setTimeAgo] = useState(formatTimeAgo(task.createdAt));

  console.log(
    "createdAt:",
    task.createdAt,
    "Parsed:",
    new Date(task.createdAt),
    "Now:",
    new Date()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(task.createdAt));
    }, 1000); // Actualiza cada segundo

    return () => clearInterval(interval);
  }, [task.createdAt]);

  useEffect(() => {
    setIsSelected(initialSelected);
  }, [initialSelected]);

  const handleToggleSelect = () => {
    const newSelectedState = !isSelected;
    setIsSelected(newSelectedState);

    // Para activa la animacion
    if (newSelectedState) {
      setJustSelected(true);
      setTimeout(() => setJustSelected(false), 300);
    }

    onToggleSelect(task.id_Tarea, newSelectedState);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setCommentText(task.descripcion || "");
    setIsEditingComment(true);
    // Pequeño delay para que la animación se vea mejor
    setTimeout(() => setShowEditPanel(true), 10);
  };

  const handleSaveComment = async () => {
    const { error } = await supabase
      .from("Tareas")
      .update({ descripcion: commentText })
      .eq("id_Tarea", task.id_Tarea);

    if (error) {
      alert("Error al guardar la descripcion: " + error.message);
      return;
    }
    if (onUpdateComment) onUpdateComment(task.id_Tarea, commentText);

    // Cerrar con animación
    setShowEditPanel(false);
    setTimeout(() => setIsEditingComment(false), 300);
  };

  const handleCancelEdit = () => {
    setCommentText(task.descripcion || "");
    // Cerrar con animación
    setShowEditPanel(false);
    setTimeout(() => setIsEditingComment(false), 300);
  };

  useEffect(() => {
    if (showEditPanel && textareaRef.current) {
      // Delay para que el textarea esté renderizado
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [showEditPanel]);

  const isSaveCommentDisabled = commentText.trim().length === 0;

  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-y-auto">
        <div
          className={`bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 hover:border-slate-500/50 rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-300 group ${
            isSelected ? "ring-2 ring-purple-500/30 bg-slate-600/40" : ""
          } ${justSelected ? "animate-pulse" : ""}`}
        >
          <div className="flex items-center gap-3 flex-grow min-w-0">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleToggleSelect}
              className={`w-5 h-5 text-purple-600 bg-slate-800/50 border-2 border-slate-500/60 rounded-md focus:ring-purple-500 focus:ring-2 focus:ring-offset-0 hover:border-purple-400/80 transition-all duration-200 cursor-pointer accent-purple-600 ${
                justSelected ? "scale-110" : "scale-100"
              }`}
            />
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2">
                <h4
                  className={`group-hover:text-gray-100 font-semibold text-sm overflow-hidden whitespace-nowrap text-ellipsis transition-colors duration-300 ${
                    isSelected ? "text-purple-200" : "text-white"
                  }`}
                >
                  {task.taskTitle}
                </h4>
                {task.descripcion && (
                  <span className="text-purple-400/60 text-xs">
                    <i className="bi bi-chat-dots"></i>
                  </span>
                )}
              </div>
              <span className="text-purple-400 group-hover:text-purple-300 text-xs font-medium transition-colors duration-300">
                {timeAgo}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {task.descripcion && (
              <span className="text-gray-500 text-xs bg-slate-700/30 px-2 py-1 rounded-full">
                Con nota
              </span>
            )}
            <button
              onClick={handleEditClick}
              className="text-gray-400 hover:text-purple-400 transition-all duration-200 p-2 rounded-lg hover:bg-slate-600/40 flex-shrink-0 group/edit"
              aria-label="Editar tarea"
            >
              <i className="bi bi-pencil-square text-sm group-hover/edit:scale-110 transition-transform"></i>
            </button>
          </div>
        </div>

        {/* Panel de edición con animación */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            isEditingComment
              ? showEditPanel
                ? "max-h-96 opacity-100 mt-3"
                : "max-h-0 opacity-0 mt-0"
              : "max-h-0 opacity-0 mt-0"
          }`}
        >
          <div
            className={`bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 space-y-4 transform transition-all duration-300 ease-out ${
              showEditPanel
                ? "translate-y-0 scale-100"
                : "translate-y-2 scale-95"
            }`}
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción de la tarea
              </label>
              <textarea
                ref={textareaRef}
                className="w-full h-28 bg-slate-900/60 border border-slate-600/50 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none transition-all duration-200"
                placeholder="Añade una descripción detallada..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelEdit}
                className="px-5 py-2.5 bg-slate-700/50 hover:bg-slate-700/70 text-gray-300 hover:text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveComment}
                disabled={isSaveCommentDisabled}
                className={`px-5 py-2.5 font-medium rounded-xl transition-all duration-200 ${
                  isSaveCommentDisabled
                    ? "bg-purple-600/50 text-white/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white hover:scale-[1.02] shadow-lg hover:shadow-purple-500/25"
                }`}
              >
                <i className="bi bi-check-lg mr-2"></i>
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
