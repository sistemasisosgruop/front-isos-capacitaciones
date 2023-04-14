import React from "react";

const FormularioInicio = () => {
  return (
    <form>
      <div className="flex flex-col md:flex-row gap-3 mb-2">
        <div className="w-full md:w-2/4">
          <label htmlFor="capacitacion" className="font-semibold">
            Nombre de capacitación
          </label>
          <input type="hidden" defaultValue={"fds"} />
          <input
            type="text"
            name="empresa"
            id="empresa"
            className="input input-bordered input-sm w-full"
            //value={empresa}
            //onChange={onInputChange}
          />
         {/*  {!!empresaValid && formSubmitted && (
            <p className="text-sm text-red-700">{empresaValid}</p>
          )} */}
        </div>
        <div className="w-full md:w-2/4">
          <label htmlFor="ruc" className="font-semibold">
            Nombre de la empresa
          </label>
          <input
            type="text"
            name="ruc"
            id="ruc"
            className="input input-bordered input-sm w-full"
            //value={ruc}
            //onChange={onInputChange}
          />
         {/*  {!!rucValid && formSubmitted && (
            <p className="text-sm text-red-700">{rucValid}</p>
          )} */}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3 mb-2">
        <div className="w-full md:w-2/5">
          <label htmlFor="gerente" className="font-semibold">
            Nombre del instructor
          </label>
          <input
            type="text"
            name="nombreGerente"
            id="gerente"
            className="input input-bordered input-sm w-full"
            //value={nombreGerente}
            //onChange={onInputChange}
          />
          {/* {!!nombreGerenteValid && formSubmitted && (
            <p className="text-sm text-red-700">{nombreGerenteValid}</p>
          )} */}
        </div>
        <div className="w-full md:w-2/5">
          <label htmlFor="gerente" className="font-semibold">
            URL del video
          </label>
          <input
            type="text"
            name="nombreGerente"
            id="gerente"
            className="input input-bordered input-sm w-full"
            //value={nombreGerente}
            //onChange={onInputChange}
          />
          {/* {!!nombreGerenteValid && formSubmitted && (
            <p className="text-sm text-red-700">{nombreGerenteValid}</p>
          )} */}
        </div>
        <div className="w-full md:w-1/5">
          <label htmlFor="contacto" className="font-semibold">
            Firma del instructor
          </label>
          <input
            type="file"
            name="numeroContacto"
            id="contacto"
            className="file-input file-input-bordered file-input-sm w-full"
            accept=".png, .jpg, .jpeg"
            //value={numeroContacto}
            //onChange={onInputChange}
          />
          {/* {!!numeroContactoValid && formSubmitted && (
            <p className="text-sm text-red-700">{numeroContactoValid}</p>
          )} */}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3 mb-2">
        <div className="w-full md:w-1/3">
          <label htmlFor="gerente" className="font-semibold">
            Fecha de inicio
          </label>
          <input
            type="date"
            name="nombreGerente"
            id="gerente"
            className="input input-bordered input-sm w-full"
            //value={nombreGerente}
            //onChange={onInputChange}
          />
          {/* {!!nombreGerenteValid && formSubmitted && (
            <p className="text-sm text-red-700">{nombreGerenteValid}</p>
          )} */}
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor="contacto" className="font-semibold">
            Fecha de culminación
          </label>
          <input
            type="date"
            name="numeroContacto"
            id="contacto"
            className="input input-bordered input-sm w-full"
            //value={numeroContacto}
            //onChange={onInputChange}
          />
         {/*  {!!numeroContactoValid && formSubmitted && (
            <p className="text-sm text-red-700">{numeroContactoValid}</p>
          )} */}
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor="contacto" className="font-semibold">
            Fecha de aplazo
          </label>
          <input
            type="date"
            name="numeroContacto"
            id="contacto"
            className="input input-bordered input-sm w-full"
            //value={numeroContacto}
            //onChange={onInputChange}
          />
         {/*  {!!numeroContactoValid && formSubmitted && (
            <p className="text-sm text-red-700">{numeroContactoValid}</p>
          )} */}
        </div>
      </div>
    </form>
  );
};

export default FormularioInicio;
