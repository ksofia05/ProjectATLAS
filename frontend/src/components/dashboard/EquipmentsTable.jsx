import React, { useState, useEffect } from "react";
import EquipmentClientModal from "./EquipmentClientModal";
import Loader from "../common/Loader";
import useEquipmentsStore from "../../stores/useEquipmentsStore";

export default function EquipmentsTable({ cliente }) {
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [numeroSerieSeleccionado, setNumeroSerieSeleccionado] = useState(null);

  const { getEquiposByCliente, fetchEquiposByCliente } = useEquipmentsStore();

  const clienteData = cliente
    ? getEquiposByCliente(cliente.dni)
    : { equipos: [], loading: false };
  const { equipos, loading } = clienteData;

  useEffect(() => {
    if (!cliente?.dni) return;

    fetchEquiposByCliente(cliente);
  }, [cliente?.dni, fetchEquiposByCliente]);

  if (!cliente) return null;

  return (
    <>
      <div className="bg-gradient-to-br from-[#08080e]/95 to-[#0c0c14]/95 via-[#0a0a12]/95 backdrop-blur-md border border-slate-800/40 rounded-3xl p-4 sm:p-6 md:p-8 w-full text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 mt-4">
        <div className="flex flex-col mx-4 sm:mx-6 md:mx-8 mb-6">
          <h1 className="text-xl sm:text-2xl text-purple-300 mb-2 font-bold">
            DETALLES DEL EQUIPO
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Cliente:{" "}
            <span className="text-white font-semibold">
              {cliente.nombre} {cliente.apellido}
            </span>
          </p>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader text="Cargando equipos..." />
            </div>
          ) : (
            <div className="min-w-full">
              
              <div className="block sm:hidden space-y-4">
                {equipos.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    No hay equipos para este cliente.
                  </div>
                ) : (
                  equipos.map((equipo, idx) => (
                    <div
                      key={equipo.numeroSerie + idx}
                      className="bg-[#181825]/80 rounded-xl p-4 border border-slate-700/40 cursor-pointer hover:bg-purple-900/30 transition shadow"
                      onClick={() => {
                        setEquipoSeleccionado(equipo);
                        setNumeroSerieSeleccionado(equipo.numeroSerie);
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-purple-300 text-base">
                          <i className="bi bi-laptop mr-2 text-xl text-purple-400" />
                          No. Serie: {equipo.numeroSerie}
                          {equipo.repeticiones > 1 && (
                            <span className="text-xs text-purple-400 ml-1">
                              ({equipo.repeticiones})
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-400">Ingreso: </span>
                          <span className="text-white">{equipo.ingreso}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Salida: </span>
                          <span>
                            {equipo.salida || (
                              <span className="italic text-gray-500">
                                No hay salida aún
                              </span>
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">
                            Comentario entrada:{" "}
                          </span>
                          <span>
                            {equipo.comentarioEntrada || (
                              <span className="italic text-gray-500">
                                No hay comentarios aún
                              </span>
                            )}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">
                            Comentario salida:{" "}
                          </span>
                          <span>
                            {equipo.comentarioSalida || (
                              <span className="italic text-gray-500">
                                No hay comentarios aún
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              
              <table className="hidden sm:table w-full text-center mt-4 mb-6 rounded-2xl overflow-hidden shadow">
                <thead>
                  <tr className="border-b border-slate-700/40 bg-[#181825]/80">
                    <th className="py-3 px-4 font-bold text-purple-300 text-sm uppercase tracking-wide">
                      No. Serie
                    </th>
                    <th className="py-3 px-4 font-bold text-gray-300 text-sm uppercase tracking-wide">
                      Ingreso
                    </th>
                    <th className="py-3 px-4 font-bold text-gray-300 text-sm uppercase tracking-wide">
                      Salida
                    </th>
                    <th className="py-3 px-4 font-bold text-gray-300 text-sm uppercase tracking-wide">
                      Comentario entrada
                    </th>
                    <th className="py-3 px-4 font-bold text-gray-300 text-sm uppercase tracking-wide">
                      Comentario salida
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {equipos.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-gray-400"
                      >
                        No hay equipos para este cliente.
                      </td>
                    </tr>
                  ) : (
                    equipos.map((equipo, idx) => (
                      <tr
                        key={equipo.numeroSerie + idx}
                        className="border-b border-slate-700/30 hover:bg-purple-900/20 transition cursor-pointer"
                        onClick={() => {
                          setEquipoSeleccionado(equipo);
                          setNumeroSerieSeleccionado(equipo.numeroSerie);
                        }}
                      >
                        <td className="py-3 px-4 text-purple-200 font-semibold text-base">
                          <i className="bi bi-laptop mr-2 text-xl text-purple-400" />
                          {equipo.numeroSerie}
                          {equipo.repeticiones > 1 && (
                            <span className="text-xs text-purple-400 ml-1">
                              ({equipo.repeticiones})
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-white">
                          {equipo.ingreso}
                        </td>
                        <td className="py-3 px-4">
                          {equipo.salida ? (
                            <span className="text-white">{equipo.salida}</span>
                          ) : (
                            <span className="italic text-gray-500">
                              No hay salida aún
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {equipo.comentarioEntrada ? (
                            <span className="text-white">
                              {equipo.comentarioEntrada}
                            </span>
                          ) : (
                            <span className="italic text-gray-500">
                              No hay comentarios aún
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {equipo.comentarioSalida ? (
                            <span className="text-white">
                              {equipo.comentarioSalida}
                            </span>
                          ) : (
                            <span className="italic text-gray-500">
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
    </>
  );
}
