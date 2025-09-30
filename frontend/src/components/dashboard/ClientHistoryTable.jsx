import React, { useEffect, useState } from "react";
import useClientsStore from "../../stores/useClientsStore";
import { useAuth } from "../../context/AuthProvider";
import RegisterClientDrawer from "../dashboard/RegisterClientDrawer";
import DropdownMenu from "../common/DropdownMenu";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { client as supabase } from "../../supabase/client";
import ButtonGrey from "../common/ButtonGrey";

export default function ClientHistoryTable() {
  const { user, isLoading } = useAuth();
  const {
    clientes,
    loading,
    error,
    usuarioIdActual,
    idProyecto,
    initialized,
    fetchClientes,
    shouldRefresh,
  } = useClientsStore();

  const [showDrawer, setShowDrawer] = useState(false);
  const [equiposEnReparacion, setEquiposEnReparacion] = useState(0);

  // Carga automática de clientes al iniciar
  useEffect(() => {
    if (isLoading || !user) return;
    const email = user?.email || user?.user_metadata?.email;
    if (!email) return;
    if (!initialized || shouldRefresh()) {
      fetchClientes(email);
    }
  }, [user, isLoading, initialized, fetchClientes, shouldRefresh]);

  // Contador de equipos en reparación (agendamientos activos)
  useEffect(() => {
    async function fetchAgendamientosActivos() {
      if (clientes.length === 0) {
        setEquiposEnReparacion(0);
        return;
      }
      const clientesMostrados = clientes.slice(0, 10);
      const dniList = clientesMostrados.map(c => c.dni);

      // Consulta todos los agendamientos activos de esos clientes
      const { data, error } = await supabase
        .from("Agendamiento")
        .select("idAgendamiento, Cliente_dni")
        .in("Cliente_dni", dniList)
        .eq("estado", "Activo");

      if (!error && data) setEquiposEnReparacion(data.length);
      else setEquiposEnReparacion(0);
    }
    fetchAgendamientosActivos();
  }, [clientes]);

  // Exportar agendamientos del cliente
  const handleExportAgendamientos = async (cliente, formato) => {
    const { data: agendamientos, error } = await supabase
      .from("Agendamiento")
      .select("idAgendamiento")
      .eq("Cliente_dni", cliente.dni);

    if (error || !agendamientos || agendamientos.length === 0) {
      alert("No se pudieron obtener los agendamientos");
      return;
    }

    const idsAgendamiento = agendamientos.map(a => a.idAgendamiento);

    const { data: equipoAgs, error: errorEqAg } = await supabase
      .from("EquipoAgendamiento")
      .select("equipo_numeroSerie, fechaIngreso, comentarioEntrada, comentarioSalida, fechaSalida")
      .in("agendamiento_idAgendamiento", idsAgendamiento);

    if (errorEqAg || !equipoAgs || equipoAgs.length === 0) {
      alert("No hay equipos agendados para este cliente");
      return;
    }

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

  const handleClienteAdded = () => {
    fetchClientes(user?.email || user?.user_metadata?.email);
    setShowDrawer(false);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <p className="text-lg font-semibold mb-2">Error al cargar clientes</p>
        <p className="text-sm mb-4">{error}</p>
        <button
          className="bg-purple-800 hover:bg-purple-900 text-white px-4 py-2 rounded-lg transition-colors"
          onClick={() => fetchClientes(user?.email || user?.user_metadata?.email)}
        >
          Reintentar carga
        </button>
      </div>
    );
  }

  const clientesMostrados = clientes.slice(0, 10);

  return (
    <>
      <div className="bg-gradient-to-br from-[#08080e]/95 to-[#0c0c14]/95 via-[#0a0a12]/95 backdrop-blur-md border border-slate-800/40 rounded-3xl p-8 w-full text-white shadow-lg mt-4 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.01]">
        {/* Header de la tabla */}
        <div className="flex flex-wrap items-center justify-between mb-2">
          <h3 className="text-2xl font-bold">HISTORIAL DE CLIENTES</h3>
          <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-400 text-sm font-normal">
            <span>
              Equipos en Reparación:{" "}
              <span className="font-semibold text-white">
                {equiposEnReparacion}
              </span>
            </span>
            <span>
              Clientes Registrados:{" "}
              <span className="font-semibold text-white">
                {clientes.length}
              </span>
            </span>
            <ButtonGrey
              className="bg-purple-800 hover:bg-purple-900 text-white font-semibold px-6 py-2 rounded-xl shadow transition w-fit"
              onClick={() => setShowDrawer(true)}
            >
              Registrar Ingreso
            </ButtonGrey>
          </div>
        </div>
        {/* Tabla con scroll vertical */}
        <div className="overflow-y-auto scrollbar-subtle" style={{ maxHeight: "400px" }}>
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-[#232336]">
                <th className="py-2 px-3 font-semibold">Equipo</th>
                <th className="py-2 px-3 font-semibold">Nombre</th>
                <th className="py-2 px-3 font-semibold">Apellido</th>
                <th className="py-2 px-3 font-semibold">Telefono</th>
                <th className="py-2 px-3 font-semibold">Correo</th>
                <th className="py-2 px-3 font-semibold">Estado</th>
                <th className="py-2 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">Cargando clientes...</td>
                </tr>
              ) : clientesMostrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">No hay clientes registrados</td>
                </tr>
              ) : (
                clientesMostrados.map((c, idx) => (
                  <tr
                    key={c.id || idx}
                    className="border-b border-[#232336] hover:bg-[#232336]/40 transition"
                  >
                    <td className="py-2 px-3">
                      <i className="bi bi-laptop text-2xl text-gray-400"></i>
                    </td>
                    <td className="py-2 px-3">{c.nombre}</td>
                    <td className="py-2 px-3">{c.apellido}</td>
                    <td className="py-2 px-3">{c.telefono}</td>
                    <td className="py-2 px-3">
                      <a
                        href={`mailto:${c.correo}`}
                        className="text-violet-200 hover:underline"
                      >
                        {c.correo}
                      </a>
                    </td>
                    <td className="py-2 px-3 flex items-center gap-2 h-[70px]">
                      <span
                        className={
                          c.estado === "Activo"
                            ? "text-green-400 font-semibold"
                            : "text-red-400 font-semibold"
                        }
                      >
                        {c.estado}
                      </span>
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${
                          c.estado === "Activo"
                            ? "ml-7 bg-green-500"
                            : "ml-4 bg-red-500"
                        }`}
                      ></span>
                    </td>
                    <td className="py-2 px-3">
                      <DropdownMenu
                        buttonLabel={<i className="bi bi-download text-xl text-gray-400 cursor-pointer hover:text-violet-400"></i>}
                        options={[
                          { label: "Exportar PDF", value: "pdf" },
                          { label: "Exportar Excel", value: "excel" },
                        ]}
                        onSelect={(value) => handleExportAgendamientos(c, value)}
                        buttonClassName="p-2"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <RegisterClientDrawer
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        onClienteAdded={handleClienteAdded}
        idproyecto={idProyecto}
        usuarioIdActual={usuarioIdActual}
      />
    </>
  );
}
