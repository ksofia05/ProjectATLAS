import React, { useState, useRef } from "react";
import Input from "../common/Input";
import WideFloatingModal from "../common/popUp/WideFloatingModal";
import Switch from "../common/Switch";
import ImagenGenerica from "../../assets/pcDañada.jpg";
import EstateAdEquipmentModal from "./EstateAdEquipmentModal";
import InputCalendario from "../common/InputCalendario";

const EquipmentClientModal = ({ equipo, onClose }) => {
  // Detecta si la marca tiene un número entre paréntesis (ej: "Dell (2)")
  const match = equipo.marca.match(/\((\d+)\)/);
  const cantidadRegistros = match ? parseInt(match[1], 10) : 1;

  // Estados para navegación y datos
  const [registroActual, setRegistroActual] = useState(0);
  const [fechaSalida, setFechaSalida] = useState("");
  const salidaRef = useRef(null);

  // Estados individuales para cada registro
  const [estadosEquipos, setEstadosEquipos] = useState(
    Array.from({ length: cantidadRegistros }, () =>
      equipo.estado === "Inactivo" ? "Inactivo" : "Activo"
    )
  );
  const [bloquearSwitches, setBloquearSwitches] = useState(
    Array.from({ length: cantidadRegistros }, () => equipo.estado === "Inactivo")
  );

  const [showConfirmModal, setShowConfirmModal] = useState(false);


  //Los datos pueden ser dinamicos y de la BD en el futuro
  const [comentariosEntrada] = useState(
    Array.from({ length: cantidadRegistros }, (_, idx) =>
      equipo.comentarioEntrada
        ? `${equipo.comentarioEntrada} (${idx + 1})`
        : `Comentario entrada ${idx + 1}`
    )
  );

  const [comentariosSalida] = useState(
    Array.from({ length: cantidadRegistros }, (_, idx) =>
      `Comentario salida ${idx + 1}`
    )
  );

  // Solo este campo es editable
  const [fechasSalida, setFechasSalida] = useState(
    Array.from({ length: cantidadRegistros }, () => "")
  );

  // Genera los registros individuales
  const registros = Array.from({ length: cantidadRegistros }, (_, idx) => ({
    ...equipo,
    marca: equipo.marca.replace(/\s*\(\d+\)/, ""), // Quita el número de la marca
    registro: idx + 1,
  }));

  function getToday() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  // Maneja el cambio del switch
  const handleSwitchChange = () => {
    if (estadosEquipos[registroActual] === "Activo") {
      setShowConfirmModal(true);
    }
  };

  // Confirmar inactivación
  const handleConfirmInactivar = () => {
    setEstadosEquipos((prev) =>
      prev.map((estado, idx) =>
        idx === registroActual ? "Inactivo" : estado
      )
    );
    setBloquearSwitches((prev) =>
      prev.map((bloqueado, idx) =>
        idx === registroActual ? true : bloqueado
      )
    );
    setShowConfirmModal(false);
  };

  // Cancelar inactivación
  const handleCancelInactivar = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <WideFloatingModal className="max-w-6xl" onClose={onClose}>
        <h1 className="text-2xl font-bold text-white mx-8 mt-2 mb-2">
          Equipos Registrados
        </h1>
        <form className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Inputs columna izquierda */}
            <div className="flex flex-col gap-8">
              <Input
                label="Marca"
                name="marca"
                value={registros[registroActual].marca}
                readOnly
                placeholder="Marca del equipo"
              />
              <Input
                label="Comentario Entrada"
                name="comentarioEntrada"
                value={comentariosEntrada[registroActual]}
                readOnly
                placeholder="Comentario de entrada"
              />
              <Input
                label="Ingreso"
                name="ingreso"
                type="date"
                value={registros[registroActual].ingreso || getToday()}
                readOnly
                icon="bi-calendar"
                placeholder="Fecha de ingreso"
              />
            </div>
            {/* Inputs columna derecha */}
            <div className="flex flex-col gap-8 h-full">
              <Input
                label="No. Serie"
                name="serie"
                value={registros[registroActual].serie}
                readOnly
                placeholder="Número de serie"
              />
              <Input
                label="Comentario Salida"
                name="comentarioSalida"
                value={comentariosSalida[registroActual]}
                readOnly
                placeholder="Comentario de salida"
              />
              <InputCalendario
                label="Salida"
                value={fechasSalida[registroActual]}
                readOnly
                ref={salidaRef}
              />
            </div>
            {/* Imagen a la derecha */}
            <div className="flex items-center justify-center">
              <img
                src={ImagenGenerica}
                alt="Equipo"
                className="w-60 h-60 object-cover rounded-xl shadow"
              />
            </div>
          </div>
          {/* Navegación entre registros */}
          <div className="flex justify-end items-center px-6 gap-4 mt-4">
            <button
              onClick={() => setRegistroActual((prev) => Math.max(prev - 1, 0))}
              disabled={registroActual === 0}
              className="text-gray-400 shadow-2xl hover:text-purple-600 hover:text-shadow-xs text-shadow-purple-500/50 transition-colors dashboard-hover-text-shadow text-2xl px-2 "
              type="button"
            >
              &#8592;
            </button>
            <span className="text-white shadow-2xl">{registroActual + 1} / {cantidadRegistros}</span>
            <button
              onClick={() => setRegistroActual((prev) => Math.min(prev + 1, cantidadRegistros - 1))}
              disabled={registroActual === cantidadRegistros - 1}
              className="text-gray-400 shadow-2xl hover:text-purple-600 hover:text-shadow-xs text-shadow-purple-500/50 transition-colors dashboard-hover-text-shadow text-2xl px-2"
              type="button"
            >
              &#8594;
            </button>
          </div>
          {/* Switch de estado debajo de los inputs */}
          <div className="flex items-center gap-4 mt-4">
            <Switch
              checked={estadosEquipos[registroActual] === "Activo"}
              onChange={handleSwitchChange}
              disabled={bloquearSwitches[registroActual]}
            />
            <span
              className={
                estadosEquipos[registroActual] === "Activo"
                  ? "text-green-400 font-semibold"
                  : "text-red-400 font-semibold"
              }
            >
              {estadosEquipos[registroActual]}
            </span>
          </div>
        </form>
      </WideFloatingModal>
      {/* Modal de confirmación */}
      {showConfirmModal && (
        <EstateAdEquipmentModal
          onClose={handleCancelInactivar}
          onSave={handleConfirmInactivar}
          message="¿Estás seguro de que deseas inactivar este equipo?"
        />
      )}
    </>
  );
};

export default EquipmentClientModal;