import StepWizard from "react-step-wizard";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Button";
import NavWizard from "./NavWizard";
import Pregunta from "./components/Pregunta";
import { useState } from "react";
import useModals from "../../../hooks/useModal";
import { Modal } from "../../../components/modal/Modal";
import FormularioInicio from "./components/FormularioInicio";

const initialForm = [
  {
    pregunta: "",
    puntos: "",
    respuesta1: "",
    respuesta2: "",
    respuesta3: "",
    respuesta4: "",
    respuesta5: "",
  },
];
const ListaCapacitaciones = () => {
  const [formPreguntas, setFormPreguntas] = useState(initialForm);
  const [isOpen, openModal, closeModal] = useModals();

  const handleFormChange = (index, event) => {
    console.log("index", index);
    let data = [...formPreguntas];
    data[index][event.target.name] = event.target.value;
    setFormPreguntas(data);
  };

  const addPregunta = () => {
    let newPregunta = {
      pregunta: "",
      puntos: "",
      respuesta1: "",
      respuesta2: "",
      respuesta3: "",
      respuesta4: "",
      respuesta5: "",
    };

    setFormPreguntas([...formPreguntas, newPregunta]);
  };
  const removePregunta = (index) => {
    let data = [...formPreguntas];
    data.splice(index, 1);
    setFormPreguntas(data);
  };
  return (
    <div className="">
      <div className="bg-white p-3">
        <h2 className="font-bold text-2xl mb-3">Empresas</h2>
        <div className="flex justify-between gap-3">
          <select className="select" id="searchSelect">
            <option value={"yyy"}>yyyy</option>
            <option value={"hola"}>hola</option>
          </select>
          <Button description="Registrar" icon={faPlus} event={openModal} />
        </div>

        <Modal
          isOpen={isOpen}
          openModal={openModal}
          closeModal={closeModal}
          size={"modal-xl"}
          title="Agregar empresa"
        >
          <StepWizard initialStep={1} nav={<NavWizard />}>
            <div className="p-3" stepName="inicio">
              <FormularioInicio/>
            </div>
            <div className="p-3" stepName="preguntas">
              <form>
                {formPreguntas.map((pregunta, index) => {
                  return (
                    <Pregunta
                      key={index}
                      indice={index}
                      pregunta={pregunta.pregunta}
                      puntos={pregunta.puntos}
                      respuesta1={pregunta.respuesta1}
                      respuesta2={pregunta.respuesta2}
                      respuesta3={pregunta.respuesta3}
                      respuesta4={pregunta.respuesta4}
                      respuesta5={pregunta.respuesta5}
                      handleFormChange={handleFormChange}
                      removePregunta={removePregunta}
                    />
                  );
                })}
              </form>
              <Button
                description="Nueva pregunta"
                icon={faPlus}
                event={addPregunta}
              />
            </div>
          </StepWizard>
        </Modal>
        {/*   <div style={containerStyle}>
            <AgGridReact          <div style={gridStyle} className="ag-theme-alpine">

              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowGroupPanelShow={"always"}
              pagination={true}
              onGridReady={onGridReady}
              rowHeight="34"
              ref={gridRef}
              getRowId={getRowId}
            ></AgGridReact>
          </div>
        </div>

        <Modal
          isOpen={isOpen1}
          openModal={openModal1}
          closeModal={closeModal1}
          size={"modal-lg"}
          title="Agregar empresa"
        >
          <FormularioEmpresa
            initialForm={dataForm}
            closeModal={closeModal1}
            addItem={addItem}
            updateRow={updateRow}
          />
        </Modal>

        <SweetAlert
          warning
          showCancel
          confirmBtnText="si"
          cancelBtnText="No, cancelar"
          confirmBtnCssClass="btn-sweet-success"
          cancelBtnCssClass="btn-sweet-danger"
          title="¿Esta seguro de eliminar?"
          onConfirm={confirmDelete}
          show={sweetAlert}
          onCancel={() => setSweetAlert(false)}
        ></SweetAlert>
 */}
      </div>
    </div>
  );
};

export default ListaCapacitaciones;
