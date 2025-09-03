import React from "react";
import FloatingModal from "../common/popUp/FloatingModal";

const WarningModal = ({ 
    visible,
    onClose,
    title = "Ya tienes un proyecto asociado",
    message ="Actualmente  ya formas parte de un proyecto. Si deseas unirte a otro, primero debes de desvincularte del actual.",
    projectName,
    confirmText = "Entendido",
    showConfirm=false,
    onConfirm,
    showCloseIcon =true,
 }) => {

    if (!visible) return null;
    console.log("WarningModal visible:", visible, "projectName:", projectName);
    return(
    <FloatingModal onClose={onClose} showCloseIcon={showCloseIcon}>
      <div className="p-6">
        <div className="flex flex-col items-center">
          <span className="text-[#7c2ae8] my-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="56"
              fill="currentColor"
              className="bi bi-exclamation-diamond"
              viewBox="0 0 16 16"
            >
              <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.48 1.48 0 0 1 0-2.098zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z" />
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
            </svg>
          </span>
          <h2 className="text-xl font-bold text-white mb-2 text-center">{title}</h2>
          {projectName && (
            <p className="text-purple-400 font-semibold mb-2 text-center">
              Proyecto actual: <span className="text-white">{projectName}</span>
            </p>
          )}
          <p className="text-gray-200 mb-4 text-center">{message}</p>
          <div className="flex w-full mt-4 gap-4 justify-center">
            <button
              className="bg-gray-700 hover:bg-gray-600 w-full rounded-lg text-white py-2 px-4 font-semibold"
              onClick={onClose}
            >
              {confirmText}
            </button>
            {showConfirm && (
              <button
                className=" bg-[#7c2ae8] hover:bg-[#5a1bb7] w-full rounded-lg text-white py-2 px-4 font-semibold"
                onClick={onConfirm}
              >
                Confirmar
              </button>
            )}
          </div>
        </div>
      </div>
    </FloatingModal>    
    );
};
export default WarningModal;