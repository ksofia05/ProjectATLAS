import React, { useState } from "react";

const FloatingModal = ({ children, onClose, showClose = true }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (onClose) onClose();
      setIsClosing(false);
    }, 400); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div
        className={`border border-gray-700  relative bg-gradient-to-tr from-[#18162b] via-[#232041] to-[#2c2952] rounded-2xl shadow-2xl p-8 max-w-md w-full
          ${isClosing ? "animate-floatModalOut" : "animate-floatModalIn"}`}
        style={{ minHeight: "220px" }}
      >
        {showClose && onClose && (
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-purple-400 hover:text-purple-600 text-xl font-bold"
            aria-label="Cerrar"
          >
            ✕
          </button>
        )}
        {typeof children === "function" ? children({ handleClose }) : children}
      </div>
      <style jsx="true">{`
        @keyframes floatModalIn {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes floatModalOut {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
        }
        .animate-floatModalIn {
          animation: floatModalIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-floatModalOut {
          animation: floatModalOut 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default FloatingModal;