import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dateUtils } from "../../utils/dateUtils";
import dayjs from "dayjs";
import { client as supabase } from "../../supabase/client";
import useUserStore from "../../stores/useUserStore";

const diasSemana = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];

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

const CalendarCard = ({ mes = null, year = null, className }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useUserStore((state) => state.user);

  const today = dayjs();
  const currentMonth = mes ? monthNames.indexOf(mes) : today.month();
  const currentYear = year || today.year();
  const monthName = monthNames[currentMonth];

  const [diasConPendientes, setDiasConPendientes] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;

      const startDate = dayjs()
        .year(currentYear)
        .month(currentMonth)
        .startOf("month")
        .format("YYYY-MM-DD");
      const endDate = dayjs()
        .year(currentYear)
        .month(currentMonth)
        .endOf("month")
        .format("YYYY-MM-DD");

      const { data, error } = await supabase
        .from("Tareas")
        .select("*")
        .gte("fechaCreacion", startDate)
        .lte("fechaCreacion", endDate)
        .eq("id_usuario", user.idUsuario);

      if (!error && data) {
        const groupedDays = data.map((task) =>
          dayjs(task.fechaCreacion).date()
        );
        setDiasConPendientes(groupedDays);
      }
    };

    fetchTasks();
  }, [currentMonth, currentYear, user]);

  const handleCalendarClick = () => {
    navigate(`/dashboard/${id}/calendario-avanzado`);
  };

  const daysInMonth = dateUtils.getDaysInMonth(currentYear, currentMonth);
  const firstDay = dateUtils.getFirstDayOfMonth(currentYear, currentMonth);

  const semanas = [];
  let dia = 1 - firstDay;

  for (let w = 0; w < 6; w++) {
    const semana = [];
    for (let d = 0; d < 7; d++, dia++) {
      if (dia < 1 || dia > daysInMonth) {
        semana.push(null);
      } else {
        semana.push(dia);
      }
    }
    semanas.push(semana);
  }

  const isCurrentMonth =
    today.month() === currentMonth && today.year() === currentYear;
  const todayDay = isCurrentMonth ? today.date() : null;

  return (
    <div
      className={`bg-gradient-to-br from-[#08080e]/95 to-[#0c0c14]/95 via-[#0a0a12]/95 backdrop-blur-md border border-slate-800/40 rounded-3xl px-6 sm:px-8 md:px-9 py-6 sm:py-7 md:py-8 w-full full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${className}`}
      onClick={handleCalendarClick}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
            Calendario
          </h3>
          <i className="bi bi-calendar-event text-lg sm:text-xl md:text-2xl text-gray-300" />
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl font-bold">
          {monthName}
        </div>
      </div>
      <div className="text-gray-400 text-sm sm:text-base font-semibold mb-2 sm:mb-3 ml-1">
        (Trabajos Pendientes)
      </div>
      <div>
        <div className="grid grid-cols-7 gap-y-1 mb-1 sm:mb-2">
          {diasSemana.map((dia) => (
            <div
              key={dia}
              className="text-center font-semibold text-xs sm:text-sm md:text-base"
            >
              {dia}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1 sm:gap-y-2">
          {semanas.flat().map((d, idx) =>
            d ? (
              <div
                key={idx}
                className={`text-center text-xs sm:text-sm md:text-base relative py-1 sm:py-0 ${
                  d === todayDay
                    ? "bg-purple-600 rounded-full font-bold text-white w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 flex items-center justify-center mx-auto text-xs sm:text-sm"
                    : ""
                } ${
                  diasConPendientes.includes(d)
                    ? "after:content-[''] after:block after:h-0.5 sm:after:h-0.5 md:after:h-1 after:bg-violet-400 after:rounded-full after:mt-0.5 sm:after:mt-1 after:mx-auto after:w-2 sm:after:w-3 md:after:w-4"
                    : ""
                }`}
              >
                {d}
              </div>
            ) : (
              <div key={idx} />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarCard;
