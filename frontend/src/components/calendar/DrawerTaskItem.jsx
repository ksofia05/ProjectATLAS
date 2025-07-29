import React, { useEffect, useRef, useState } from "react";
import ButtonBG from "../common/ButtonBG";


function formatTimeAgo(dateString) {
    const now = new Date();
    const createdDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - createdDate) / 1000);

    if (diffInSeconds < 60) {
        if (diffInSeconds < 10) return "Reciente";
        return `Hace ${diffInSeconds} seg(s)`;
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `Hace ${minutes} min(s)`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `Hace ${hours} h(s)`;
    } else if (diffInSeconds < 604800) { // Menos de 7 días
        const days = Math.floor(diffInSeconds / 86400);
        return `Hace ${days} día(s)`;
    } else if (diffInSeconds < 2592000) { // Menos de 30 días (aprox. 1 mes)
        const weeks = Math.floor(diffInSeconds / 604800);
        return `Hace ${weeks} sem(s)`;
    } else if (diffInSeconds < 31536000) { // Menos de 365 días (aprox. 1 año)
        const months = Math.floor(diffInSeconds / 2592000);
        return `Hace ${months} mes(es)`;
    } else {
        const years = Math.floor(diffInSeconds / 31536000);
        return `Hace ${years} año(s)`;
    }
}

export default function DrawerTaskItem({ task, onToggleSelect, onUpdateComment, isSelected: initialSelected }) {
    const [isSelected, setIsSelected] = useState(initialSelected);
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [commentText, setCommentText] = useState(task.comment || "");
    const textareaRef = useRef(null);

    const timeAgo = formatTimeAgo(task.createdAt);

    useEffect(() => {
        setIsSelected(initialSelected);
    }, [initialSelected]);

    const handleToggleSelect = () => {
        const newSelectedState = !isSelected;
        setIsSelected(newSelectedState);
        onToggleSelect(task.id, newSelectedState);
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        setIsEditingComment(true);
        setCommentText(task.comment || ""); 
    };

    const handleSaveComment = () => {
        onUpdateComment(task.id, commentText);
        setIsEditingComment(false);
    };

    const handleCancelEdit = () => {
        setIsEditingComment(false); 
        setCommentText(task.comment || ""); 
    };

    useEffect(() => {
        if (isEditingComment && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isEditingComment]);

    const isSaveCommentDisabled = commentText.trim().length === 0;

    return (
        <div className="flex flex-col mb-3">
            <div className="bg-[#2A273A] hover:bg-[#3c3853] transition-colors duration-300 rounded-2xl px-6 py-4 flex items-center w-full min-h-[58px] max-h-[58px] overflow-hidden relative">
                <button
                    onClick={handleToggleSelect}
                    className={`
                        flex-shrink-0 w-6 h-6 rounded-full border-2 mr-4
                        ${isSelected ? 'bg-transparent border-gray-500' : 'bg-transparent border-gray-500'}
                        transition-colors duration-200
                        flex items-center justify-center
                    `}
                    aria-label={isSelected ? "Desmarcar tarea" : "Marcar tarea"}
                >
                    {isSelected && <i className="bi bi-record-fill transformation-colors duration-200 opacity-50 text-purple-500 text-lg"></i>}
                </button>

                <div className="flex-grow pr-2">
                    <h4 className="text-white font-semibold text-sm overflow-hidden whitespace-nowrap text-ellipsis">
                        {task.taskTitle}
                    </h4>
                </div>

                <button
                    onClick={handleEditClick}
                    className="flex-shrink-0 text-gray-400 hover:text-purple-600 transition-colors duration-200 ml-4"
                    aria-label="Editar comentario de la tarea"
                >
                    <i className="bi bi-pencil-fill text-lg"></i>
                </button>
            </div>

            <span className="text-[#813dff] text-sm font-medium mt-1 ml-4 self-start">
                {timeAgo}
            </span>

            {isEditingComment && (
                <div className="bg-[#20202E] shadow-xl rounded-b-lg p-4 mt-2">
                    <textarea
                        ref={textareaRef}
                        className="w-full h-24 bg-[#14141d] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                        placeholder="Añade una descripción"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end mt-4 gap-3"> 
                        {/* Botón de Cancelar */}
                        <ButtonBG
                            onClick={handleCancelEdit}
                            className={`
                                flex items-center gap-3 shadow-xl rounded-2xl transition duration-500 px-6 py-2 font-semibold text-sm focus:outline-none
                                bg-[#343149] hover:bg-[#3c3a4b] text-white
                            `}
                        >
                            Cancelar
                        </ButtonBG>

                        {/* Botón de Guardar */}
                        <ButtonBG
                            onClick={handleSaveComment}
                            disabled={isSaveCommentDisabled}
                            className={`
                                flex items-center gap-3 shadow-xl rounded-2xl transition duration-500 px-6 py-2 font-semibold text-sm focus:outline-none
                                ${isSaveCommentDisabled ? 'bg-[#7c2ae8] text-white opacity-50 cursor-not-allowed' : 'bg-[#7c2ae8] hover:bg-[#5a1bb7] text-white'}
                            `}
                        >
                            Guardar
                        </ButtonBG>
                    </div>
                </div>
            )}
        </div>
    );
}
import React, { useEffect, useRef, useState } from "react";
import ButtonBG from "../common/ButtonBG";

function formatTimeAgo(dateString) {
    const now = new Date();
    const createdDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - createdDate) / 1000);

    if (diffInSeconds < 60) {
        if (diffInSeconds < 10) return "Reciente";
        return `Hace ${diffInSeconds} seg(s)`;
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `Hace ${minutes} min(s)`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `Hace ${hours} h(s)`;
    } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `Hace ${days} día(s)`;
    } else if (diffInSeconds < 2592000) {
        const weeks = Math.floor(diffInSeconds / 604800);
        return `Hace ${weeks} sem(s)`;
    } else if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2592000);
        return `Hace ${months} mes(es)`;
    } else {
        const years = Math.floor(diffInSeconds / 31536000);
        return `Hace ${years} año(s)`;
    }
}

