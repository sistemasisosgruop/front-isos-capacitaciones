import { months } from "../config";

const padTo2Digits = (num) => {
  return num.toString().padStart(2, "0");
};

const formatDateYMD = (date) => {
  const dateFormat = new Date(date);
  return [
    dateFormat.getFullYear(),
    padTo2Digits(dateFormat.getMonth() + 1),
    padTo2Digits(dateFormat.getDate()),
  ].join("-");
};

const formatDateDb = (date) => {
  console.log(date);
  const fechaJs = new Date(date);
  
  // Establecer la zona horaria a UTC antes de obtener el día
  fechaJs.setUTCHours(0, 0, 0, 0);
  
  const dia = fechaJs.getUTCDate();
  const mes = months[fechaJs.getUTCMonth()].descripcion;
  const anio = fechaJs.getUTCFullYear();
  
  return [dia, mes, anio];
};
export { formatDateYMD, formatDateDb };
