import React from 'react';
import Input from '../common/Input';
import { openDashboardIfActive } from "../../utils/openDashboardIfActive";
import useUserStore from "../../stores/useUserStore";
import { showLoadingToast } from "../common/popUp/Loading";

const Searchbar = ({
  placeholder = "Buscar...",
  searchTerm,
  setSearchTerm,
  filteredProjects = [],
}) => {
  const user = useUserStore((state) => state.user);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleProjectClick = async (project) => {
    //Solo los colaboradores se les valida el acceso
    if (user?.rol_idrol === 1 || user?.rol_idRol === 1) {
      window.open(`/dashboard/${project.id_proyecto}`, "_blank");
      return;
    }
    const toastId = showLoadingToast("Verificando acceso...");
    try {
      await openDashboardIfActive(project.id_proyecto, user, toastId); 
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="relative w-fit">
      <Input
        type="text"
        name="search"
        label=""
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder={placeholder}
        icon="bi-search"
        containerClassName="mb-0"
        inputClassName="bg-[#232336] text-gray-200 rounded-xl px-3 py-2 pl-4 pr-10 h-10 w-72 focus:outline-none border border-[#232336] focus:border-violet-400 transition placeholder:text-gray-400"
        autoComplete="off"
      />
      {searchTerm && filteredProjects.length > 0 && (
        <div
          className="absolute z-10 w-full bg-[#232336] border border-[#7c2ae8] rounded-b-xl mt-1 max-h-60 overflow-y-auto shadow-lg"
        >
          {filteredProjects.map((project) => (
            <div
              key={project.id_proyecto}
              className="px-4 py-2 hover:bg-[#2d2d44] cursor-pointer text-white"
              onClick={() => handleProjectClick(project)}
            >
              {project.nombreproyecto}
            </div>
          ))}
        </div>
      )}
      {searchTerm && filteredProjects.length === 0 && (
        <div
          className="absolute z-10 w-full bg-[#232336] border border-[#7c2ae8] rounded-b-xl mt-1 px-4 py-2 text-gray-400"
        >
          Sin resultados
        </div>
      )}
    </div>
  );
};

export default Searchbar;