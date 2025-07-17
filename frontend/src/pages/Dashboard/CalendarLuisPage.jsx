import React, { useState } from "react";
import CalendarView from "../../components/dashboard/CalendarView";

export default function CalendarLuisPage() {
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentDay, setCurrentDay] = useState(null);
  const [viewMode, setViewMode] = useState("year");
  const handleYearChange = (year) => {
    setCurrentYear(year);
  };

  const handleMonthSelect = (month) => {
    setCurrentMonth(month);
    setViewMode("month");
  };

  const handleDaySelect = (day) => {
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
        setCurrentMonth(new Date().getMonth());
      }
    } else if (value === "day") {
      // Si no hay día seleccionado, usar día actual
      if (currentDay === null) {
        const today = new Date();
        setCurrentDay(today.getDate());
        if (currentMonth === null) {
          setCurrentMonth(today.getMonth());
        }
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
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      setCurrentMonth(prevMonth);
      if (currentMonth === 0) setCurrentYear(prevYear);
    } else if (viewMode === "day") {
      // Navegar día anterior
      const prevDay = new Date(currentYear, currentMonth, currentDay - 1);
      setCurrentDay(prevDay.getDate());
      setCurrentMonth(prevDay.getMonth());
      setCurrentYear(prevDay.getFullYear());
    }
  };

  const handleNext = () => {
    if (viewMode === "year") {
      setCurrentYear((prev) => prev + 1);
    } else if (viewMode === "month") {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      setCurrentMonth(nextMonth);
      if (currentMonth === 11) setCurrentYear(nextYear);
    } else if (viewMode === "day") {
      // Navegar día siguiente
      const nextDay = new Date(currentYear, currentMonth, currentDay + 1);
      setCurrentDay(nextDay.getDate());
      setCurrentMonth(nextDay.getMonth());
      setCurrentYear(nextDay.getFullYear());
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
      return new Date(currentYear, currentMonth, currentDay).toLocaleDateString(
        "es-ES",
        { weekday: "long" }
      );
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
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setCurrentDay(today.getDate());
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
