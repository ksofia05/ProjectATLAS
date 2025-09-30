import React from "react";
import { createPortal } from "react-dom";
import NewTaskModal from "../calendar/NewTaskModal";
import TaskDetailModal from "../calendar/TaskDetailModal";
import dayjs from "dayjs";
import { client as supabase } from "../../supabase/client";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { showErrorToast } from "../common/popUp/Loading";
import WarningModal from "./WarningModal";

const DayCalendarView = ({ year, month, day }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Estado para tareas asignadas
  const [tasks, setTasks] = React.useState([]);
  const [showTaskModal, setShowTaskModal] = React.useState(false);
  const [showDetailModal, setShowDetailModal] = React.useState(false);
  const [selectedHour, setSelectedHour] = React.useState(null);
  const [modalTaskData, setModalTaskData] = React.useState(null);
  const [detailTaskData, setDetailTaskData] = React.useState(null);

  // Estado para confirmación de borrado
  const [showWarningModal, setShowWarningModal] = React.useState(false);
  const [taskToDelete, setTaskToDelete] = React.useState(null);

  // Abrir modal para añadir tarea
  const isPastDay = (year, month, day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(year, month, day);
    selected.setHours(0, 0, 0, 0);
    return selected < today;
  };

  const handleHourClick = (hour) => {
    if (isPastDay(year, month, day)) {
      showErrorToast("No puedes crear tareas en días anteriores a hoy.");
      return;
    }
    setSelectedHour(hour);
    setShowTaskModal(true);
    setModalTaskData({
      startDate: dayjs().year(year).month(month).date(day).format("YYYY-MM-DD"),
      taskTime: `${hour.toString().padStart(2, "0")}:00`,
    });
  };

  // Abrir modal de detalle de tarea (siempre sincroniza con tasks)
  const handleTaskClick = (task) => {
    const updatedTask = tasks.find((t) => t.id_Tarea === task.id_Tarea);
    setDetailTaskData(updatedTask);
    setShowDetailModal(true);
  };

  const { userProfile } = useContext(AuthContext);

  const handleAddTask = async (taskData) => {
    if (!userProfile) return;
    const fechaCreacion = modalTaskData?.startDate;
    const { error } = await supabase.from("Tareas").insert([
      {
        nombreTarea: taskData.taskTitle,
        descripcion: taskData.taskDescription,
        fechaCreacion: fechaCreacion,
        fechaLimite: taskData.taskTime,
        fechaActual: new Date().toLocaleString("sv-SE"),
        id_usuario: userProfile.idUsuario,
        filtro: "por completar",
      },
    ]);
    if (error) {
      alert("Error al guardar la tarea: " + error.message);
      return;
    }
    fetchTasksForDay();
    setShowTaskModal(false);
    setSelectedHour(null);
    setModalTaskData(null);
  };

  const fetchTasksForDay = async () => {
    if (!userProfile) return;
    const fechaActual = dayjs()
      .year(year)
      .month(month)
      .date(day)
      .format("YYYY-MM-DD");
    const { data, error } = await supabase
      .from("Tareas")
      .select("*")
      .eq("fechaCreacion", fechaActual)
      .eq("id_usuario", userProfile.idUsuario);
    if (!error) setTasks(data || []);
  };

  // Actualizar tarea (título y descripción)
  const handleUpdateInfo = async (id_Tarea, newTitle, newDescription) => {
    const { error } = await supabase
      .from("Tareas")
      .update({
        nombreTarea: newTitle,
        descripcion: newDescription,
      })
      .eq("id_Tarea", id_Tarea);
    if (error) {
      alert("Error al actualizar la tarea: " + error.message);
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id_Tarea === id_Tarea
          ? { ...t, nombreTarea: newTitle, descripcion: newDescription }
          : t
      )
    );
    setDetailTaskData((prev) => {
      const updated = tasks.find((t) => t.id_Tarea === id_Tarea);
      return updated
        ? { ...updated, nombreTarea: newTitle, descripcion: newDescription }
        : prev;
    });
  };

  // Eliminar tarea
  const handleDeleteTask = async (task) => {
    const { error } = await supabase
      .from("Tareas")
      .delete()
      .eq("id_Tarea", task.id_Tarea);
    if (error) {
      alert("error al borrar tarea: " + error.message);
      return;
    }
    setTasks((prev) => prev.filter((t) => t.id_Tarea !== task.id_Tarea));
    setShowDetailModal(false);
    setTaskToDelete(null);
  };

  // Completar/no completado
  const handleToggleComplete = async (id_Tarea) => {
    const tarea = tasks.find((t) => t.id_Tarea === id_Tarea);
    if (!tarea) return;

    const nuevoFiltro =
      tarea.filtro === "completado" ? "por completar" : "completado";

    const { error } = await supabase
      .from("Tareas")
      .update({ filtro: nuevoFiltro })
      .eq("id_Tarea", id_Tarea);

    if (error) {
      alert("error al actualizar estado");
      return;
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id_Tarea === id_Tarea ? { ...t, filtro: nuevoFiltro } : t
      )
    );
    setDetailTaskData((prev) =>
      prev && prev.id_Tarea === id_Tarea
        ? { ...prev, filtro: nuevoFiltro }
        : prev
    );
  };

  // Cerrar modal de nueva tarea
  const handleCloseModal = () => {
    setShowTaskModal(false);
    setSelectedHour(null);
    setModalTaskData(null);
  };

  // Cerrar modal de detalle
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setDetailTaskData(null);
  };

  const formatHour = (hour) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  const dayName = dayjs().year(year).month(month).date(day).format("dddd");
  React.useEffect(() => {
    fetchTasksForDay();
  }, [year, month, day, userProfile]);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-700/40 bg-gradient-to-br from-[#08080e]/80 to-[#0c0c14]/80 backdrop-blur-sm shadow-lg flex flex-col h-[calc(100vh-240px)]">
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-[100px_1fr] gap-0">
            {hours.map((hour) => {
              const tareasHora = tasks.filter(
                (t) =>
                  t.fechaLimite &&
                  parseInt(t.fechaLimite.slice(0, 2), 10) === hour
              );
              const minHeight = Math.max(80, 60 + tareasHora.length * 52);

              return (
                <React.Fragment key={hour}>
                  {/* Columna de horas */}
                  <div className="flex items-start justify-end pr-4 pt-4 text-sm text-slate-400 border-r border-slate-700/40 bg-gradient-to-r from-slate-800/20 to-slate-900/20">
                    <span className="font-medium">{formatHour(hour)}</span>
                  </div>

                  {/* Columna de contenido */}
                  <div
                    className="relative border-b border-slate-700/40 p-3 hover:bg-slate-800/20 transition-all duration-200 cursor-pointer group"
                    style={{ minHeight: `${minHeight}px` }}
                    onClick={(e) => {
                      if (e.target === e.currentTarget) handleHourClick(hour);
                    }}
                  >
                    {/* Indicador de hover para agregar tarea */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="absolute top-2 right-2 text-xs text-purple-400/60 bg-purple-500/10 px-2 py-1 rounded-lg border border-purple-500/20">
                        <i className="bi bi-plus-circle mr-1"></i>
                        Clic para añadir tarea
                      </div>
                    </div>

                    {/* Tareas existentes */}
                    <div className="flex flex-col gap-2 relative z-10">
                      {tareasHora
                        .sort((a, b) =>
                          a.fechaLimite.localeCompare(b.fechaLimite)
                        )
                        .map((task) => (
                          <div
                            key={task.id_Tarea}
                            className={`
                            group/task text-white text-sm px-4 py-3 rounded-xl shadow-lg 
                            flex items-center gap-3 cursor-pointer transform transition-all duration-200 
                            hover:scale-[1.02] hover:shadow-xl relative overflow-hidden
                            ${
                              task.filtro === "completado"
                                ? "bg-gradient-to-r from-emerald-600/80 to-emerald-500/80 border border-emerald-400/30"
                                : "bg-gradient-to-r from-purple-600/80 to-purple-500/80 border border-purple-400/30"
                            }
                          `}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskClick(task);
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/task:translate-x-full transition-transform duration-700"></div>

                            {/* Icono de estado ( hay un error de diseño) */}
                            <div
                              className={`
                            flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs
                            ${
                              task.filtro === "completado"
                                ? "bg-emerald-400/30 text-emerald-200"
                                : "bg-purple-400/30 text-purple-200"
                            }
                          `}
                            >
                              <i
                                className={`bi ${
                                  task.filtro === "completado"
                                    ? "bi-check-lg"
                                    : "bi-clock"
                                }`}
                              ></i>
                            </div>

                            {/* Contenido de la tarea */}
                            <div className="flex-1 min-w-0">
                              <div
                                className={`
                              font-medium relative
                              ${
                                task.filtro === "completado"
                                  ? "line-through text-emerald-100/80"
                                  : "text-white"
                              }
                            `}
                              >
                                {task.nombreTarea}
                              </div>
                              {task.descripcion && (
                                <div className="text-xs opacity-80 mt-1 truncate">
                                  {task.descripcion}
                                </div>
                              )}
                            </div>

                            {/* Hora */}
                            <div
                              className={`
                            text-xs px-2 py-1 rounded-lg font-medium
                            ${
                              task.filtro === "completado"
                                ? "bg-emerald-500/20 text-emerald-200"
                                : "bg-purple-500/20 text-purple-200"
                            }
                          `}
                            >
                              {task.fechaLimite.slice(0, 5)}
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Botón para añadir tarea adicional */}
                    {tareasHora.length > 0 && (
                      <div
                        className="w-full mt-2 flex items-center justify-center py-2 rounded-lg border-2 border-dashed border-slate-600/40 hover:border-purple-500/50 transition-all duration-200 cursor-pointer group/add"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHourClick(hour);
                        }}
                      >
                        <button className="text-xs text-slate-400 group-hover/add:text-purple-400 transition-colors duration-200 flex items-center gap-1">
                          <i className="bi bi-plus-circle"></i>
                          Añadir otra tarea
                        </button>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {showTaskModal &&
        createPortal(
          <NewTaskModal
            onClose={handleCloseModal}
            onSave={handleAddTask}
            startDate={modalTaskData?.startDate}
            onlyTimeField={true}
          />,
          document.body
        )}

      {showDetailModal &&
        createPortal(
          <TaskDetailModal
            task={detailTaskData}
            onClose={handleCloseDetailModal}
            onDelete={(taskToDelete) => {
              setTaskToDelete(taskToDelete);
              setShowWarningModal(true);
            }}
            onDeleteFromDB={handleDeleteTask}
            onUpdateInfo={handleUpdateInfo}
            onToggleComplete={handleToggleComplete}
          />,
          document.body
        )}

      {showWarningModal &&
        createPortal(
          <WarningModal
            visible={showWarningModal}
            title="¿Eliminar tarea?"
            message="¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer."
            confirmText="Cancelar"
            showConfirm={true}
            onClose={() => {
              setShowWarningModal(false);
              setTaskToDelete(null);
            }}
            onConfirm={() => {
              if (taskToDelete) {
                handleDeleteTask(taskToDelete);
              }
              setShowWarningModal(false);
              setTaskToDelete(null);
            }}
          />,
          document.body
        )}
    </>
  );
};

export default DayCalendarView;
