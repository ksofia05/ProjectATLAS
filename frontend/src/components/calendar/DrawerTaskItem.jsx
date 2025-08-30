import React, { useEffect, useRef, useState } from "react";
import ButtonBG from "../common/ButtonBG";

export function formatTimeAgo(dateString) {
    if (!dateString) return "";
    const now = new Date();
    const createdDate = new Date(dateString);

    // Log para depuración
    console.log("Comparando días:", now.getDate(), createdDate.getDate());
    console.log("Comparando meses:", now.getMonth(), createdDate.getMonth());
    console.log("Comparando años:", now.getFullYear(), createdDate.getFullYear());

    // Si es el mismo día, mes y año, muestra "Hoy"
    if (
        now.getDate() === createdDate.getDate() &&
        now.getMonth() === createdDate.getMonth() &&
        now.getFullYear() === createdDate.getFullYear()
    ) {
        console.log("Es hoy!");
        return "Hoy";
    }

    const diffInSeconds = Math.floor((now - createdDate) / 1000);

    if (diffInSeconds < 60) return `Hace ${diffInSeconds} seg(s)`;
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min(s)`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h(s)`;
    if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} día(s)`;
    if (diffInSeconds < 2592000) return `Hace ${Math.floor(diffInSeconds / 604800)} sem(s)`;
    if (diffInSeconds < 31536000) return `Hace ${Math.floor(diffInSeconds / 2592000)} mes(es)`;
    return `Hace ${Math.floor(diffInSeconds / 31536000)} año(s)`;
}
export default function DrawerTaskItem({ task, onToggleSelect, onUpdateComment, isSelected: initialSelected }) {
    const [isSelected, setIsSelected] = useState(initialSelected);
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [commentText, setCommentText] = useState(task.comment || "");
    const textareaRef = useRef(null);

    // console.log("createdAt:", task.createdAt);
    // console.log("Date parsed:", new Date(task.createdAt));
    // console.log("Now:", new Date());

    const timeAgo = formatTimeAgo(task.createdAt);

    useEffect(() => {
        setIsSelected(initialSelected);
    }, [initialSelected]);

    const handleToggleSelect = () => {
        const newSelectedState = !isSelected;
        setIsSelected(newSelectedState);
        // Cambia task.id por task.id_Tarea
        onToggleSelect(task.id_Tarea, newSelectedState);
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        setIsEditingComment(true);
        setCommentText(task.comment || "");
    };

    const handleSaveComment = () => {
        if (onUpdateComment) onUpdateComment(task.id_Tarea, commentText);
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
    // console.log("Render timeAgo:", timeAgo);

    return (
        <div className="flex flex-col ">
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
                {/* <span style={{color: 'red', fontWeight: 'bold'}}>DEBUG: {timeAgo}</span> */}

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
            
        </div>
    );
}