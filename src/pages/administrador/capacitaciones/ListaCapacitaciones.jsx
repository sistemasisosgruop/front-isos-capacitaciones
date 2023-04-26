import StepWizard from "react-step-wizard";

import { faEdit, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Button";
import NavWizard from "./NavWizard";
import Pregunta from "./components/Pregunta";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useModals from "../../../hooks/useModal";
import { Modal } from "../../../components/modal/Modal";
import FormularioInicio from "./components/FormularioInicio";
import { getCapacitaciones, getPreguntas } from "../../../services/capacitacion";
import { AgGridReact } from "ag-grid-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getEmpresas } from "../../../services/empresa";
import { toast } from "react-toastify";

const initialFormPreguntas = [
  {
    texto:"",
    opcion1:"",
    opcion2:"",
    opcion3:"",
    opcion4:"",
    opcion5:"",
    puntajeDePregunta:"",
    respuesta_correcta:1,
  },
];

const initialForm = {
  nombre: "",
  instructor: "",
  fechaInicio: "",
  fechaCulminacion: "",
  urlVideo: "",
  horas: "",
  fechaAplazo: "",
  empresas: "",
  certificado: "",
};

const ListaCapacitaciones = () => {
  const [formPreguntas, setFormPreguntas] = useState(initialFormPreguntas);
  const [isOpen, openModal, closeModal] = useModals();
  const [empresas, setEmpresas] = useState([]);
  const [dataForm, setdataForm] = useState(initialForm);
  const [rowSelected, setRowSelected] = useState([]);
  const [preguntas, setPreguntas] = useState([])

  const containerStyle = useMemo(() => ({ width: "100%", height: "80vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef();

  //configuracion de la tabla
  const renderButtons = ({ data }) => {
    return (
      <>
        <label
          onClick={() => updateButton(data)}
          className="cursor-pointer mr-2"
        >
          <FontAwesomeIcon icon={faEdit} />
        </label>
        <label className="cursor-pointer" onClick={() => openConfirm(data)}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </label>
      </>
    );
  };

  const renderButtonCertificado = ({ data }) => {
    return (
      <div
        className="badge badge-primary cursor-pointer"
        onClick={() => showImgs(data, true)}
      >
        <FontAwesomeIcon icon={faEye} />
      </div>
    );
  };

  const [columnDefs, setColumnDefs] = useState([
    { field: "id", hide: true },
    { field: "nombre" },
    { field: "urlVideo" },
    { field: "instructor" },
    { field: "fechaInicio" },
    { field: "fechaCulminacion" },
    { field: "fechaAplazo" },
    { field: "Opciones", cellRenderer: renderButtons },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const getRowId = useMemo(() => {
    return (params) => {
      return params.data.id;
    };
  }, []);

  //cargar la informacion de la tabla
  const onGridReady = useCallback((params) => {
    getCapacitaciones().then((res) => {
      const { data } = res;
      if (data) {
        setRowData(data);
      } else {
        toast.error("Ocurrio un error en el servidor", {
          position: "bottom-right",
        });
      }
    });
  }, []);

  //funciones para refrescar la tabla
  const addItem = useCallback((addIndex, newRow) => {
    const newItem = [newRow];
    gridRef.current.api.applyTransaction({
      add: newItem,
      addIndex: addIndex,
    });
  }, []);

  const updateRow = useCallback((data) => {
    var rowNode = gridRef.current.api.getRowNode(data?.id);
    rowNode.setData(data);
  }, []);

  const removeItem = useCallback((data) => {
    const arrayItems = [data];
    gridRef.current.api.applyTransaction({ remove: arrayItems });
  }, []);

  const openAddModal = () => {
    openModal();
    setdataForm(initialForm);
  };

  const updateButton = (data) => {
    console.log('data', data)
    getPreguntasExamen(data.id);
    const { createdAt, examen, Empresas, ...dataFormat } = data;

    openModal();
    //obtenemos los id de las empresas
    const empresasFormat = Empresas.map(function (obj) {
      const { id, nombreEmpresa } = obj;
      let newObj = {};
      newObj["value"] = id;
      newObj["label"] = nombreEmpresa;
      return newObj;
    });
    dataFormat.empresas = empresasFormat;
    setdataForm(dataFormat)
  }

  const openConfirm = (data) => {
    setRowSelected(data);
    setSweetAlert(true);
  };

  const confirmDelete = () => {
    deleteEmpresa(rowDelete.id).then((res) => {
      const { data } = res;
      if (data) {
        removeItem(rowDelete);
        setSweetAlert(false);
        toast.success("Eliminado con exito", {
          position: "bottom-right",
        });
      } else {
        toast.error("Ocurrio un error en el servidor", {
          position: "bottom-right",
        });
      }
    });
  };

  const getPreguntasExamen = ( id ) => {
    getPreguntas( id ).then( res => {
      console.log('res', res)
      setFormPreguntas()
 /*      {
        texto:"",
        opcion1:"",
        opcion2:"",
        opcion3:"",
        opcion4:"",
        opcion5:"",
        puntajeDePregunta:"",
        respuesta_correcta:1,
      },

      {
        "id": 1,
        "texto": "¿Cuál es la capital de Francia?",
        "opcion1": "Madrid",
        "opcion2": "París",
        "opcion3": "Londres",
        "opcion4": "Roma",
        "opcion5": "Berlín",
        "respuesta_correcta": 2,
        "puntajeDePregunta": 4,
        "examenId": 1
      } */
    })
  }

  // fin tabla

  const handleFormChange = (index, event) => {
    console.log("index", index);
    let data = [...formPreguntas];
    data[index][event.target.name] = event.target.value;
    setFormPreguntas(data);
  };

  const addPregunta = () => {
    let newPregunta =  {
      texto:"",
      opcion1:"",
      opcion2:"",
      opcion3:"",
      opcion4:"",
      opcion5:"",
      puntajeDePregunta:"",
      respuesta_correcta:1
    }

    setFormPreguntas([...formPreguntas, newPregunta]);
  };
  const removePregunta = (index) => {
    let data = [...formPreguntas];
    data.splice(index, 1);
    setFormPreguntas(data);
  };

  useEffect(() => {
    getEmpresas().then((res) => {
      const newData = res.data.map(function (obj) {
        const { id, nombreEmpresa } = obj;
        let newObj = {};
        newObj["value"] = id;
        newObj["label"] = nombreEmpresa;
        return newObj;
      });

      setEmpresas(newData);
    });
  }, []);

  const validateGetPreguntas = () => {
    return new Promise((resolve, reject) => {
      
      formPreguntas.forEach((pregunta) => {
        let campoVacio = false;
        for (const item in pregunta) {
          if (pregunta[item] === "") {
            campoVacio = true;
          }
        }
        if (campoVacio) {
          resolve(false)
        }
      });
      resolve(formPreguntas)
    });

  };
  return (
    <div className="">
      <div className="bg-white p-3">
        <h2 className="font-bold text-2xl mb-3">Capacitaciones</h2>
        <div className="flex justify-between gap-3">
          <select className="select" id="searchSelect">
            <option value={"Zoom"}>Zoom</option>
            <option value={"Meet"}>Meet</option>
          </select>
          <Button description="Registrar" icon={faPlus} event={openModal} />
        </div>
        <div style={containerStyle}>
          <div style={gridStyle} className="ag-theme-alpine">
            <AgGridReact
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
          isOpen={isOpen}
          openModal={openModal}
          closeModal={closeModal}
          size={"modal-xl"}
          title="Agregar empresa"
        >
          <StepWizard initialStep={1} nav={<NavWizard />}>
            <div className="p-3" stepName={"inicio"}>
              <FormularioInicio
                initialForm={dataForm}
                empresasDb={empresas}
                validateGetPreguntas={validateGetPreguntas}
                closeModal={closeModal}
                addItem={addItem}
              />
            </div>
            <div className="p-3" stepName={"preguntas"}>
              <form>
                {formPreguntas.map((pregunta, index) => {
                  return (
                    <Pregunta
                      key={index}
                      indice={index}
                      texto={pregunta.texto}
                      puntajeDePregunta={pregunta.puntajeDePregunta}
                      opcion1={pregunta.opcion1}
                      opcion2={pregunta.opcion2}
                      opcion3={pregunta.opcion3}
                      opcion4={pregunta.opcion4}
                      opcion5={pregunta.opcion5}
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
        {/* 
            
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
