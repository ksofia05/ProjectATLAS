import React from "react";
import dayjs from "dayjs";

const DayCalendarView = ({ year, month, day }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Simulación de cosas para arreglar
  const events = [
    { hour: 10, title: "Arreglo del pc de Luisito", duration: 2 },
    { hour: 14, title: "Arreglo de pc patata", duration: 1 },
    { hour: 16, title: "Limpieza de ventilador de PC", duration: 1 },
  ];

  const formatHour = (hour) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const dayName = dayjs().year(year).month(month).date(day).format("dddd");

  return (
    <div className="bg-gradient-to-r from-[#181825] to-[#232335] rounded-3xl p-6 w-full text-white shadow-lg border border-gray-700 mt-0 flex flex-col h-[calc(100vh-240px)]">
      <div className="flex-1 overflow-y-auto scrollbar-subtle">
        <div className="grid grid-cols-[80px_1fr] gap-0">
          {hours.map((hour) => {
            const event = events.find((e) => e.hour === hour);

            return (
              <React.Fragment key={hour}>
                {/* Columna de hora */}
                <div className="text-right pr-4 py-4 text-sm text-gray-400 border-r border-gray-600">
                  {formatHour(hour)}
                </div>

                {/* Columna de contenido */}
                <div className="relative border-b border-gray-600 min-h-[60px] p-2 hover:bg-gray-800/30 transition-colors">
                  {event && (
                    <div
                      className="absolute left-2 right-2 bg-purple-600/80 text-white text-sm px-3 py-2 rounded-lg shadow-lg"
                      style={{
                        height: `${event.duration * 60 - 8}px`,
                        top: "4px",
                      }}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs text-purple-200">
                        {formatHour(hour)} - {formatHour(hour + event.duration)}
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DayCalendarView;
