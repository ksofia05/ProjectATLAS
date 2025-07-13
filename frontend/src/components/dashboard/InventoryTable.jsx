import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

import DataTable from "../common/DataTable";
import ButtonGrey from "../common/ButtonGrey";
import RegisterClientDrawer from "./RegisterClientDrawer";
import { useAuth } from "../../hooks/useAuth";

export default function InventoryTable({ onEmojiClick }) {
  const { user, isLoading } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [usuarioIdActual, setUsuarioIdActual] = useState(null);
  const [idProyecto, setIdProyecto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (isLoading || !user) return;

    const fetchClientes = async () => {
      setLoading(true);
      const email = user?.email || user?.user_metadata?.email;
      try {
        const usuarioRes = await axios.get(
          `http://localhost:8000/tasks/api/v1/usuarios/?correoelectronico=${email}`
        );
        const usuarioId = usuarioRes.data[0].idusuario;
        setUsuarioIdActual(usuarioId);

        const proyectosRes = await axios.get(
          `http://localhost:8000/tasks/api/v1/Proyecto/?id_usuario=${usuarioId}`
        );
        const proyectos = proyectosRes.data;

        if (proyectos.length === 0) {
          setClientes([]);
          setIdProyecto(null);
          setLoading(false);
          return;
        }

        const idProyecto = proyectos[0].id_proyecto;
        setIdProyecto(idProyecto);

        const clientesRes = await axios.get(
          `http://localhost:8000/tasks/api/v1/clientes_por_proyecto/?id_proyecto=${idProyecto}`
        );

        setClientes(clientesRes.data.clientes);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
        setClientes([]);
        setIdProyecto(null);
        setUsuarioIdActual(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [user, isLoading]);

  // Exportar a Excel
  const exportToExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        Equipo: "💻",
        Nombre: item.nombre,
        Apellido: item.apellido,
        Correo: item.correo,
        Teléfono: item.telefono,
        Estado: item.estado,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clientes");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "clientes.xlsx");
  };

  // Exportar a PDF
  const exportToPDF = (data) => {
    const doc = new jsPDF();
    doc.text("Clientes", 14, 10);
    autoTable(doc, {
      head: [["Equipo", "Nombre", "Apellido", "Correo", "Teléfono", "Estado"]],
      body: data.map((item) => [
        "💻",
        item.nombre,
        item.apellido,
        item.correo,
        item.telefono,
        item.estado,
      ]),
      startY: 20,
    });
    doc.save("clientes.pdf");
  };

  // Filtrado de datos
  const clientesFiltrados = clientes.filter(
    (item) =>
      (estadoSeleccionado === "todos" || item.estado === estadoSeleccionado) &&
      ((item.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.apellido?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (item.correo?.toLowerCase() || "").includes(searchTerm.toLowerCase()))
  );

  // Configuración de columnas
  const columns = [
    {
      key: "equipo",
      label: "Equipo",
      width: "8%",
      render: (item) => (
        <i
          className="bi bi-laptop text-2xl text-gray-400 cursor-pointer hover:text-blue-400"
          onClick={() => onEmojiClick(item)}
        ></i>
      ),
    },
    {
      key: "nombre",
      label: "Nombre",
      width: "15%",
    },
    {
      key: "apellido",
      label: "Apellido",
      width: "15%",
    },
    {
      key: "correo",
      label: "Correo",
      width: "25%",
      render: (item) => (
        <a
          href={`mailto:${item.correo}`}
          className="text-violet-200 hover:underline"
        >
          {item.correo}
        </a>
      ),
    },
    {
      key: "telefono",
      label: "Teléfono",
      width: "18%",
    },
    {
      key: "estado",
      label: "Estado",
      width: "19%",
      render: (item) => (
        <div className="flex items-center justify-center gap-2">
          <span
            className={
              item.estado === "Activo"
                ? "text-green-400 font-semibold"
                : "text-red-400 font-semibold"
            }
          >
            {item.estado}
          </span>
          <span
            className={
              item.estado === "Activo"
                ? "w-3 h-3 rounded-full bg-green-500 inline-block"
                : "w-3 h-3 rounded-full bg-red-500 inline-block"
            }
          ></span>
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
      value: "Activo",
      selected: estadoSeleccionado === "Activo",
    },
    {
      label: "Inactivo",
      value: "Inactivo",
      selected: estadoSeleccionado === "Inactivo",
    },
  ];

  // Configuración de exportación
  const exportOptions = [
    { label: "Excel", value: "excel" },
    { label: "PDF", value: "pdf" },
  ];

  const handleExport = (value) => {
    if (value === "excel") exportToExcel(clientesFiltrados);
    if (value === "pdf") exportToPDF(clientesFiltrados);
  };

  // Botón de agregar cliente
  const extraActions = (
    <ButtonGrey
      className="bg-purple-800 hover:bg-purple-900 text-white font-semibold px-6 py-2 rounded-xl shadow transition w-fit"
      onClick={() => setShowDrawer(true)}
    >
      + Agregar nuevo equipo
    </ButtonGrey>
  );

  return (
    <>
      <DataTable
        title="clientes"
        data={clientesFiltrados}
        columns={columns}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar cliente..."
        filters={filters}
        selectedFilter={estadoSeleccionado}
        onFilterChange={setEstadoSeleccionado}
        exportOptions={exportOptions}
        onExport={handleExport}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        rowsPerPageOptions={[10, 20, 30, 40, 50]}
        extraActions={extraActions}
        loadingText="Cargando clientes..."
        emptyMessage="No hay clientes disponibles"
      />

      <RegisterClientDrawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        idproyecto={idProyecto}
        usuarioIdActual={usuarioIdActual}
      />
    </>
  );
}
