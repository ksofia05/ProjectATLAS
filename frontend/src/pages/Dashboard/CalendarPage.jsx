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
      <div className="w-full">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-start justify-items-center xl:justify-items-start">
          
          <div className="w-full flex justify-center xl:justify-start">
            <CalendarCard onDayClick={handleDayClick} />
          </div>
          
          <div className="w-full flex justify-center xl:justify-start">
            <MyTasksCard />
          </div>
          
        </div>
      </div>
      {selectedDate && (
        <DayTemplateModal 
          selectedDate={selectedDate}
          onClose={closeModal}
        />
      )}
    </>
  );
}