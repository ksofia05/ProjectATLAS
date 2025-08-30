import React from "react";

export function formatTimeAgo(dateString) {
    if (!dateString) return "";
    const now = new Date();
    const createdDate = new Date(dateString);

    const diffInSeconds = Math.floor((now - createdDate) / 1000);

    // Si es el mismo día, muestra "Hoy, hace X"
    if (
        now.getDate() === createdDate.getDate() &&
        now.getMonth() === createdDate.getMonth() &&
        now.getFullYear() === createdDate.getFullYear()
    ) {
        if (diffInSeconds < 60) return "Hoy, hace unos segundos";
        if (diffInSeconds < 3600) return `Hoy, hace ${Math.floor(diffInSeconds / 60)} min(s)`;
        return `Hoy, hace ${Math.floor(diffInSeconds / 3600)} h(s)`;
    }

    if (diffInSeconds < 60) return `Hace ${diffInSeconds} seg(s)`;
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min(s)`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h(s)`;
    if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} día(s)`;
    if (diffInSeconds < 2592000) return `Hace ${Math.floor(diffInSeconds / 604800)} sem(s)`;
    if (diffInSeconds < 31536000) return `Hace ${Math.floor(diffInSeconds / 2592000)} mes(es)`;
    return `Hace ${Math.floor(diffInSeconds / 31536000)} año(s)`;
}

export default function TaskItem({ task }) {
    const timeAgo = formatTimeAgo(task.createdAt);

    return (
        <div className="bg-[#2A273A] hover:bg-[#3c3853] transition-colors duration-300 rounded-2xl px-6 py-4 flex justify-between items-center w-full min-h-[58px] max-h-[58px] overflow-hidden">
            <div className="flex-grow-0 flex-shrink-0 pr-2" style={{ maxWidth: '75%' }}> 
                <h4 className="text-white font-semibold text-sm overflow-hidden whitespace-nowrap text-ellipsis">
                    {task.taskTitle}
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