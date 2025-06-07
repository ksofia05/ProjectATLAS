import React from "react";
import ButtonGrey from "../common/ButtonGrey";
import Input from "../common/Input";

const colaboradores = [
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
  return (
    <div className="bg-gradient-to-r from-[#181825] to-[#232335] rounded-3xl p-8 w-full text-white shadow-lg border border-gray-700 mt-4">

      <div className="flex items-center justify-between mb-6 flex-wrap">

        <div>
          <ButtonGrey className="px-5 py-2 font-semibold text-base">
            <i className="bi bi-download mr-2"></i> Export
          </ButtonGrey>
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
          <ButtonGrey className="px-4 py-2 font-semibold text-base flex items-center gap-2">
            Estado <i className="bi bi-chevron-down"></i>
          </ButtonGrey>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full max-w-6xl mx-auto text-center">
          <thead>
            <tr className="border-b border-[#232336]">
              <th className="py-2 px-3 font-semibold text-center">Vista</th>
              <th className="py-2 px-3 font-semibold text-center">Nombre</th>
              <th className="py-2 px-3 font-semibold text-center">Apellido</th>
              <th className="py-2 px-3 font-semibold text-center">Telefono</th>
              <th className="py-2 px-3 font-semibold text-center">Rol</th>
              <th className="py-2 px-3 font-semibold text-center">Estado</th>
              <th className="py-2 px-3 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {colaboradores.map((c, idx) => (
              <tr
                key={c.nombre + c.apellido}
                className="border-b border-[#232336] hover:bg-[#232336]/40 transition"
              >
                <td className="py-2 px-3 flex items-center justify-center">
                  <i className="bi bi-eye text-lg text-gray-400 cursor-pointer"></i>
                </td>
                <td className="py-2 px-3 text-gray-200 text-center">{c.nombre}</td>
                <td className="py-2 px-3 text-center">{c.apellido}</td>
                <td className="py-2 px-3 text-center">{c.telefono}</td>
                <td className="py-2 px-3 text-center">{c.rol}</td>
                <td className="py-2 px-3 flex items-center gap-2 justify-center">
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
                      c.estado === "Activo" ? "ml-7 bg-green-500" : "ml-4 bg-red-500"
                    }`}
                  ></span>
                </td>
                <td className="py-2 px-3 text-center"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end mt-4 text-gray-400 text-sm gap-4">
        <div>
          Rows per page{" "}
          <select className="bg-[#232336] border border-[#232336] rounded px-2 py-1 text-gray-200 ml-1">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
        <div>1 - 4 of 406</div>
      </div>
    </div>
  );
}