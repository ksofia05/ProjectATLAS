import React, { useState, useRef, useEffect } from "react";
import MdFloatingModal from "../common/popUp/MdFloatingModal";
import ButtonBG from "../common/ButtonBG";
import Input from "../common/Input";
import styled from "styled-components";

const DateInput = styled.input`
    &::-webkit-calendar-picker-indicator {
        opacity: 0;
        display: none;
    }
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: textfield;
`;

export default function NewTaskModal({ onClose, onSave, /*startDate,*/ hideDateAndTimeFields = false }) {
    const [form, setForm] = useState({
        taskTitle: "",
        taskDescription: "",
        // startDate: /*startDate ||*/ "",
        endDate: "",
        taskTime: "",
    });

    // const startDateInputRef = useRef(null);
    const endDateInputRef = useRef(null);
    const taskTimeInputRef = useRef(null);

    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const { taskTitle, taskDescription, /*startDate,*/ endDate, taskTime } = form;

        // Lógica de validación corregida
        if (hideDateAndTimeFields) {
            setIsFormValid(taskTitle.trim() !== "" && taskDescription.trim() !== "");
        } else {
            setIsFormValid(
                taskTitle.trim() !== "" &&
                taskDescription.trim() !== "" &&
                // startDate.trim() !== "" &&
                endDate.trim() !== "" &&
                taskTime.trim() !== ""
            );
        }
    }, [form, hideDateAndTimeFields]);

    // useEffect(() => {
    //     if (startDate && !form.startDate) {
    //         setForm((prevForm) => ({
    //             ...prevForm,
    //             startDate: startDate,
    //         }));
    //     }
    // }, [form, startDate]);

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
            onSave(form);
        }
    };

    return (
        <MdFloatingModal
            title="Añadir una nueva tarea"
            onClose={onClose}
        >
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
            >
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
                        className="w-full p-3 rounded-lg bg-[#2A273A] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        style={{
                            minHeight: "100px",
                        }}
                    ></textarea>
                </div>
                
                {!hideDateAndTimeFields && (
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-300 font-semibold mt-6 mb-2">Fecha y Hora:</label>
                        <div className="grid grid-cols-3 gap-4 items-center">
                            {/* Desde */}
                            {/* <div className="relative">
                                <span className="block text-gray-400 mb-1">Desde</span>
                                <div className="relative w-full">
                                    <DateInput
                                        ref={startDateInputRef}
                                        type="date"
                                        name="startDate"
                                        value={form.startDate}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-lg bg-[#2b2b3a] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-8"
                                        style={{ backgroundColor: '#2b2b3a', color: 'white' }}
                                    />
                                    <span
                                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                                        onClick={() => startDateInputRef.current && startDateInputRef.current.showPicker()}
                                        tabIndex={0}
                                        role="button"   
                                        aria-label="Abrir calendario"
                                    >
                                        <i className="bi bi-calendar text-gray-500" />
                                    </span>
                                </div>
                            </div> */}
                            {/* Hasta */}
                            <div className="relative">
                                <span className="block text-gray-400 mb-1">Fecha</span>
                                <div className="relative w-full text-sm">
                                    <DateInput
                                        ref={endDateInputRef}
                                        type="date"
                                        name="endDate"
                                        value={form.endDate}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-lg bg-[#2b2b3a] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-8"
                                        style={{ backgroundColor: '#2b2b3a', color: 'white' }}
                                    />
                                    <span
                                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                                        onClick={() => endDateInputRef.current && endDateInputRef.current.showPicker()}
                                        tabIndex={0}
                                        role="button"
                                        aria-label="Abrir calendario"
                                    >
                                        <i className="bi bi-calendar text-gray-500" />
                                    </span>
                                </div>
                            </div>
                            {/* Hora */}
                            <div className="relative">
                                <span className="block text-gray-400 mb-1">Hora</span>
                                <div className="relative w-full">
                                    <DateInput
                                        ref={taskTimeInputRef}
                                        type="time"
                                        name="taskTime"
                                        value={form.taskTime}
                                        onChange={handleChange}
                                        className="w-full p-3 rounded-lg bg-[#2b2b3a] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-8"
                                        style={{ backgroundColor: '#2b2b3a', color: 'white' }}
                                    />
                                    <span
                                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                                        onClick={() => taskTimeInputRef.current && taskTimeInputRef.current.showPicker()}
                                        tabIndex={0}
                                        role="button"
                                        aria-label="Abrir selector de hora"
                                    >
                                        <i className="bi bi-clock text-gray-500" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
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
        </MdFloatingModal>
    );
}