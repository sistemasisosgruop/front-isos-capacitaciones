const ProgressCapacitacion = ({ progress = 0, height = 35, backgroundColor = '#e0e0e0', fillColor = '#2ca69a', showPercentage = true, total = 0 }) => {
  const totalPorcentaje = total;
  const porcentajeProgress = (progress * 100) / totalPorcentaje;
  // const porcentajeTotal = (total - progress * 100) / totalPorcentaje;
  const resto = total - progress;
  
  let colabora =
  progress < 2 || (progress === 1 && resto === 0)
    ? 'Colaborador'
    : 'Colaboradores';
    
  let falta =
  resto < 2 || (resto === 1 && progress === 0)
    ? 'Colaborador'
    : 'Colaboradores';
   
  return (
    <div className="flex justify-between border border-gray-500 progress-bar-container" style={{ backgroundColor, height: `${height}px` }}>
      {progress === 0
        ? null
        : <div className="border border-gray-500 progress-bar-filler" style={{ width: `${progress * porcentajeProgress}%`, backgroundColor: fillColor }}>
            {showPercentage && <span className="progress-percentage line-clamp-1">{`${progress} ${colabora}`}</span>}
          </div>
      }
      {resto === 0 
        ? null
        : progress === 0
          ? <div className="w-full progress-bar-filler">
            {showPercentage && <span className="progress-percentage-total line-clamp-1">{`${resto} ${falta}`}</span>}
          </div>
          : <div className="w-full progress-bar-filler" style={{ width: `${resto * porcentajeProgress}%` }}>
            {showPercentage && <span className="progress-percentage-total line-clamp-1">{`${resto} ${falta}`}</span>}
          </div>
      }
    </div>
  );
}
export default ProgressCapacitacion;