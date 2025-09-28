import dayjs from "dayjs";
import { isBlockedDay } from "./holidayUtils.js";

export const dateUtils = {
  // se obtienen los días del mes
  getDaysInMonth: (year, month) => dayjs(`${year}-${month + 1}`).daysInMonth(),

  // Esto es para el primer día de cada mes
  getFirstDayOfMonth: (year, month) => dayjs(`${year}-${month + 1}-01`).day(),

  // Compara la fecha si es hoy
  isToday: (date) => dayjs(date).isSame(dayjs(), "day"),

  // Obtener fecha actual
  today: () => dayjs().toDate(),

  // Reinicio total de las fechas (por si acaso xd)
  format: (date, format = "YYYY-MM-DD") => dayjs(date).format(format),

  // Navegar entre fechas
  addMonth: (date) => dayjs(date).add(1, "month").toDate(),
  subtractMonth: (date) => dayjs(date).subtract(1, "month").toDate(),
  addYear: (date) => dayjs(date).add(1, "year").toDate(),
  subtractYear: (date) => dayjs(date).subtract(1, "year").toDate(),

  // Obtener fecha de hoy en formato string (textpo)
  getToday: () => dayjs().format("YYYY-MM-DD"),

  // Crear fecha desde string
  fromString: (dateString) => dayjs(dateString).toDate(),

  // Obtener año y mes actuales
  getCurrentYear: () => dayjs().year(),
  getCurrentMonth: () => dayjs().month(),
};

export function isDayBlocked(date) {
    return isBlockedDay(date); // Solo bloquea domingos y festivos
}

// prueba si se puede clicar el día
export function canClickDay(date, isCurrentMonth = true) {
  return isCurrentMonth;
}
