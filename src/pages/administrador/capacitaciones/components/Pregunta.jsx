
const Pregunta = ({
  indice,
  texto,
  puntajeDePregunta,
  opcion1,
  opcion2,
  opcion3,
  opcion4,
  opcion5,
  handleFormChange,
  removePregunta,
}) => {
  return (
    <div className="shadow-xl bg-slate-100 p-3 rounded-lg mb-4">
      <div className="flex flex-col md:flex-row items-center gap-2">
        <div className="flex gap-3 items-center w-full md:w-4/5">
          <div className="bg-black w-10 h-10 rounded-full flex justify-center items-center text-white font-bold">
            {indice+1}
          </div>
          <div className="w-full">
            <label className="font-semibold">Digite la pregunta</label>
            <input
              type="text"
              name="texto"
              className={`input ${
                texto === "" ? "input-error" : ""
              } input-bordered input-sm w-full`}
              value={texto}
              onChange={(event) => handleFormChange(indice, event)}
            />
          </div>
        </div>
        <div className="w-full md:w-1/5">
          <label className="font-semibold">Puntos</label>
          <input
            type="number"
            name="puntajeDePregunta"
            className={`input ${
              puntajeDePregunta === "" ? "input-error" : ""
            } input-bordered input-sm w-full`}
            value={puntajeDePregunta}
            onChange={(event) => handleFormChange(indice, event)}
          />
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="font-semibold text-sm text-teal-600">
              * Esta respuesta sera la correcta
            </label>
            <input
              type="text"
              name="opcion1"
              className={`input ${
                opcion1 === "" ? "input-error" : ""
              } input-bordered   input-sm w-full`}
              value={opcion1}
              onChange={(event) => handleFormChange(indice, event)}
            />
          </div>
          <div>
            <label className="font-semibold text-transparent">-</label>
            <input
              type="text"
              name="opcion2"
              className={`input ${
                opcion2 === "" ? "input-error" : ""
              } input-bordered   input-sm w-full`}
              value={opcion2}
              onChange={(event) => handleFormChange(indice, event)}
            />
          </div>
          <div>
            <input
              type="text"
              name="opcion3"
              className={`input ${
                opcion3 === "" ? "input-error" : ""
              } input-bordered   input-sm w-full`}
              value={opcion3}
              onChange={(event) => handleFormChange(indice, event)}
            />
          </div>
          <div>
            <input
              type="text"
              name="opcion4"
              className={`input ${
                opcion4 === "" ? "input-error" : ""
              } input-bordered   input-sm w-full`}
              value={opcion4}
              onChange={(event) => handleFormChange(indice, event)}
            />
          </div>
          <div>
            <input
              type="text"
              name="opcion5"
              className={`input ${
                opcion5 === "" ? "input-error" : ""
              } input-bordered   input-sm w-full`}
              value={opcion5}
              onChange={(event) => handleFormChange(indice, event)}
            />
          </div>
         {/*  <div className="text-right">
            <button
              className="btn btn-sm btn-error"
              onClick={() => removePregunta(indice)}
            >
              Quitar pregunta
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Pregunta;
