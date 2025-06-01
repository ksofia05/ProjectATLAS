// Sidebar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/LogoTransparente.png";
import ModalNuevoProyecto from "./ModalNewProject"; // ¡Asegúrate de que esta ruta sea correcta!
import ProjectList from './ProjectList'; // Importa el componente ProjectList

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = (projectName) => {
    console.log("Simulando creación de proyecto:", projectName);
    setIsModalOpen(false);
  };

  return (
    <aside className="bg-gradient-to-l from-[#181825] via-[#181825] to-[#14141e] text-white w-72 min-h-screen flex flex-col justify-between py-8 px-6">
     
      <div>
        <div className="flex items-center gap-3 mb-10">
          <img src={logo} alt="Logo ATLAS" className="w-16 h-16 object-contain" />
          <span className="text-3xl font-bold tracking-wide">ATLAS</span>
        </div>
        <div className="mb-8">
          <h3 className="font-semibold mb-2 text-white">Mis Proyectos (Admin)</h3>
          
          <ProjectList />
        
          <ul className="text-sm text-gray-300 list-decimal list-inside pl-2 mt-2">
            <li className="cursor-pointer hover:text-[#7c2ae8]" onClick={() => setIsModalOpen(true)}>
              Haz clic en "Nuevo Proyecto"
            </li>
          </ul>
        </div>

        <hr className="border-t border-[#7c2ae8] opacity-40 my-6" />

      
        <div>
          <h3 className="font-semibold mb-2 text-white">Mis Proyectos (Colaborador)</h3>
          <p className="text-sm text-gray-400">
            Aún no formas parte de ningún proyecto.<br />
            pide acceso a un administrador.
          </p>
        </div>
      </div>


      <div>
        <hr className="border-t border-[#7c2ae8] opacity-40 my-6" />
        <footer className="text-xs text-gray-500">
          <div className="mb-2">&copy; 2025 AtlasCo.</div>
          <div>
            <Link
              to="/terminos"
              className="underline hover:text-[#7c2ae8]"
            >
              Términos y Condiciones
            </Link>
            {" y "}
            <Link
              to="/politica-de-privacidad"
              className="underline hover:text-[#7c2ae8]"
            >
              Políticas de Privacidad
            </Link>
          </div>
          <div>
            <a href="#" className="underline hover:text-[#7c2ae8]">Acerca de nosotros</a>
          </div>
        </footer>
      </div>

    
      <ModalNuevoProyecto
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </aside>
  );
};

export default Sidebar;