export default function DrawerTaskItem({ task, onToggleSelect, onUpdateComment, isSelected: initialSelected }) {
    const [isSelected, setIsSelected] = useState(initialSelected);
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [commentText, setCommentText] = useState(task.comment || "");
    const textareaRef = useRef(null);

    const timeAgo = formatTimeAgo(task.createdAt);

    useEffect(() => {
        setIsSelected(initialSelected);
    }, [initialSelected]);

    const handleToggleSelect = () => {
        const newSelectedState = !isSelected;
        setIsSelected(newSelectedState);
        onToggleSelect(task.id, newSelectedState);
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        setIsEditingComment(true);
        setCommentText(task.comment || "");
    };

    const handleSaveComment = () => {
        onUpdateComment(task.id, commentText);
        setIsEditingComment(false);
    };

    const handleCancelEdit = () => {
        setIsEditingComment(false);
        setCommentText(task.comment || "");
    };

    useEffect(() => {
        if (isEditingComment && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isEditingComment]);

    const isSaveCommentDisabled = commentText.trim().length === 0;

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto">
                <div className="bg-[#2A273A] hover:bg-[#3c3853] transition-colors duration-300 rounded-2xl px-6 py-4 flex items-center w-full min-h-[58px] max-h-[58px] overflow-hidden relative">
                    <button
                        onClick={handleToggleSelect}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-4 ${
                            isSelected ? "bg-transparent border-gray-500" : "bg-transparent border-gray-500"
                        } transition-colors duration-200 flex items-center justify-center`}
                        aria-label={isSelected ? "Desmarcar tarea" : "Marcar tarea"}
                    >
                        {isSelected && (
                            <i className="bi bi-record-fill transformation-colors duration-200 opacity-50 text-purple-500 text-lg"></i>
                        )}
                    </button>

                    <div className="flex-grow pr-2">
                        <h4 className="text-white font-semibold text-sm overflow-hidden whitespace-nowrap text-ellipsis">
                            {task.taskTitle}
                        </h4>
                    </div>

                    <button
                        onClick={handleEditClick}
                        className="flex-shrink-0 text-gray-400 hover:text-purple-600 transition-colors duration-200 ml-4"
                        aria-label="Editar comentario de la tarea"
                    >
                        <i className="bi bi-pencil-fill text-lg"></i>
                    </button>
                </div>

                <span className="text-[#813dff] text-sm font-medium mt-1 ml-4 self-start">{timeAgo}</span>

                {isEditingComment && (
                    <div className="bg-[#20202E] shadow-xl rounded-b-lg p-4 mt-2">
                        <textarea
                            ref={textareaRef}
                            className="w-full h-24 bg-[#14141d] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                            placeholder="Añade una descripción"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end mt-4 gap-3">
                            <ButtonBG
                                onClick={handleCancelEdit}
                                className="flex items-center gap-3 shadow-xl rounded-2xl transition duration-500 px-6 py-2 font-semibold text-sm focus:outline-none bg-[#343149] hover:bg-[#3c3a4b] text-white"
                            >
                                Cancelar
                            </ButtonBG>
                            <ButtonBG
                                onClick={handleSaveComment}
                                disabled={isSaveCommentDisabled}
                                className={`flex items-center gap-3 shadow-xl rounded-2xl transition duration-500 px-6 py-2 font-semibold text-sm focus:outline-none ${
                                    isSaveCommentDisabled
                                        ? "bg-[#7c2ae8] text-white opacity-50 cursor-not-allowed"
                                        : "bg-[#7c2ae8] hover:bg-[#5a1bb7] text-white"
                                }`}
                            >
                                Guardar
                            </ButtonBG>
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-auto">
                <hr className="border-gray-700 my-4" />
                <div className="mt-4">
                    <h3 className="text-xs font-bold text-gray-400">Tareas Completadas ({task.completedCount || 0})</h3>
                </div>
            </div>
        </div>
    );
}