const getYearsBefore = (yearsBefore) => {
  let fechaActual = new Date().getFullYear();
  const years = [];

  // creacion de 10 años anteriores
  for (let x = 0; x < yearsBefore; x++) years.push(fechaActual - x);
  return years;
}
export default getYearsBefore;