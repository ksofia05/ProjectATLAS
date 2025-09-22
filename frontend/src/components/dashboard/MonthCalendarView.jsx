import React, { useEffect, useState } from "react";
import { dateUtils, isDayBlocked, canClickDay } from "../../utils/dateUtils.js";
import { isSunday, getHolidayInfo } from "../../utils/holidayUtils.js";
import dayjs from "dayjs";
import { client as supabase } from "../../supabase/client";
import useUserStore from "../../stores/useUserStore"; 
import useProjectsStore from "../../stores/useProjectsStore"; 

const MonthCalendarView = ({ year, month, onDaySelect }) => {
  const dayNames = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const getDaysInMonth = (year, month) => dateUtils.getDaysInMonth(year, month);
  const getFirstDayOfMonth = (year, month) =>
    dateUtils.getFirstDayOfMonth(year, month);

  
  const [tasksByDay, setTasksByDay] = useState({});
  const user = useUserStore((state) => state.user);
  
  

  useEffect(() => {
const fetchTasks = async () => {
  if (!user) return;
  const startDate = dayjs().year(year).month(month).startOf("month").format("YYYY-MM-DD");
  const endDate = dayjs().year(year).month(month).endOf("month").format("YYYY-MM-DD");

  const { data, error } = await supabase
    .from("Tareas")
    .select("*")
    .gte("fechaCreacion", startDate)
    .lte("fechaCreacion", endDate)
    .eq("id_usuario", user.idUsuario) 
    console.log("Supabase error:", error);
console.log("Tareas recibidas:", data);
     
  

  if (!error && data) {
    const grouped = {};
    data.forEach((task) => {
      const day = dayjs(task.fechaCreacion).date();
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(task);
    });
    setTasksByDay(grouped);
  }
};
    fetchTasks();
  }, [year, month, user,]);


  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Días del mes anterior
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        date: dayjs()
          .year(prevYear)
          .month(prevMonth)
          .date(daysInPrevMonth - i)
          .toDate(),
      });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: dayjs().year(year).month(month).date(day).toDate(),
      });
    }

    // Es para saber cuantas secciones mostrar
    const totalDays = days.length;
    const weeksNeeded = Math.ceil(totalDays / 7);
    const totalCells = weeksNeeded * 7;
    const remainingCells = totalCells - totalDays;

    // Días del mes siguiente (solo los necesarios para completar la última semana)
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: dayjs().year(nextYear).month(nextMonth).date(day).toDate(),
      });
    }

    return days;
  };

  const days = generateCalendarDays();
  const today = dayjs().toDate();

  const handleDayClick = (dayObj) => {
  // Solo bloquea domingos y festivos
  if (isDayBlocked(dayObj.date)) {
    return;
  }
  if (onDaySelect) {
    onDaySelect(
      dayObj.date.getFullYear(),
      dayObj.date.getMonth(),
      dayObj.date.getDate()
    );
  }
};

  return (
    <div className="overflow-hidden rounded-xl border border-gray-600">
      {/* Días de la semana */}
      <div className="grid grid-cols-7 border-b border-gray-600">
        {dayNames.map((dayName) => (
          <div
            key={dayName}
            className="p-4 text-center text-gray-300 font-semibold border-r border-gray-600 last:border-r-0 bg-[#232336]"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7">
        {days.map((dayObj, index) => {
          const isToday = dayjs(dayObj.date).isSame(today, "day");
          const blocked = isDayBlocked(dayObj.date);
          const holidayInfo = getHolidayInfo(dayObj.date);

          return (
            <div
              key={index}
              className={`
                min-h-32 p-3 border-r border-b border-gray-600 last:border-r-0
                ${dayObj.isCurrentMonth ? "bg-[#1a1a26]" : "bg-[#232336]"}
                ${
                  dayObj.isCurrentMonth && !blocked
                    ? "hover:bg-[#2a2a40] cursor-pointer"
                    : blocked && dayObj.isCurrentMonth
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-not-allowed"
                }
                transition-colors
              `}
              onClick={() => handleDayClick(dayObj)}
            >
              <div className="h-full flex flex-col relative">
                {/* Número del día */}
                <div
                  className={`
                    text-sm font-medium mb-2
                    ${
                      dayObj.isCurrentMonth
                        ? isToday
                          ? "text-purple-400 font-bold"
                          : blocked
                          ? "text-gray-500"
                          : "text-white"
                        : "text-gray-500"
                    }
                  `}
                >
                  {dayObj.day}
                </div>

                {/* Indicadores para días bloqueados */}
                {blocked && dayObj.isCurrentMonth && (
                  <div className="absolute top-1 right-1">
                    {isSunday(dayObj.date) ? (
                      <span className="text-xs" title="Domingo">
                        😴😴😴😴😴
                      </span>
                    ) : holidayInfo ? (
                      <span className="text-xs" title={holidayInfo.name}>
                        🥳🥳🥳🥳
                      </span>
                    ) : null}
                  </div>
                )}

                <div className="flex-1 space-y-1">
                  {dayObj.isCurrentMonth && tasksByDay[dayObj.day] && (
                    <div className="flex flex-col gap-1 mt-1">
                      {tasksByDay[dayObj.day]?.map((task, idx) => (
                        <div
                        key={task.id_Tarea || idx}
                        className="h-1 rounded-full bg-purple-400 w-3/4 mx-auto"
                        title={task.nombreTarea}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {holidayInfo && dayObj.isCurrentMonth && (
                  <div className="absolute bottom-0 left-0 right-0 text-xs text-center text-gray-600 bg-yellow-100/90 rounded-b px-1 py-1">
                    {holidayInfo.name}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthCalendarView;
