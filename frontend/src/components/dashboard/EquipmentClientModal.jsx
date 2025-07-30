import WideFloatingModal from "../common/popUp/WideFloatingModal";
import Switch from "../common/Switch";
import Input from "../common/Input";
import InputCalendario from "../common/InputCalendario";
import ImagenGenerica from "../../assets/pcDañada.jpg";
import EstateAdEquipmentModal from "./EstateAdEquipmentModal";
import { client as supabase } from "../../supabase/client";
import { dateUtils } from "../../utils/dateUtils";
import React, { useState, useEffect, useRef } from "react";

const EquipmentClientModal = ({ cliente, equipo, numeroSerieSeleccionado, onClose }) => {
  const [equipos, setEquipos] = useState([]);
  const [registroActual, setRegistroActual] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [comentarioSalida, setComentarioSalida] = useState("");
  const salidaRef = useRef(null);

  useEffect(() => {
    if (!cliente) return;
    const fetchEquipos = async () => {
      setLoading(true);
      try {
        const { data: agendamientos, error: errorAg } = await supabase
          .from("Agendamiento")
          .select("idAgendamiento")
          .eq("Cliente_dni", cliente.dni);
        if (errorAg || !agendamientos.length) {
          setEquipos([]);
          setLoading(false);
          return;
        }
        const idsAgendamiento = agendamientos.map((a) => a.idAgendamiento);
        const { data: equipoAgs, error: errorEqAg } = await supabase
          .from("EquipoAgendamiento")
          .select(
            "agendamiento_equipo, equipo_numeroSerie, fechaIngreso, comentarioEntrada, comentarioSalida, fechaSalida, Estado"
          )
          .in("agendamiento_idAgendamiento", idsAgendamiento);
        if (errorEqAg || !equipoAgs.length) {
          setEquipos([]);
          setLoading(false);
          return;
        }
        const numerosSerie = equipoAgs.map((ea) => ea.equipo_numeroSerie);
        const { data: equiposData, error: errorEq } = await supabase
          .from("Equipo")
          .select("*")
          .in("numeroSerie", numerosSerie);
        if (errorEq) {
          setEquipos([]);
          setLoading(false);
          return;
        }
        // Unir datos y contar repeticiones, asegurando que cada registro duplicado tenga su propia imagen
        const equiposCompletos = equipoAgs.map((ea) => {
          const equipo =
            equiposData.find(
              (eq) => eq.numeroSerie === ea.equipo_numeroSerie
            ) || {};
          // Usar la foto de la tabla Equipo para cada registro
          return {
            ...equipo,
            ingreso: ea.fechaIngreso,
            comentarioEntrada: ea.comentarioEntrada,
            comentarioSalida: ea.comentarioSalida,
            salida: ea.fechaSalida,
            estado: ea.Estado,
            agendamiento_equipo: ea.agendamiento_equipo,
            fotoEquipo: equipo.fotoEquipo || ""
          };
        });
        // Agrupar por numeroSerie y contar repeticiones
        const contador = {};
        equiposCompletos.forEach(eq => {
          if (!contador[eq.numeroSerie]) contador[eq.numeroSerie] = 0;
          contador[eq.numeroSerie]++;
        });
        // Agregar repeticiones a todos los equipos
        const equiposFinal = equiposCompletos.map(eq => ({ ...eq, repeticiones: contador[eq.numeroSerie] }));
        setEquipos(equiposFinal);
        // Inicializar registroActual según el número de serie seleccionado
        if (numeroSerieSeleccionado) {
          const idx = equiposFinal.findIndex(e => e.numeroSerie === numeroSerieSeleccionado);
          setRegistroActual(idx >= 0 ? idx : 0);
        } else if (equipo) {
          const idx = equiposFinal.findIndex(e => e.numeroSerie === equipo.numeroSerie);
          setRegistroActual(idx >= 0 ? idx : 0);
        } else {
          setRegistroActual(0);
        }
      } catch (error) {
        console.error("Error al obtener equipos:", error);
        setEquipos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipos();
    // eslint-disable-next-line
  }, [cliente, equipo, numeroSerieSeleccionado]);

  const handleConfirmInactivar = async () => {
    const equipoActual = equipos[registroActual];
    const nuevoEstado =
      equipoActual.estado === "Activo" ? "Inactivo" : "Activo";
    const fechaSalida =
      nuevoEstado === "Inactivo" ? dateUtils.getToday() : null;

    try {
      const { error } = await supabase
        .from("EquipoAgendamiento")
        .update({
          Estado: nuevoEstado,
          fechaSalida: fechaSalida,
          comentarioSalida: comentarioSalida,
          comentarioSalida: comentarioSalida,
        })
        .eq("agendamiento_equipo", equipoActual.agendamiento_equipo);

      if (error) {
        console.error("Error al actualizar estado:", error);
        alert(
          "No se pudo actualizar el estado. Verifica las políticas de seguridad en Supabase."
        );
        alert(
          "No se pudo actualizar el estado. Verifica las políticas de seguridad en Supabase."
        );
        return;
      }

      setEquipos((prevEquipos) =>
        prevEquipos.map((eq, idx) =>
          idx === registroActual
            ? {
                ...eq,
                estado: nuevoEstado,
                salida: fechaSalida,
                comentarioSalida,
              }
            : eq
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    } finally {
      setShowConfirmModal(false);
      setComentarioSalida("");
      setComentarioSalida("");
    }
  };

  const handleSwitchChange = () => {
    const equipoActual = equipos[registroActual];
    if (equipoActual.estado === "Activo") {
      setShowConfirmModal(true);
    }
  };

  if (loading) return;

  // Filtrar solo los registros del equipo seleccionado (por número de serie)
  let equiposFiltrados = equipos;
  let equipoActual = {};
  if (equipos.length > 0) {
    const serie = numeroSerieSeleccionado || (equipo && equipo.numeroSerie);
    const duplicados = equipos.filter(eq => eq.numeroSerie === serie);
    if (duplicados.length > 1) {
      equiposFiltrados = duplicados;
      equipoActual = equiposFiltrados[registroActual] || {};
    } else {
      equiposFiltrados = [equipos.find(eq => eq.numeroSerie === serie)];
      equipoActual = equiposFiltrados[0] || {};
    }
  }

  return (
    <>
      <WideFloatingModal className="max-w-6xl" onClose={onClose}>
        <h1 className="text-2xl font-bold text-white mx-8 mt-2 mb-2">
          Equipos Registrados
        </h1>
        <form className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col gap-8">
              <Input
                label="Marca"
                name="marca"
                value={equipoActual.marca || "Sin marca"}
                readOnly
                placeholder="Marca del equipo"
              />
              <Input
                label="Comentario Entrada"
                name="comentarioEntrada"
                value={equipoActual.comentarioEntrada || "Sin comentario"}
                readOnly
                placeholder="Comentario de entrada"
              />
              <Input
                label="Ingreso"
                name="ingreso"
                type="date"
                value={equipoActual.ingreso || ""}
                readOnly
                icon="bi-calendar"
                placeholder="Fecha de ingreso"
              />
            </div>
            <div className="flex flex-col gap-8 h-full">
              <Input
                label="No. Serie"
                name="serie"
                value={
                  equipoActual.numeroSerie
                    ? equipoActual.repeticiones > 1
                      ? equipoActual.numeroSerie + ` (${equipoActual.repeticiones})`
                      : equipoActual.numeroSerie
                    : "Sin número de serie"
                }
                readOnly
                placeholder="Número de serie"
              />
              <Input
                label="Comentario Salida"
                name="comentarioSalida"
               
                value={
                  equipoActual.comentarioSalida || "Sin comentario de salida"
                }
                onChange={(e) => setComentarioSalida(e.target.value)}
                placeholder="Comentario de salida"
              />
              <InputCalendario
                label="Salida"
                value={equipoActual.salida || ""}
                readOnly
                ref={salidaRef}
              />
            </div>
            <div className="flex items-center justify-center">
              <img
                src={
                  equipoActual.fotoEquipo && equipoActual.fotoEquipo !== ""
                    ? (equipoActual.fotoEquipo.includes("supabase.co/storage/v1/object/public/atlas/computadores/")
                        ? equipoActual.fotoEquipo
                        : equipoActual.fotoEquipo.startsWith("http")
                          ? equipoActual.fotoEquipo
                          : `https://ksofia05-org.supabase.co/storage/v1/object/public/atlas/computadores/${equipoActual.fotoEquipo}`
                      )
                    : ImagenGenerica
                }
                alt={equipoActual.marca ? equipoActual.marca : "Equipo"}
                className="w-60 h-60 object-cover rounded-xl shadow"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = ImagenGenerica;
                }}
              />
            </div>
          </div>
          <div className="flex justify-end items-center px-6 gap-4 mt-4">
            {equiposFiltrados.length > 1 ? (
              <>
                <button
                  onClick={() => setRegistroActual((prev) => Math.max(prev - 1, 0))}
                  disabled={registroActual === 0}
                  className="text-gray-400 shadow-2xl hover:text-purple-600 hover:text-shadow-xs text-shadow-purple-500/50 transition-colors dashboard-hover-text-shadow text-2xl px-2 "
                  type="button"
                >
                  &#8592;
                </button>
                <span className="text-white shadow-2xl">
                  {registroActual + 1} / {equiposFiltrados.length}
                </span>
                <button
                  onClick={() =>
                    setRegistroActual((prev) =>
                      Math.min(prev + 1, equiposFiltrados.length - 1)
                    )
                  }
                  disabled={registroActual === equiposFiltrados.length - 1}
                  className="text-gray-400 shadow-2xl hover:text-purple-600 hover:text-shadow-xs text-shadow-purple-500/50 transition-colors dashboard-hover-text-shadow text-2xl px-2"
                  type="button"
                >
                  &#8594;
                </button>
              </>
            ) : (
              <span className="text-white shadow-2xl">
                1 / 1
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Switch
              checked={equipoActual.estado === "Activo"}
              onChange={handleSwitchChange}
              disabled={equipoActual.estado !== "Activo"}
            />
            <span
              className={
                equipoActual.estado === "Activo"
                  ? "text-green-400 font-semibold"
                  : "text-red-400 font-semibold"
              }
            >
              {equipoActual.estado}
            </span>
          </div>
        </form>
      </WideFloatingModal>
      {showConfirmModal && (
        <EstateAdEquipmentModal
          onClose={() => setShowConfirmModal(false)}
          onSave={handleConfirmInactivar}
        />
      )}
    </>
  );
};

export default EquipmentClientModal;

