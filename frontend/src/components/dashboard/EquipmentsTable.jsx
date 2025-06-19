import React, { useState } from "react";
import EquipmentClientModal from "./EquipmentClientModal";

export default function EquipmentsTable({ cliente }) {
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

  // Datos estáticos de equipos del cliente
  const equipos = [
    {
      marca: "Dell",
      serie: "DL-2025-001",
      ingreso: "2025-01-21",
      salida: "2025-01-23",
      comentarioEntrada: "Equipo en condiciones no óptimas",
      comentarioSalida: "",
    },
    {
      marca: "Samsung",
      serie: "SM-2025-002",
      ingreso: "2025-02-01",
      salida: "2025-02-10",
      comentarioEntrada: "La batería no funciona correctamente",
      comentarioSalida: "",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-[#181825] to-[#232335] rounded-3xl p-8 w-full text-white shadow-lg border border-gray-700 mt-4">
      <div className="flex flex-col mx-8 mb-6">
        <h1 className="text-2xl text-white mb-2">DETALLES DEL EQUIPO</h1>
        <p className="text-gray-400">
          Cliente: {cliente.nombre} {cliente.apellido}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-center mt-4 mb-6">
          <thead>
            <tr className="border-b border-[#232336]">
              <th className="py-2 px-3 font-semibold text-center">Marca</th>
              <th className="py-2 px-3 font-semibold text-center">No. Serie</th>
              <th className="py-2 px-3 font-semibold text-center">Ingreso</th>
              <th className="py-2 px-3 font-semibold text-center">Salida</th>
              <th className="py-2 px-3 font-semibold text-center">
                Comentario entrada
              </th>
              <th className="py-2 px-3 font-semibold text-center">
                Comentario salida
              </th>
            </tr>
          </thead>
          <tbody>
            {equipos.map((equipo, idx) => (
              <tr
                key={equipo.serie + idx}
                className="border-b border-[#232336] hover:bg-[#232336]/40 transition cursor-pointer"
                onClick={() => setEquipoSeleccionado(equipo)}
              >
                <td className="py-2 px-3 text-center">{equipo.marca}</td>
                <td className="py-2 px-3 text-center">{equipo.serie}</td>
                <td className="py-2 px-3 text-center">{equipo.ingreso}</td>
                <td className="py-2 px-3 text-center">{equipo.salida}</td>
                <td className="py-2 px-3 text-center">
                  {equipo.comentarioEntrada ? (
                    equipo.comentarioEntrada
                  ) : (
                    <span className="italic text-gray-400">
                      No hay comentarios aún
                    </span>
                  )}
                </td>
                <td className="py-2 px-3 text-center">
                  {equipo.comentarioSalida ? (
                    equipo.comentarioSalida
                  ) : (
                    <span className="italic text-gray-400">
                      No hay comentarios aún
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {equipoSeleccionado && (
        <EquipmentClientModal
          equipo={equipoSeleccionado}
          onClose={() => setEquipoSeleccionado(null)}
        />
      )}
    </div>
  );
}