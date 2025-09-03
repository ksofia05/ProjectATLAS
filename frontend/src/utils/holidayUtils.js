import Holidays from "date-holidays";

// Estoes local, cambiar según necesidad (por ahora colombia)
const hd = new Holidays("CO");

export function isSunday(date) {//verifica si es domingo
  return date.getDay() === 0;
}

//sirve pa verificar que es festivo con la libreria
export function isHoliday(date) {
  const holidays = hd.getHolidays(date.getFullYear());
  return holidays.some((holiday) => {
    const holidayDate = new Date(holiday.date);
    return holidayDate.toDateString() === date.toDateString();
  });
}

//verifica si ese dia no cumple las condiciones para asignar tareas (dominical o festivo)
export function isBlockedDay(date) {
  return isSunday(date) || isHoliday(date);
}

// con la libreria obtiene info del festivo (para colocarle los nombres en la interfaz)
export function getHolidayInfo(date) {
  const holidays = hd.getHolidays(date.getFullYear());
  const holiday = holidays.find((holiday) => {
    const holidayDate = new Date(holiday.date);
    return holidayDate.toDateString() === date.toDateString();
  });

  return holiday
    ? {
        name: holiday.name,
        type: holiday.type,
      }
    : null;
}
