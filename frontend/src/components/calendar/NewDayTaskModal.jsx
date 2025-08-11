import React, { useState } from "react";

// Modal personalizado para añadir tarea en el calendario diario
const NewDayTaskModal = ({ onClose, onSave, startDate, taskTime }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      taskTitle: title,
      taskDescription: description,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/20">
      <div className="bg-[#181825] rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <form onSubmit={handleSubmit}>
          <div className="mb-6 flex flex-col items-center">
            <input
              type="text"
              className="text-2xl font-bold text-white bg-transparent border-none outline-none text-center w-full mb-2 placeholder:text-gray-500"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Añade un título"
              required
              style={{ minHeight: '2.5rem' }}
              autoFocus
            />
            <hr className="border-t border-gray-700 w-full" />
          </div>
          <div className="mb-6">
            <label className="text-xs text-gray-400 mb-1 block">Descripción</label>
            <textarea
              className="w-full bg-[#232335] text-white rounded-lg px-3 py-2 focus:outline-none min-h-[80px]"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Añade una descripción"
            />
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-2 rounded-xl shadow-lg transition-colors"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDayTaskModal;
