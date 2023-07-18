import React, { useCallback, useMemo, useEffect, useState } from "react";
import { hideLoader, showLoader } from "../../../utils/loader";
import Button from "../../../components/Button";
import FormularioTrabajador from "./components/FormularioTrabajador";
import { Modal } from "../../../components/modal/Modal";
import useModals from "../../../hooks/useModal";
import { initialForm } from "./config";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import SweetAlert from "react-bootstrap-sweetalert";
import { getEmpresas } from "../../../services/empresa";
import { useRef } from "react";
import { toast } from "react-toastify";
import {
  deleteTrabajador,
  getTrabajador,
  getTrabajadores,
  patchEstado,
} from "../../../services/trabajador";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrashAlt,
  faFileImport,
  faFileExport,
  faCheckCircle,
  faTimesCircle,
  faCheck,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import FormularioImportar from "./components/FormularioImportar";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import FormularioEmo from "./components/FormularioEmo";

const ListadoTrabajador = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "80vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [dataForm, setdataForm] = useState(initialForm);
  const [sweetAlert, setSweetAlert] = useState(false);
  const [sweetAlertState, setSweetAlertState] = useState(false);
  const [rowData, setRowData] = useState();
  const [isOpen1, openModal1, closeModal1] = useModals();
  const [isOpenImport, openModalImport, closeModalImport] = useModals();
  const [rowDelete, setRowDelete] = useState(null);
  const [selectFilter, setSelectFilter] = useState("");
  const [empresas, setEmpresas] = useState([]);
  const [refetchData, setRefetchData] = useState(false);
  const [descripcionModal, setDescripcionModal] = useState("");
  const [modalEmo, setModalEmo] = useState(false);
  const gridRef = useRef();

  useEffect(() => {
    getEmpresas().then((res) => setEmpresas(res.data));
  }, []);

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
          className="cursor-pointer"
          onClick={() => openConfirm(data, "DELETE")}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </label>
      </>
    );
  };

  const renderButtonsEstado = ({ data }) => {
    return (
      <label
        className="cursor-pointer"
        onClick={() => openConfirm(data, "UPDATE")}
      >
        {data.habilitado ? (
          <div className="badge bg-red-500">Deshabilitar</div>
        ) : (
          <div className="badge bg-teal-700">Habilitar</div>
        )}
      </label>
    );
  };

  const renderButtonEmo = ({ data }) => {
    return (
      <label className="cursor-pointer" onClick={() => cargarEmoPdf(data)}>
        EMO{" "}
        {data.emoPdf !== null ? (
          <FontAwesomeIcon style={{ color: "green" }} icon={faCheck} />
        ) : (
          <FontAwesomeIcon style={{ color: "red" }} icon={faClose} />
        )}
      </label>
    );
  };

  const [columnDefs, setColumnDefs] = useState([
    { field: "id", hide: true },
    { field: "apellidoPaterno", headerName: "Apellido paterno" },
    { field: "apellidoMaterno", headerName: "Apellido materno" },
    { field: "nombres", headerName: "Nombres" },
    { field: "dni", headerName: "DNI" },
    { field: "edad", headerName: "Edad" },
    { field: "areadetrabajo", headerName: "Area" },
    { field: "celular", headerName: "Celular" },
    { field: "cargo", headerName: "Cargo" },
    { field: "empresa.nombreEmpresa", headerName: "Empresa" },
    {
      field: "emoPdf",
      headerName: "EMO",
      cellStyle: { textAlign: "center" },
      cellRenderer: renderButtonEmo,
    },
    {
      headerName: "Habil/deshab",
      minWidth: 150,
      cellStyle: { textAlign: "center" },
      cellRenderer: renderButtonsEstado,
    },
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

  const getDataTrabajador = async()=>{

    const response = await getTrabajadores()
    if(response.status === 200){
      setRowData(response.data)
    }
  }
  //cargar la informacion de la tabla
  const onGridReady = useCallback(async(params) => {
    await getDataTrabajador()
  }, []);
  useEffect(() => {
    onGridReady();
  }, [refetchData]);

  const openAddModal = () => {
    setDescripcionModal("Agregar trabajador");
    openModal1();
    setdataForm(initialForm);
  };

  const cargarEmoPdf = (data) => {
    setDescripcionModal("SUBIR EMO DE TRABAJADOR");
    setModalEmo(true);
    setdataForm(data);
    // setdataForm(initialForm);
  };

  const updateButton = (data) => {
    setDescripcionModal("Actualizar trabajador");
    openModal1();
    const { createdAt, userId, empresaId: empresa, user, ...formatData } = data;
    formatData.password = "";
    formatData.empresa = empresa;
    setdataForm(formatData);
  };

  const openConfirm = (data, action) => {
    setRowDelete(data);
    if (action === "DELETE") {
      setSweetAlert(true);
    } else {
      setSweetAlertState(true);
    }
  };

  const confirmDelete = () => {
    showLoader();
    deleteTrabajador(rowDelete.id).then(({ data, message = null }) => {
      if (data) {
        removeItem(rowDelete);
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
    patchEstado(rowDelete).then(({ data, message = null }) => {
      if (data) {
        getTrabajador(rowDelete.id).then(({ data }) => {
          data["nombreEmpresa"] = data.empresa.nombreEmpresa;
          updateRow(data);
        });
        setSweetAlertState(false);
        toast.success("Actualizado con exito", {
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

  //filtro de la tabla
  const onFilterTextBoxChanged = useCallback((e, isSelect) => {
    if (isSelect) {
      setSelectFilter(e.target.value);
      document.getElementById("searchInput").value = "";
    } else {
      document.getElementById("searchSelect").value = "";
    }
    gridRef.current.api.setQuickFilter(e.target.value);
  }, []);

  const closeModalEmo = () =>{
    setModalEmo(false)
  }

  //excel
  const crearExcel = async () => {
    const workbook = new ExcelJS.Workbook();

    //Agregar una hoja de trabajo
    const worksheet = workbook.addWorksheet("Hoja 1");

    // establecemos las filas
    worksheet.columns = [
      { header: "Nombre", key: "nombres", width: 32, color: "D58144" },
      { header: "Apellido paterno", key: "apellidoPaterno", width: 32 },
      { header: "Apellido materno", key: "apellidoMaterno", width: 32 },
      { header: "DNI", key: "dni", width: 10 },
      { header: "Genero", key: "genero", width: 10 },
      { header: "Edad", key: "edad", width: 10 },
      { header: "Area", key: "areadetrabajo", width: 32 },
      { header: "Cargo", key: "cargo", width: 32 },
      { header: "Empresa", key: "nombreEmpresa", width: 32 },
    ];

    // Obtener el rango correspondiente a la cabecera
    const headerRange = worksheet.getRow(1);

    // Aplicar un estilo de relleno a la cabecera
    headerRange.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "16A971" },
    };
    //agrega filas
    worksheet.addRows(rowData);

    // Descarga el archivo Excel en el navegador
    workbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        "trabajadores.xlsx"
      );
    });
  };
  return (
    <div className="">
      <div className="bg-white p-3">
        <div className="flex justify-between gap-3">
          <h2 className="font-bold text-2xl mb-3">Trabajadores</h2>
        </div>
        <div className="flex flex-col lg:flex-row justify-between gap-3 mb-3 w-full">
          <div className="flex flex-col md:flex-row w-full lg:w-3/5 gap-3">
            <select
              className="select select-bordered select-sm"
              id="searchSelect"
              onChange={(e) => onFilterTextBoxChanged(e, true)}
              value={selectFilter}
            >
              <option value={""}>Seleccione una empresa</option>
              {empresas.map((empresa) => {
                return (
                  <option key={empresa.id} value={empresa.nombreEmpresa}>
                    {empresa.nombreEmpresa}
                  </option>
                );
              })}
            </select>
            <input
              type="text"
              name="empresa"
              placeholder="Buscar"
              id="searchInput"
              onChange={(e) => onFilterTextBoxChanged(e, false)}
              className="input input-bordered input-sm"
            />
          </div>
          <div className="flex flex-col md:flex-row justify-end  gap-3 w-full lg:w-2/5">
            <Button
              description="Importar"
              icon={faFileImport}
              event={openModalImport}
            />
            <Button
              description="Exportar"
              icon={faFileExport}
              event={crearExcel}
            />
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
          isOpen={isOpen1}
          openModal={openModal1}
          closeModal={closeModal1}
          size={"modal-lg"}
          title={descripcionModal}
        >
          <FormularioTrabajador
            initialForm={dataForm}
            closeModal={closeModal1}
            addItem={addItem}
            updateRow={updateRow}
            empresas={empresas}
          />
        </Modal>
        <Modal
          isOpen={modalEmo}
          openModal={modalEmo}
          closeModal={closeModalEmo}
          size={"modal-sm"}
          title={descripcionModal}
        >
          <FormularioEmo
            initialForm={dataForm}
            closeModal={closeModalEmo}
            addItem={addItem}
            updateRow={updateRow}
            empresas={empresas}
            setRefetchData={setRefetchData}
          />
        </Modal>

        <Modal
          isOpen={isOpenImport}
          openModal={openModalImport}
          closeModal={closeModalImport}
          size={"modal-sm"}
          title="Importar trabajadores"
        >
          <FormularioImportar
            setRefetchData={setRefetchData}
            closeModal={closeModalImport}
            empresas={empresas}
            actualizar = {getDataTrabajador}
          />
        </Modal>

        <SweetAlert
          warning
          showCancel
          confirmBtnText="si"
          cancelBtnText="No, cancelar"
          confirmBtnCssClass="btn-sweet-success"
          cancelBtnCssClass="btn-sweet-danger"
          title="¿Esta seguro de eliminar al trabajador?"
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
          title="¿Esta seguro de actualizar al trabajador?"
          onConfirm={confirmUpdateState}
          show={sweetAlertState}
          onCancel={() => setSweetAlertState(false)}
        ></SweetAlert>
      </div>
    </div>
  );
};

export default ListadoTrabajador;
