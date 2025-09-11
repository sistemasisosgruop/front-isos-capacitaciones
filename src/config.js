const months = [
  {
    numero: 1,
    descripcion: "Enero",
  },
  {
    numero: 2,
    descripcion: "Febrero",
  },
  {
    numero: 3,
    descripcion: "Marzo",
  },
  {
    numero: 4,
    descripcion: "Abril",
  },
  {
    numero: 5,
    descripcion: "Mayo",
  },
  {
    numero: 6,
    descripcion: "Junio",
  },
  {
    numero: 7,
    descripcion: "Julio",
  },
  {
    numero: 8,
    descripcion: "Agosto",
  },
  {
    numero: 9,
    descripcion: "Septiembre",
  },
  {
    numero: 10,
    descripcion: "Octubre",
  },
  {
    numero: 11,
    descripcion: "Noviembre",
  },
  {
    numero: 12,
    descripcion: "Diciembre",
  },
];

const generateYearOptions = (minYear, maxYear) => {
  const years = [];
  for (let year = minYear; year <= maxYear; year++) {
    years.push({ value: year, label: String(year) });
  }
  return years;
};

export {
  months,
  generateYearOptions
} 