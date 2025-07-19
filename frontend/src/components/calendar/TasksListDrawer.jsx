// TasksListDrawer.jsx
import React, { useEffect, useRef, useState } from "react";
import DrawerTaskItem from "./DrawerTaskItem"; 
import ButtonBG from "../common/ButtonBG";

export default function TasksListDrawer({
    open,
    onClose,
    tasks, 
    onTasksUpdate,
}) {
    const [mounted, setMounted] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const [selectedTaskIds, setSelectedTaskIds] = useState(new Set());
    const timeoutRef = useRef();

    useEffect(() => {
        if (open) {
            setMounted(true);
            timeoutRef.current = setTimeout(() => setShowDrawer(true), 10);
        } else if (mounted) {
            setShowDrawer(false);
            setSelectedTaskIds(new Set()); 
            timeoutRef.current = setTimeout(() => setMounted(false), 300);
        }
        return () => clearTimeout(timeoutRef.current);
    }, [open, mounted]);

    const handleToggleSelectTask = (taskId, isSelected) => {
        setSelectedTaskIds((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (isSelected) {
                newSelected.add(taskId);
            } else {
                newSelected.delete(taskId);
            }
            return newSelected;
        });
    };

    const handleUpdateTaskComment = (taskId, newComment) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, comment: newComment } : task
        );
        onTasksUpdate(updatedTasks);
    };

    const handleCompleteSelectedTasks = () => {
        const remainingTasks = tasks.filter(task => !selectedTaskIds.has(task.id));
        onTasksUpdate(remainingTasks);
        setSelectedTaskIds(new Set());
    };

    const isCompleteButtonDisabled = selectedTaskIds.size === 0;

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            <div
                className={`
                    fixed inset-0 transition-all duration-300
                    ${
                        showDrawer
                            ? "backdrop-blur-[2px] bg-black/5 pointer-events-auto"
                            : "backdrop-blur-0 bg-transparent pointer-events-none"
                    }
                `}
                onClick={onClose}
                aria-label="Cerrar lista de tareas"
            />
            <aside
                className={`
                    fixed top-0 right-0 h-full w-full max-w-md bg-[#181825] shadow-2xl p-8 flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${showDrawer ? "translate-x-0" : "translate-x-full"}
                    rounded-l-3xl
                    pointer-events-auto
                `}
                style={{
                    boxShadow:
                        "0 0 32px 0 rgba(255,255,255,0.08), 0 2px 8px 0 rgba(0,0,0,0.12)",
                }}
            >
                <div className="relative mb-5">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-gray-400">Tareas</h2>
                        <div>
                            <h3 className="text-3xl font-bold text-white mt-2">Lista de Usuario</h3>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-0 right-0 text-white transition-colors duration-200 hover:text-purple-600 text-2xl -mt-4 mr-0"
                        tabIndex={0}
                        aria-label="Cerrar panel de tareas"
                    >
                        &times;
                    </button>
                </div>

                <hr className="border-gray-700 mb-6" />

                <div className="flex flex-col gap-3 overflow-y-auto flex-grow">
                    {tasks && tasks.length > 0 ? (
                        tasks.map((task) => (
                            <DrawerTaskItem
                                key={task.id}
                                task={task}
                                onToggleSelect={handleToggleSelectTask}
                                onUpdateComment={handleUpdateTaskComment}
                                isSelected={selectedTaskIds.has(task.id)} 
                            />
                        ))
                    ) : (
                        <p className="text-gray-500">No hay tareas disponibles.</p>
                    )}
                </div>

                <div className="mt-auto ml-auto flex pt-4">
                    <ButtonBG
                        onClick={handleCompleteSelectedTasks}
                        disabled={isCompleteButtonDisabled}
                        className={`
                            flex items-center gap-3 shadow-xl transition duration-500 hover:scale-104 rounded-xl px-6 py-3 font-semibold focus:outline-none
                            ${isCompleteButtonDisabled ? 'bg-[#7c2ae8] text-white opacity-50 cursor-not-allowed' : 'bg-[#7c2ae8] hover:bg-[#5a1bb7] text-white'}
                        `}
                    >
                        Completar
                    </ButtonBG>
                </div>
            </aside>
        </div>
    );
}
