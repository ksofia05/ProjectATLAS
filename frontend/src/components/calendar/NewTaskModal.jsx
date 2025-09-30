import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { showErrorToast } from "../common/popUp/Loading";
import { isBlockedDay } from "../../utils/holidayUtils.js";
import TimePicker15 from "../common/TimePicker15";

const DateInput = styled.input`
  &::-webkit-calendar-picker-indicator {
    opacity: 0;
    display: none;
  }
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: textfield;
`;

export default function NewTaskModal({
  onClose,
  onSave,
  /*startDate,*/ hideDateAndTimeFields = false,
  onlyTimeField = false,
}) {
  const [form, setForm] = useState({
    taskTitle: "",
    taskDescription: "",
    endDate: "",
    taskTime: "",
  });

  const endDateInputRef = useRef(null);

  const [isFormValid, setIsFormValid] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Inicializar la animación
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 20);
    return () => clearTimeout(timer);
  }, []);

  const isPastDay = (selectedDate) => {
    if (!selectedDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(selectedDate);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isValidTime = (value, selectedDate) => {
    if (!value) return false;
    if (isPastDay(selectedDate)) return false;
    const [hour, minute] = value.split(":").map(Number);
    if (hour < 6 || hour > 18) return false;
    if (minute % 15 !== 0) return false;
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "endDate") {
      const [year, month, day] = value.split("-").map(Number);
      const selectedDate = new Date(year, month - 1, day, 12, 0, 0);

      if (isBlockedDay(selectedDate)) {
        showErrorToast("No puedes seleccionar domingos ni festivos.");
        setForm((prevForm) => ({
          ...prevForm,
          [name]: "",
        }));
        return;
      }
    }

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      onSave(form);
    }
  };

  const handleTimeChange = (value) => {
    setForm((prevForm) => ({
      ...prevForm,
      taskTime: value,
    }));
    if (!isValidTime(value, form.endDate)) {
      showErrorToast(
        "Solo puedes seleccionar horas entre 6:00 y 18:00 y minutos en intervalos de 15."
      );
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const { taskTitle, taskDescription, endDate, taskTime } = form;

    let isValid = false;

    if (hideDateAndTimeFields) {
      isValid = taskTitle.trim() !== "" && taskDescription.trim() !== "";
    } else if (onlyTimeField) {
      isValid =
        taskTitle.trim() !== "" &&
        taskDescription.trim() !== "" &&
        taskTime.trim() !== "" &&
        isValidTime(taskTime, endDate);
    } else {
      const dateObj = endDate ? new Date(endDate + "T12:00:00") : null;

      isValid =
        taskTitle.trim() !== "" &&
        taskDescription.trim() !== "" &&
        endDate &&
        endDate.trim() !== "" &&
        taskTime &&
        taskTime.trim() !== "" &&
        isValidTime(taskTime, endDate) &&
        !isBlockedDay(dateObj);
    }

    setIsFormValid(isValid);
  }, [form, hideDateAndTimeFields, onlyTimeField]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 transition-all duration-400 ${
          isVisible
            ? "bg-black/5 backdrop-blur-[2px] opacity-100"
            : "bg-black/0 backdrop-blur-0 opacity-0"
        }`}
        onClick={handleClose}
      />

      <div
        className={`relative z-10 w-full max-w-md transition-all duration-400 ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-12 scale-95"
        }`}
        style={{
          transitionTimingFunction: isVisible
            ? "cubic-bezier(0.34, 1.56, 0.64, 1)" 
            : "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
        onClick={handleBackdropClick}
      >
        <div className="bg-[#14141e] border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">
                Añadir nueva tarea
              </h2>
              <p className="text-xs text-gray-400">Organiza tu tiempo</p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Campo título */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                Título:
              </label>
              <input
                type="text"
                name="taskTitle"
                placeholder="Escribe el título de la tarea.."
                value={form.taskTitle}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-[#1a1a26] border border-slate-600/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm"
                autoFocus
              />
            </div>

            {/* Campo descripción */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                Descripción:
              </label>
              <textarea
                name="taskDescription"
                placeholder="Breve descripción..."
                rows={2}
                value={form.taskDescription}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-[#1a1a26] border border-slate-600/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 resize-none text-sm"
              />
            </div>

            {/* Campos de fecha y hora en grid para ahorrar espacio */}
            {!hideDateAndTimeFields && (
              <div
                className={`grid gap-4 ${
                  !onlyTimeField ? "grid-cols-2" : "grid-cols-1"
                }`}
              >
                {!onlyTimeField && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Fecha:
                    </label>
                    <div className="relative">
                      <DateInput
                        ref={endDateInputRef}
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-3 py-2.5 bg-[#1a1a26] border border-slate-600/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          endDateInputRef.current &&
                          endDateInputRef.current.showPicker()
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors duration-200"
                      >
                        <i className="bi bi-calendar3 text-sm"></i>
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Hora:
                  </label>
                  <div className="relative">
                    <TimePicker15
                      value={form.taskTime}
                      onChange={handleTimeChange}
                      disabled={isPastDay(form.endDate)}
                    />
                  </div>
                </div>
              </div>
            )}

            {!isFormValid && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-xs text-red-400 flex items-center gap-2">
                  <i className="bi bi-exclamation-triangle"></i>
                  Completa todos los campos antes de guardar
                </p>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 bg-[#1a1a26] hover:bg-[#20202e] text-gray-300 hover:text-white font-medium rounded-xl transition-all duration-200 border border-slate-600/40 hover:border-slate-500/50 text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`flex-1 px-4 py-2.5 font-medium rounded-xl transition-all duration-200 text-sm ${
                  isFormValid
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg"
                    : "bg-[#1a1a26] text-slate-500 cursor-not-allowed border border-slate-600/30"
                }`}
              >
                <i className="bi bi-check mr-1"></i>
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
