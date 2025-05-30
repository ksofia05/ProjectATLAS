import React from 'react';
import Input from '../common/Input';

const Searchbar = ({ placeholder = "Buscar...", searchTerm, setSearchTerm, filteredProjects }) => {
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="searchContainer" style={{ position: "relative" }}>
            <Input
                type="text"
                name="search"
                label=""
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={placeholder}
                icon="bi-search"
                containerClassName="mb-0"
                inputClassName="rounded=full py-1 h-8 text-sm"
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
                            onClick={() => window.open(`/dashboard/${project.id_proyecto}`, '_blank')}
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