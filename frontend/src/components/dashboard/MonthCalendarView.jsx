import React from "react";
import { dateUtils, isDayBlocked, canClickDay } from "../../utils/dateUtils.js";
import { isSunday, getHolidayInfo } from "../../utils/holidayUtils.js";
import dayjs from "dayjs";

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

    // Días del mes siguiente
    const totalCells = 42;
    const remainingCells = totalCells - days.length;
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
    if (!canClickDay(dayObj.date, dayObj.isCurrentMonth)) {
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
                  {/* Solo mostrar contenido si no está bloqueado */}
                  {dayObj.isCurrentMonth && !blocked && (
                    <>
                      {/* Ejemplo de tareas */}
                      {dayObj.day === 16 && (
                        <div className="bg-purple-600/80 text-white text-xs px-2 py-1 rounded">
                          Limpieza teclado de PC
                        </div>
                      )}
                      {dayObj.day === 25 && (
                        <div className="bg-blue-600/80 text-white text-xs px-2 py-1 rounded">
                          Entrega del pc de Juan
                        </div>
                      )}
                    </>
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
