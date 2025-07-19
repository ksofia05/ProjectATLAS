import React, { useState, useRef, useEffect } from "react";
import FloatingModal from "../common/popUp/FloatingModal";
import ButtonBG from "../common/ButtonBG"; 
import Input from "../common/Input";

export default function NewTaskModal({ onClose, onSave }) {
    const [form, setForm] = useState({
        taskTitle: "",
        taskDescription: "",
        startDate: "",  
        endDate: "",
        taskTime: "",
    });

    const startDateInputRef = useRef(null);
    const endDateInputRef = useRef(null);
    const taskTimeInputRef = useRef(null);


    const [isFormValid, setIsFormValid] = useState(false);


    useEffect(() => {
        const { taskTitle, taskDescription, startDate, endDate, taskTime } = form;
        const allFieldsFilled =
            taskTitle.trim() !== "" &&
            taskDescription.trim() !== "" &&
            startDate.trim() !== "" &&
            endDate.trim() !== "" &&
            taskTime.trim() !== "";
        setIsFormValid(allFieldsFilled);
    }, [form]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            console.log("Guardando tarea:", form);
            onSave(form); 
        } else {
            console.log("Formulario incompleto. No se puede guardar.");
            
        }
    };

    return (
        <FloatingModal
            title="Nueva Tarea"
            onClose={onClose}
            className="w-[500px] max-w-full"
        >

            <style jsx>{`
                input[type="date"]::-webkit-calendar-picker-indicator,
                input[type="time"]::-webkit-calendar-picker-indicator {
                    display: none;
                    -webkit-appearance: none;
                    opacity: 0;
                    pointer-events: none;
                }

                input[type="time"]::-webkit-time-picker-indicator {
                    display: none;
                    -webkit-appearance: none;
                    opacity: 0;
                    pointer-events: none;
                }

                /* Para Firefox */
                input[type="date"],
                input[type="time"] {
                    -moz-appearance: none;
                    appearance: none; /* Propiedad estándar */
                }

                /* Ajustar el tamaño de fuente dentro de los inputs */
                input[type="date"],
                input[type="time"] {
                    font-size: 0.95rem; /* Ajuste del tamaño de fuente, puedes probar con '0.875rem' para 'text-sm' de Tailwind */
                    padding-right: 2.2rem; /* Aumenta el padding derecho para el icono */
                    padding-top: 0.75rem; /* Ajusta el padding vertical */
                    padding-bottom: 0.75rem; /* Ajusta el padding vertical */
                }

                /* Estilos específicos para el placeholder de la fecha */
                input[type="date"]:not([value]):before {
                    content: 'dd/mm/aaaa';
                    color: #9ca3af; /* Color de texto gris para el placeholder */
                }

                /* Estilos específicos para el placeholder de la hora */
                input[type="time"]:not([value]):before {
                    content: 'hh:mm';
                    color: #9ca3af; /* Color de texto gris para el placeholder */
                }

                /* Asegurar que el color del texto del input sea blanco cuando hay un valor */
                input[type="date"][value],
                input[type="time"][value] {
                    color: white;
                }
            `}</style>

            <h1 className="text-2xl font-bold text-white mt-6 mb-6 items-center text-center">
                Añadir una nueva tarea
            </h1>
            <hr className="border-t border-gray-700 mt-4 mb-4" />
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label="Añade un título:"
                    type="text"
                    name="taskTitle"
                    placeholder="Escribe el título de la tarea.."
                    required
                    value={form.taskTitle}
                    onChange={handleChange}
                />

                <div className="flex flex-col gap-2">
                    <label htmlFor="taskDescription" className="text-gray-300 font-semibold">
                        Añade una descripción:
                    </label>
                    <textarea
                        id="taskDescription"
                        name="taskDescription"
                        placeholder="Escribe una breve descripción..."
                        rows={4}
                        value={form.taskDescription}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-[#2A273A] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
                    ></textarea>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-gray-300 font-semibold mt-6 mb-2">Fecha y Hora:</label>
                    <div className="grid grid-cols-3 gap-4 items-center">

                        <div className="relative">
                            <span className="block text-gray-400 mb-1">Desde</span>
                            <div className="relative w-full">
                                <input
                                    ref={startDateInputRef}
                                    type="date"
                                    name="startDate"
                                    value={form.startDate}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg bg-[#2b2b3a] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-8"
                                    style={{ backgroundColor: '#2b2b3a', color: 'white' }}
                                />
                                <i
                                    className="bi bi-calendar text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                    onClick={() => startDateInputRef.current.showPicker()}
                                ></i>
                            </div>
                        </div>

                        <div className="relative">
                            <span className="block text-gray-400 mb-1">Hasta</span>
                            <div className="relative w-full text-sm">
                                <input
                                    ref={endDateInputRef}
                                    type="date"
                                    name="endDate"
                                    value={form.endDate}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg bg-[#2b2b3a] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-8"
                                    style={{ backgroundColor: '#2b2b3a', color: 'white' }}
                                />
                                <i
                                    className="bi bi-calendar text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                    onClick={() => endDateInputRef.current.showPicker()}
                                ></i>
                            </div>
                        </div>

                        <div className="relative">
                            <span className="block text-gray-400 mb-1">Hora</span>
                            <div className="relative w-full">
                                <input
                                    ref={taskTimeInputRef}
                                    type="time"
                                    name="taskTime"
                                    value={form.taskTime}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg bg-[#2b2b3a] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-8"
                                    style={{ backgroundColor: '#2b2b3a', color: 'white' }}
                                />
                                <i
                                    className="bi bi-clock text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                    onClick={() => taskTimeInputRef.current.showPicker()}
                                ></i>
                            </div>
                        </div>
                    </div>
                </div>

                {!isFormValid && (
                    <p className="text-red-500 text-xs mt-6">
                        Primero debes de llenar todos los campos antes de guardar
                    </p>
                )}

                <div className="flex justify-end mt-8 gap-6">
                    <ButtonBG
                        className="bg-[#343149] hover:bg-[#3c3a4b] text-white font-semibold px-6 py-2 rounded-xl shadow transition w-full h-12"
                        type="button"
                        onClick={onClose}
                    >
                        Cancelar
                    </ButtonBG>
                    <ButtonBG
                        type="submit"

                        className={`font-semibold px-6 py-2 rounded-xl shadow transition w-full h-12 ${
                            isFormValid
                                ? "bg-[#7c2ae8] hover:bg-[#5a1bb7] text-white" 
                                : "bg-[#7c2ae8] text-white opacity-50 cursor-not-allowed" 
                        }`}
                        disabled={!isFormValid} 
                    >
                        Guardar
                    </ButtonBG>
                </div>
            </form>
        </FloatingModal>
    );
}