import React, { useEffect, useState } from "react";
import { dateUtils } from "../../utils/dateUtils";
import dayjs from "dayjs";
import { client as supabase } from "../../supabase/client";
import useUserStore from "../../stores/useUserStore"; // Asegúrate de tener el usuario

const MonthCalendarView = ({ year, month, onDaySelect }) => {
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

  // --- NUEVO: Estado para las tareas agrupadas por día ---
  const [tasksByDay, setTasksByDay] = useState({});
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      const startDate = dayjs().year(year).month(month).startOf("month").format("YYYY-MM-DD");
      const endDate = dayjs().year(year).month(month).endOf("month").format("YYYY-MM-DD");
      // Ajusta el filtro por usuario si es necesario
      const { data, error } = await supabase
        .from("Tareas")
        .select("*")
        .gte("fechaCreacion", startDate)
        .lte("fechaCreacion", endDate);
        // Si quieres filtrar por usuario: .eq("id_usuario", user.idUsuario);

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
  }, [year, month, user]);
  // --- FIN NUEVO ---

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
          const isToday = dayjs(dayObj.date).isSame(dayjs(), "day");

          return (
            <div
              key={index}
              className={`
                min-h-32 p-3 border-r border-b border-gray-600 last:border-r-0
                ${dayObj.isCurrentMonth ? "bg-[#1a1a26]" : "bg-[#232336]"}
                hover:bg-[#2a2a40] transition-colors cursor-pointer
              `}
              onClick={() => {
                if (dayObj.isCurrentMonth && onDaySelect) {
                  onDaySelect(
                    dayObj.date.getFullYear(),
                    dayObj.date.getMonth(),
                    dayObj.date.getDate()
                  );
                }
              }}
            >
              <div className="h-full flex flex-col">
                <div
                  className={`
                    text-sm font-medium mb-2
                    ${
                      dayObj.isCurrentMonth
                        ? isToday
                          ? "text-purple-400 font-bold"
                          : "text-white"
                        : "text-gray-500"
                    }
                  `}
                >
                  {dayObj.day}
                </div>

                <div className="flex-1 space-y-1">
                  {/* --- NUEVO: Renderiza una línea por cada tarea de ese día --- */}
                  {dayObj.isCurrentMonth && tasksByDay[dayObj.day] && (
                    <div className="flex flex-col gap-1 mt-1">
                      {tasksByDay[dayObj.day].map((task, idx) => (
                        <div
                          key={task.id_Tarea || idx}
                          className="h-1 rounded-full bg-purple-400 w-3/4 mx-auto"
                          title={task.nombreTarea}
                        />
                      ))}
                    </div>
                  )}
                  {/* --- FIN NUEVO --- */}

                  
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthCalendarView;