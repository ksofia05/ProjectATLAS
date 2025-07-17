import React from "react";
import CalendarCard from "../../components/dashboard/CalendarCard";
import MyTasksCard from "../../components/calendar/MyTasksCard";

export default function CalendarPage() {
  return (
    <>
      <h2 className="text-3xl font-bold text-white mb-2">
        Calendario
      </h2>
      <p className="text-gray-300 mb-8">
        Gestiona tus citas y tareas en el calendario!
      </p>
      <div className="flex flex-wrap gap-12 items-start">
        <div className="flex gap-8 mb-8">
          <CalendarCard />
        </div>
        <div className="flex mb-2">
          <MyTasksCard />
        </div>
      </div>
    </>
  );
}