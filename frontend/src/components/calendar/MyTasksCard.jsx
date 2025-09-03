import React, { useState,useEffect } from "react";
import NewTaskModal from "./NewTaskModal";
import TaskItem from "./TaskItem";
import TasksListDrawer from "./TasksListDrawer";
import { client as supabase } from "../../supabase/client";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

export default function MyTasksCard() {
    const { userProfile } = useContext(AuthContext); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [tasks, setTasks] = useState([]);

        useEffect(() => {
        const fetchTasks = async () => {
            const { data, error } = await supabase
                .from("Tareas")
                .select("*")
                .eq("id_usuario", userProfile.idUsuario); // Filtra por el id del usuario

            if (!error) setTasks(data || []);
        };
        fetchTasks();
    }, [userProfile]); // Se actualiza cuando cambia el usuario

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenDrawer = () => {
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    const handleSaveTask = async (newTaskData) => {
        if (!userProfile) return;
        const { taskTitle, taskDescription, endDate, taskTime } = newTaskData;
        const { data, error } = await supabase
            .from('Tareas')
            .insert([
                {
                    nombreTarea: taskTitle,
                    descripcion: taskDescription,
                    fechaCreacion: endDate,
                    fechaLimite: taskTime,
                    fechaActual:new Date().toLocaleString("sv-SE"), // <-- Aquí agregas la fecha actual
                    id_usuario: userProfile.idUsuario // Guarda el id del usuario
                },
            ])
            .select()
            .single();

        if (error) {
            alert('Error al guardar la tarea: ' + error.message);
            return;
        }

        // Vuelve a consultar las tareas del usuario actual
        const { data: tareasActualizadas, error: errorFetch } = await supabase
            .from("Tareas")
            .select("*")
            .eq("id_usuario", userProfile.idUsuario);

        if (!errorFetch) setTasks(tareasActualizadas || []);
        handleCloseModal();
    };
    const updateTasksInCard = (updatedTasks) => {
        setTasks(updatedTasks);
    };
    return (
        <>
            <div className="bg-gradient-to-r from-[#181825] to-[#232335] border border-gray-700 rounded-2xl px-9 py-8 w-[520px] shadow-lg flex flex-col dashboard-hover-shadow min-h-[calc(100vh-200px)]">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="text-2xl font-bold text-white leading-tight">
                            Mis Tareas 📅
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-base text-gray-400 font-semibold">Ver Lista</span>
                        <button
                            className="transition-transform duration-200 hover:scale-125 focus:outline-none py-4"
                            aria-label="Más opciones"
                            onClick={handleOpenDrawer}
                        >
                            <i className="bi bi-three-dots text-gray-300 hover:text-purple-600 transition-colors text-lg"></i>
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-3 mt-3 overflow-y-auto pb-4 flex-grow">
                    {tasks.length === 0 ? (
                        <div className="flex-grow flex">
                            <p className="text-gray-500">No tienes tareas pendientes.</p>
                        </div>
                    ) : (
                            tasks.slice(0, 5).map((task) => (
                                <TaskItem
                                    key={task.id_Tarea}
                                    task={{
                                        taskTitle: task.nombreTarea,
                                        createdAt: task.fechaActual,
                                        // otros campos si los necesitas
                                    }}
                                />
                            ))
                    )}
                </div>
                <div className="mt-auto flex justify-center pt-4">
                    <button
                        className="flex items-center gap-3 border-2 border-dashed border-purple-600 bg-[#14141d] text-purple-500 shadow-xl hover:border-purple-700 hover:scale-104 rounded-full px-26 py-4 font-semibold text-mg focus:outline-none"
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

            <TasksListDrawer
                open={isDrawerOpen}
                onClose={handleCloseDrawer}
                tasks={tasks}
                onTasksUpdate={updateTasksInCard}
                />
        </>
    );
}