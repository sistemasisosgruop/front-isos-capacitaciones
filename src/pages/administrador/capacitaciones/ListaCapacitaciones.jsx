import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "../../../components/Button";
import Pregunta from "./components/Pregunta";
import useModals from "../../../hooks/useModal";
import { Modal } from "../../../components/modal/Modal";
import FormularioInicio from "./components/FormularioInicio";
import { hideLoader, showLoader } from "../../../utils/loader";
import NavWizard from "./components/NavWizard";
import { initialForm, initialFormPreguntas } from "./config";
import StepWizard from "react-step-wizard";
import {
  deleteCapacitaciones,
  getCapacitacion,
  getCapacitaciones,
  getPreguntas,
  patchEstadoCapacitacion,
} from "../../../services/capacitacion";
import { AgGridReact } from "ag-grid-react";
import { getEmpresas } from "../../../services/empresa";
import { toast } from "react-toastify";
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const ListaCapacitaciones = () => {
  const [formPreguntas, setFormPreguntas] = useState(initialFormPreguntas);
  const [isOpen, openModal, closeModal] = useModals();
  const [empresas, setEmpresas] = useState([]);
  const [dataForm, setdataForm] = useState(initialForm);
  const [rowSelected, setRowSelected] = useState([]);
  const [descripcionModal, setDescripcionModal] = useState("");
  const [sweetAlert, setSweetAlert] = useState(false);
  const [sweetAlertState, setSweetAlertState] = useState(false);
  

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
        <label
          className="cursor-pointer mr-2"
          onClick={() => openConfirm(data, 'DELETE')}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </label>
        {}
        <label className="cursor-pointer" onClick={() => openConfirm(data,'UPDATE')}>
          {data.habilitado ? (
            <div className="badge bg-red-500">Deshabilitar</div>
          ) : (
            <div className="badge bg-teal-700">Habilitar</div>
          )}
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
    { field: "Opciones", cellRenderer: renderButtons, minWidth: 200 },
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
    getCapacitaciones().then(({data}) => {
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

  const updateButton = (data) => {
    //obtenemos todas las preguntas
    getPreguntasExamen(data.id);
    setDescripcionModal("Actualizar capacitación");

    //obtenemos los id de las empresas
    const empresasFormat = data.Empresas.map(function (obj) {
      const { id, nombreEmpresa } = obj;
      let newObj = {};
      newObj["value"] = id;
      newObj["label"] = nombreEmpresa;
      return newObj;
    });
    console.log("pase pór aqui");
    const dataFormat = {
      id: data.id,
      nombre: data.nombre,
      instructor: data.instructor,
      fechaInicio: data.fechaInicio,
      fechaCulminacion: data.fechaCulminacion,
      urlVideo: data.urlVideo,
      horas: data.horas,
      fechaAplazo: !data.fechaAplazo ? "" : data.fechaAplazo,
      certificado: data.certificado,
      empresas: empresasFormat,
    };

    setdataForm(dataFormat);
    openModal();
  };

  const openConfirm = (data, action) => {
    setRowSelected(data);
    if (action === "DELETE") {
      setSweetAlert(true);
    } else {
      setSweetAlertState(true);
    }
  };

  const confirmDelete = () => {
    showLoader();
    deleteCapacitaciones(rowSelected.id).then((res) => {
      if (res.data) {
        removeItem(data);
        setSweetAlert(false);
        toast.success("Eliminado con exito", {
          position: "bottom-right",
        });
      } else {
        console.log("res", res);
        toast.error(res.message, {
          position: "bottom-right",
        });
      }
      hideLoader();
    });
  };

  const confirmUpdateState = () => {
    showLoader();
    patchEstadoCapacitacion(rowSelected).then(({data, message = ''}) => {
      console.log('data :>><<<<<<<<<<<<<<<<<<<<<< ', data);
      if (data) {
        getCapacitacion(data.id).then(({data}) => {
          const {capacitacion} = data;
          delete data.capacitacion;
          const dataFormat = {...data, ...capacitacion}
          toast.success("Actualizado con exito", {
            position: "bottom-right",
          });
          console.log('dataFormat', dataFormat)
          updateRow(dataFormat);
        })
        setSweetAlertState(false);
      } else {
        toast.error("Ocurrio un error en el servidor", {
          position: "bottom-right",
        });
      }
      hideLoader();
    });
  };


  const getPreguntasExamen = (id) => {
    getPreguntas(id).then(({ data }) => {
      if (!data.preguntas) {
        setFormPreguntas(initialFormPreguntas);
        return;
      }
      const formatPreguntas = data.preguntas.map((pregunta) => ({
        texto: pregunta.texto,
        opcion1: pregunta.opcion1,
        opcion2: pregunta.opcion2,
        opcion3: pregunta.opcion3,
        opcion4: pregunta.opcion4,
        opcion5: pregunta.opcion5,
        puntajeDePregunta: pregunta.puntajeDePregunta,
        respuesta_correcta: pregunta.respuesta_correcta,
      }));
      setFormPreguntas(formatPreguntas);
    });
  };

  // fin tabla

  const handleFormChange = (index, event) => {
    let data = [...formPreguntas];
    data[index][event.target.name] = event.target.value;
    setFormPreguntas(data);
  };

  const addPregunta = () => {
    let newPregunta = {
      texto: "",
      opcion1: "",
      opcion2: "",
      opcion3: "",
      opcion4: "",
      opcion5: "",
      puntajeDePregunta: "",
      respuesta_correcta: 1,
    };

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
          resolve(false);
        }
      });
      resolve(formPreguntas);
    });
  };

  const onFilterTextBoxChanged = useCallback((e) => {
    gridRef.current.api.setQuickFilter(e.target.value);
  }, []);

  const openAddModal = () => {
    setDescripcionModal("Agregar capacitación");
    openModal();
    setdataForm(initialForm);
    setFormPreguntas(initialFormPreguntas);
  };

  return (
    <div className="">
      <div className="bg-white p-3">
        <h2 className="font-bold text-2xl mb-3">Capacitaciones</h2>
        <div className="flex justify-between gap-3 mb-2">
          <input
            type="text"
            placeholder="Buscar"
            id="searchInput"
            onChange={onFilterTextBoxChanged}
            className="input input-bordered input-sm"
          />
          <Button description="Registrar" icon={faPlus} event={openAddModal} />
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
          title={descripcionModal}
        >
          <StepWizard initialStep={1} nav={<NavWizard />}>
            <div className="p-3" stepName={"inicio"}>
              <FormularioInicio
                initialForm={dataForm}
                empresasDb={empresas}
                validateGetPreguntas={validateGetPreguntas}
                closeModal={closeModal}
                addItem={addItem}
                updateRow={updateRow}
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
              {/*   <Button
                description="Nueva pregunta"
                icon={faPlus}
                event={addPregunta}
              /> */}
            </div>
          </StepWizard>
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
        <SweetAlert
          warning
          showCancel
          confirmBtnText="si"
          cancelBtnText="No, cancelar"
          confirmBtnCssClass="btn-sweet-success"
          cancelBtnCssClass="btn-sweet-danger"
          title="¿Esta seguro de actualizar la capacitación?"
          onConfirm={confirmUpdateState}
          show={sweetAlertState}
          onCancel={() => setSweetAlertState(false)}
        ></SweetAlert>
      </div>
    </div>
  );
};

export default ListaCapacitaciones;
