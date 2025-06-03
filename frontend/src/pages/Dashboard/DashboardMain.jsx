import React from "react";
import PendingTasksCard from "../../components/dashboard/PendingTasksCard";
import CalendarCard from "../../components/dashboard/CalendarCard";
import ClientHistoryTable from "../../components/dashboard/ClientHistoryTable";

export default function DashboardMain() {
  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-2">
        Dashboard - Generación T
      </h2>
      <p className="text-gray-400 mb-8">
        No puedo creer que estoy haciendo esto a las 4 de la madrugada xd
      </p>
      <div className="flex flex-wrap gap-8 mb-8">
        <PendingTasksCard />
        <CalendarCard />
      </div>
      <ClientHistoryTable />
    </>
  );
}