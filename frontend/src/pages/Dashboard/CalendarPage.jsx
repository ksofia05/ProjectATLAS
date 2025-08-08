import React, { useState, useEffect } from "react";
import CalendarCard from "../../components/dashboard/CalendarCard";
import MyTasksCard from "../../components/calendar/MyTasksCard";
import DayTemplateModal from "../../components/dashboard/DayTemplateModal";
import { useNavbarTitle } from "../../context/NavbarTitleContext";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const { setTitle, setSubtitle } = useNavbarTitle();

  useEffect(() => {
    setTitle("Calendario");
    setSubtitle("Gestiona tus citas y tareas en el calendario!");
  }, [setTitle, setSubtitle]);

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const closeModal = () => {
    setSelectedDate(null);
  };

  return (
    <>
      <div className="flex flex-wrap gap-12 mt-4 items-start">
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