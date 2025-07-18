import React, { useState } from "react";
import NewTaskModal from "./NewTaskModal";
import TaskItem from "./TaskItem"; 
export default function MyTasksCard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]); 
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveTask = (newTaskData) => {

        const newTask = {
            ...newTaskData,
            createdAt: new Date().toISOString(), 
            id: Date.now(), // Un ID único simple para la tarea
        };

        setTasks((prevTasks) => {

            const updatedTasks = [newTask, ...prevTasks];

            if (updatedTasks.length > 6) {
                return updatedTasks.slice(0, 6);
            }
            return updatedTasks;
        });
        handleCloseModal(); 
    };

    return (
        <>
            <div className="bg-gradient-to-r from-[#181825] to-[#232335] border border-gray-700 rounded-2xl px-9 py-8 w-[500px] shadow-lg flex flex-col min-h-[700px] dashboard-hover-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="text-2xl font-bold text-white leading-tight">
                            Mis Tareas 📅
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-base text-gray-400 font-semibold">Más opciones</span>
                        <button
                            className="transition-transform duration-200 hover:scale-125 focus:outline-none py-4"
                            aria-label="Más opciones"
                        >
                            <i className="bi bi-three-dots text-gray-300 hover:text-purple-600 transition-colors text-lg"></i>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-3 overflow-hidden" style={{ maxHeight: 'calc(700px - 200px)' }}> 
                    {tasks.length === 0 ? (
                        <p className="text-gray-500">No tienes tareas pendientes.</p>
                    ) : (
                        tasks.map((task) => (
                            <TaskItem key={task.id} task={task} />
                        ))
                    )}
                </div>
                <div className="mt-auto flex justify-center pt-4"> 
                    <button
                        className="flex items-center gap-3 border-2 border-dashed border-purple-600 bg-[#14141d] text-purple-500 shadow-xl hover:border-purple-700 transition-transform duration-500 hover:scale-104 rounded-full px-26 py-4 font-semibold text-mg focus:outline-none"
                        onClick={handleOpenModal}
                    >
                        <span className="bg-[#0f0f16] border-2 border-purple-600 rounded-lg w-8 h-8 flex items-center justify-center text-lg text-purple-600 font-bold">
                            +
                        </span>
                        Añade una nueva tarea
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <NewTaskModal onClose={handleCloseModal} onSave={handleSaveTask} />
            )}
        </>
    );
}