import WideFloatingModal from "../common/popUp/WideFloatingModal";
import Switch from "../common/Switch";
import Input from "../common/Input";
import InputCalendario from "../common/InputCalendario";
import ImagenGenerica from "../../assets/pcDañada.jpg";
import EstateAdEquipmentModal from "./EstateAdEquipmentModal";
import { client as supabase } from "../../supabase/client";
import { dateUtils } from "../../utils/dateUtils";
import React, { useState, useEffect, useRef } from "react";
import Button from "../common/Button";

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
  const [comentarioEntradaEdit, setComentarioEntradaEdit] = useState("");
  const [savingEntrada, setSavingEntrada] = useState(false);
  const salidaRef = useRef(null);

  // Helper para ordenar duplicados de forma estable: fechaIngreso, luego id único
  const ordenarDuplicados = (a, b) => {
    const fechaA = new Date(a.ingreso);
    const fechaB = new Date(b.ingreso);
    if (fechaA < fechaB) return -1;
    if (fechaA > fechaB) return 1;
    const idA = Number(a.agendamiento_equipo) || 0;
    const idB = Number(b.agendamiento_equipo) || 0;
    return idA - idB;
  };

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
            "agendamiento_equipo, agendamiento_idAgendamiento, equipo_numeroSerie, fechaIngreso, comentarioEntrada, comentarioSalida, fechaSalida, Estado, fotoEquipo"
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
            agendamiento_idAgendamiento: ea.agendamiento_idAgendamiento,
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
        // Inicializar registroActual apuntando al último duplicado (más reciente) del número de serie seleccionado
        const seriePreferida =
          numeroSerieSeleccionado ||
          (equipo && equipo.numeroSerie) ||
          (equiposFinal[0] ? equiposFinal[0].numeroSerie : null);

        if (seriePreferida) {
          // Buscar duplicados de esa serie
          let dups = equiposFinal.filter(
            (e) => e.numeroSerie === seriePreferida
          );
          if (dups.length > 1) {
            // Ordenar con el helper y seleccionar el último
            dups = dups.sort(ordenarDuplicados);
            const ultimo = dups[dups.length - 1];
            // Ubicar su índice real dentro de equiposFinal
            const idxUltimo = equiposFinal.findIndex(
              (e) => e.agendamiento_equipo === ultimo.agendamiento_equipo
            );
            setRegistroActual(idxUltimo >= 0 ? idxUltimo : 0);
          } else {
            const idx = equiposFinal.findIndex(
              (e) => e.numeroSerie === seriePreferida
            );
            setRegistroActual(idx >= 0 ? idx : 0);
          }
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
      let duplicados = equipos.filter((eq) => eq.numeroSerie === serie);
      let equipoActual = {};
      if (duplicados.length > 1) {
        // Ordenar igual que en el render para mantener consistencia
        duplicados = duplicados.sort(ordenarDuplicados);
        equipoActual = duplicados[registroActual] || {};
      } else {
        equipoActual = equipos.find((eq) => eq.numeroSerie === serie) || {};
      }

      if (equipoActual.comentarioSalida) {
        setComentarioSalida(equipoActual.comentarioSalida);
      } else {
        setComentarioSalida("");
      }

      // Inicializar comentario de entrada editable con el valor actual (o vacío)
      setComentarioEntradaEdit(
        equipoActual.comentarioEntrada
          ? String(equipoActual.comentarioEntrada)
          : ""
      );
    }
  }, [equipos, registroActual, numeroSerieSeleccionado, equipo]);

  const handleConfirmInactivar = async () => {
    // Determinar el registro actual de forma consistente con el render
    const serieSel = numeroSerieSeleccionado || (equipo && equipo.numeroSerie);
    let lista = equipos.filter((eq) => eq.numeroSerie === serieSel);
    if (lista.length > 1) {
      lista = lista.sort(ordenarDuplicados);
    }
    const equipoActual = lista[registroActual] || lista[0];
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
        prevEquipos.map((eq) =>
          eq.agendamiento_equipo === equipoActual.agendamiento_equipo
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
    }
  };

  const handleSwitchChange = () => {
    // Debe usar el mismo item que se muestra en pantalla
    const serieSel = numeroSerieSeleccionado || (equipo && equipo.numeroSerie);
    if (!serieSel) return;
    let lista = equipos.filter((eq) => eq.numeroSerie === serieSel);
    if (lista.length > 1) {
      lista = lista.sort(ordenarDuplicados);
    }
    const seleccionado = lista[registroActual] || lista[0];
    if (seleccionado && seleccionado.estado === "Activo") {
      setShowConfirmModal(true);
    }
  };

  // Guardar comentario de entrada editado
  const handleGuardarEntrada = async () => {
    const serieSel = numeroSerieSeleccionado || (equipo && equipo.numeroSerie);
    if (!serieSel) return;

    let lista = equipos.filter((eq) => eq.numeroSerie === serieSel);
    if (lista.length > 1) lista = lista.sort(ordenarDuplicados);
    const actual = lista[registroActual] || lista[0];
    if (!actual || !actual.agendamiento_equipo) return;

    // Evitar guardar si no hay cambios
    const originalEntrada = (actual.comentarioEntrada || "").trim();
    const nuevoEntrada = (comentarioEntradaEdit || "").trim();
    const originalSalida = (actual.comentarioSalida || "").trim();
    const nuevoSalida = (comentarioSalida || "").trim();

    if (originalEntrada === nuevoEntrada && originalSalida === nuevoSalida)
      return;

    try {
      setSavingEntrada(true);

      const updates = {};
      if (originalEntrada !== nuevoEntrada) {
        updates.comentarioEntrada = nuevoEntrada;
      }
      if (originalSalida !== nuevoSalida) {
        updates.comentarioSalida = nuevoSalida;
      }

      const { error } = await supabase
        .from("EquipoAgendamiento")
        .update(updates)
        .eq("agendamiento_equipo", actual.agendamiento_equipo);

      if (error) {
        console.error("Error guardando información:", error);
        alert("No se pudo guardar la información.");
        return;
      }

      setEquipos((prev) =>
        prev.map((e) =>
          e.agendamiento_equipo === actual.agendamiento_equipo
            ? { ...e, ...updates }
            : e
        )
      );

      if (updates.comentarioEntrada) {
        setComentarioEntradaEdit(updates.comentarioEntrada);
      }
      if (updates.comentarioSalida) {
        setComentarioSalida(updates.comentarioSalida);
      }
    } catch (e) {
      console.error("Error inesperado al guardar información:", e);
    } finally {
      setSavingEntrada(false);
    }
  };

  if (loading) return;

  // Filtrar solo los registros del equipo seleccionado (por número de serie)
  let equiposFiltrados = equipos;
  let equipoActual = {};
  if (equipos.length > 0) {
    const serie = numeroSerieSeleccionado || (equipo && equipo.numeroSerie);
    let duplicados = equipos.filter((eq) => eq.numeroSerie === serie);
    if (duplicados.length > 1) {
      // Ordenar por fechaIngreso y, si son iguales, por una llave estable (agendamiento_equipo)
      duplicados = duplicados.sort(ordenarDuplicados);
      equiposFiltrados = duplicados;
      equipoActual = equiposFiltrados[registroActual] || {};
    } else {
      equiposFiltrados = [equipos.find((eq) => eq.numeroSerie === serie)];
      equipoActual = equiposFiltrados[0] || {};
    }
  }

  const hasUnsavedChanges = () => {
    const salidaDirty =
      comentarioSalida.trim() !== (equipoActual.comentarioSalida || "").trim();
    const entradaDirty =
      comentarioEntradaEdit.trim() !==
      (equipoActual.comentarioEntrada || "").trim();
    return salidaDirty || entradaDirty;
  };

  const handleDiscardChanges = () => {
    setComentarioSalida(equipoActual.comentarioSalida || "");
    setComentarioEntradaEdit(equipoActual.comentarioEntrada || "");
    if (onClose) onClose();
  };

  return (
    <>
      <WideFloatingModal
        
        onClose={onClose}
        hasUnsavedChanges={hasUnsavedChanges}
        onDiscardChanges={handleDiscardChanges}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-purple-300 text-center pt-6 pb-8 drop-shadow">
          Equipos Registrados
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-12">
          {/* Columna izquierda: Imagen */}
          <div className="flex flex-col items-center">
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
              className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-2xl shadow-lg border-4 border-slate-800 bg-white mb-6"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = ImagenGenerica;
              }}
            />
            <div className="w-full flex items-center justify-between">
              <button
                className={`flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 shadow-md transition-all duration-200 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                  registroActual === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  if (registroActual > 0) setRegistroActual(registroActual - 1);
                }}
                disabled={registroActual === 0}
                aria-label="Anterior registro"
              >
                <i className="bi bi-chevron-left text-white text-lg"></i>
              </button>
              <div className="text-purple-300 font-semibold text-center">
                No. Serie: {equipoActual.numeroSerie} ({registroActual + 1}/
                {equiposFiltrados.length})
              </div>
              <button
                className={`flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 shadow-md transition-all duration-200 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                  registroActual === equiposFiltrados.length - 1
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => {
                  if (registroActual < equiposFiltrados.length - 1)
                    setRegistroActual(registroActual + 1);
                }}
                disabled={registroActual === equiposFiltrados.length - 1}
                aria-label="Siguiente registro"
              >
                <i className="bi bi-chevron-right text-white text-lg"></i>
              </button>
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <label className="text-purple-300 font-semibold mb-1">
                  Ingreso
                </label>
                <InputCalendario
                  name="ingreso"
                  value={equipoActual.ingreso || ""}
                  onChange={() => {}}
                  required={false}
                  containerClassName="relative"
                  placeholder="Selecciona una fecha"
                />
              </div>
              <div className="relative">
                <label className="text-purple-300 font-semibold mb-1">
                  Salida
                </label>
                <InputCalendario
                  name="salida"
                  value={
                    equipoActual.estado === "Activo"
                      ? "Aún no ha salido"
                      : equipoActual.salida || ""
                  }
                  onChange={() => {}}
                  required={false}
                  containerClassName="relative"
                  placeholder="Selecciona una fecha"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-purple-300 font-semibold mb-1">
                  Comentario Entrada
                </label>
                <Input
                  name="comentarioEntrada"
                  as="textarea"
                  rows={2}
                  value={comentarioEntradaEdit}
                  readOnly={equipoActual.estado !== "Activo"}
                  disabled={equipoActual.estado !== "Activo"}
                  onChange={(e) => {
                    if (equipoActual.estado !== "Activo") return;
                    const v = e.target.value || "";
                    if (v.length <= 120) setComentarioEntradaEdit(v);
                  }}
                  className="bg-[#1a1a26] border border-slate-600/40 rounded-xl text-white px-4 py-2.5 mt-1 resize-none"
                />
                <div className="text-center text-xs mt-1 text-purple-400">
                  {comentarioEntradaEdit.length}/120 caracteres
                </div>
              </div>
              <div>
                <label className="text-purple-300 font-semibold mb-1">
                  Comentario Salida
                </label>
                <Input
                  name="comentarioSalida"
                  as="textarea"
                  rows={2}
                  value={comentarioSalida}
                  readOnly={equipoActual.estado !== "Activo"}
                  disabled={equipoActual.estado !== "Activo"}
                  onChange={(e) => {
                    if (equipoActual.estado !== "Activo") return;
                    const v = e.target.value || "";
                    if (v.length <= 120) setComentarioSalida(v);
                  }}
                  className="bg-[#1a1a26] border border-slate-600/40 rounded-xl text-white px-4 py-2.5 mt-1 resize-none"
                />
                <div className="text-center text-xs mt-1 text-purple-400">
                  {comentarioSalida.length}/120 caracteres
                </div>
              </div>
            </div>
            <div className="w-full flex items-center justify-between mt-6">
              <button
                onClick={handleGuardarEntrada}
                disabled={
                  equipoActual.estado !== "Activo" || !hasUnsavedChanges()
                }
                className={`w-full py-3 px-4 rounded-full font-semibold text-white bg-purple-600 shadow-md transition-all duration-200 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                  equipoActual.estado !== "Activo" || !hasUnsavedChanges()
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Actualizar información
              </button>
              <div className="flex items-center gap-3 ml-6">
                <Switch
                  checked={equipoActual.estado === "Activo"}
                  onChange={handleSwitchChange}
                  disabled={equipoActual.estado !== "Activo"}
                />
                <span
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-lg ${
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