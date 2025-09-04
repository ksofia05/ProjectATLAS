import React from "react";
import NewTaskModal from "../calendar/NewTaskModal";
import TaskDetailModal from "../calendar/TaskDetailModal";
import dayjs from "dayjs";
import { client as supabase } from "../../supabase/client";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { showErrorToast } from "../common/popUp/Loading";

const DayCalendarView = ({ year, month, day }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Estado para tareas asignadas
  const [tasks, setTasks] = React.useState([]);
  const [showTaskModal, setShowTaskModal] = React.useState(false);
  const [showDetailModal, setShowDetailModal] = React.useState(false);
  const [selectedHour, setSelectedHour] = React.useState(null);
  const [modalTaskData, setModalTaskData] = React.useState(null);
  const [detailTaskData, setDetailTaskData] = React.useState(null);

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
    return; // No abrir modal si el día es pasado
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
    // Usa startDate del modal, no endDate del formulario
    const fechaCreacion = modalTaskData?.startDate;
    const { error } = await supabase
        .from('Tareas')
        .insert([
            {
                nombreTarea: taskData.taskTitle,
                descripcion: taskData.taskDescription,
                fechaCreacion: fechaCreacion, // <-- la fecha del calendario
                fechaLimite: taskData.taskTime, // la hora seleccionada
                fechaActual:new Date().toLocaleString("sv-SE"),
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
        .eq('id_usuario', userProfile.idUsuario); // <-- Filtras por usuario
    if (!error) setTasks(data || []);
};
// Actualizar tarea (título y descripción)
const handleUpdateInfo = async (id_Tarea, newTitle, newDescription) => {

  const { error } = await supabase
  .from ("Tareas")
  .update ({
    nombreTarea: newTitle,
    descripcion: newDescription
  })
  .eq("id_Tarea", id_Tarea)
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


//eliminar tarea
const handleDeleteTask = async (task) =>{
  const {error} = await supabase
  .from ("Tareas")
  .delete()
  .eq("id_Tarea", task.id_Tarea);
  if (error) {
    alert ("error al borrar tarea: " + error.message);
    return;
  }

//eliminar estado
setTasks(prev => prev.filter(t => t.id_Tarea !== task.id_Tarea));
setShowDetailModal(false);
};



// Completar/no completado
const handleToggleComplete = async (id_Tarea) => {
  const tarea = tasks.find(t => t.id_Tarea === id_Tarea);
  if (!tarea) return;

  const nuevoFiltro = tarea.filtro === "completado" ? "por completar" : "completado";

  const {error} = await supabase
  .from("Tareas")
  .update({filtro: nuevoFiltro })
  .eq("id_Tarea", id_Tarea);

  if (error) {
    alert("error al actualizar estado")
    return;
  }


  setTasks(prev =>
    prev.map(t =>
      t.id_Tarea === id_Tarea
        ? { ...t, filtro:nuevoFiltro }
        : t
    )
  );
  setDetailTaskData( prev =>
    prev && prev.id_Tarea === id_Tarea
    ? {...prev, filtro: nuevoFiltro}
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
            // Busca tareas para esta franja horaria
            const tareasHora = tasks.filter(
              t => t.fechaLimite && parseInt(t.fechaLimite.slice(0, 2), 10) === hour
            );
            return (
              <React.Fragment key={hour}>
                {/* Columna de hora */}
                <div className="text-right pr-4 py-4 text-sm text-gray-400 border-r border-gray-600">
                  {formatHour(hour)}
                </div>
                {/* Columna de contenido */}
                <div
                  className={`relative border-b border-gray-600 min-h-[60px] p-2 hover:bg-gray-800/30 transition-colors cursor-pointer`}
                  onClick={() => tareasHora.length > 0 ? handleTaskClick(tareasHora[0]) : handleHourClick(hour)}
                >
                  {/* Renderiza todas las tareas de esa hora */}
                  {tareasHora.map(task => (
                    <div
                      key={task.id_Tarea}
                      className={`absolute left-2 right-2 text-white text-sm px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 ${task.completed ? "bg-purple-400/80" : "bg-purple-600/80"}`}
                      style={{ top: "4px" }}
                    >
                      <i className="bi bi-tools text-lg mr-2" />
                      <span className={`font-medium relative ${task.completed ? "line-through" : ""}`}>
                        {task.nombreTarea}
                      </span>
                      <span className="text-xs text-purple-200 ml-2">({task.fechaLimite.slice(0, 5)})</span>
                    </div>
                  ))}
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
          onlyTimeField={true} // <-- Solo hora en el modal de calendario
        />
      )}
      {/* Modal de detalle de tarea */}
      {showDetailModal && (
        <TaskDetailModal
          task={detailTaskData}
          onClose={handleCloseDetailModal}
          onDelete={(taskToDelete) => {
            setTasks(tasks.filter(t => t.hour !== taskToDelete.hour));
            setShowDetailModal(false);
            setDetailTaskData(null);
          }}
          onDeleteFromDB={handleDeleteTask}
          onUpdateInfo={handleUpdateInfo}
          onToggleComplete={handleToggleComplete}
        />
      )}
    </div>
  );
};

export default DayCalendarView;