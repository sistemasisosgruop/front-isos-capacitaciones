import React from "react";

const Pregunta = ({
  indice,
  pregunta,
  puntos,
  respuesta1,
  respuesta2,
  respuesta3,
  respuesta4,
  respuesta5,
  handleFormChange,
  removePregunta,
}) => {
  return (
    <div className="shadow-xl bg-slate-100 p-3 rounded-lg mb-4">
      <div className="flex flex-col md:flex-row items-center gap-2">
      <div className="flex gap-3 items-center">
        <div className="bg-black w-10 h-10 rounded-full flex justify-center items-center text-white font-bold">
          1
        </div>
        <div className="w-full">
          <label className="font-semibold">Digite la pregunta</label>
          <input
            type="text"
            name="pregunta"
            className="input input-bordered input-sm w-full"
            value={pregunta}
            onChange={(event) => handleFormChange(indice, event)}
          />
        </div>
      </div>
        <div className="w-full">
          <label className="font-semibold">Puntos</label>
          <input
            type="text"
            name="puntos"
            className="input input-bordered input-sm w-full"
            value={puntos}
            onChange={(event) => handleFormChange(indice, event)}
          />
        </div>
      </div>
      {/* <p className="font-bold mb-2 text-center">Alternativas</p> */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="font-semibold text-sm text-teal-600">
              * Esta respuesta sera la correcta
            </label>
            <input
              type="text"
              name="respuesta1"
              className="input input-bordered input-sm w-full"
              value={respuesta1}
              onChange={(event) => handleFormChange(indice, event)}
            />
          </div>
          <div>
            <label className="font-semibold text-transparent">-</label>
            <input
              type="text"
              name="respuesta2"
              className="input input-bordered input-sm w-full"
              value={respuesta2}
              onChange={(event) => handleFormChange(indice, event)}
            />
          </div>
          <div>
            <input
              type="text"
              name="respuesta3"
              className="input input-bordered input-sm w-full"
              value={respuesta3}
              onChange={(event) => handleFormChange(indice, event)}
            />
          </div>
          <div>
            <input
              type="text"
              name="respuesta4"
              className="input input-bordered input-sm w-full"
              value={respuesta4}
              onChange={(event) => handleFormChange(indice, event)}
            />
          </div>
          <div>
            <input
              type="text"
              name="respuesta5"
              className="input input-bordered input-sm w-full"
              value={respuesta5}
              onChange={(event) => handleFormChange(indice, event)}
            />
          </div>
          <div className="text-right">
            <button
              class="btn btn-sm btn-error"
              onClick={() => removePregunta(indice)}
            >
              Quitar pregunta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pregunta;
