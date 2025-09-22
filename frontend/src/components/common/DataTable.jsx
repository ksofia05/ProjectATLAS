import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Input from "./Input";
import DropdownMenu from "./DropdownMenu";
import CustomScrollSelect from "./CustomScrollSelect";
import Loader from "./Loader";


const DataTable = ({
  title,
  data = [],
  columns = [],
  loading = false,
  searchTerm = "",
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filters = [],
  selectedFilter = "",
  onFilterChange,
  exportOptions = [],
  onExport,
  rowsPerPage = 10,
  onRowsPerPageChange,
  rowsPerPageOptions = [10, 20, 30, 40, 50, "Todos"],
  onRowClick,
  extraActions = null,
  loadingText = "Cargando datos...",
  emptyMessage = "No hay datos disponibles",
  className = "",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const filteredData = rowsPerPage === "Todos"
  ? data
  : data.slice(startIdx, startIdx + rowsPerPage);
  const location = useLocation();
  

  // Detectar la ruta actual para mostrar columnas específicas
  const isColaboradoresRoute = location.pathname.includes('/colaboradores');
  const isInventarioRoute = location.pathname.includes('/inventario');

  // Configurar columnas móviles según la ruta

  const getMobileColumns = () => {
    if (isColaboradoresRoute) {
      return {
        headers: ["Nombre", "Apellido", "Correo", "Estado"],
        keys: ["nombre", "apellido", "correo", "estado"],
        gridCols: "grid-cols-4"
      };
    } else {
      // Para inventario y otras rutas (por defecto)
      return {
        headers: ["Equipo", "Nombre", "Estado"],
        keys: ["equipo", "nombre", "estado"],
        gridCols: "grid-cols-3"
      };
    }
  };

  const mobileConfig = getMobileColumns();

  return (
    <div
      className={`bg-gradient-to-r from-[#14141e] to-[#14141e] via-[#181825] border border-slate-700/50 rounded-3xl p-4 sm:p-5 md:p-6 w-full text-white shadow-lg mt-0 flex flex-col h-[calc(100vh-6rem)] max-h-[calc(100vh-6rem)] min-h-96 ${className}`}
    >
      {/* Controles fijos en la parte superior */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3 sm:mb-4 gap-3 sm:gap-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {extraActions}
          {exportOptions.length > 0 && (
            <DropdownMenu
              buttonLabel="Exportar"
              options={exportOptions}
              onSelect={(option) => onExport(option, filteredData)} 
              buttonClassName="px-3 sm:px-4 md:px-5 py-2 font-semibold text-sm sm:text-base hover:shadow shadow-[#8d49e7]"
              icon={<i className="bi bi-download mr-2"></i>}
            />
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-2 sm:mt-4 lg:mt-0">
          <Input
            type="text"
            name="search"
            placeholder={searchPlaceholder}
            icon="bi-search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            inputClassName="bg-[#232336] text-gray-200 rounded-xl px-3 py-2 pl-4 pr-10 h-10 w-full sm:w-64 md:w-72 focus:outline-none border border-[#232336] focus:border-violet-400 transition placeholder:text-gray-400"
            containerClassName="mb-0"
          />
          {filters.length > 0 && (
            <DropdownMenu
              buttonLabel="Estado"
              options={filters}
              onSelect={onFilterChange}
              buttonClassName="px-3 sm:px-4 py-2 font-semibold hover:shadow shadow-[#8d49e7] text-sm sm:text-base flex items-center gap-2 justify-center"
            />
          )}
        </div>
      </div>

      {/* Contenedor de tabla con scroll */}
      <div className="flex-1 overflow-hidden rounded-xl border border-gray-600 flex flex-col">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader text={loadingText} />
          </div>
        ) : data.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400 text-base sm:text-lg">{emptyMessage}</p>
          </div>
        ) : (
          <>
            {/* Vista móvil - Columnas dinámicas según la ruta */}
            <div className="sm:hidden flex flex-col h-full">
              {/* Header móvil dinámico */}
              <div className="bg-[#1a1a2e] border-b-2 border-purple-500/30 flex-shrink-0">
                <div className={`${mobileConfig.gridCols} gap-1 py-3 px-2`}>
                  {mobileConfig.headers.map((header, idx) => (
                    <div key={idx} className="font-bold text-gray-200 text-xs uppercase tracking-wide text-center">
                      {header}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Contenido móvil con scroll */}
              <div className="flex-1 overflow-y-auto">
                {filteredData.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className={`${mobileConfig.gridCols} gap-1 py-3 px-2 border-b border-gray-700/50 hover:bg-purple-500/10 transition-all duration-200 cursor-pointer`}
                    onClick={() => onRowClick && onRowClick(item, idx)}
                  >
                    {mobileConfig.keys.map((key, colIdx) => {
                      const column = columns.find(col => col.key === key);
                      return (
                        <div key={colIdx} className="text-center text-xs">
                          {column?.render 
                            ? column.render(item, idx)
                            : item[key] || item[getAlternativeKey(key)] || "N/A"
                          }
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Vista desktop - Tabla completa */}
            <div className="hidden sm:flex flex-col h-full">
              {/* Contenido del panel con scroll independiente */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-subtle z-0">
             <table className="min-w-full text-center table-fixed z-0">
             <colgroup>
             {columns.map((col, idx) => (
             <col key={idx} style={{ width: col.width }} />
         ))}
             </colgroup>
             <thead>
            <tr>
             {columns.map((col, idx) => (
             <th
             key={idx}
             className="py-3 px-4 font-bold text-gray-200 text-sm uppercase tracking-wide bg-[#1a1a2e] sticky top-0 z-10"
            >
              {col.label}
          </th>
        ))}
           </tr>
         </thead>
             <tbody>
              {filteredData.map((item, idx) => (
             <tr
              key={item.id || idx}
              className="border-b-2 border-[#232336] hover:bg-purple-500/10 transition-all duration-200 cursor-pointer"
             onClick={() => onRowClick && onRowClick(item, idx)}
        >
               {columns.map((col, colIdx) => (
             <td key={colIdx} className="py-2 px-4">
               {col.render ? col.render(item, idx) : item[col.key]}
            </td>
          ))}
        </tr>
      ))}
             </tbody>
       </table>
  </div>
              

            </div>
          </>
        )}
      </div>

      {/* Controles de paginación fijos en la parte inferior */}
      <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-end text-gray-400 text-xs sm:text-sm gap-2 sm:gap-4 flex-shrink-0 pb-2 mt-2">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2">
          <span className="text-center sm:text-left">
            <span className="hidden sm:inline">Visualizando: </span>
            {filteredData.length} de {data.length} {title.toLowerCase()}
          </span>
          <CustomScrollSelect
            value={rowsPerPage}
            options={rowsPerPageOptions}
            onChange={onRowsPerPageChange}
          />
        </div>
      </div>
    </div>
  );
};

// Función helper para claves alternativas
const getAlternativeKey = (key) => {
  const alternatives = {
    'equipo': 'tipo',
    'nombre': 'cliente',
    'correo': 'email'
  };
  return alternatives[key] || key;
};

export default DataTable;