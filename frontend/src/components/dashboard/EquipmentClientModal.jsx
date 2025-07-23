import React, { useState, useEffect, useRef } from "react";
import Input from "../common/Input";
import WideFloatingModal from "../common/popUp/WideFloatingModal";
import Switch from "../common/Switch";
import ImagenGenerica from "../../assets/pcDañada.jpg";
import EstateAdEquipmentModal from "./EstateAdEquipmentModal";
import InputCalendario from "../common/InputCalendario";
import { client as supabase } from "../../supabase/client";

const EquipmentClientModal = ({ cliente, equipo, onClose }) => {
  const [registros, setRegistros] = useState([]);
  const [registroActual, setRegistroActual] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [comentarioSalida, setComentarioSalida] = useState("");
  const salidaRef = useRef(null);

  useEffect(() => {
    if (!cliente || !equipo) return;
    const fetchRegistros = async () => {
      setLoading(true);
      try {
        const { data: agendamientos, error: errorAg } = await supabase
          .from("Agendamiento")
          .select("idAgendamiento")
          .eq("Cliente_dni", cliente.dni);
        if (errorAg || !agendamientos.length) {
          setRegistros([]);
          setLoading(false);
          return;
        }
        const idsAgendamiento = agendamientos.map((a) => a.idAgendamiento);
        const { data: equipoAgs, error: errorEqAg } = await supabase
          .from("EquipoAgendamiento")
          .select(
            "agendamiento_equipo, equipo_numeroSerie, fechaIngreso, comentarioEntrada, comentarioSalida, fechaSalida, Estado"
          )
          .in("agendamiento_idAgendamiento", idsAgendamiento)
          .eq("equipo_numeroSerie", equipo.numeroSerie);
        if (errorEqAg || !equipoAgs.length) {
          setRegistros([]);
          setLoading(false);
          return;
        }
        // Ordenar por fechaIngreso (opcional)
        equipoAgs.sort((a, b) => new Date(a.fechaIngreso) - new Date(b.fechaIngreso));
        // Obtener datos del equipo
        const { data: equiposData } = await supabase
          .from("Equipo")
          .select("marca, fotoEquipo, numeroSerie")
          .eq("numeroSerie", equipo.numeroSerie);
        const equipoData = equiposData && equiposData[0] ? equiposData[0] : {};
        // Unir datos, asegurando que fotoEquipo esté presente
        const registrosCompletos = equipoAgs.map(ea => ({
          marca: equipoData.marca,
          fotoEquipo: equipoData.fotoEquipo,
          numeroSerie: equipoData.numeroSerie,
          ingreso: ea.fechaIngreso,
          comentarioEntrada: ea.comentarioEntrada,
          comentarioSalida: ea.comentarioSalida,
          salida: ea.fechaSalida,
          estado: ea.Estado,
          agendamiento_equipo: ea.agendamiento_equipo,
          repeticiones: equipoAgs.length,
        }));
        setRegistros(registrosCompletos);
      } catch (error) {
        console.error("Error al obtener registros:", error);
        setRegistros([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistros();
  }, [cliente, equipo]);

  const handleConfirmInactivar = async () => {
    const equipoActual = equipos[registroActual];
    const nuevoEstado = equipoActual.estado === "Activo" ? "Inactivo" : "Activo";
    const fechaSalida = nuevoEstado === "Inactivo" ? new Date().toISOString().split("T")[0] : null;

    try {
      const { error } = await supabase
        .from("EquipoAgendamiento")
        .update({
          Estado: nuevoEstado,
          fechaSalida: fechaSalida,
          comentarioSalida: comentarioSalida, 
        })
        .eq("agendamiento_equipo", equipoActual.agendamiento_equipo);

      if (error) {
        console.error("Error al actualizar estado:", error);
        alert("No se pudo actualizar el estado. Verifica las políticas de seguridad en Supabase.");
        return;
      }

      setEquipos((prevEquipos) =>
        prevEquipos.map((eq, idx) =>
          idx === registroActual
            ? { ...eq, estado: nuevoEstado, salida: fechaSalida, comentarioSalida }
            : eq
        )
      );
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    } finally {
      setShowConfirmModal(false);
      setComentarioSalida(""); 
    }
  };

  const handleSwitchChange = () => {
    if (equipoActual.estado === "Activo") {
      setShowConfirmModal(true);
    }
  };

  if (loading) return;

  const equipoActual = registros[registroActual];

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
                value={equipoActual.comentarioSalida || "Sin comentario de salida"}
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
            {equipoActual.repeticiones > 1 ? (
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
                  {registroActual + 1} / {registros.length}
                </span>
                <button
                  onClick={() =>
                    setRegistroActual((prev) =>
                      Math.min(prev + 1, registros.length - 1)
                    )
                  }
                  disabled={registroActual === registros.length - 1}
                  className="text-gray-400 shadow-2xl hover:text-purple-600 hover:text-shadow-xs text-shadow-purple-500/50 transition-colors dashboard-hover-text-shadow text-2xl px-2"
                  type="button"
                >
                  &#8594;
                </button>
              </>
            ) : null}
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