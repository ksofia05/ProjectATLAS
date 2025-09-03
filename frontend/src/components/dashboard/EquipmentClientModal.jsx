import WideFloatingModal from "../common/popUp/WideFloatingModal";
import Switch from "../common/Switch";
import Input from "../common/Input";
import InputCalendario from "../common/InputCalendario";
import ImagenGenerica from "../../assets/pcDañada.jpg";
import EstateAdEquipmentModal from "./EstateAdEquipmentModal";
import { client as supabase } from "../../supabase/client";
import { dateUtils } from "../../utils/dateUtils";
import React, { useState, useEffect, useRef } from "react";

const EquipmentClientModal = ({
  cliente,
  equipo,
  numeroSerieSeleccionado,
  onClose,
}) => {
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
            "agendamiento_equipo, equipo_numeroSerie, fechaIngreso, comentarioEntrada, comentarioSalida, fechaSalida, Estado, fotoEquipo"
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
          // Usar primero la foto del registro, luego la general del equipo
          return {
            ...equipo,
            ingreso: ea.fechaIngreso,
            comentarioEntrada: ea.comentarioEntrada,
            comentarioSalida: ea.comentarioSalida,
            salida: ea.fechaSalida,
            estado: ea.Estado,
            agendamiento_equipo: ea.agendamiento_equipo,
            fotoEquipo: ea.fotoEquipo || equipo.fotoEquipo || "",
          };
        });
        // Agrupar por numeroSerie y contar repeticiones
        const contador = {};
        equiposCompletos.forEach((eq) => {
          if (!contador[eq.numeroSerie]) contador[eq.numeroSerie] = 0;
          contador[eq.numeroSerie]++;
        });
        // Agregar repeticiones a todos los equipos
        const equiposFinal = equiposCompletos.map((eq) => ({
          ...eq,
          repeticiones: contador[eq.numeroSerie],
        }));
        setEquipos(equiposFinal);
        // Inicializar registroActual según el número de serie seleccionado
        if (numeroSerieSeleccionado) {
          const idx = equiposFinal.findIndex(
            (e) => e.numeroSerie === numeroSerieSeleccionado
          );
          setRegistroActual(idx >= 0 ? idx : 0);
        } else if (equipo) {
          const idx = equiposFinal.findIndex(
            (e) => e.numeroSerie === equipo.numeroSerie
          );
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
  }, [cliente, equipo, numeroSerieSeleccionado]);

  useEffect(() => {
    if (equipos.length > 0 && registroActual >= 0) {
      const serie = numeroSerieSeleccionado || (equipo && equipo.numeroSerie);
      const duplicados = equipos.filter((eq) => eq.numeroSerie === serie);
      let equipoActual = {};
      if (duplicados.length > 1) {
        equipoActual = duplicados[registroActual] || {};
      } else {
        equipoActual = equipos.find((eq) => eq.numeroSerie === serie) || {};
      }

      if (equipoActual.comentarioSalida) {
        setComentarioSalida(equipoActual.comentarioSalida);
      } else {
        setComentarioSalida("");
      }
    }
  }, [equipos, registroActual, numeroSerieSeleccionado, equipo]);

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
    const duplicados = equipos.filter((eq) => eq.numeroSerie === serie);
    if (duplicados.length > 1) {
      equiposFiltrados = duplicados;
      equipoActual = equiposFiltrados[registroActual] || {};
    } else {
      equiposFiltrados = [equipos.find((eq) => eq.numeroSerie === serie)];
      equipoActual = equiposFiltrados[0] || {};
    }
  }

  const hasUnsavedChanges = () => {
    return (
      equipoActual.estado === "Activo" &&
      comentarioSalida.trim() !== (equipoActual.comentarioSalida || "").trim()
    );
  };

  const handleDiscardChanges = () => {
    setComentarioSalida(equipoActual.comentarioSalida || "");
    if (onClose) onClose();
  };

  return (
    <>
      <WideFloatingModal
        className="w-full max-w-3xl bg-[#232335] shadow-xl rounded-3xl border border-[#2d2d44] px-0"
        onClose={onClose}
        hasUnsavedChanges={hasUnsavedChanges}
        onDiscardChanges={handleDiscardChanges}
      >
        
        <h1 className="text-2xl md:text-3xl font-bold text-white text-center pt-4 pb-12">
          Equipos Registrados
        </h1>
        <div className="flex flex-col md:flex-row gap-8 px-4 md:px-10 items-start">
          {/* Columna izquierda: tiene la imagen, la marca y el numero de serie del pc */}
          <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
            <img
              src={
                equipoActual.fotoEquipo && equipoActual.fotoEquipo !== ""
                  ? equipoActual.fotoEquipo.includes(
                      "supabase.co/storage/v1/object/public/atlas/computadores/"
                    )
                    ? equipoActual.fotoEquipo
                    : equipoActual.fotoEquipo.startsWith("http")
                    ? equipoActual.fotoEquipo
                    : `https://ksofia05-org.supabase.co/storage/v1/object/public/atlas/computadores/${equipoActual.fotoEquipo}`
                  : ImagenGenerica
              }
              alt={equipoActual.marca ? equipoActual.marca : "Equipo"}
              className="w-44 h-44 md:w-56 md:h-56 object-cover rounded-xl shadow-lg border-3 border-purple-400 bg-white mb-6"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = ImagenGenerica;
              }}
            />
            <div className="w-full flex flex-col gap-4">
              <div>
                <label className="text-gray-300 font-semibold">Marca</label>
                <Input
                  name="marca"
                  value={equipoActual.marca || "Sin marca"}
                  readOnly
                  className="bg-[#232335] border border-purple-700 text-white rounded-lg mt-1"
                />
              </div>
              <div>
                <label className="text-gray-300 font-semibold">No. Serie</label>
                <Input
                  name="serie"
                  value={
                    equipoActual.numeroSerie
                      ? equipoActual.repeticiones > 1
                        ? equipoActual.numeroSerie +
                          ` (${equipoActual.repeticiones})`
                        : equipoActual.numeroSerie
                      : "Sin número de serie"
                  }
                  readOnly
                  className="bg-[#232335] border border-purple-700 text-white rounded-lg mt-1"
                />
              </div>
            </div>
          </div>

          {/* Columna derecha: resto de la info */}
          <div className="w-full md:w-2/3 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 font-semibold">Ingreso</label>
                <Input
                  name="ingreso"
                  type="date"
                  value={equipoActual.ingreso || ""}
                  readOnly
                  icon="bi-calendar"
                  className="bg-[#232335] border border-purple-700 text-white rounded-lg mt-1"
                />
              </div>
              <div>
                <label className="text-gray-300 font-semibold">Salida</label>
                <InputCalendario
                  value={equipoActual.salida || ""}
                  readOnly
                  ref={salidaRef}
                  className="bg-[#232335] border border-purple-700 text-white rounded-lg mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-300 font-semibold">
                Comentario Entrada
              </label>
              <Input
                name="comentarioEntrada"
                as="textarea"
                rows={2}
                value={equipoActual.comentarioEntrada || "Sin comentario"}
                readOnly
                className="bg-[#232335] border border-purple-700 text-white rounded-lg mt-1"
              />
            </div>
            <div className="flex flex-row gap-4 items-start">
              <div className="flex-1">
                <label className="text-gray-300 font-semibold">
                  Comentario Salida
                </label>
                <Input
                  name="comentarioSalida"
                  as="textarea"
                  rows={2}
                  value={
                    equipoActual.estado === "Inactivo"
                      ? equipoActual.comentarioSalida
                      : comentarioSalida || equipoActual.comentarioSalida
                  }
                   onChange={(e) => {
    if (e.target.value.length <= 120) setComentarioSalida(e.target.value);
  }}
                  className="bg-[#232335] border border-purple-700 text-white rounded-lg mt-1"
                />
                 {equipoActual.estado !== "Inactivo" && (
      <div
        className="text-right text-xs mt-1"
        style={{
          color: comentarioSalida.length === 120 ? "#f87171" : "#a78bfa",
        }}
      >
        {comentarioSalida.length}/120 caracteres
      </div>
    )}
              </div>
            </div>
            {/* Switch, estado y navegación juntos y alineads a la derecha (jodido boton de mrd) */}
            <div className="flex justify-end items-center gap-4 mt-2">
              <div className="flex items-center gap-3">
                <Switch
                  checked={equipoActual.estado === "Activo"}
                  onChange={handleSwitchChange}
                  disabled={equipoActual.estado !== "Activo"}
                />
                <span
                  className={`flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-lg
        ${
          equipoActual.estado === "Activo"
            ? "bg-green-900/30 text-green-400"
            : "bg-red-900/30 text-red-400"
        }`}
                >
                  {equipoActual.estado === "Activo" ? (
                    <i className="bi bi-check-circle-fill text-green-400 text-xl"></i>
                  ) : (
                    <i className="bi bi-x-circle-fill text-red-400 text-xl"></i>
                  )}
                  {equipoActual.estado}
                </span>
              </div>
              {/* Navegación */}
              <div className="flex items-center gap-2">
                {equiposFiltrados.length > 1 ? (
                  <>
                    <button
                      onClick={() =>
                        setRegistroActual((prev) => Math.max(prev - 1, 0))
                      }
                      disabled={registroActual === 0}
                      className="text-gray-400 hover:text-purple-500 text-2xl px-2 transition-colors"
                      type="button"
                    >
                      <i className="bi bi-arrow-left-circle"></i>
                    </button>
                    <span className="text-white font-semibold">
                      {registroActual + 1} / {equiposFiltrados.length}
                    </span>
                    <button
                      onClick={() =>
                        setRegistroActual((prev) =>
                          Math.min(prev + 1, equiposFiltrados.length - 1)
                        )
                      }
                      disabled={registroActual === equiposFiltrados.length - 1}
                      className="text-gray-400 hover:text-purple-500 text-2xl px-2 transition-colors"
                      type="button"
                    >
                      <i className="bi bi-arrow-right-circle"></i>
                    </button>
                  </>
                ) : (
                  <span className="text-white font-semibold">1 / 1</span>
                )}
              </div>
            </div>
          </div>
        </div>
        {showConfirmModal && (
          <EstateAdEquipmentModal
            onClose={() => setShowConfirmModal(false)}
            onSave={handleConfirmInactivar}
          />
        )}
      </WideFloatingModal>
    </>
  );
};

export default EquipmentClientModal;

//Psd : Si esta mrd funciona, porfavor no la toquen, att: luis