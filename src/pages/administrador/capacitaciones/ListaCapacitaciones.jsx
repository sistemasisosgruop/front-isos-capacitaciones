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
  getCapacitacionUser,
  getCapacitaciones,
  getPreguntas,
  patchEstadoCapacitacion,
  patchCapacitaciones,
  patchEstadoRecuperacion
} from "../../../services/capacitacion";
import { AgGridReact } from "ag-grid-react";
import { getEmpresas, getEmpresaCapacitador } from "../../../services/empresa";
import { toast } from "react-toastify";
import SweetAlert from "react-bootstrap-sweetalert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { getReportCreate, getReportStatus } from "../../../services/reportes";
import ProgressBar from "../../../components/ProgressBar";

const ListaCapacitaciones = () => {
  const [formPreguntas, setFormPreguntas] = useState(initialFormPreguntas);
  const [isOpen, openModal, closeModal] = useModals();
  const [empresas, setEmpresas] = useState([]);
  const [dataForm, setdataForm] = useState(initialForm);
  const [rowSelected, setRowSelected] = useState([]);
  const [descripcionModal, setDescripcionModal] = useState("");
  const [sweetAlert, setSweetAlert] = useState(false);
  const [sweetAlertState, setSweetAlertState] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [originalData, setOriginalData] = useState([]);
  const [codigoFiltro, setCodigoFiltro] = useState("");
  const [mesFiltro, setMesFiltro] = useState(""); // Guarda el mes seleccionado (1-12)
  const [añoFiltro, setAñoFiltro] = useState(""); // Guarda el año seleccionado (YYYY)



  const containerStyle = useMemo(() => ({ width: "100%", height: "80vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef();

  const rol = window.localStorage.getItem('rol')
  const userId = window.localStorage.getItem('userId')
  const empresaId = window.localStorage.getItem('empresaId')

  const handleEmpresaFilter = (selectedOption) => {
    if (selectedOption) {
      // Si se selecciona una empresa, filtramos
      const filteredData = rowData.filter((row) =>
        row.Empresas?.some((empresa) => empresa.id === selectedOption.value)
      );
      setRowData(filteredData);
    } else {
      // Si no hay selección, mostramos todos los datos
      setRowData(originalData);
    }
    setSelectedEmpresa(selectedOption || null); // Actualizamos el estado
  };

  //configuracion de la tabla
  const renderButtons = ({ data }) => {
    return (
      <>
        <label
          onClick={() => updateButton(data)}
          className="mr-2 cursor-pointer"
        >
          { 
            data.userId == userId && rol === 'Capacitador'
            ? <FontAwesomeIcon icon={faEdit} />
            : rol === 'Administrador' ? <FontAwesomeIcon icon={faEdit} /> : null
          }
        </label>
        <label
          className="mr-2 cursor-pointer"
          onClick={() => openConfirm(data, "DELETE")}
        >
          { 
            data.userId == userId && rol === 'Capacitador'
            ? <FontAwesomeIcon icon={faTrashAlt} />
            : rol === 'Administrador' ? <FontAwesomeIcon icon={faTrashAlt} /> : null
          }
        </label>
        {}
        <label
          className="cursor-pointer"
          onClick={() => openConfirm(data, "UPDATE")}
        >
        
          {data.habilitado ? (
            data.userId == userId && rol === 'Capacitador'
            ? <div className="bg-red-500 badge">Deshabilitar</div>
            : rol === 'Administrador' ? <div className="bg-red-500 badge">Deshabilitar</div> : null
          ) : (
            data.userId == userId && rol === 'Capacitador'
            ? <div className="bg-teal-700 badge">Habilitar</div>
            : rol === 'Administrador' ? <div className="bg-teal-700 badge">Habilitar</div> : null
          )}
        </label>
      </>
    );
  };

  const renderButtonCertificado = ({ data }) => {
    return (
      <div
        className="cursor-pointer badge badge-primary"
        onClick={() => showImgs(data, true)}
      >
        <FontAwesomeIcon icon={faEye} />
      </div>
    );
  };

  const renderSwitch = ({ value, data }) => {
    return (
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          checked={value}
          onChange={() => handleSwitchChange(data)}
          className={`toggle ${value ? 'toggle-accent bg-teal-300' : 'bg-red-200'}`}
        />
      </div>
    );
  };
  

  const handleSwitchChange = (data) => {
    // Cambiar el valor de recuperación en el estado local
    const updatedData = { ...data, recuperacion: !data.recuperacion };
  
    // Realizar la actualización en el backend
    patchEstadoRecuperacion(data.id, updatedData.recuperacion).then(({ data }) => {
      if (data) {
        // Actualizar la fila en la tabla
        updateRow(updatedData);
        toast.success("Estado de recuperación actualizado", {
          position: "bottom-right",
        });
      } else {
        toast.error("Error al actualizar el estado", {
          position: "bottom-right",
        });
      }
    });
  };
  

  const [columnDefs, setColumnDefs] = useState([
    { field: "id", hide: true },
    { field: "codigo"},
    { field: "nombre" },
    { field: "urlVideo" },
    { field: "instructor" },
    { field: "fechaInicio" },
    { field: "fechaCulminacion" },
    { field: "fechaAplazo" },
    { field: "recuperacion", headerName: "Recuperación", cellRendererFramework: renderSwitch, minWidth: 150 },
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
    if (rol === 'Capacitador') {
      getCapacitacionUser(empresaId).then(({ data }) => {
        if (data) {
          setRowData(data);
          setOriginalData(data);  // Guardamos los datos originales aquí
        } else {
          toast.error("Ocurrio un error en el servidor", {
            position: "bottom-right",
          });
        }
      });
    } else {
      getCapacitaciones().then(({ data }) => {
        if (data) {
          setRowData(data);
          setOriginalData(data);  // Guardamos los datos originales aquí
        } else {
          toast.error("Ocurrio un error en el servidor", {
            position: "bottom-right",
          });
        }
      });
    }
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

  const onFilterTextBoxChanged = useCallback((e) => {
    gridRef.current.api.setQuickFilter(e.target.value);
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
      userId: userId
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
    deleteCapacitaciones(rowSelected.id).then(({ data, message = null }) => {
      if (data) {
        removeItem(data);
        setSweetAlert(false);
        toast.success("Eliminado con exito", {
          position: "bottom-right",
        });
      } else {
        toast.error(message, {
          position: "bottom-right",
        });
      }
      hideLoader();
    });
  };

  const confirmUpdateState = () => {
    showLoader();
    patchEstadoCapacitacion(rowSelected).then(({ data, message = null }) => {
      if (data) {
        getCapacitacion(data.id).then(({ data }) => {
          const { capacitacion } = data;
          delete data.capacitacion;
          const dataFormat = { ...data, ...capacitacion };
          toast.success("Actualizado con exito", {
            position: "bottom-right",
          });
          updateRow(dataFormat);
        });
        setSweetAlertState(false);
      } else {
        toast.error(message, {
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

  //funcion para controlar las preguntas
  const handleFormChange = (index, event) => {
    let data = formPreguntas.map((item, i) => {
      if (i !== index) return item;
      return { ...item, [event.target.name]: event.target.value };
    });
    setFormPreguntas(data);
  };

  useEffect(() => {

    if (rol === 'Capacitador') {
      // console.log(empresaId)
      getEmpresaCapacitador(empresaId).then(({ data }) => {
        const newData = data.map(function (obj) {
          const { id, nombreEmpresa } = obj;
          let newObj = {};
          newObj["value"] = id;
          newObj["label"] = nombreEmpresa;
          return newObj;
        });

        // console.log(newData)
        
        setEmpresas(newData);
      });
    } else {
      getEmpresas().then(({ data }) => {
        const newData = data.map(function (obj) {
          const { id, nombreEmpresa } = obj;
          let newObj = {};
          newObj["value"] = id;
          newObj["label"] = nombreEmpresa;
          return newObj;
        });
  
        setEmpresas(newData);
      });
    }
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

  const openAddModal = () => {
    setDescripcionModal("Agregar capacitación");
    openModal();
    setFormPreguntas(initialFormPreguntas);
    setdataForm(initialForm);
  };

  const createWorkersReport = () => {
    getReportCreate().then(({ report }) => {
      console.log("====================================");
      console.log(report);
      console.log("====================================");
    });

  };

  const aplicarFiltros = () => {
    let datosFiltrados = originalData;

    // Filtro por código
    if (codigoFiltro.trim() !== "") {
      datosFiltrados = datosFiltrados.filter((row) =>
        row.codigo.toLowerCase().includes(codigoFiltro.toLowerCase())
      );
    }
  
    // Filtro por mes y año
    if (mesFiltro || añoFiltro) {
      datosFiltrados = datosFiltrados.filter((row) => {
        if (!row.fechaInicio) return false; // Aseguramos que la fecha exista
        const fecha = new Date(row.fechaInicio);
        const mes = fecha.getMonth() + 1; // getMonth() devuelve de 0 a 11
        const año = fecha.getFullYear();
        return (
          (!mesFiltro || mes === parseInt(mesFiltro)) &&
          (!añoFiltro || año === parseInt(añoFiltro))
        );
      });
    }
  
    setRowData(datosFiltrados);
  };

  // Ejecutar el filtrado cada vez que cambie un filtro
  useEffect(() => {
   aplicarFiltros();
  }, [codigoFiltro, mesFiltro, añoFiltro, originalData]);
      

  return (
    <div className="">
      <div className="p-3 bg-white">
        <div className="flex justify-between gap-3">
          <h2 className="mb-3 text-2xl font-bold">Capacitaciones</h2>
        </div>
        <div className="flex flex-col justify-between w-full gap-3 mb-3 lg:flex-row">
          <div className="flex flex-col w-full gap-3 md:flex-row lg:w-3/8">
            <select
              className="select select-bordered select-sm lg:w-3/4"  // Ajusté el tamaño del select para que esté alineado con el input
              id="searchSelect"
              onChange={(e) => {
                const selectedValue = e.target.value;
                const selectedOption = empresas.reduce((acc, emp) => {
                  if (emp.value == selectedValue) return emp;
                  return acc;
                }, null);
                handleEmpresaFilter(selectedOption);
              }}
              value={selectedEmpresa?.value || ""}
              >
              <option value="">Seleccione una empresa</option>
              {empresas.map((empresa) => (
                <option key={empresa.value} value={empresa.value}>
                  {empresa.label}
                </option>
              ))}
            </select>
            {/* Filtro por código */}
            <input
              type="text"
              name="codigo"
              placeholder="Buscar por código"
              className="input input-bordered input-sm w-full"
              value={codigoFiltro}
              onChange={(e) => {
                setCodigoFiltro(e.target.value)
              }}
            />

            {/* Filtro por mes */}
            <select
              className="select select-bordered select-sm w-full"
              value={mesFiltro}
              onChange={(e) => setMesFiltro(e.target.value)}
            >
              <option value="">Seleccionar mes</option>
              <option value="1">Enero</option>
              <option value="2">Febrero</option>
              <option value="3">Marzo</option>
              <option value="4">Abril</option>
              <option value="5">Mayo</option>
              <option value="6">Junio</option>
              <option value="7">Julio</option>
              <option value="8">Agosto</option>
              <option value="9">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>

            {/* Filtro por año */}
            <select
              className="select select-bordered select-sm w-full"
              value={añoFiltro}
              onChange={(e) => setAñoFiltro(e.target.value)}
            >
              <option value="">Seleccionar año</option>
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
            <input
              type="text"
              name="empresa"
              placeholder="Buscar"
              id="searchInput"
              onChange={onFilterTextBoxChanged}
              className="input input-bordered input-sm w-full"  // Ajusté el tamaño del input para que esté alineado con el select
            />
          </div>

          <div className="flex flex-col justify-end w-full gap-3 md:flex-row lg:w-2/5">
            <ProgressBar/>
            <Button
              description="Registrar"
              icon={faPlus}
              event={openAddModal}
            />
          </div>
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
                userId={userId}
                empresaId={empresaId}
                rol={rol}
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
                    />
                  );
                })}
              </form>
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
