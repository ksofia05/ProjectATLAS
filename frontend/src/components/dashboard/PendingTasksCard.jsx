import React from "react";
import ButtonGrey from "../common/ButtonGrey";
import UserTaskRow from "../common/UserTaskRow";

const collaborators = [
  { initials: "JP", name: "Juan Perez", pending: 5 },
  { initials: "CR", name: "Camila Rojas", pending: 3 },
  { initials: "JD", name: "Juan Diego", pending: 1 },
];

export default function PendingTasksCard({ className }) {
  return (
    <>
      <style>
        {`
          .no-backdrop-filter {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            filter: none !important;
          }
        `}
      </style>
      <div
        className={`bg-[#14141e] rounded-3xl border border-slate-700/50 px-9 py-8 no-backdrop-filter w-full max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${className}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">
              Trabajos Pendientes
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-base text-gray-300 font-semibold">
                (Colaboradores)
              </span>
              <i className="bi bi-tools text-gray-300 text-lg"></i>
            </div>
          </div>
          <ButtonGrey className="px-5 py-2 font-semibold text-base">
            Ver detalles
          </ButtonGrey>
        </div>
        <div className="flex flex-col gap-3 mb-3">
          {collaborators.map((col) => (
            <UserTaskRow
              key={col.name}
              initials={col.initials}
              name={col.name}
              rightContent={`${col.pending} Pendiente(s)`}
              rightContentClass="text-red-300"
            />
          ))}
          <div className="flex items-center gap-2 pl-2">
            <span className="text-xl text-gray-400">•••</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[#232336] pt-3 mt-1">
          <div className="flex items-center gap-2 text-gray-400 text-base font-normal">
            <i className="bi bi-people-fill text-lg"></i>
            <span className="text-gray-300 font-bold">12</span> Colaboradores
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-base font-normal">
            <i className="bi bi-tools text-lg"></i>
            <span className="text-gray-300 font-bold">18</span> Trabajos
          </div>
        </div>
      </div>
    </>
  );
}
