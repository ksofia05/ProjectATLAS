import React, { useState, useEffect, useRef } from "react";
import UnsaveChangesModal from "../../dashboard/UnsaveChangesModal";

const ANIMATION_DURATION = 300;

const WideFloatingModal = ({
  children,
  onClose,
  showClose = true,
  open = true,
  className = "max-w-5xl",
  hasUnsavedChanges,
  onDiscardChanges,
}) => {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(open);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
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
      timeoutRef.current = setTimeout(
        () => setMounted(false),
        ANIMATION_DURATION
      );
    }
    return () => clearTimeout(timeoutRef.current);
  }, [open, mounted]);

  const handleClose = () => {
    if (hasUnsavedChanges && hasUnsavedChanges()) {
      setShowUnsavedModal(true);
    } else {
      setShow(false);
      setTimeout(() => {
        if (onClose) onClose();
      }, ANIMATION_DURATION);
    }
  };

  const handleDiscard = () => {
    setShowUnsavedModal(false);
    setShow(false);
    setTimeout(() => {
      if (onDiscardChanges) onDiscardChanges();
      if (onClose) onClose();
    }, ANIMATION_DURATION);
  };

  const handleStayEditing = () => {
    setShowUnsavedModal(false);
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        className={`fixed inset-0 transition-all duration-300 ${
          show
            ? "backdrop-blur-[2px] bg-black/50 opacity-100 pointer-events-auto"
            : "backdrop-blur-0 bg-black/0 opacity-0 pointer-events-none"
        }`}
        style={{
          transitionProperty: "background-color, opacity",
        }}
        onClick={handleClose}
        aria-label="Cerrar modal"
      />
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
          show
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-75 translate-y-10 pointer-events-none"
        }`}
        style={{
          transitionProperty: "opacity, transform",
        }}
      >
        <div
          className={`border border-slate-800 relative bg-[#0c0c14] rounded-3xl shadow-xl p-8 w-full ${className} transition-transform duration-300 ${
            show ? "scale-100 translate-y-0" : "scale-75 translate-y-10"
          }`}
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
          {typeof children === "function"
            ? children({ handleClose })
            : children}
        </div>
      </div>
      {showUnsavedModal && (
        <UnsaveChangesModal
          onClose={handleStayEditing}
          onDiscard={handleDiscard}
          onStay={handleStayEditing}
        />
      )}
    </div>
  );
};

export default WideFloatingModal;
