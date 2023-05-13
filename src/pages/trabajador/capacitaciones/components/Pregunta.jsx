import Opcion from "./Opcion";
import "./pregunta.css";

const Pregunta = ({ data, handleFormChange, indice }) => {
  const { opciones, texto, value_radio } = data;
  return (
    <form className="container_questions mb-3">
      <h5 className="font-bold pregunta-slide mb-2">{texto}</h5>
      {opciones.map((opcion, index) => {
        return (
          <Opcion
            key={index}
            data={opcion}
            value_radio={value_radio}
            indice={indice}
            handleFormChange={handleFormChange}
          />
        );
      })}
    </form>
  );
};

export default Pregunta;
