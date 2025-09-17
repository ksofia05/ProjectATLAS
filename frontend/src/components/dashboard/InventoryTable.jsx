import React, { useEffect, useState } from "react";
import { client as supabase } from "../../supabase/client";
// filepath: c:\Users\Milton\Desktop\project-Atlas\ProjectATLAS\frontend\src\components\dashboard\InventoryTable.jsx
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DropdownMenu from "../common/DropdownMenu"; 
import DataTable from "../common/DataTable";
import ButtonGrey from "../common/ButtonGrey";
import RegisterClientDrawer from "./RegisterClientDrawer";
import { useAuth } from "../../context/AuthProvider";
import useClientsStore from "../../stores/useClientsStore";
import EditClientDrawer from "./EditClientDrawer";

export default function InventoryTable({ onEmojiClick }) {
  const { user, userProfile, isLoading } = useAuth();
  // Estados del store
  const {
    clientes,
    loading,
    error,
    usuarioIdActual,
    idProyecto,
    initialized,
    fetchClientes,
    getClientesFiltrados,
    refreshClientes,
    shouldRefresh,
  } = useClientsStore();
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [refreshFlag, setRefreshFlag] = useState(0); // Nuevo estado
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);


  useEffect(() => {
    if (isLoading || !user) return;

    const email = user?.email || user?.user_metadata?.email;
    if (!email) return;

    // Si no está inicializado o necesita refresh, cargar datos
    if (!initialized || shouldRefresh()) {
      console.log('Cargando clientes...');
      fetchClientes(email);
    }
  }, [user, isLoading, initialized, fetchClientes, shouldRefresh]);

  // Función para manejar cuando se agrega un nuevo cliente
  const handleClienteAdded = () => {
    console.log('Cliente agregado, cerrando drawer');
    setShowDrawer(false);
  };

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

  //  Obtener clientes filtrados usando el selector del store
  const clientesFiltrados = getClientesFiltrados(estadoSeleccionado, searchTerm);

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
             {
    key: "descargar",
    label: "",
    width: "6%",
    render: (item) => (
      <div className="flex gap-2 justify-center">
        {/* Icono de descarga */}
        <DropdownMenu
          buttonLabel={<i className="bi bi-download text-xl text-purple-400 hover:text-purple-600 cursor-pointer"></i>}
          options={[
            { label: "Exportar PDF", value: "pdf" },
            { label: "Exportar Excel", value: "excel" },
          ]}
          onSelect={(value) => handleExportAgendamientos(item, value)}
          buttonClassName="p-2"
        />
        {/* Icono de editar */}
        <button
          className="text-purple-400 hover:text-purple-600 p-2"
          title="Editar cliente"
          onClick={() => {
            setClienteEditando(item);
            setShowEditDrawer(true);
          }}
        >
          <i className="bi bi-pencil-square text-xl"></i>
        </button>
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

  //  Función para reintentar carga de datos
  const handleRetry = () => {
    const email = user?.email || user?.user_metadata?.email;
    if (email) {
      console.log('Reintentando cargar clientes...');
      refreshClientes(email);
    }
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

  //  Manejo de errores mejorado
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <p className="text-lg font-semibold mb-2">Error al cargar clientes</p>
        <p className="text-sm mb-4">{error}</p>
        <button
          className="bg-purple-800 hover:bg-purple-900 text-white px-4 py-2 rounded-lg transition-colors"
          onClick={handleRetry}
        >
          Reintentar carga
        </button>
      </div>
    );
  }
  // ...existing code...
const handleExportAgendamientos = async (cliente, formato) => {
  // 1. Obtener los agendamientos del cliente
  const { data: agendamientos, error } = await supabase
    .from("Agendamiento")
    .select("idAgendamiento")
    .eq("Cliente_dni", cliente.dni);

  if (error || !agendamientos || agendamientos.length === 0) {
    alert("No se pudieron obtener los agendamientos");
    return;
  }

  const idsAgendamiento = agendamientos.map(a => a.idAgendamiento);

  // 2. Obtener los equipos agendados con los datos necesarios
  const { data: equipoAgs, error: errorEqAg } = await supabase
    .from("EquipoAgendamiento")
    .select("equipo_numeroSerie, fechaIngreso, comentarioEntrada, comentarioSalida, fechaSalida")
    .in("agendamiento_idAgendamiento", idsAgendamiento);

  if (errorEqAg || !equipoAgs || equipoAgs.length === 0) {
    alert("No hay equipos agendados para este cliente");
    return;
  }

  // 3. Exportar según el formato
  if (formato === "excel") {
    const ws = XLSX.utils.json_to_sheet(
      equipoAgs.map((item) => ({
        "No. Serie": item.equipo_numeroSerie,
        "Ingreso": item.fechaIngreso,
        "Salida": item.fechaSalida || "No hay salida aún",
        "Comentario entrada": item.comentarioEntrada || "",
        "Comentario salida": item.comentarioSalida || "",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Agendamientos");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `agendamientos_${cliente.nombre}.xlsx`);
  } else if (formato === "pdf") {
    const doc = new jsPDF();
    doc.text(`Agendamientos de ${cliente.nombre}`, 14, 10);
    autoTable(doc, {
      head: [["No. Serie", "Ingreso", "Salida", "Comentario entrada", "Comentario salida"]],
      body: equipoAgs.map((item) => [
        item.equipo_numeroSerie,
        item.fechaIngreso,
        item.fechaSalida || "No hay salida aún",
        item.comentarioEntrada || "",
        item.comentarioSalida || "",
      ]),
      startY: 20,
    });
    doc.save(`agendamientos_${cliente.nombre}.pdf`);
  }
};
// ...existing code...

  return (
    <div className="flex flex-col flex-1 min-h-0">
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
        rowsPerPageOptions={[10, 20, 30, 40, 50, "Todos"]}
        extraActions={extraActions}
        loadingText="Actualizando clientes..."
        emptyMessage="No hay clientes disponibles"
      />

      <RegisterClientDrawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        onClienteAdded={handleClienteAdded}
        idproyecto={idProyecto}
        usuarioIdActual={usuarioIdActual}
      />
    <EditClientDrawer
    open={showEditDrawer}
    onClose={() => {
      setShowEditDrawer(false);
      setClienteEditando(null);
    }}
    cliente={clienteEditando}
    idProyecto={idProyecto}
    usuarioIdActual={usuarioIdActual}
    onClienteEdited={handleClienteAdded}
  />
       
    </div>
  );
}