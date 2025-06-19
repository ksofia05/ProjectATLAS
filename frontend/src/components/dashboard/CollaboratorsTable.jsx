import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import CustomScrollSelect from "../common/CustomScrollSelect";
import Input from "../common/Input";
import DropdownMenu from "../common/DropdownMenu";
import Switch from "../common/Switch";
import { useAuth } from "../../hooks/useAuth";

import axios from "axios";
import { useEffect } from "react";

export default function CollaboratorsTable() {
  const { user } = useAuth();
  const [colaboradores, setColaboradores] = React.useState([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = React.useState("todos");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    const fetchProyectos = async () => {
      const email = user?.email || user?.user_metadata?.email;
      try {
        // 1. Obtener el usuario por su correo
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
      }
    };

    if (user) {
      fetchProyectos();
    }
  }, [user]);

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
      head: [["Nombre", "Apellido", "Correo", "Estado"]],
      body: data.map((c) => [
        c.nombre,
        c.apellido,
        c.correo,
        c.estado,
      ]),
      startY: 20,
    });
    doc.save("colaboradores.pdf");
  };

  const handleSwitch = async (idx) => {
    const colaborador = colaboradoresFiltrados[idx];
    const nuevoEstado = colaborador.estado === "Activo" ? "Inactivo" : "Activo";

    try {
      // Esto lo cambia anny jiji
      await axios.patch(
        `http://localhost:8000/tasks/api/v1/usuarios/${colaborador.id}/estado/`,
        { estado: nuevoEstado }
      );

      // Actualiza en el estado local
      setColaboradores((prev) =>
        prev.map((c, i) =>
          c.id === colaborador.id ? { ...c, estado: nuevoEstado } : c
        )
      );
    } catch (error) {
      alert("Hubo un error al cambiar el estado del colaborador.");
    }
  };

  // Aqui se fultra por el estado y la busqueda
  const colaboradoresFiltrados = colaboradores
    .filter((c) =>
      estadoSeleccionado === "todos"
        ? true
        : c.estado?.toLowerCase() === estadoSeleccionado
    )
    .filter((c) =>
      c.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const colaboradoresMostrados = colaboradoresFiltrados.slice(0, rowsPerPage);

  // Generar opciones del 1 al 50
  const opcionesFilas = Array.from({ length: 50 }, (_, i) => i + 1);

  return (
    <div className="bg-gradient-to-r from-[#181825] to-[#232335] rounded-3xl p-8 w-full text-white shadow-lg border border-gray-700 mt-4">
      <div className="flex items-center justify-between mb-6 flex-wrap">
        <div>
          <DropdownMenu
            buttonLabel="Exportar"
            options={opcionesExportar}
            onSelect={(value) => {
              if (value === "excel") exportToExcel(colaboradoresFiltrados);
              if (value === "pdf") exportToPDF(colaboradoresFiltrados);
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
              placeholder="Buscar colaborador..."
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
              <th className="py-2 px-3 font-semibold text-center">Nombre</th>
              <th className="py-2 px-3 font-semibold text-center">Apellido</th>
              <th className="py-2 px-3 font-semibold text-center">Correo</th>
              <th className="py-2 px-3 font-semibold text-center">Estado</th>
              <th className="py-2 px-3 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {colaboradoresMostrados.map((c, idx) => (
              <tr
                key={c.nombre + c.apellido + c.correo}
                className="border-b border-[#232336] hover:bg-[#232336]/40 transition"
              >
                <td className="py-2 px-3 text-gray-200 text-center">{c.nombre}</td>
                <td className="py-2 px-3 text-center">{c.apellido}</td>
                <td className="py-2 px-3 text-center">{c.correo}</td>
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
        <div className="flex items-center gap-2">
          <span>
            Visualizando: {colaboradoresMostrados.length} de {colaboradoresFiltrados.length} colaboradores
          </span>
          <CustomScrollSelect
            value={rowsPerPage}
            options={opcionesFilas}
            onChange={setRowsPerPage}
          />
        </div>
      </div>
    </div>
  );
}