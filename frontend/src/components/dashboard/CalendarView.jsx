import React from "react";
import YearCalendarView from "./YearCalendarView";
import MonthCalendarView from "./MonthCalendarView";
import DayCalendarView from "./DayCalendarView";

const CalendarView = ({
  currentYear,
  currentMonth,
  currentDay,
  viewMode,
  onMonthSelect,
  onDaySelect,
}) => {
  if (viewMode === "day" && currentDay !== null) {
    return (
      <DayCalendarView
        year={currentYear}
        month={currentMonth}
        day={currentDay}
      />
    );
  }

  if (viewMode === "month" && currentMonth !== null) {
    return (
      <MonthCalendarView
        year={currentYear}
        month={currentMonth}
        onDaySelect={onDaySelect}
      />
    );
  }

  return <YearCalendarView year={currentYear} onMonthSelect={onMonthSelect} />;
};

const DayView = ({ currentYear, currentMonth, currentDay }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="space-y-4">
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="grid grid-cols-1 gap-1">
          {hours.map((hour) => (
            <div
              key={hour}
              className="flex items-center border-b border-gray-700/50 py-3"
            >
              <div className="w-20 text-right text-sm text-gray-400 pr-4">
                {hour === 0
                  ? "12 AM"
                  : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                  ? "12 PM"
                  : `${hour - 12} PM`}
              </div>
              <div className="flex-1 min-h-[40px] bg-gray-700/30 rounded hover:bg-gray-700/50 transition-colors cursor-pointer">
                {/* Aquí irían los pc por arreglar en el día */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
