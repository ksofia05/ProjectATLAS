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
      <div className="w-full">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-start justify-items-center xl:justify-items-start mb-8">
          
          <div className="w-full flex justify-center xl:justify-start">
            <PendingTasksCard />
          </div>
          
          <div className="w-full flex justify-center xl:justify-start">
            <CalendarCard diasConPendientes={trabajosPendientes} />
          </div>
          
        </div>
      </div>

      {/* ClientHistoryTable ocupa todo el ancho */}
      <ClientHistoryTable />
    </>
  );
}