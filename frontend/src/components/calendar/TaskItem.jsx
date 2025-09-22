import React from "react";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

export function formatTimeAgo(dateString) {
  if (!dateString) return "";
  const now = dayjs();
  const createdDate = dayjs(dateString);

  let diffInSeconds = now.diff(createdDate, "second");
  if (diffInSeconds < 0) diffInSeconds = 0;

  if (now.isSame(createdDate, "day")) {
    if (diffInSeconds < 60) return `recientemente`;
    if (diffInSeconds < 3600)
      return `Hoy, hace ${Math.floor(diffInSeconds / 60)} min(s)`;
    return `Hoy, hace ${Math.floor(diffInSeconds / 3600)} h(s)`;
  }

  if (diffInSeconds < 60) return `Hace ${diffInSeconds} seg(s)`;
  if (diffInSeconds < 3600)
    return `Hace ${Math.floor(diffInSeconds / 60)} min(s)`;
  if (diffInSeconds < 86400)
    return `Hace ${Math.floor(diffInSeconds / 3600)} h(s)`;
  if (diffInSeconds < 604800)
    return `Hace ${Math.floor(diffInSeconds / 86400)} día(s)`;
  if (diffInSeconds < 2592000)
    return `Hace ${Math.floor(diffInSeconds / 604800)} sem(s)`;
  if (diffInSeconds < 31536000)
    return `Hace ${Math.floor(diffInSeconds / 2592000)} mes(es)`;
  return `Hace ${Math.floor(diffInSeconds / 31536000)} año(s)`;
}

export default function TaskItem({ task }) {
  const [timeAgo, setTimeAgo] = useState(formatTimeAgo(task.createdAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(task.createdAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [task.createdAt]);

  return (
    <div className="bg-slate-700/25 hover:bg-slate-600/35 border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 rounded-xl px-6 py-4 flex justify-between items-center w-full min-h-[58px] max-h-[58px] overflow-hidden backdrop-blur-sm group">
      <div
        className="flex-grow-0 flex-shrink-0 pr-2"
        style={{ maxWidth: "75%" }}
      >
        <h4 className="text-white group-hover:text-gray-100 font-semibold text-sm overflow-hidden whitespace-nowrap text-ellipsis transition-colors duration-300">
          {task.taskTitle}
        </h4>
      </div>
      <div className="flex-shrink-0 text-right">
        <span className="text-purple-400 group-hover:text-purple-300 text-sm font-medium transition-colors duration-300">
          {timeAgo}
        </span>
      </div>
    </div>
  );
}
