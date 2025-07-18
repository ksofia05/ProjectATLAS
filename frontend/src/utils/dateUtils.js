import dayjs from "dayjs";

export const dateUtils = {
  // días del mes
  getDaysInMonth: (year, month) => dayjs(`${year}-${month + 1}`).daysInMonth(),

  // primer día del mes
  getFirstDayOfMonth: (year, month) => dayjs(`${year}-${month + 1}-01`).day(),

  // Verificar si es hoy
  isToday: (date) => dayjs(date).isSame(dayjs(), "day"),

  // Obtener fecha actual
  today: () => dayjs().toDate(),

  // reiniciar fechas
  format: (date, format = "YYYY-MM-DD") => dayjs(date).format(format),

  // Navegar entre fechas
  addMonth: (date) => dayjs(date).add(1, "month").toDate(),
  subtractMonth: (date) => dayjs(date).subtract(1, "month").toDate(),
  addYear: (date) => dayjs(date).add(1, "year").toDate(),
  subtractYear: (date) => dayjs(date).subtract(1, "year").toDate(),

  // Obtener fecha de hoy en formato string
  getToday: () => dayjs().format("YYYY-MM-DD"),

  // Crear fecha desde string
  fromString: (dateString) => dayjs(dateString).toDate(),

  // Obtener año y mes actuales
  getCurrentYear: () => dayjs().year(),
  getCurrentMonth: () => dayjs().month(),
};
