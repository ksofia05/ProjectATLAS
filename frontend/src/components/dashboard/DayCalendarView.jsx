import React from "react";
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
      startDate: dayjs().year(year).month(month).date(day).format('YYYY-MM-DD'),
      taskTime: `${hour.toString().padStart(2, '0')}:00`,
    });
  };

  // Abrir modal de detalle de tarea (siempre sincroniza con tasks)
  const handleTaskClick = (task) => {
    const updatedTask = tasks.find(t => t.hour === task.hour);
    setDetailTaskData(updatedTask);
    setShowDetailModal(true);
  };

  const { userProfile } = useContext(AuthContext);

  const handleAddTask = async (taskData) => {
    if (!userProfile) return;
    const fechaCreacion = modalTaskData?.startDate;
    const { error } = await supabase
      .from('Tareas')
      .insert([
        {
          nombreTarea: taskData.taskTitle,
          descripcion: taskData.taskDescription,
          fechaCreacion: fechaCreacion,
          fechaLimite: taskData.taskTime,
          fechaActual: new Date().toLocaleString("sv-SE"),
          id_usuario: userProfile.idUsuario,
          filtro: "por completar"
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
    const fechaActual = dayjs().year(year).month(month).date(day).format('YYYY-MM-DD');
    const { data, error } = await supabase
      .from('Tareas')
      .select('*')
      .eq('fechaCreacion', fechaActual)
      .eq('id_usuario', userProfile.idUsuario);
    if (!error) setTasks(data || []);
  };

  // Actualizar tarea (título y descripción)
  const handleUpdateInfo = async (id_Tarea, newTitle, newDescription) => {
    const { error } = await supabase
      .from("Tareas")
      .update({
        nombreTarea: newTitle,
        descripcion: newDescription
      })
      .eq("id_Tarea", id_Tarea);
    if (error) {
      alert("Error al actualizar la tarea: " + error.message);
    }

    setTasks(prev =>
      prev.map(t =>
        t.id_Tarea === id_Tarea
          ? { ...t, nombreTarea: newTitle, descripcion: newDescription }
          : t
      )
    );
    setDetailTaskData(prev => {
      const updated = tasks.find(t => t.id_Tarea === id_Tarea);
      return updated ? { ...updated, nombreTarea: newTitle, descripcion: newDescription } : prev;
    });
  };

  // Eliminar tarea (solo si el usuario confirma en el WarningModal)
  const handleDeleteTask = async (task) => {
    const { error } = await supabase
      .from("Tareas")
      .delete()
      .eq("id_Tarea", task.id_Tarea);
    if (error) {
      alert("error al borrar tarea: " + error.message);
      return;
    }
    setTasks(prev => prev.filter(t => t.id_Tarea !== task.id_Tarea));
    setShowDetailModal(false);
    setTaskToDelete(null);
  };

  // Completar/no completado
  const handleToggleComplete = async (id_Tarea) => {
    const tarea = tasks.find(t => t.id_Tarea === id_Tarea);
    if (!tarea) return;

    const nuevoFiltro = tarea.filtro === "completado" ? "por completar" : "completado";

    const { error } = await supabase
      .from("Tareas")
      .update({ filtro: nuevoFiltro })
      .eq("id_Tarea", id_Tarea);

    if (error) {
      alert("error al actualizar estado")
      return;
    }

    setTasks(prev =>
      prev.map(t =>
        t.id_Tarea === id_Tarea
          ? { ...t, filtro: nuevoFiltro }
          : t
      )
    );
    setDetailTaskData(prev =>
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
    // eslint-disable-next-line
  }, [year, month, day, userProfile]);

  return (
    <div className="bg-gradient-to-r from-[#181825] to-[#232335] rounded-3xl p-6 w-full text-white shadow-lg border border-gray-700 mt-0 flex flex-col h-[calc(100vh-240px)]">
      <div className="flex-1 overflow-y-auto scrollbar-subtle">
        <div className="grid grid-cols-[80px_1fr] gap-0">

          
{hours.map((hour) => {
  const tareasHora = tasks.filter(
    t => t.fechaLimite && parseInt(t.fechaLimite.slice(0, 2), 10) === hour
  );
  const minHeight = 60 + tareasHora.length * 48;

  return (
    <React.Fragment key={hour}>
      <div className="text-right pr-4 py-4 text-sm text-gray-400 border-r border-gray-600">
        {formatHour(hour)}
      </div>
      <div
        className={`relative border-b border-gray-600 p-2 hover:bg-gray-800/30 transition-colors cursor-pointer`}
        style={{ minHeight: `${minHeight}px` }}
        onClick={e => {
          // Solo crea nueva tarea si se hace click en el fondo (no sobre una tarea)
          if (e.target === e.currentTarget) handleHourClick(hour);
        }}
      >
        <div className="flex flex-col gap-2">
          {tareasHora.sort((a, b) => a.fechaLimite.localeCompare(b.fechaLimite)).map((task) => (
            <div
              key={task.id_Tarea}
              className={`text-white text-sm px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 ${task.completed ? "bg-purple-400/80" : "bg-purple-600/80"}`}
              onClick={e => {
                e.stopPropagation(); // Evita que el click en la tarea cree una nueva
                handleTaskClick(task);
              }}
            >
              <i className="bi bi-tools text-lg mr-2" />
              <span className={`font-medium relative ${task.completed ? "line-through" : ""}`}>
                {task.nombreTarea}
              </span>
              <span className="text-xs text-purple-200 ml-2">({task.fechaLimite.slice(0, 5)})</span>
            </div>
          ))}
        </div>
        {/* Espacio extra debajo de las tareas para agregar otra tarea */}
        <div
          className="w-full h-8 flex items-center justify-center"
          onClick={e => {
            e.stopPropagation();
            handleHourClick(hour);
          }}
        >
          <button className="text-xs text-purple-300 hover:text-purple-500 transition-colors">
            + Añadir otra tarea
          </button>
        </div>
      </div>
    </React.Fragment>
  );
})}

        </div>
      </div>
      {/* Modal para añadir tarea usando NewTaskModal */}
      {showTaskModal && (
        <NewTaskModal
          onClose={handleCloseModal}
          onSave={handleAddTask}
          startDate={modalTaskData?.startDate}
          onlyTimeField={true}
        />
      )}
      {/* Modal de detalle de tarea */}
      {showDetailModal && (
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
        />
      )}
      {/* Modal de confirmación de borrado */}
      {showWarningModal && (
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
              handleDeleteTask(taskToDelete); // SOLO se borra aquí, al confirmar
            }
            setShowWarningModal(false);
            setTaskToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default DayCalendarView;