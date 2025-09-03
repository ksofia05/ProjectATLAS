import React, { useState } from "react";
import CalendarView from "../../components/dashboard/CalendarView";
import { dateUtils } from "../../utils/dateUtils";
import dayjs from "dayjs";

export default function CalendarAdvancedPage() {
  const [currentYear, setCurrentYear] = useState(dateUtils.getCurrentYear());
  const [currentMonth, setCurrentMonth] = useState(dateUtils.getCurrentMonth());
  const [currentDay, setCurrentDay] = useState(dayjs().date());
  const [viewMode, setViewMode] = useState("year");

  const handleYearChange = (year) => {
    setCurrentYear(year);
  };

  const handleMonthSelect = (month) => {
    setCurrentMonth(month);
    setViewMode("month");
  };

  const handleDaySelect = (year, month, day) => {
    setCurrentYear(year);
    setCurrentMonth(month);
    setCurrentDay(day);
    setViewMode("day");
  };

  const handleBackToYear = () => {
    setCurrentMonth(null);
    setCurrentDay(null);
    setViewMode("year");
  };

  const handleBackToMonth = () => {
    setCurrentDay(null);
    setViewMode("month");
  };

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

  const yearOptions = Array.from({ length: 10 }, (_, i) => ({
    label: (2020 + i).toString(),
    value: (2020 + i).toString(),
  }));

  const viewOptions = [
    { label: "Vista anual", value: "year" },
    { label: "Vista mensual", value: "month" },
    { label: "Vista diaria", value: "day" },
  ];

  const handleYearSelect = (value) => {
    handleYearChange(parseInt(value));
  };

  const handleViewSelect = (value) => {
    setViewMode(value);

    if (value === "year") {
    } else if (value === "month") {
      if (currentMonth === null) {
        setCurrentMonth(dateUtils.getCurrentMonth()); 
      }
    } else if (value === "day") {
      const today = dayjs();
      if (currentDay === null || currentMonth === null || currentYear === null) {
        setCurrentDay(today.date());
        setCurrentMonth(today.month());
        setCurrentYear(today.year());
      }
    }
  };

  const getTitle = () => {
    return "Calendario";
  };

  const getSubtitle = () => {
    return "Organiza y gestiona tu tiempo de manera eficiente";
  };

  const handlePrevious = () => {
    if (viewMode === "year") {
      setCurrentYear((prev) => prev - 1);
    } else if (viewMode === "month") {
      const currentDate = dayjs().year(currentYear).month(currentMonth);
      const prevMonth = currentDate.subtract(1, "month");
      setCurrentMonth(prevMonth.month());
      setCurrentYear(prevMonth.year());
    } else if (viewMode === "day") {
      // Navegar día anterior
      const prevDay = dayjs(`${currentYear}-${(currentMonth+1).toString().padStart(2, "0")}-${currentDay.toString().padStart(2, "0")}`)
        .subtract(1, "day");
      setCurrentDay(prevDay.date());
      setCurrentMonth(prevDay.month());
      setCurrentYear(prevDay.year());
    }
  };

  const handleNext = () => {
    if (viewMode === "year") {
      setCurrentYear((prev) => prev + 1);
    } else if (viewMode === "month") {
      const currentDate = dayjs().year(currentYear).month(currentMonth);
      const nextMonth = currentDate.add(1, "month");
      setCurrentMonth(nextMonth.month());
      setCurrentYear(nextMonth.year());
    } else if (viewMode === "day") {
      // Navegar día siguiente
      const nextDay = dayjs(`${currentYear}-${(currentMonth+1).toString().padStart(2, "0")}-${currentDay.toString().padStart(2, "0")}`)
        .add(1, "day");
      setCurrentDay(nextDay.date());
      setCurrentMonth(nextDay.month());
      setCurrentYear(nextDay.year());
    }
  };

  const getNavigationTitle = () => {
    if (viewMode === "year") return currentYear.toString();
    if (viewMode === "month")
      return `${monthNames[currentMonth]} ${currentYear}`;
    if (viewMode === "day")
      return `${currentDay} ${monthNames[currentMonth]} ${currentYear}`;
  };

  const getNavigationSubtitle = () => {
    if (viewMode === "year") return "Vista anual";
    if (viewMode === "month") return "Vista mensual";
    if (viewMode === "day")
      return dayjs()
        .year(currentYear)
        .month(currentMonth)
        .date(currentDay)
        .format("dddd"); 
  };

  const BreadcrumbNavigation = () => (
    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
      <button
        onClick={() => handleViewSelect("year")}
        className={`hover:text-white transition-colors ${
          viewMode === "year" ? "text-white font-semibold" : ""
        }`}
      >
        {currentYear}
      </button>

      {(viewMode === "month" || viewMode === "day") && (
        <>
          <i className="bi bi-chevron-right text-xs"></i>
          <button
            onClick={() => handleViewSelect("month")}
            className={`hover:text-white transition-colors ${
              viewMode === "month" ? "text-white font-semibold" : ""
            }`}
          >
            {monthNames[currentMonth]}
          </button>
        </>
      )}

      {viewMode === "day" && (
        <>
          <i className="bi bi-chevron-right text-xs"></i>
          <span className="text-white font-semibold">{currentDay}</span>
        </>
      )}
    </div>
  );

  const handleGoToToday = () => {
    const today = dayjs();
    setCurrentYear(today.year());
    setCurrentMonth(today.month());
    setCurrentDay(today.date());
    setViewMode("day");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-white">{getTitle()}</h1>
        <p className="text-gray-300 mt-1">{getSubtitle()}</p>
      </div>

      <div className="bg-gradient-to-r from-[#181825] to-[#232335] rounded-3xl p-6 w-full text-white shadow-lg border border-gray-700">
        <BreadcrumbNavigation />

        {/* Navegación principal */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevious}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <i className="bi bi-chevron-left text-lg"></i>
            </button>

            <div className="text-center min-w-[200px]">
              <h2 className="text-xl font-bold text-white">
                {getNavigationTitle()}
              </h2>
              <p className="text-sm text-gray-400">{getNavigationSubtitle()}</p>
            </div>

            <button
              onClick={handleNext}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <i className="bi bi-chevron-right text-lg"></i>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGoToToday}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
            >
              Hoy
            </button>

            <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
              {["year", "month", "day"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleViewSelect(mode)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === mode
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  {mode === "year" ? "Año" : mode === "month" ? "Mes" : "Día"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido del calendario */}
        <CalendarView
          currentYear={currentYear}
          currentMonth={currentMonth}
          currentDay={currentDay}
          viewMode={viewMode}
          onMonthSelect={handleMonthSelect}
          onDaySelect={handleDaySelect}
        />
      </div>
    </div>
  );
}
