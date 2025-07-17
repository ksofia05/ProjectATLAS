import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const diasSemana = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
const diasPendientes = [30, 5, 14, 9, 19];

const CalendarCard = ({
  mes = "Agosto",
  year = 2025,
  diasConPendientes = diasPendientes,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleCalendarClick = () => {
    navigate(`/dashboard/${id}/calendario-avanzado`);
  };

  const diasMes = 31;
  const primerDiaSemana = 5;
  const semanas = [];
  let dia = 1 - primerDiaSemana;

  for (let w = 0; w < 6; w++) {
    const semana = [];
    for (let d = 0; d < 7; d++, dia++) {
      if (dia < 1 || dia > diasMes) {
        semana.push(null);
      } else {
        semana.push(dia);
      }
    }
    semanas.push(semana);
  }

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
        <div className="text-3xl font-bold">{mes}</div>
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
