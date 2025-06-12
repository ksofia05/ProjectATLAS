import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import Input from "../common/Input";
import DropdownMenu from "../common/DropdownMenu";
import Switch from "../common/Switch";

const colaboradoresInicial = [
  {
    nombre: "Karen Sofia",
    apellido: "Lizcano Torres",
    telefono: "305 364 3047",
    rol: "Colaborador",
    estado: "Activo",
  },
  {
    nombre: "Dilan Francisco",
    apellido: "Rojas Pinilla",
    telefono: "311 804 3208",
    rol: "Colaborador",
    estado: "Inactivo",
  },
  {
    nombre: "Daniel Orlando",
    apellido: "Velasquez Ramirez",
    telefono: "301 243 3967",
    rol: "Colaborador",
    estado: "Activo",
  },
  {
    nombre: "Juan David",
    apellido: "Garzon Sanchez",
    telefono: "310 589 2939",
    rol: "Colaborador",
    estado: "Activo",
  },
];

export default function CollaboratorsTable() {
  const [colaboradores, setColaboradores] = React.useState(colaboradoresInicial);
  const [estadoSeleccionado, setEstadoSeleccionado] = React.useState("todos");

  const opcionesEstado = [
    { label: "Todos", value: "todos", selected: estadoSeleccionado === "todos" },
    { label: "Activo", value: "activo", selected: estadoSeleccionado === "activo" },
    { label: "Inactivo", value: "inactivo", selected: estadoSeleccionado === "inactivo" },
  ];

  const opcionesExportar = [
    { label: "Excel", value: "excel" },
    { label: "PDF", value: "pdf" },
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
      head: [["Nombre", "Apellido", "Telefono", "Rol", "Estado"]],
      body: data.map((c) => [
        c.nombre,
        c.apellido,
        c.telefono,
        c.rol,
        c.estado,
      ]),
      startY: 20,
    });
    doc.save("colaboradores.pdf");
  };

  // Cambia el estado del colaborador (Activo/Inactivo)
  const handleSwitch = (idx) => {
    setColaboradores((prev) =>
      prev.map((c, i) =>
        i === idx
          ? { ...c, estado: c.estado === "Activo" ? "Inactivo" : "Activo" }
          : c
      )
    );
  };

  // El filtro cambia según el estado seleccionado (Eso lo revisa julian)
  const colaboradoresVisibles = colaboradores.filter((c) =>
    estadoSeleccionado === "todos"
      ? true
      : c.estado.toLowerCase() === estadoSeleccionado
  );

  return (
    <div className="bg-gradient-to-r from-[#181825] to-[#232335] rounded-3xl p-8 w-full text-white shadow-lg border border-gray-700 mt-4">
      <div className="flex items-center justify-between mb-6 flex-wrap">
        <div>
          <DropdownMenu
            buttonLabel="Exportar"
            options={opcionesExportar}
            onSelect={(value) => {
              if (value === "excel") exportToExcel(colaboradoresVisibles);
              if (value === "pdf") exportToPDF(colaboradoresVisibles);
            }}
            buttonClassName="px-5 py-2 font-semibold text-base"
            icon={<i className="bi bi-download mr-2"></i>}
          />
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="relative">
            <Input
              type="text"
              name="search"
              placeholder="Buscar colaborador..."
              icon="bi-search"
              inputClassName="bg-[#232336] text-gray-200 rounded-xl px-4 py-2 pl-10 focus:outline-none border border-[#232336] focus:border-violet-400 transition w-64"
              containerClassName="mb-0"
            />
          </div>
          <DropdownMenu
            buttonLabel="Estado"
            options={opcionesEstado}
            onSelect={setEstadoSeleccionado}
            buttonClassName="px-4 py-2 font-semibold text-base flex items-center gap-2"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-center">
          <thead>
            <tr className="border-b border-[#232336]">
              <th className="py-2 px-3 font-semibold text-center">Nombre</th>
              <th className="py-2 px-3 font-semibold text-center">Apellido</th>
              <th className="py-2 px-3 font-semibold text-center">Telefono</th>
              <th className="py-2 px-3 font-semibold text-center">Rol</th>
              <th className="py-2 px-3 font-semibold text-center">Estado</th>
              <th className="py-2 px-3 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {colaboradoresVisibles.map((c, idx) => (
              <tr
                key={c.nombre + c.apellido}
                className="border-b border-[#232336] hover:bg-[#232336]/40 transition"
              >
                <td className="py-2 px-3 text-gray-200 text-center">{c.nombre}</td>
                <td className="py-2 px-3 text-center">{c.apellido}</td>
                <td className="py-2 px-3 text-center">{c.telefono}</td>
                <td className="py-2 px-3 text-center">{c.rol}</td>
                <td className="py-2 px-3 flex items-center gap-4 justify-center">
                  <span
                    className={
                      c.estado === "Activo"
                        ? "text-green-400 font-semibold"
                        : "text-red-400 font-semibold"
                    }
                  >
                    {c.estado}
                  </span>
                  <Switch
                    checked={c.estado === "Activo"}
                    onChange={() => handleSwitch(idx)}
                  />
                </td>
                <td className="py-2 px-3 text-center"></td>
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
          1 - {colaboradoresVisibles.length} de {colaboradores.length}
        </div>
      </div>
    </div>
  );
}