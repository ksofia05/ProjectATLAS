import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

import DataTable from "../common/DataTable";
import Switch from "../common/Switch";
import { useAuth } from "../../hooks/useAuth";

export default function CollaboratorsTable() {
  const { user } = useAuth();
  const [colaboradores, setColaboradores] = useState([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProyectos = async () => {
      setLoading(true);
      const email = user?.email || user?.user_metadata?.email;
      try {
        // 1. Obtener el usuario por su correo (esto toca cambiarlo por culpa de anny)
        const usuarioResponse = await axios.get(
          `http://localhost:8000/tasks/api/v1/usuarios/?correoelectronico=${email}`
        );
        const usuarioDb = usuarioResponse.data[0];
        const usuarioId = usuarioDb.idusuario;

        // 2. Obtener los proyectos del usuario
        const proyectosResponse = await axios.get(
          `http://localhost:8000/tasks/api/v1/Proyecto/?id_usuario=${usuarioId}`
        );

        const proyectos = proyectosResponse.data;

        if (proyectos.length === 0) {
          setColaboradores([]);
          setLoading(false);
          return;
        }

        // Tomar el primer proyecto
        const idProyecto = proyectos[0].id_proyecto;

        // 3. Llamar al endpoint filtro_colaborador
        const colaboradoresResponse = await axios.get(
          `http://localhost:8000/tasks/api/v1/filtro_colaborador/?id_proyecto=${idProyecto}`
        );

        const data = colaboradoresResponse.data;
        setColaboradores(data.colaboradores);
      } catch (error) {
        setColaboradores([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProyectos();
    }
  }, [user]);

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

  const handleSwitch = async (colaborador, idx) => {
    const nuevoEstado = colaborador.estado === "Activo" ? "Inactivo" : "Activo";

    try {
      await axios.patch(
        `http://localhost:8000/tasks/api/v1/usuarios/${colaborador.id}/estado/`,
        { estado: nuevoEstado }
      );

      setColaboradores((prev) =>
        prev.map((c) =>
          c.id === colaborador.id ? { ...c, estado: nuevoEstado } : c
        )
      );
    } catch (error) {
      alert("Hubo un error al cambiar el estado del colaborador.");
    }
  };

  // Filtrado de datos
  const colaboradoresFiltrados = colaboradores
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
      render: (colaborador, idx) => (
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
      ),
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
    <DataTable
      title="colaboradores"
      data={colaboradoresFiltrados}
      columns={columns}
      loading={loading}
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
  );
}
