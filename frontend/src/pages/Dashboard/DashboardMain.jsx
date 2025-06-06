import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PendingTasksCard from "../../components/dashboard/PendingTasksCard";
import CalendarCard from "../../components/dashboard/CalendarCard";
import ClientHistoryTable from "../../components/dashboard/ClientHistoryTable";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardMain() {
  const { id } = useParams();
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjectName = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8000/tasks/api/v1/Proyecto/?id_proyecto=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        const project = data.find(
          (p) => String(p.id_proyecto) === String(id)
        );
        if (project) {
          setProjectName(project.nombreproyecto);
        } else {
          setProjectName("Proyecto");
        }
      } catch (error) {
        setProjectName("Proyecto");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectName();
  }, [id]);

  const firstName = user?.user_metadata?.nombre?.split(" ")[0] || "Usuario";

  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-2">
        {loading ? "Cargando..." : `Dashboard - ${projectName}`}
      </h2>
      <p className="text-gray-400 mb-8">
        Hola {firstName}, ¿Qué deseas hacer el día de hoy?
      </p>
      <div className="flex flex-wrap gap-8 mb-8">
        <PendingTasksCard />
        <CalendarCard />
      </div>
      <ClientHistoryTable />
    </>
  );
}