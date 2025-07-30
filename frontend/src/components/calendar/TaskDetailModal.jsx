import React from "react";

const TaskDetailModal = ({ task, onClose, onDelete }) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
      <div className="bg-gradient-to-br from-[#181825] to-[#232335] rounded-2xl shadow-xl p-6 w-[400px] relative border border-gray-800">
        {/* Botones cerrar y borrar */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            className="text-gray-400 hover:text-red-400"
            title="Eliminar tarea"
            onClick={() => onDelete && onDelete(task)}
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
          <span className="text-lg font-semibold text-white">
            {task.title || "(Sin título)"}
          </span>
        </div>
        {/* Fecha y hora */}
        <div className="flex items-center gap-2 text-purple-200 mb-1">
          <i className="bi bi-clock text-purple-300" />
          <span>{task.startDate}</span>
          <span>{task.taskTime}</span>
        </div>
        <div className="text-xs text-purple-400 mb-2">No se repite</div>
        {/* Participantes */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <i className="bi bi-people text-lg text-purple-300" />
            <span className="text-sm text-white">Participantes</span>
          </div>
          <div className="flex flex-col gap-1">
            {(task.participants || [
              "KarenSofiaLizcanoTorres@gmail.com",
              "Jrvaquero@gmail.com",
              "ThomasGero@gmail.com"
            ]).map((email, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-purple-100">
                <i className="bi bi-person-circle text-base text-purple-400" />
                <span>{email}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Descripción */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <i className="bi bi-card-text text-lg text-purple-300" />
            <span className="text-sm text-white">Descripcion</span>
          </div>
          <div className="bg-[#232335] rounded-lg p-2 text-sm text-purple-100 min-h-[40px] border border-gray-700">
            {task.description || "Sin descripción"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
