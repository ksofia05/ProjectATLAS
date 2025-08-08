import React, { useState } from "react";
import CalendarCard from "../../components/dashboard/CalendarCard";
import MyTasksCard from "../../components/calendar/MyTasksCard";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const closeModal = () => {
    setSelectedDate(null);
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-white mb-2">Calendario</h2>
      <p className="text-gray-300 mb-8">Gestiona tus citas y tareas en el calendario!</p>
      <div className="flex flex-wrap gap-8 items-start">
        <CalendarCard onDayClick={handleDayClick} />
        <MyTasksCard />
      </div>
    </>
  );
}