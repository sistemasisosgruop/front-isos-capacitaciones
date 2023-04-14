import './pregunta.css';

const Pregunta = () => {
  return (
    <div className="container_questions <?php echo ($contador == 1) ? 'show_step' : '' ?>" data-step="<?php echo $contador ?>">
    <h5 className="fw-bold pregunta-slide">Prgunta 1</h5>
      <label className="rad-label">
        <input type="radio" className="rad-input pregunta_radio" name="pregunta_radio"/>
        <div className="rad-design"></div>
        <div className="rad-text">hola</div>
      </label>
      <label className="rad-label">
        <input type="radio" className="rad-input pregunta_radio" name="pregunta_radio"/>
        <div className="rad-design"></div>
        <div className="rad-text">hola</div>
      </label>
      <label className="rad-label">
        <input type="radio" className="rad-input pregunta_radio" name="pregunta_radio"/>
        <div className="rad-design"></div>
        <div className="rad-text">hola</div>
      </label>
    <button 
    className="btn btn-sm bg-ucv text-light d-block mx-auto mt-3 btnPreguntas" 
    type="button">
    Siguiente</button>
  </div>
  )
}

export default Pregunta
