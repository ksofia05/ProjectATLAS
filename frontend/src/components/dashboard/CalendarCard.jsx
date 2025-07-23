import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dateUtils } from "../../utils/dateUtils";
import dayjs from "dayjs";

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

const CalendarCard = ({
  mes = null,
  year = null,
  diasConPendientes = [], 
}) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const today = dayjs();
  const currentMonth = mes ? monthNames.indexOf(mes) : today.month();
  const currentYear = year || today.year();
  const monthName = monthNames[currentMonth];

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
      className="bg-gradient-to-r from-[#181825] to-[#232335] border border-gray-700 rounded-3xl py-6 px-8 w-[540px] max-w-full text-white shadow-lg dashboard-hover-shadow cursor-pointer hover:border-purple-500/50 hover:bg-gradient-to-r hover:from-[#1a1a2e] hover:to-[#2a2a45] transition-all duration-300"
      onClick={handleCalendarClick}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold">Calendario</h3>
          <i className="bi bi-calendar-event text-2xl text-gray-300" />
        </div>
        <div className="text-3xl font-bold">{monthName}</div>
      </div>
      <div className="text-gray-400 text-base font-semibold mb-2 ml-1">
        (Trabajos Pendientes)
      </div>
      <div>
        <div className="grid grid-cols-7 gap-y-1 mb-1">
          {diasSemana.map((dia) => (
            <div key={dia} className="text-center font-semibold text-base">
              {dia}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-2">
          {semanas.flat().map((d, idx) =>
            d ? (
              <div
                key={idx}
                className={`text-center text-base relative ${
                  
                  d === todayDay
                    ? "bg-purple-600 rounded-full font-bold text-white"
                    : ""
                } ${
                  
                  diasConPendientes.includes(d)
                    ? "after:content-[''] after:block after:h-1 after:bg-violet-400 after:rounded-full after:mt-1"
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
