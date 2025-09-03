import React, { useState } from "react";
import EquipmentClientModal from "./EquipmentClientModal";
import { client } from "../../supabase/client";
import { useEffect } from "react";
import Loader from "../common/Loader";

export default function EquipmentsTable({ cliente }) {
  const [equipos, setEquipos] = useState([]);
  const [equiposContador, setEquiposContador] = useState([]);
  const [loading, setLoading] = useState(true);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [numeroSerieSeleccionado, setNumeroSerieSeleccionado] = useState(null);

useEffect(() => {
  if (!cliente) return;
  setLoading(true);

  // 1. Obtener los agendamientos del cliente
  client
    .from("Agendamiento")
    .select("idAgendamiento")
    .eq("Cliente_dni", cliente.dni)
    .then(async ({ data: agendamientos, error: errorAg }) => {
      if (errorAg || !agendamientos.length) {
        setEquipos([]);
        setLoading(false);
        return;
      }
      const idsAgendamiento = agendamientos.map(a => a.idAgendamiento);

      // 2. Obtener los equipoagendamiento de esos agendamientos (con todos los campos necesarios)
      const { data: equipoAgs, error: errorEqAg } = await client
        .from("EquipoAgendamiento")
        .select("equipo_numeroSerie, fechaIngreso, comentarioEntrada, comentarioSalida, fechaSalida"  )
        .in("agendamiento_idAgendamiento", idsAgendamiento);

      if (errorEqAg || !equipoAgs.length) {
        setEquipos([]);
        setLoading(false);
        return;
      }
      const numerosSerie = equipoAgs.map(ea => ea.equipo_numeroSerie);

      // 3. Obtener los equipos por sus números de serie
      const { data: equipos, error: errorEq } = await client
        .from("Equipo")
        .select("*")
        .in("numeroSerie", numerosSerie);

      // 4. Unir los datos de Equipo y EquipoAgendamiento
      const equiposCompletos = equipoAgs.map(ea => {
        const equipo = equipos.find(eq => eq.numeroSerie === ea.equipo_numeroSerie) || {};
        return {
          ...equipo,
          ingreso: ea.fechaIngreso,
          comentarioEntrada: ea.comentarioEntrada,
          comentarioSalida: ea.comentarioSalida,
          salida: ea.fechaSalida,
        };
      });

      // Agrupar por numeroSerie y contar repeticiones
      const contador = {};
      equiposCompletos.forEach(eq => {
        if (!contador[eq.numeroSerie]) contador[eq.numeroSerie] = 0;
        contador[eq.numeroSerie]++;
      });
      // Mostrar solo un equipo por numeroSerie, pero con el contador
      const equiposUnicos = Object.keys(contador).map(numSerie => {
        const eq = equiposCompletos.find(e => e.numeroSerie === numSerie);
        return { ...eq, repeticiones: contador[numSerie] };
      });
      setEquipos(errorEq ? [] : equiposUnicos);
      setLoading(false);
    });
}, [cliente]);

if (!cliente) return null;

return (
  <div className="bg-gradient-to-r from-[#181825] to-[#232335] rounded-3xl p-8 w-full text-white shadow-lg border border-gray-700 mt-4">
    <div className="flex flex-col mx-8 mb-6">
      <h1 className="text-2xl text-white mb-2">DETALLES DEL EQUIPO</h1>
      <p className="text-gray-400">
        Cliente: {cliente.nombre} {cliente.apellido}
      </p>
    </div>
<div className="overflow-x-auto">
  {loading ? (
    <Loader text="Cargando equipos..." />
  ) : (
    <table className="w-full text-center mt-4 mb-6">
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