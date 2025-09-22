import React from "react";
import ButtonGrey from "../common/ButtonGrey";

const clientes = [
  {
    equipo: "laptop",
    nombre: "Jose Jacobo",
    apellido: "Rojas Aponte",
    telefono: "302 649 2065",
    correo: "joserojas@gmail.com",
    estado: "Activo",
  },
  {
    equipo: "laptop",
    nombre: "Dilan Francisco",
    apellido: "Rojas Pinilla",
    telefono: "311 804 3208",
    correo: "dilanrojas@gmail.com",
    estado: "Inactivo",
  },
  {
    equipo: "laptop",
    nombre: "Daniel Orlando",
    apellido: "Velasquez Ramirez",
    telefono: "301 243 3967",
    correo: "orlandogoat@gmail.com",
    estado: "Activo",
  },
  {
    equipo: "laptop",
    nombre: "Juan David",
    apellido: "Garzon Sanchez",
    telefono: "310 589 2939",
    correo: "danielramen@gmail.com",
    estado: "Activo",
  },
];

export default function ClientHistoryTable() {
  return (
    <div className="bg-gradient-to-br from-[#08080e]/95 to-[#0c0c14]/95 via-[#0a0a12]/95 backdrop-blur-md border border-slate-800/40 rounded-3xl p-8 w-full text-white shadow-lg mt-4 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.01]">
      <div className="flex flex-wrap items-center justify-between mb-2">
        <h3 className="text-2xl font-bold">HISTORIAL DE CLIENTES</h3>
        <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-400 text-sm font-normal">
          <span>
            Equipos en Reparación:{" "}
            <span className="font-semibold text-white">8</span>
          </span>
          <span>
            Clientes Registrados:{" "}
            <span className="font-semibold text-white">32</span>
          </span>
          <ButtonGrey className="px-5 py-2 font-semibold text-base">
            Registrar Ingreso
          </ButtonGrey>
        </div>
      </div>
      <div className="text-gray-400 text-sm mb-2">1/01/2025 - 10/04/2025</div>
      <div className="overflow-x-auto">
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
            {clientes.map((c, idx) => (
              <tr
                key={c.nombre}
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
                <td className="py-2 px-3 flex items-center gap-2">
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
                  <i className="bi bi-download text-xl text-gray-400 cursor-pointer hover:text-violet-400"></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
