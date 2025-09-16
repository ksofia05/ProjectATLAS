import React, { useState, useEffect, useRef } from "react";

const ANIMATION_DURATION = 300;

const MdFloatingModal = ({ children, onClose, showClose = true, open = true, title }) => {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(open);
  const timeoutRef = useRef();
  const firstRender = useRef(true);

  useEffect(() => {
    if (open) {
      setMounted(true);
      if (firstRender.current) {
        setShow(true);
        firstRender.current = false;
      } else {
        timeoutRef.current = setTimeout(() => setShow(true), 10);
      }
    } else if (mounted) {
      setShow(false);
      timeoutRef.current = setTimeout(() => setMounted(false), ANIMATION_DURATION);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [open, mounted]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, ANIMATION_DURATION);
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        className={`
          fixed inset-0 transition-all duration-300
          ${show
            ? "backdrop-blur-[2px] bg-black/5 opacity-100 pointer-events-auto"
            : "backdrop-blur-0 bg-transparent opacity-0 pointer-events-auto"}
        `}
        style={{ transitionProperty: "backdrop-filter, background-color, opacity" }}
        onClick={handleClose}
        aria-label="Cerrar modal"
      />
      {/* Modal flotante con animación responsiva */}
      <div
        className={`
          fixed inset-0 flex items-center justify-center z-50
          transition-all duration-300 px-4 sm:px-6 md:px-8
          ${show
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-8 pointer-events-none"}
        `}
        style={{
          transitionProperty: "opacity, transform",
        }}
      >
        <div
          className="border border-gray-700 relative bg-gradient-to-tr from-[#17161d] via-[#1f1e29] to-[#323342] rounded-2xl shadow-2xl px-4 sm:px-6 md:px-10 py-4 sm:py-6 md:py-8 max-w-sm sm:max-w-md md:max-w-xl w-full scrollbar-none"
          style={{
            minHeight: "220px",
            maxHeight: "80vh",
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          {showClose && onClose && (
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-purple-400 hover:text-purple-600 text-xl sm:text-2xl font-bold"
              aria-label="Cerrar"
            >
              ✕
            </button>
          )}
          {title && (
            <>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mt-2 mb-2 text-center">{title}</h1>
              <hr className="my-2 sm:my-3 md:my-4 border-gray-700" />
            </>
          )}
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default MdFloatingModal;