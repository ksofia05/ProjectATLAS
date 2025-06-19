import React, { useState, useRef } from "react";
import Input from "../common/Input";
import WideFloatingModal from "../common/popUp/WideFloatingModal";
import Switch from "../common/Switch";
import ImagenGenerica from "../../assets/pcDañada.jpg";
import EstateAdEquipmentModal from "./EstateAdEquipmentModal";
import InputCalendario from "../common/InputCalendario";

const EquipmentClientModal = ({ equipo, onClose }) => {
  const [fechaSalida, setFechaSalida] = useState("");
  const salidaRef = useRef(null);
  const [estadoEquipo, setEstadoEquipo] = useState(equipo.estado || "Activo");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bloquearSwitch, setBloquearSwitch] = useState(equipo.estado === "Inactivo");

  function getToday() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  // Maneja el cambio del switch
  const handleSwitchChange = () => {
    if (estadoEquipo === "Activo" && !bloquearSwitch) {
      setShowConfirmModal(true);
    }
  };

  // Confirmar inactivación
  const handleConfirmInactivar = () => {
    setEstadoEquipo("Inactivo");
    setBloquearSwitch(true);
    setShowConfirmModal(false);
  };

  // Cancelar inactivación
  const handleCancelInactivar = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      <WideFloatingModal 
      className="max-w-6xl"
      onClose={onClose}>
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
                value={equipo.marca}
                readOnly
                placeholder="Marca del equipo"
              />
              <Input
                label="Comentario Entrada"
                name="comentarioEntrada"
                value={equipo.comentarioEntrada || "No hay comentarios aún"}
                readOnly
                placeholder="Comentario de entrada"
              />
              <Input
                label="Ingreso"
                name="ingreso"
                type="date"
                value={equipo.ingreso || getToday()}
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
                value={equipo.serie}
                readOnly
                placeholder="Número de serie"
              />
              <Input
                label="Comentario Salida"
                name="comentarioSalida"
                value={equipo.comentarioSalida || "No hay comentarios aún"}
                readOnly
                placeholder="Comentario de salida"
              />
              <InputCalendario
                label="Salida"
                value={fechaSalida}
                onChange={(e) => setFechaSalida(e.target.value)}
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
          {/* Switch de estado debajo de los inputs */}
          <div className="flex items-center gap-4 mt-4">
            <span
              className={
                estadoEquipo === "Activo"
                  ? "text-green-400 font-semibold"
                  : "text-red-400 font-semibold"
              }
            >
              {estadoEquipo}
            </span>
            <Switch
              checked={estadoEquipo === "Activo"}
              onChange={handleSwitchChange}
              disabled={bloquearSwitch}
            />
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