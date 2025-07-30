import React from "react";
import FloatingModal from "../common/popUp/FloatingModal";

const DayTemplateModal = ({ date, onClose }) => {
  return (
    <FloatingModal onClose={onClose}>
      <h2 className="text-2xl font-bold text-white mb-2">Plantilla del día</h2>
      <p className="text-gray-300 mb-6">Fecha seleccionada: {date.toLocaleDateString()}</p>
      {/* Aquí puedes agregar inputs para agendar citas, tareas, etc. */}
      <button
        className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        onClick={onClose}
      >
        Cerrar
      </button>
    </FloatingModal>
  );
};

export default DayTemplateModal;