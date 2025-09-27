import React, { useState, useEffect } from "react";

const FloatingModal = ({
  children,
  onClose,
  showCloseIcon = true,
  open = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 20);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 400);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-[99999] transition-all duration-400 pointer-events-auto ${
          isVisible
            ? "bg-black/5 backdrop-blur-[2px] opacity-100"
            : "bg-black/0 backdrop-blur-0 opacity-0"
        }`}
        onClick={handleBackdropClick}
      />
      {/* Modal */}
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 pointer-events-auto">
        <div
          className={`relative w-full max-w-md transition-all duration-400 pointer-events-auto ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-12 scale-95"
          }`}
          style={{
            transitionTimingFunction: isVisible
              ? "cubic-bezier(0.34, 1.56, 0.64, 1)"
              : "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div
            className="bg-[#14141e] border border-slate-700/50 rounded-2xl shadow-2xl p-8 w-full"
            style={{ minHeight: "220px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {showCloseIcon && onClose && (
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
                aria-label="Cerrar"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            )}
            {typeof children === "function"
              ? children({ handleClose })
              : children}
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingModal;
