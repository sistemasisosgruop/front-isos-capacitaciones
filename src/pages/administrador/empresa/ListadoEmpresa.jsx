import React, { useCallback, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import SweetAlert from "react-bootstrap-sweetalert";
import { deleteEmpresa, getEmpresas, getImgs } from "../../../services/empresa";
import { useRef } from "react";
import { Modal } from "../../../components/modal/Modal";
import useModals from "../../../hooks/useModal";
import Button from "../../../components/Button";
import { toast } from "react-toastify";
import FormularioEmpresa from "./components/FormularioEmpresa";
import loadingImg from "../../../assets/img/cargando-loading-048.gif";
import { hideLoader, showLoader } from "../../../utils/loader";
import { initialForm } from "./config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrashAlt,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

const ListadoEmpresa = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "80vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [dataForm, setdataForm] = useState(initialForm);
  const [sweetAlert, setSweetAlert] = useState(false);
  const [rowData, setRowData] = useState();
  const [rowDelete, setRowDelete] = useState(null);
  const [descripcionModal, setDescripcionModal] = useState('');

  const [isOpenModal, openModal, closeModal] = useModals();
  const [isOpenModalImg, openModalImg, closeModalImg] = useModals();
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

  const renderButtonLogo = ({ data }) => {
    return (
      <div
        className="badge badge-primary cursor-pointer"
        onClick={() => showImgs(data, true)}
      >
        <FontAwesomeIcon icon={faEye} />
      </div>
    );
  };

  const renderButtonCertificado = ({ data }) => {
    return (
      <div
        className="badge badge-primary cursor-pointer"
        onClick={() => showImgs(data, false)}
      >
        <FontAwesomeIcon icon={faEye} />
      </div>
    );
  };

  const [columnDefs, setColumnDefs] = useState([
    { field: "id", hide: true },
    { field: "nombreEmpresa" },
    { field: "direccion" },
    { field: "nombreGerente" },
    { field: "numeroContacto" },
    {
      field: "imagenLogo",
      cellRenderer: renderButtonLogo,
      cellStyle: { textAlign: "center" },
    },
    {
      field: "imagenCertificado",
      cellRenderer: renderButtonCertificado,
      cellStyle: { textAlign: "center" },
    },
    { field: "RUC" },
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

  //cargar la informacion de la tabla
  const onGridReady = useCallback((params) => {
    getEmpresas().then(({ data }) => {
      if (data) {
        setRowData(data);
      } else {
        toast.error("Ocurrio un error en el servidor", {
          position: "bottom-right",
        });
      }
    });
  }, []);

  const handleSearch = (e) => {
    gridRef.current.api.setQuickFilter(e.target.value);
  };

  const openAddModal = () => {
    setDescripcionModal('Agregar empresa');
    openModal();
    setdataForm(initialForm);
  };
  
  const updateButton = (data) => {
    setDescripcionModal('Actualizar empresa');
    const {
      nombreEmpresa: empresa,
      RUC: ruc,
      nombreGerente,
      numeroContacto,
      direccion,
      id,
      relacionadas,
    } = data;

    openModal();
    setdataForm({
      id,
      empresa,
      ruc,
      nombreGerente,
      numeroContacto,
      direccion,
      logoEmpresa: "-",
      fondoCertificado: "-",
      relacionadas: relacionadas
    });
  };

  const openConfirm = (data) => {
    setRowDelete(data);
    setSweetAlert(true);
  };

  const confirmDelete = () => {
    showLoader();
    deleteEmpresa(rowDelete.id).then(({ data, message = null }) => {
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

  const showImgs = (data, isLogo) => {
    const img = isLogo ? "logo" : "certificado";
    getImgs(data.id, img).then((res) => {
      const url = URL.createObjectURL(new Blob([res.data]));
      const logoElement = document.getElementById("logo");
      logoElement.src = url;
    });
    openModalImg();
  };

  return (
    <div className="">
      <div className="bg-white p-3">
        <div className="flex justify-between gap-3">
        <h2 className="font-bold text-2xl mb-3">Empresas</h2>
        </div>
        <div className="flex flex-col justify-between w-full gap-3 mb-3 lg:flex-row">
          <div className="flex flex-col w-full gap-3 md:flex-row lg:w-3/5">
          <input
            type="text"
            placeholder="Buscar por nombre de empresa"
            className="input input-bordered input-sm"
            onChange={handleSearch} // Llama al manejador del filtro
          />
          </div>
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
          openModal={openModal}
          isOpen={isOpenModal}
          closeModal={closeModal}
          size={"modal-lg"}
          title={descripcionModal}
        >
          <FormularioEmpresa
            initialForm={dataForm}
            closeModal={closeModal}
            addItem={addItem}
            updateRow={updateRow}
          />
        </Modal>
        <Modal
          isOpen={isOpenModalImg}
          openModal={openModalImg}
          closeModal={closeModalImg}
          size={"modal-lg"}
          title="Imagen"
        >
          <img id="logo" className="aspect-video w-full" src={loadingImg} />
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
      </div>
      </div>
  );
};

export default ListadoEmpresa;
