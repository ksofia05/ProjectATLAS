import React, { useState } from "react";
import construccionImg from "../../assets/LogoSinProyecto.png";
import ModalNewProject from "./ModalNewProject";

const CreateProjectPanel = ({ onCreate }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreate = (nombreProyecto) => {
    setModalOpen(false);
    if (onCreate) onCreate(nombreProyecto);
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-10 px-4">
      <div className="bg-gradient-to-tr from-[#181825] via-[#181825] to-[#29293f] border border-gray-700 rounded-2xl shadow-2xl px-14 py-10 w-full max-w-6xl">
        {/* Título y subtítulo */}
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2 text-left">
          Hola, Luis Nuñez <span className="text-2xl">👋</span>
        </h2>
        <p className="text-lg text-gray-300 mb-8 text-left">
          Organiza tus espacios de trabajo.
        </p>
        {/* Botón de nuevo proyecto */}
        <div className="flex mb-10">
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg text-xl transition"
            onClick={() => setModalOpen(true)}
          >
            <i className="bi bi-plus-circle text-2xl"></i>
            Nuevo Proyecto
          </button>
        </div>
        {/* Panel sin proyectos */}
        <div className="border-2 border-dashed border-[#7c2ae8] rounded-2xl p-12 flex flex-col items-center bg-[#232336]">
          <img
            src={construccionImg}
            alt="Sin proyectos"
            className="w-32 mb-6"
          />
          <h3 className="text-2xl font-bold text-white mb-2 text-center">
            Sin proyectos creados
          </h3>
          <p className="text-gray-300 text-center text-lg">
            Crea tu primer proyecto para comenzar a colaborar con tu equipo.
          </p>
        </div>
      </div>
      {/* Modal */}
      <ModalNewProject
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default CreateProjectPanel;