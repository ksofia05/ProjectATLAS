import React, { useRef } from "react";
import FloatingModal from "../common/popUp/FloatingModal";
import Button from "../common/Button";
import ButtonBG from "../common/ButtonBG";

const EstateAdEquipmentModal = ({ onClose, onSave }) => {
  const fileInputRef = useRef();

  return (
    <FloatingModal onClose={onClose}>
      <h2 className="text-2xl font-bold text-white mb-4 text-center">
        Actualizar Estado
      </h2>
      <hr className="border-t border-gray-700" />
      <div className="flex flex-col items-center">
        <span className="text-[#7c2ae8] my-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="68" height="68" fill="currentColor" className="bi bi-exclamation-diamond" viewBox="0 0 16 16">
            <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.48 1.48 0 0 1 0-2.098zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
          </svg>
        </span>
        <p className="text-white text-center mb-2">
          Atención, esta decisión es irreversible. ¿Desea continuar?
        </p>
        <div className="flex gap-4 w-full mt-4">
          <ButtonBG
            className="bg-[#282446] hover:bg-[#373263] text-white w-full rounded-lg"
            onClick={onClose}
          >
            Cancelar
          </ButtonBG>
          <Button
            type="submit"
            className="bg-[#7c2ae8] hover:bg-[#5a1bb7]"
            onClick={onSave}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </FloatingModal>
  );
};

export default EstateAdEquipmentModal;