import React from "react";
import { dateUtils } from "../../utils/dateUtils";

const YearCalendarView = ({ year, onMonthSelect }) => {
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayNames = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];

  const getDaysInMonth = (year, month) => dateUtils.getDaysInMonth(year, month);
  const getFirstDayOfMonth = (year, month) =>
    dateUtils.getFirstDayOfMonth(year, month);

  const generateCalendarDays = (year, month) => {
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
        isToday: false,
      });
    }

    // Días del mes actual
    const today = dateUtils.today();
    const isCurrentMonth =
      today.getFullYear() === year && today.getMonth() === month;

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isToday: isCurrentMonth && today.getDate() === day,
      });
    }

    // Días del mes siguiente
    const totalCells = 42; // 6 semanas × 7 días
    const remainingCells = totalCells - days.length;

    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {monthNames.map((monthName, monthIndex) => {
        const days = generateCalendarDays(year, monthIndex);

        return (
          <div
            key={monthIndex}
            className="bg-[#232336] rounded-xl p-4 border border-gray-600/50 hover:border-purple-500/50 hover:bg-[#2a2a40] transition-all duration-300 cursor-pointer group"
            onClick={() => onMonthSelect(monthIndex)}
          >
            <h3 className="text-white text-lg font-semibold mb-3 text-center group-hover:text-purple-300 transition-colors">
              {monthName}
            </h3>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((dayName) => (
                <div
                  key={dayName}
                  className="text-gray-400 text-xs font-medium text-center py-1"
                >
                  {dayName}
                </div>
              ))}
            </div>

            {/* Días del mes */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((dayObj, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`
                    text-center py-1 text-xs rounded transition-colors
                    ${
                      dayObj.isCurrentMonth
                        ? dayObj.isToday
                          ? "bg-purple-600 text-white font-bold"
                          : "text-white hover:bg-gray-700"
                        : "text-gray-500"
                    }
                  `}
                >
                  {dayObj.day}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default YearCalendarView;
