import { useState } from "react";
import Button from "../../../../components/Button";
import { getTest, patchTest, postTest } from "../../../../services/test";
import { hideLoader, showLoader } from "../../../../utils/loader";
import validate from "../validateFormModal";
import { useForm } from "../../../../hooks/useForms";
import { toast } from "react-toastify";
import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

const FormularioTest = ({
  initialForm,
  addItem,
  updateRow,
  closeModal,
  empresasDb,
}) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const formValidations = validate();
  
  //tipo de accion del formulario
  const action = initialForm.Empresas === "" ? "ADD" : "UPDATE";

  const {
    id,
    detalle,
    codigo,
    urlTest,
    fechaCr,
    fechaVen,
    fechaAplazo,
    Empresas,

    detalleValid,
    codigoValid,
    urlTestValid,
    fechaCrValid,
    fechaVenValid,
    fechaAplazoValid,
    empresasValid,

    formState,
    isFormValid,
    onInputChange,
    setFormState,
    onResetForm,
  } = useForm(initialForm, formValidations);

  const handleForm = async (event, action) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!isFormValid) return;

    const { Empresas: sendEmpresas, fechaAplazo, ...formatData } = formState;
    if (fechaAplazo !== "") formatData['fechaAplazo'] = fechaAplazo;
    const formatEmpresas = sendEmpresas.map((option) => option.value);
    formatData.empresas = formatEmpresas;

    if (action === "ADD") {
      add(formatData);
    } else {
      update(formatData);
    }
  };

  const update = ({ id, ...data }) => {
    showLoader();
    patchTest(id, data).then(({ data, message = null }) => {
      if (data) {
        getTest(data.id).then(({ data }) => {
          toast.success("Actualizado con exito", {
            position: "bottom-right",
          });
          updateRow(data);
        });
        closeModal();
        setFormSubmitted(false);
      } else {
        toast.error(message, {
          position: "bottom-right",
        });
      }
      hideLoader();
    });
  };

  const add = ({ id, ...data }) => {
    showLoader();
    postTest(data).then(({ data, message = null }) => {
      if (data) {
        getTest(data.id).then(({ data }) => {
          toast.success("Agregado con exito", {
            position: "bottom-right",
          });
          addItem(0, data);
        });

        closeModal();
        onResetForm();
        setFormSubmitted(false);
      } else {
        toast.error(message, {
          position: "bottom-right",
        });
      }
      hideLoader()
    });
  };

  const handleEmpresas = (values) => {
    formState.Empresas = values;
    setFormState((valueForm) => ({ ...valueForm, ...formState }));
  };

  return (
    <form onSubmit={(e) => handleForm(e, action)}>
      <div className="flex flex-col md:flex-row gap-3  mb-2">
        <div className="w-full md:w-1/2">
          <label htmlFor="codigo" className="font-semibold">
            Codigo
          </label>
          <input
            type="text"
            name="codigo"
            id="codigo"
            className="input input-bordered input-sm w-full"
            value={codigo}
            onChange={onInputChange}
          />
          {!!codigoValid && formSubmitted && (
            <p className="text-sm text-red-700">{detalleValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/2">
          <label htmlFor="detalle" className="font-semibold">
            Nombre de test
          </label>
          <input type="hidden" defaultValue={"fds"} />
          <input
            type="text"
            name="detalle"
            id="detalle"
            className="input input-bordered input-sm w-full"
            value={detalle}
            onChange={onInputChange}
          />
          {!!detalleValid && formSubmitted && (
            <p className="text-sm text-red-700">{detalleValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/2">
          <label htmlFor="empresas" className="font-semibold">
            Nombre de las empresas
          </label>
          <Select
            components={animatedComponents}
            value={Empresas}
            isMulti
            options={empresasDb}
            onChange={handleEmpresas}
            placeholder="Selecciona empresa"
            menuPortalTarget={document.body} // Renderiza el menú fuera del modal
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }), // Asegura que esté sobre el modal
            }}
          />
          {!!empresasValid && formSubmitted && (
            <p className="text-sm text-red-700">{empresasValid}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3  mb-2">
        <div className="w-full md:w-1/4">
          <label htmlFor="urlTest" className="font-semibold">
            URL video
          </label>
          <input
            type="url"
            name="urlTest"
            id="urlTest"
            className="input input-bordered input-sm w-full"
            value={urlTest}
            onChange={onInputChange}
          />
          {!!urlTestValid && formSubmitted && (
            <p className="text-sm text-red-700">{urlTestValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/4">
          <label htmlFor="fechaCr" className="font-semibold">
            Fecha inicio
          </label>
          <input
            type="date"
            name="fechaCr"
            id="fechaCr"
            className="input input-bordered input-sm w-full"
            value={fechaCr}
            onChange={onInputChange}
          />
          {!!fechaCrValid && formSubmitted && (
            <p className="text-sm text-red-700">{fechaCrValid}</p>
          )}
        </div>
        <div className="w-full md:w-1/4">
          <label htmlFor="fechaVen" className="font-semibold">
            Fecha de culminación
          </label>
          <input
            type="date"
            name="fechaVen"
            id="fechaVen"
            className="input input-bordered input-sm w-full"
            value={fechaVen}
            onChange={onInputChange}
          />
          {!!fechaVenValid && formSubmitted && (
            <p className="text-sm text-red-700">{fechaVenValid}</p>
          )}
        </div>
        {action === "UPDATE" && (
          <div className="w-full md:w-1/4">
            <label htmlFor="fechaAplazo" className="font-semibold">
              Fecha de aplazo
            </label>
            <input
              type="date"
              name="fechaAplazo"
              id="fechaAplazo"
              className="input input-bordered input-sm w-full"
              value={fechaAplazo}
              onChange={onInputChange}
            />
            {!!fechaAplazoValid && formSubmitted && (
              <p className="text-sm text-red-700">{fechaAplazoValid}</p>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <Button description={action === "ADD" ? "Agregar" : "Guardar"} />
      </div>
    </form>
  );
};

export default FormularioTest;
