import React, { useState, useEffect } from "react";
import EquipmentClientModal from "./EquipmentClientModal";
import Loader from "../common/Loader";
import useEquipmentsStore from "../../stores/useEquipmentsStore";

export default function EquipmentsTable({ cliente }) {
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [numeroSerieSeleccionado, setNumeroSerieSeleccionado] = useState(null);
  
  const { 
    getEquiposByCliente, 
    fetchEquiposByCliente 
  } = useEquipmentsStore();

  const clienteData = cliente ? getEquiposByCliente(cliente.dni) : { equipos: [], loading: false };
  const { equipos, loading } = clienteData;

  useEffect(() => {
    if (!cliente?.dni) return;

    fetchEquiposByCliente(cliente);
  }, [cliente?.dni, fetchEquiposByCliente]);

  if (!cliente) return null;

  return (
    <div className="bg-gradient-to-r from-[#181825] to-[#232335] rounded-3xl p-4 sm:p-6 md:p-8 w-full text-white shadow-lg border border-gray-700 mt-4">
      <div className="flex flex-col mx-4 sm:mx-6 md:mx-8 mb-6">
        <h1 className="text-xl sm:text-2xl text-white mb-2">DETALLES DEL EQUIPO</h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Cliente: {cliente.nombre} {cliente.apellido}
        </p>
      </div>

    <div className="overflow-x-auto">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader text="Cargando equipos..." />
        </div>
      ) : (
        <div className="min-w-full">
          {/* Vista móvil - Cards responsivas */}
          <div className="block sm:hidden space-y-4">
            {equipos.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No hay equipos para este cliente.
              </div>
            ) : (
              equipos.map((equipo, idx) => (
                <div
                  key={equipo.numeroSerie + idx}
                  className="bg-[#232336]/40 rounded-lg p-4 border border-gray-700 cursor-pointer hover:bg-[#232336]/60 transition"
                  onClick={() => {
                    setEquipoSeleccionado(equipo);
                    setNumeroSerieSeleccionado(equipo.numeroSerie);
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-purple-400">
                      No. Serie: {equipo.numeroSerie}
                      {equipo.repeticiones > 1 && (
                        <span className="text-xs text-purple-300 ml-1">
                          ({equipo.repeticiones})
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Ingreso: </span>
                      <span>{equipo.ingreso}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Salida: </span>
                      <span>
                        {equipo.salida || (
                          <span className="italic text-gray-500">No hay salida aún</span>
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Comentario entrada: </span>
                      <span>
                        {equipo.comentarioEntrada || (
                          <span className="italic text-gray-500">No hay comentarios aún</span>
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Comentario salida: </span>
                      <span>
                        {equipo.comentarioSalida || (
                          <span className="italic text-gray-500">No hay comentarios aún</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Vista desktop - Tabla */}
          <table className="hidden sm:table w-full text-center mt-4 mb-6">
            <thead>
              <tr className="border-b border-[#232336]">
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
              {equipos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No hay equipos para este cliente.
                  </td>
                </tr>
              ) : (
                equipos.map((equipo, idx) => (
                  <tr
                    key={equipo.numeroSerie + idx}
                    className="border-b border-[#232336] hover:bg-[#232336]/40 transition cursor-pointer"
                    onClick={() => {
                      setEquipoSeleccionado(equipo);
                      setNumeroSerieSeleccionado(equipo.numeroSerie);
                    }}
                  >
                    <td className="py-2 px-3 text-center">
                      {equipo.numeroSerie}
                      {equipo.repeticiones > 1 && (
                        <span className="text-xs text-purple-400 ml-1">
                          ({equipo.repeticiones})
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">{equipo.ingreso}</td>
                    <td className="py-2 px-3 text-center">
                      {equipo.salida ? (
                        equipo.salida
                      ) : (
                        <span className="italic text-gray-400">
                          No hay salida aún
                        </span>
                      )}
                    </td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
    {equipoSeleccionado && (
      <EquipmentClientModal
        equipo={equipoSeleccionado}
        numeroSerieSeleccionado={numeroSerieSeleccionado}
        onClose={() => {
          setEquipoSeleccionado(null);
          setNumeroSerieSeleccionado(null);
        }}
        cliente={cliente}
      />
    )}
  </div>
  );
}