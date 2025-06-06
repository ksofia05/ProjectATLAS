import React, { useRef } from "react";
import FloatingModal from "../common/popUp/FloatingModal";
import Button from "../common/Button";

const UpdateProfilePhotoModal = ({ onClose, onSave }) => {
  const fileInputRef = useRef();

  return (
    <FloatingModal onClose={onClose}>
      <h2 className="text-2xl font-bold text-white mb-2 text-center">
        Actualizar foto de perfil
      </h2>
      <hr className="border-t border-gray-700 mb-4" />
      <div className="flex flex-col items-center">
        <span className="text-[#7c2ae8] mb-2">
          <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 17a4 4 0 100-8 4 4 0 000 8zm8-10h-3.17l-1.84-2.58A2 2 0 0012.89 3h-1.78a2 2 0 00-1.6.82L7.17 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"></path>
          </svg>
        </span>
        <p className="text-white mb-2">¡Sube una imagen nueva!</p>
        <div className="border-2 border-dashed border-gray-500 rounded-lg w-full py-8 flex flex-col items-center mb-4">
          <p className="text-gray-400">Arrastra archivos aquí</p>
          <span className="text-gray-400 text-2xl">O</span>
          <Button
            className="mt-2 bg-gray-700 hover:bg-gray-600 max-w-xs"
            onClick={() => fileInputRef.current.click()}
          >
            Examinar archivos
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            // onChange={handleFileChange}
          />
        </div>
        <div className="flex gap-4 w-full mt-4">
          <Button className="bg-gray-700 hover:bg-gray-600" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-[#7c2ae8] hover:bg-[#5a1bb7]"
            onClick={onSave}
          >
            Guardar
          </Button>
        </div>
      </div>
    </FloatingModal>
  );
};

export default UpdateProfilePhotoModal;