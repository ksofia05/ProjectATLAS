import React, { useState } from "react";
import CalendarCard from "../../components/dashboard/CalendarCard";
import MyTasksCard from "../../components/calendar/MyTasksCard";
import DayTemplateModal from "../../components/dashboard/DayTemplateModal";

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
      <div className="flex flex-wrap gap-12 items-start">
        <div className="flex gap-8 mb-8">
          <CalendarCard onDayClick={handleDayClick} />
        </div>
        <div className="flex mb-2">
          <MyTasksCard />
        </div>
      </div>
      
    </>
  );
}