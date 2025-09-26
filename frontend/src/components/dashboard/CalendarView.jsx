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

export default CalendarView;
