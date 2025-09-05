import React from "react";
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
  rowsPerPageOptions = [10, 20, 30, 40, 50],
  onRowClick,
  extraActions = null,
  loadingText = "Cargando datos...",
  emptyMessage = "No hay datos disponibles",
  className = "",
}) => {
  const filteredData = data.slice(0, rowsPerPage);

  return (
    <div
      className={`bg-gradient-to-r from-[#14141e] to-[#14141e] via-[#181825] border border-slate-700/50 rounded-3xl p-6 w-full text-white shadow-lg mt-0 flex flex-col flex-1 min-h-0`}
      style={{ maxHeight: "calc(100vh - 180px)" }}
    >
      {/* Controles fijos en la parte superior */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4 flex-shrink-0">
        <div className="flex gap-3">
          {extraActions}
          {exportOptions.length > 0 && (
            <DropdownMenu
              buttonLabel="Exportar"
              options={exportOptions}
              onSelect={onExport}
              buttonClassName="px-5 py-2 font-semibold text-base hover:shadow shadow-[#8d49e7]"
              icon={<i className="bi bi-download mr-2"></i>}
            />
          )}
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Input
            type="text"
            name="search"
            placeholder={searchPlaceholder}
            icon="bi-search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            inputClassName="bg-[#232336] text-gray-200 rounded-xl px-3 py-2 pl-4 pr-10 h-10 w-72 focus:outline-none border border-[#232336] focus:border-violet-400 transition placeholder:text-gray-400"
            containerClassName="mb-0"
          />
          {filters.length > 0 && (
            <DropdownMenu
              buttonLabel="Estado"
              options={filters}
              onSelect={onFilterChange}
              buttonClassName="px-4 py-2 font-semibold hover:shadow shadow-[#8d49e7] text-base flex items-center gap-2"
            />
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-600 flex-1 min-h-0 flex flex-col">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader text={loadingText} />
          </div>
        ) : data.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400 text-lg">{emptyMessage}</p>
          </div>
        ) : (
          <>
            {/* Header o titulos fijos para no ser afectados por el scroll */}
            <div className="bg-[#1a1a2e] border-b-2 border-purple-500/30">
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
                        className="py-3 px-4 font-bold text-gray-200 text-sm uppercase tracking-wide"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
              </table>
            </div>

            {/* Contenido del panel con scroll independiente */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-subtle">
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
                      className="border-b border-gray-700/50 hover:bg-purple-500/10 transition-all duration-200 cursor-pointer"
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
          </>
        )}
      </div>

      {/* Controles de paginación fijos en la parte inferior */}
      <div className="flex items-center justify-end text-gray-400 text-sm gap-4 flex-shrink-0 pb-2">
        <div className="flex items-center gap-2">
          <span>
            Visualizando: {filteredData.length} de {data.length}{" "}
            {title.toLowerCase()}
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

export default DataTable;
