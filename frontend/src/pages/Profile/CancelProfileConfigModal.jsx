import React , { useRef } from "react";
import FloatingModal from "../../components/common/popUp/FloatingModal";
import Button from "../../components/common/Button";
import ButtonBG from "../../components/common/ButtonBG";

const CancelProfileConfigModal = ({ onClose, onSave }) => { 
const fileInputRef = useRef();


return (
    <FloatingModal onClose={onClose}>
    <h2 className="text-2xl font-bold text-white mb-4 text-center">
        Configuración de tu perfil
    </h2>
    <hr className="border-t border-gray-700" />
    <div className="flex flex-col items-center">
        <span className="text-[#7c2ae8] my-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
        </svg>
        </span>
        <p className="text-white mb-2">¿Estás seguro de no guardar los cambios?</p>
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
}

export default CancelProfileConfigModal;