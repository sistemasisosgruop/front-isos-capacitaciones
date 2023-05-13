import { months } from "../config";

const padTo2Digits = (num) => {
  return num.toString().padStart(2, "0");
};

const formatDateYMD = (date) => {
  const dateFormat = new Date(date);
  return [
    dateFormat.getFullYear(),
    padTo2Digits(dateFormat.getMonth() + 1),
    padTo2Digits(dateFormat.getDate() + 1),
  ].join("/");
};

const formatDateDb = (date) => {
  const fechaJs = new Date(date);
  const dia = fechaJs.getDate();
  const mes = months[fechaJs.getMonth()].descripcion;
  const anio = fechaJs.getFullYear();
  return [dia, mes, anio];
};
export { formatDateYMD, formatDateDb };
