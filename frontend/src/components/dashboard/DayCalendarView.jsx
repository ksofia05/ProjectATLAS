import React from "react";
import NewTaskModal from "../calendar/NewTaskModal";
import TaskDetailModal from "../calendar/TaskDetailModal";
import dayjs from "dayjs";

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
  const handleHourClick = (hour) => {
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

  // Añadir tarea
  const handleAddTask = (taskData) => {
    setTasks([...tasks, {
      hour: selectedHour,
      title: taskData.taskTitle,
      description: taskData.taskDescription,
      startDate: taskData.startDate,
      endDate: taskData.endDate,
      taskTime: taskData.taskTime,
    }]);
    setShowTaskModal(false);
    setSelectedHour(null);
    setModalTaskData(null);
  };

  // Actualizar tarea (título y descripción)
  const handleUpdateInfo = (id, newTitle, newDescription) => {
    setTasks(prev =>
      prev.map(t =>
        t.hour === id
          ? { ...t, title: newTitle, description: newDescription }
          : t
      )
    );
    // Sincroniza el objeto seleccionado con la lista actualizada
    setDetailTaskData(prev => {
      const updated = tasks.find(t => t.hour === id);
      return updated ? { ...updated, title: newTitle, description: newDescription } : prev;
    });
  };

  // Completar/no completado
  const handleToggleComplete = (hour) => {
    setTasks(prev =>
      prev.map(t =>
        t.hour === hour
          ? { ...t, completed: !t.completed }
          : t
      )
    );
    setDetailTaskData(prev => {
      const updated = tasks.find(t => t.hour === hour);
      return updated ? { ...updated, completed: !prev.completed } : prev;
    });
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

  return (
    <div className="bg-gradient-to-r from-[#181825] to-[#232335] rounded-3xl p-6 w-full text-white shadow-lg border border-gray-700 mt-0 flex flex-col h-[calc(100vh-240px)]">
      <div className="flex-1 overflow-y-auto scrollbar-subtle">
        <div className="grid grid-cols-[80px_1fr] gap-0">
          {hours.map((hour) => {
            const task = tasks.find((t) => t.hour === hour);
            return (
              <React.Fragment key={hour}>
                {/* Columna de hora */}
                <div className="text-right pr-4 py-4 text-sm text-gray-400 border-r border-gray-600">
                  {formatHour(hour)}
                </div>

                {/* Columna de contenido */}
                <div
                  className={`relative border-b border-gray-600 min-h-[60px] p-2 hover:bg-gray-800/30 transition-colors cursor-pointer`}
                  onClick={() => task ? handleTaskClick(task) : handleHourClick(hour)}
                >
                  {/* Icono solo si hay tarea asignada */}
                  {task && (
                    <div
                      className={`absolute left-2 right-2 text-white text-sm px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 ${task.completed ? "bg-purple-400/80" : "bg-purple-600/80"}`}
                      style={{ top: "4px" }}
                    >
                      <i className="bi bi-tools text-lg mr-2" />
                      <span className={`font-medium relative ${task.completed ? "line-through" : ""}`}>
                        {task.title}
                        {/* Animación de línea tachada */}
                        {task.completed && (
                          <span
                            className="absolute left-0 right-0 top-1/2 h-[2px] bg-white opacity-70 animate-[fadeIn_0.5s_ease]"
                            style={{ transform: "translateY(-50%)" }}
                          />
                        )}
                      </span>
                      <span className="text-xs text-purple-200 ml-2">({task.taskTime})</span>
                    </div>
                  )}
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
          hideDateAndTimeFields={true}
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
          onUpdateInfo={handleUpdateInfo}
          onToggleComplete={handleToggleComplete}
        />
      )}
    </div>
  );
};

export default DayCalendarView;