import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import Input from "../common/Input";
import DropdownMenu from "../common/DropdownMenu";
import ButtonGrey from "../common/ButtonGrey"; 
import RegisterClientDrawer from "./RegisterClientDrawer";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

// Puedes reutilizar CustomScrollSelect si lo tienes, si no, usa un <select> simple
import CustomScrollSelect from "../common/CustomScrollSelect";

export default function InventoryTable({ onEmojiClick }) {
  const { user, isLoading } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);

  // Estados para pasar a RegisterClientDrawer
  const [usuarioIdActual, setUsuarioIdActual] = useState(null);
  const [idProyecto, setIdProyecto] = useState(null);

  // Paginado
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const opcionesFilas = [10, 20, 30, 40, 50];

  useEffect(() => {
    if (isLoading || !user) return;

    const fetchClientes = async () => {
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
      }
    };

    fetchClientes();
  }, [user, isLoading]);

  const opcionesEstado = [
    { label: "Todos", value: "todos" },
    { label: "Activo", value: "Activo" },
    { label: "Inactivo", value: "Inactivo" },
  ];

  const opcionesExportar = [
    { label: "Excel", value: "excel" },
    { label: "PDF", value: "pdf" },
  ];

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

  const clientesFiltrados = clientes.filter(
    (item) =>
      (estadoSeleccionado === "todos" || item.estado === estadoSeleccionado) &&
      (
        (item.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.apellido?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.correo?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      )
  );

  // Paginado real
  const clientesMostrados = clientesFiltrados.slice(0, rowsPerPage);

  return (
    <div className="bg-gradient-to-r from-[#181825] to-[#232335] rounded-3xl p-8 w-full text-white shadow-lg border border-gray-700 mt-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex gap-3">
          <ButtonGrey
            className="bg-purple-800 hover:bg-purple-900 text-white font-semibold px-6 py-2 rounded-xl shadow transition w-fit"
            onClick={() => setShowDrawer(true)}
          >
            + Agregar nuevo equipo
          </ButtonGrey>
          <DropdownMenu
            buttonLabel="Exportar"
            options={opcionesExportar}
            onSelect={(value) => {
              if (value === "excel") exportToExcel(clientesFiltrados);
              if (value === "pdf") exportToPDF(clientesFiltrados);
            }}
            buttonClassName="px-5 py-2 font-semibold text-base hover:shadow shadow-[#8d49e7]"
            icon={<i className="bi bi-download mr-2"></i>}
          />
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Input
            type="text"
            name="search"
            placeholder="Buscar cliente..."
            icon="bi-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            inputClassName="bg-[#232336] text-gray-200 rounded-xl px-3 py-2 pl-4 pr-10 h-10 w-72 focus:outline-none border border-[#232336] focus:border-violet-400 transition placeholder:text-gray-400"
            containerClassName="mb-0"
          />
          <DropdownMenu
            buttonLabel="Estado"
            options={opcionesEstado}
            onSelect={setEstadoSeleccionado}
            buttonClassName="px-4 py-2 font-semibold hover:shadow shadow-[#8d49e7] text-base flex items-center gap-2"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center">
          <thead>
            <tr className="border-b border-[#232336]">
              <th className="py-2 px-3 font-semibold text-center">Equipo</th>
              <th className="py-2 px-3 font-semibold text-center">Nombre</th>
              <th className="py-2 px-3 font-semibold text-center">Apellido</th>
              <th className="py-2 px-3 font-semibold text-center">Correo</th>
              <th className="py-2 px-3 font-semibold text-center">Teléfono</th>
              <th className="py-2 px-3 font-semibold text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {clientesMostrados.map((item, idx) => (
              <tr key={item.correo + idx} className="border-b border-[#232336] hover:bg-[#232336]/40 transition">
                <td className="py-2 px-3 text-center text-2xl cursor-pointer" onClick={() => onEmojiClick?.(item)}>💻</td>
                <td className="py-2 px-3 text-center">{item.nombre}</td>
                <td className="py-2 px-3 text-center">{item.apellido}</td>
                <td className="py-2 px-3 text-center">{item.correo}</td>
                <td className="py-2 px-3 text-center">{item.telefono}</td>
                <td className="py-2 px-3 flex items-center gap-2 justify-center">
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
                        ? "w-3 h-3 ml-7 rounded-full bg-green-500 inline-block"
                        : "w-3 h-3 ml-4 rounded-full bg-red-500 inline-block"
                    }
                  ></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end mt-4 text-gray-400 text-sm gap-4">
        <div className="flex items-center gap-2">
          <span>
            Visualizando: {clientesMostrados.length} de {clientesFiltrados.length} clientes
          </span>
          <CustomScrollSelect
            value={rowsPerPage}
            options={opcionesFilas}
            onChange={setRowsPerPage}
          />
        </div>
      </div>

      <RegisterClientDrawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        idproyecto={idProyecto}
        usuarioIdActual={usuarioIdActual}
      />
    </div>
  );
}