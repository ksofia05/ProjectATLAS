import React from "react";


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

export default function TaskItem({ task }) {
    const timeAgo = formatTimeAgo(task.createdAt);


    const displayTitle = task.taskTitle;


    return (
        <div className="bg-[#2A273A] hover:bg-[#3c3853] transition-colors duration-300 rounded-2xl px-6 py-4 flex justify-between items-center w-full min-h-[58px] max-h-[58px] overflow-hidden">
            {/* Ajustamos el max-width del contenedor del título */}
            <div className="flex-grow-0 flex-shrink-0 pr-2" style={{ maxWidth: '75%' }}> 
                <h4 className="text-white font-semibold text-sm overflow-hidden whitespace-nowrap text-ellipsis">
                    {displayTitle}
                </h4>
            </div>
            <div className="flex-shrink-0 text-right">
                <span className="text-[#813dff] text-sm font-medium">
                    {timeAgo}
                </span>
            </div>
        </div>
    );
}