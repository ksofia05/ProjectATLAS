import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import Input from "../common/Input";
import DropdownMenu from "../common/DropdownMenu";
import ButtonGrey from "../common/ButtonGrey"; 
import RegisterClientDrawer from "./RegisterClientDrawer";

// Datos estáticos de inventario
const INVENTARIO = [
  {
    equipo: "💻",
    nombre: "Jose Jacobo",
    apellido: "Rojas Aponte",
    serie: "SN1234-5678-9101",
    ingreso: "2025-01-21",
    salida: "2025-01-23",
    estado: "Activo",
  },
  {
    equipo: "💻",
    nombre: "Dilan Francisco",
    apellido: "Rojas Pinilla",
    serie: "CP-2024-ABCD-1234-EFGH",
    ingreso: "2025-01-09",
    salida: "2025-02-24",
    estado: "Inactivo",
  },
  {
    equipo: "💻",
    nombre: "Daniel Orlando",
    apellido: "Velasquez Ramirez",
    serie: "TV2024-XYZ-0001",
    ingreso: "2025-02-11",
    salida: "2025-02-12",
    estado: "Activo",
  },
  {
    equipo: "💻",
    nombre: "Juan David",
    apellido: "Garzon Sanchez",
    serie: "REF-2023-AB1C2",
    ingreso: "2025-03-13",
    salida: "2025-02-12",
    estado: "Activo",
  },
];

export default function InventoryTable() {
  const [estadoSeleccionado, setEstadoSeleccionado] = React.useState("todos");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showDrawer, setShowDrawer] = React.useState(false);

  const opcionesEstado = [
    { label: "Todos", value: "todos", selected: estadoSeleccionado === "todos" },
    { label: "Activo", value: "Activo", selected: estadoSeleccionado === "Activo" },
    { label: "Inactivo", value: "Inactivo", selected: estadoSeleccionado === "Inactivo" },
  ];

  const opcionesExportar = [
    { label: "Excel", value: "excel" },
    { label: "PDF", value: "pdf" },
  ];

  // Exportar a Excel
  const exportToExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        Equipo: item.equipo,
        Nombre: item.nombre,
        Apellido: item.apellido,
        "No. Serie": item.serie,
        Ingreso: item.ingreso,
        Salida: item.salida,
        Estado: item.estado,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventario");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "inventario.xlsx");
  };

  // Exportar a PDF
  const exportToPDF = (data) => {
    const doc = new jsPDF();
    doc.text("Inventario", 14, 10);
    autoTable(doc, {
      head: [["Equipo", "Nombre", "Apellido", "No. Serie", "Ingreso", "Salida", "Estado"]],
      body: data.map((item) => [
        item.equipo,
        item.nombre,
        item.apellido,
        item.serie,
        item.ingreso,
        item.salida || "-",
        item.estado,
      ]),
      startY: 20,
    });
    doc.save("inventario.pdf");
  };

  // Filtrado por estado y búsqueda
  const inventarioFiltrado = INVENTARIO.filter(
    (item) =>
      (estadoSeleccionado === "todos" || item.estado === estadoSeleccionado) &&
      (
        (item.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.apellido?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.cliente?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.serie?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="bg-gradient-to-r from-[#181825] to-[#232335] rounded-3xl p-8 w-full text-white shadow-lg border border-gray-700 mt-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex gap-3">
          <ButtonGrey
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-xl shadow transition w-fit"
            onClick={() => setShowDrawer(true)}
          >
            + Agregar nuevo equipo
          </ButtonGrey>
          <DropdownMenu
            buttonLabel="Exportar"
            options={opcionesExportar}
            onSelect={(value) => {
              if (value === "excel") exportToExcel(inventarioFiltrado);
              if (value === "pdf") exportToPDF(inventarioFiltrado);
            }}
            buttonClassName="px-5 py-2 font-semibold text-base hover:shadow shadow-[#8d49e7]"
            icon={<i className="bi bi-download mr-2"></i>}
          />
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="relative">
            <Input
              type="text"
              name="search"
              placeholder="Buscar equipo..."
              icon="bi-search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              inputClassName="bg-[#232336] text-gray-200 rounded-xl px-3 py-2 pl-4 pr-10 h-10 w-72 focus:outline-none border border-[#232336] focus:border-violet-400 transition placeholder:text-gray-400"
              containerClassName="mb-0"
            />
          </div>
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
              <th className="py-2 px-3 font-semibold text-center">No. Serie</th>
              <th className="py-2 px-3 font-semibold text-center">Ingreso</th>
              <th className="py-2 px-3 font-semibold text-center">Salida</th>
              <th className="py-2 px-3 font-semibold text-center">Estado</th>
              <th className="py-2 px-3 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {inventarioFiltrado.map((item, idx) => (
              <tr
                key={item.serie + idx}
                className="border-b border-[#232336] hover:bg-[#232336]/40 transition"
              >
                <td className="py-2 px-3 text-center">{item.equipo}</td>
                <td className="py-2 px-3 text-center">{item.nombre}</td>
                <td className="py-2 px-3 text-center">{item.apellido}</td>
                <td className="py-2 px-3 text-center">{item.serie}</td>
                <td className="py-2 px-3 text-center">{item.ingreso}</td>
                <td className="py-2 px-3 text-center">{item.salida || "-"}</td>
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
                        ? "w-3 h-3 rounded-full bg-green-400 inline-block"
                        : "w-3 h-3 rounded-full bg-red-400 inline-block"
                    }
                  ></span>
                </td>
                <td className="py-2 px-3 text-center">
                  <button className="text-gray-300 hover:text-white">
                    <i className="bi bi-download"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end mt-4 text-gray-400 text-sm gap-4">
        <div>
          Paginado{" "}
          <select className="bg-[#232336] border border-[#232336] rounded px-2 py-1 text-gray-200 ml-1">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
        <div>
          1 - {inventarioFiltrado.length} de {INVENTARIO.length}
        </div>
      </div>
      <RegisterClientDrawer open={showDrawer} onClose={() => setShowDrawer(false)} />
    </div>
  );
}