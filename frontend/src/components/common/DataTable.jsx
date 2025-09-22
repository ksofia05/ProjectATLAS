import React from "react";
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
  const filteredData = data.slice(0, rowsPerPage);
  const location = useLocation();

  // Detectar la ruta actual para mostrar columnas específicas
  const isColaboradoresRoute = location.pathname.includes("/colaboradores");
  const isInventarioRoute = location.pathname.includes("/inventario");

  // Configurar columnas móviles según la ruta
  const getMobileColumns = () => {
    if (isColaboradoresRoute) {
      return {
        headers: ["Nombre", "Apellido", "Correo", "Estado"],
        keys: ["nombre", "apellido", "correo", "estado"],
        gridCols: "grid-cols-4",
      };
    } else {
      // Para inventario y otras rutas (por defecto)
      return {
        headers: ["Equipo", "Nombre", "Estado"],
        keys: ["equipo", "nombre", "estado"],
        gridCols: "grid-cols-3",
      };
    }
  };

  const mobileConfig = getMobileColumns();

  return (
    <div
      className={`bg-gradient-to-br from-[#08080e]/95 to-[#0c0c14]/95 via-[#0a0a12]/95 backdrop-blur-md border border-slate-800/40 rounded-3xl p-4 sm:p-5 md:p-6 w-full text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 mt-0 flex flex-col h-[calc(100vh-6rem)] max-h-[calc(100vh-6rem)] min-h-96 ${className}`}
    >
      {/* Controles fijos en la parte superior */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3 sm:mb-4 gap-3 sm:gap-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {extraActions}
          {exportOptions.length > 0 && (
            <DropdownMenu
              buttonLabel="Exportar"
              options={exportOptions}
              onSelect={onExport}
              buttonClassName="px-4 py-2.5 font-medium text-sm bg-slate-800/50 hover:bg-slate-700/60 text-gray-300 hover:text-white rounded-xl border border-slate-700/50 hover:border-slate-600/60 transition-all duration-200"
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
            inputClassName="bg-slate-800/50 text-gray-300 rounded-xl px-4 py-2.5 pl-4 pr-10 h-11 w-full sm:w-64 md:w-72 focus:outline-none border border-slate-700/50 focus:border-slate-600/60 hover:border-slate-600/40 transition-all duration-200 placeholder:text-gray-500"
            containerClassName="mb-0"
          />
          {filters.length > 0 && (
            <DropdownMenu
              buttonLabel="Estado"
              options={filters}
              onSelect={onFilterChange}
              align="right"
              buttonClassName="px-4 py-2.5 font-medium text-sm bg-slate-800/50 hover:bg-slate-700/60 text-gray-300 hover:text-white rounded-xl border border-slate-700/50 hover:border-slate-600/60 transition-all duration-200"
            />
          )}
        </div>
      </div>

      {/* Contenedor de tabla con scroll */}
      <div className="flex-1 overflow-hidden rounded-2xl border border-slate-700/40 flex flex-col backdrop-blur-sm">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader text={loadingText} />
          </div>
        ) : data.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-3 opacity-50">👥</div>
              <p className="text-gray-400 text-base sm:text-lg font-medium">
                {emptyMessage}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Invita colaboradores para comenzar
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Vista móvil - Columnas dinámicas según la ruta */}
            <div className="sm:hidden flex flex-col h-full">
              {/* Header móvil dinámico */}
              <div className="bg-slate-800/40 backdrop-blur-sm border-b border-slate-700/50 flex-shrink-0">
                <div className={`${mobileConfig.gridCols} gap-1 py-3 px-2`}>
                  {mobileConfig.headers.map((header, idx) => (
                    <div
                      key={idx}
                      className="font-bold text-purple-300 text-xs uppercase tracking-wide text-center"
                    >
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
                    className={`${mobileConfig.gridCols} gap-1 py-3 px-2 border-b border-slate-700/30 hover:bg-slate-700/20 transition-all duration-200 cursor-pointer`}
                    onClick={() => onRowClick && onRowClick(item, idx)}
                  >
                    {mobileConfig.keys.map((key, colIdx) => {
                      const column = columns.find((col) => col.key === key);
                      return (
                        <div key={colIdx} className="text-center text-xs">
                          {column?.render
                            ? column.render(item, idx)
                            : item[key] ||
                              item[getAlternativeKey(key)] ||
                              "N/A"}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Vista desktop - Tabla completa */}
            <div className="hidden sm:flex flex-col h-full">
              {/* Header desktop */}
              <div className="bg-slate-800/40 backdrop-blur-sm border-b border-slate-700/50 flex-shrink-0">
                <table className="w-full text-center table-fixed">
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
                          className="py-2 sm:py-3 px-2 sm:px-3 md:px-4 font-bold text-purple-300 text-xs sm:text-sm uppercase tracking-wide"
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                </table>
              </div>

              {/* Contenido desktop con scroll */}
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-center table-fixed">
                  <colgroup>
                    {columns.map((col, idx) => (
                      <col key={idx} style={{ width: col.width }} />
                    ))}
                  </colgroup>
                  <tbody>
                    {filteredData.map((item, idx) => (
                      <tr
                        key={item.id || idx}
                        className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-all duration-200 cursor-pointer group"
                        onClick={() => onRowClick && onRowClick(item, idx)}
                      >
                        {columns.map((col, colIdx) => (
                          <td
                            key={colIdx}
                            className="py-3 px-2 sm:px-3 md:px-4 text-xs sm:text-sm text-gray-200 group-hover:text-white transition-colors"
                          >
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

      {/* Controles de paginación */}
      <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-end text-gray-400 text-xs sm:text-sm gap-2 sm:gap-4 flex-shrink-0 pb-2 mt-3">
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

const getAlternativeKey = (key) => {
  const alternatives = {
    equipo: "tipo",
    nombre: "cliente",
    correo: "email",
  };
  return alternatives[key] || key;
};

export default DataTable;
