import React, { useCallback, useMemo, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import SweetAlert from "react-bootstrap-sweetalert";
import {
  deleteEmpresa,
  getEmpresas,
} from "../../../services/empresa";
import { useRef } from "react";
import { Modal } from "../../../components/modal/Modal";
import useModals from "../../../hooks/useModal";
import Button from "../../../components/Button";
import { toast } from "react-toastify";
import FormularioEmpresa from "./components/FormularioEmpresa";

const initialForm = {
  empresa: "",
  ruc: "",
  nombreGerente: "",
  numeroContacto: "",
  direccion: "",
  logoEmpresa: "",
  fondoCertificado: "",
};

const ListadoEmpresa = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "80vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [dataForm, setdataForm] = useState(initialForm);
  const [sweetAlert, setSweetAlert] = useState(false);
  const [rowData, setRowData] = useState();
  const [isOpen1, openModal1, closeModal1] = useModals();
  const [rowDelete, setRowDelete] = useState(null);
  const gridRef = useRef();

  //configuracion de la tabla
  const renderButtons = ({ data }) => {
    return (
      <>
        <label onClick={() => updateButton(data)} className="cursor-pointer mr-2">
          <FontAwesomeIcon icon={faEdit} />
        </label>
        <label className="cursor-pointer" onClick={() => openConfirm(data)}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </label>
      </>
    );
  };

  const [columnDefs, setColumnDefs] = useState([
    { field: "id", hide: true },
    { field: "nombreEmpresa" },
    { field: "direccion" },
    { field: "nombreGerente" },
    { field: "numeroContacto" },
    { field: "imagenLogo" },
    { field: "imagenCertificado" },
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
    getEmpresas().then((res) => {
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

  const openAddModal = () => {
    openModal1();
    setdataForm(initialForm);
  };
  

  const updateButton = (data) => {
    const {
      nombreEmpresa: empresa,
      RUC: ruc,
      nombreGerente,
      numeroContacto,
      direccion,
      id,
    } = data;

    openModal1();
    setdataForm({
      id,
      empresa,
      ruc,
      nombreGerente,
      numeroContacto,
      direccion,
      //TODO: agregar dinamismo
      logoEmpresa: "",
      fondoCertificado: "",
    });
  };

  const openConfirm = (data) => {
    setRowDelete(data);
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

  return (
    <div className="">
      <div className="bg-white p-3">
        <div className="flex justify-between gap-3">
          <h2 className="font-bold text-2xl mb-3">Empresas</h2>
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

      </div>
    </div>
  );
};

export default ListadoEmpresa;
