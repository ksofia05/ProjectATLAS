import React, { useState, useEffect, useRef } from "react";

const ANIMATION_DURATION = 300;

const FloatingModal = ({
  children,
  onClose,
  showClose = true,
  open = true,
  className = "max-w-md", // Valor por defecto
}) => {
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
      {/* Fondo con blur y transición poco a poco*/}
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
      {/* Modal flotante con animación */}
      <div
        className={`
          fixed inset-0 flex items-center justify-center z-50
          transition-all duration-300
          ${show
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-8 pointer-events-none"}
        `}
        style={{
          transitionProperty: "opacity, transform",
        }}
      >
        <div
          className={`border border-gray-700 relative bg-gradient-to-tr from-[#18162b] via-[#232041] to-[#2c2952] rounded-2xl shadow-2xl p-8 w-full ${className}`}
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
      </div>
    </div>
  );
};

export default FloatingModal;