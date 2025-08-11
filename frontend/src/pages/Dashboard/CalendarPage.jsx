import React, { useState, useEffect } from "react";
import CalendarCard from "../../components/dashboard/CalendarCard";
import MyTasksCard from "../../components/calendar/MyTasksCard";
<<<<<<< HEAD
import DayTemplateModal from "../../components/dashboard/DayTemplateModal";
import { useNavbarTitle } from "../../context/NavbarTitleContext";
=======
>>>>>>> a83c38b99e67d26af2b73b74aeefd9966d9edafa

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
<<<<<<< HEAD
      <div className="flex flex-wrap gap-12 items-start">
        <div className="flex gap-8 mb-8">
          <CalendarCard onDayClick={handleDayClick} />
        </div>
        <div className="flex mb-2">
          <MyTasksCard />
        </div>
=======
      <h2 className="text-3xl font-bold text-white mb-2">Calendario</h2>
      <p className="text-gray-300 mb-8">Gestiona tus citas y tareas en el calendario!</p>
      <div className="flex flex-wrap gap-8 items-start">
        <CalendarCard onDayClick={handleDayClick} />
        <MyTasksCard />
>>>>>>> a83c38b99e67d26af2b73b74aeefd9966d9edafa
      </div>
    </>
  );
}