const TarjetasCapacitaciones = ({ data, verPreguntas, verCertificado }) => {
  let backgroundEstado = null;
  let descripcionEstado = null;
  if (data.capacitacion.recuperacion) {
    descripcionEstado = "Recuperacion";
    backgroundEstado = "rgb(249 115 22)";
    if (data.notaExamen > 12) {
      descripcionEstado = "Aprobado";
      backgroundEstado = "rgb(13 148 136)";
    }
  }else if (!data.asistenciaExamen) {
    descripcionEstado = "Pendiente";
    backgroundEstado = " rgb(148 163 184)";
  } else {
    if (data.maximaNotaExamen / 2 > data.notaExamen) {
      descripcionEstado = "Desaprobado";
      backgroundEstado = "rgb(220 20 38)";
    } else {
      descripcionEstado = "Aprobado";
      backgroundEstado = "rgb(13 148 136)";
    }
  }
  return (
    <div
      className={`w-full bg-slate-100 p-3 border-l-8 rounded-lg`}
      style={{ borderLeftColor: backgroundEstado }}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-bold md:text-lg">
          {data.capacitacion?.nombre}
        </h2>
        <div
          className={`badge text-white`}
          style={{ backgroundColor: backgroundEstado }}
        >
          {descripcionEstado} { (descripcionEstado === 'Aprobado') ? ' - ' + data.notaExamen : null }
        </div>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="flex w-full lg:w-1/2 gap-y-3">
          <div className="w-1/2 lg:w-2/5">
            <p className="font-semibold">Capacitación</p>
            <p className="font-semibold">Evaluación</p>
          </div>
          <div className="w-1/2 lg:w-3/5">
            <a
              href={data.capacitacion?.urlVideo}
              target="_blank"
              className="block mb-2 text-blue-500 cursor-pointer badge badge-outline"
            >
              Dar capacitación
            </a>
            <div
              className="block mb-2 text-blue-500 cursor-pointer badge badge-outline"
              onClick={() =>
                descripcionEstado != 'Aprobado' && verPreguntas(data)
              }
            >
              Dar evaluación
            </div>
          </div>
        </div>

        <div className="flex w-full lg:w-1/2 gap-y-3">
          <div className="w-1/2 lg:w-2/5">
            <p className="font-semibold">Certificado</p>
            <p className="font-semibold">Fecha</p>
          </div>
          <div className="w-1/2 lg:w-3/5">
            { (descripcionEstado === 'Aprobado')
            ? <div
              className="block mb-2 text-blue-500 cursor-pointer badge badge-outline" 
              onClick={() => (descripcionEstado === 'Aprobado') && verCertificado(data)}
            >
              Ver certificado
            </div>
            : <div className="invisible mb-2 text-blue-500 cursor-pointer badge badge-outline"></div>
            }
            <p>{data.fechaCapacitacion}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarjetasCapacitaciones;
