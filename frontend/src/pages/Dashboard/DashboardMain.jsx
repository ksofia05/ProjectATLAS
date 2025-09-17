import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PendingTasksCard from "../../components/dashboard/PendingTasksCard";
import CalendarCard from "../../components/dashboard/CalendarCard";
import ClientHistoryTable from "../../components/dashboard/ClientHistoryTable";
import { useAuth } from "../../context/AuthProvider";
import { useNavbarTitle } from "../../context/NavbarTitleContext";

export default function DashboardMain() {
  const { id } = useParams();
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, userProfile, isAuthenticated } = useAuth();
  const { setTitle, setSubtitle } = useNavbarTitle();

  const firstName = user?.user_metadata?.nombre?.split(" ")[0] || "Usuario";

  useEffect(() => {
    const newTitle = loading ? "Cargando..." : `Dashboard - ${projectName}`;
    const newSubtitle = `Hola ${firstName}, ¿Qué deseas hacer el día de hoy?`;

    setTitle(newTitle);
    setSubtitle(newSubtitle);

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
        const project = data.find((p) => String(p.id_proyecto) === String(id));
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
  }, [id, user, loading, projectName, setTitle, setSubtitle, firstName]);
  const trabajosPendientes = [5, 14, 19, 25, 30];

  return (
    <>
      <div className="flex flex-wrap gap-8 mb-8">
        <PendingTasksCard className="grow" />
        <CalendarCard className="grow min-w-[540px]" diasConPendientes={trabajosPendientes} />
      </div>
      <ClientHistoryTable />
    </>
  );
}