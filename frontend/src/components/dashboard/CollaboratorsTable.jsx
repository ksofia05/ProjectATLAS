import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import DataTable from "../common/DataTable";
import Switch from "../common/Switch";
import useCollaboratorsStore from "../../stores/useCollaboratorsStore";
import { showErrorToast, showSuccessToast } from "../common/popUp/Loading";
import { client as supabase } from "../../supabase/client";

export default function CollaboratorsTable() {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Obtener projectId directamente de la URL
  const { id: projectId } = useParams();

  const {
    collaborators,
    isLoading,
    fetchCollaborators,
    updateCollaboratorState,
  } = useCollaboratorsStore();

  //Estado para historial
  const [historialColaboradores, setHistorialColaboradores] = useState([]);

  // Solo cargar colaboradores si no están en cache
  useEffect(() => {
    if (projectId) {
      console.log("📊 CollaboratorsTable: Verificando colaboradores para proyecto", projectId);
      fetchCollaborators(projectId);

      (async () => {
        // Consulta historial de eliminados con JOIN a Usuario
        const { data, error } = await supabase
          .from("historial_colaboradores")
          .select(`
            usuario_id,
            estado,
            usuario:usuario_id (
              nombre,
              apellido,
              correoElectronico
            )
          `)
          .eq("proyecto_id", projectId)
          .eq("estado", "eliminado");

        if (error) {
          console.error("Error consultando historial_colaboradores:", error);
          setHistorialColaboradores([]);
          return;
        }

        const usuarios = (data || []).map((h) => ({
          id: h.usuario_id,
          nombre: h.usuario?.nombre ?? "(Sin datos)",
          apellido: h.usuario?.apellido ?? "(sin datos)",
          correo: h.usuario?.correoElectronico ?? "(sin datos)",
          estado: h.estado,
        }));
        setHistorialColaboradores(usuarios);
      })();
    }
  }, [projectId, fetchCollaborators]);


  // Manejo optimista del switch
  const handleSwitch = async (colaborador, idx) => {
    const nuevoEstado = colaborador.estado === "Activo" ? "Inactivo" : "Activo";

    try {
      await updateCollaboratorState(
        colaborador.id || colaborador.idusuario,
        nuevoEstado
      );
      showSuccessToast(`Colaborador ${nuevoEstado.toLowerCase()}`);
    } catch (error) {
      showErrorToast("Error al cambiar el estado del colaborador");
    }
  };
  const todosColaboradores = [
    ...collaborators, // activos/inactivos
    ...historialColaboradores // eliminados
  ];
  // Exportar a Excel
  const exportToExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Colaboradores");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "colaboradores.xlsx");
  };

  // Exportar a PDF
  const exportToPDF = (data) => {
    const doc = new jsPDF();
    doc.text("Colaboradores", 14, 10);
    autoTable(doc, {
      head: [["Nombre", "Apellido", "Correo", "Estado"]],
      body: data.map((c) => [c.nombre, c.apellido, c.correo, c.estado]),
      startY: 20,
    });
    doc.save("colaboradores.pdf");
  };

  // Filtrado de datos
  const colaboradoresFiltrados = todosColaboradores
    .filter((c) =>
      estadoSeleccionado === "todos"
        ? true
        : c.estado?.toLowerCase() === estadoSeleccionado
    )
    .filter((c) => c.nombre?.toLowerCase().includes(searchTerm.toLowerCase()));

  // Organización de columnas
  const columns = [
    {
      key: "nombre",
      label: "Nombre",
      width: "20%",
    },
    {
      key: "apellido",
      label: "Apellido",
      width: "20%",
    },
    {
      key: "correo",
      label: "Correo",
      width: "35%",
      render: (colaborador) => (
        <a
          href={`mailto:${colaborador.correo}`}
          className="text-violet-200 hover:underline"
        >
          {colaborador.correo}
        </a>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      width: "25%",
      render: (colaborador, idx) => {
        if (colaborador.estado === "eliminado") {
          return (
            <div className="flex items-center justify-center gap-2">
              <span className="text-purple-400 font-semibold">Eliminado</span>
              <button
                disabled
                className="w-5 h-5 rounded-full bg-purple-700 flex items-center justify-center "
              >
                <i className="bi bi-x text-gray-300"></i>
              </button>
            </div>
          );
        }
        return (
          <div className="flex items-center justify-center gap-2">
            <span
              className={
                colaborador.estado === "Activo"
                  ? "text-green-400 font-semibold"
                  : "text-red-400 font-semibold"
              }
            >
              {colaborador.estado}
            </span>
            <Switch
              checked={colaborador.estado === "Activo"}
              onChange={() => handleSwitch(colaborador, idx)}
            />
          </div>
        );
      },
    },
  ];

  // Configuración de filtros
  const filters = [
    {
      label: "Todos",
      value: "todos",
      selected: estadoSeleccionado === "todos",
    },
    {
      label: "Activo",
      value: "activo",
      selected: estadoSeleccionado === "activo",
    },
    {
      label: "Inactivo",
      value: "inactivo",
      selected: estadoSeleccionado === "inactivo",
    },
    {
      label: "Eliminado",
      value: "eliminado",
      selected: estadoSeleccionado === "eliminado",
    }
  ];

  // Configuración de exportación
  const exportOptions = [
    { label: "Excel", value: "excel" },
    { label: "PDF", value: "pdf" },
  ];

  const handleExport = (value) => {
    if (value === "excel") exportToExcel(colaboradoresFiltrados);
    if (value === "pdf") exportToPDF(colaboradoresFiltrados);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <DataTable
        title="colaboradores"
        data={colaboradoresFiltrados}
        columns={columns}
        loading={isLoading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar colaborador..."
        filters={filters}
        selectedFilter={estadoSeleccionado}
        onFilterChange={setEstadoSeleccionado}
        exportOptions={exportOptions}
        onExport={handleExport}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        rowsPerPageOptions={[10, 20, 30, 40, 50]}
        loadingText="Cargando colaboradores..."
        emptyMessage="No hay colaboradores disponibles"
      />
    </div>
  );
}
