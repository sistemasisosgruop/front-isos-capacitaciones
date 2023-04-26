import React, { useCallback, useEffect, useMemo, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import SweetAlert from "react-bootstrap-sweetalert";
import { getEmpresas } from "../../../services/empresa";
import { useRef } from "react";
import { Modal } from "../../../components/modal/Modal";
import useModals from "../../../hooks/useModal";
import Button from "../../../components/Button";
import { toast } from "react-toastify";
import FormularioTest from "./components/FormularioTest";
import { deleteTest, getTest } from "../../../services/test";

const initialForm = {
  id: "",
  detalle: "",
  urlTest: "",
  fechaCr: "",
  fechaVen: "",
  fechaAplazo: "",
  Empresas: "",
};

const ListadoTest = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "80vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [dataForm, setdataForm] = useState(initialForm);
  const [sweetAlert, setSweetAlert] = useState(false);
  const [rowData, setRowData] = useState();
  const [rowDelete, setRowDelete] = useState(null);
  const [empresas, setEmpresas] = useState([]);

  const [isOpenModal, openModal, closeModal] = useModals();
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

  const [columnDefs, setColumnDefs] = useState([
    { field: "id", hide: true },
    { field: "detalle" },
    { field: "urlTest", headerName: "URL video" },
    { field: "fechaCr", headerName: "Fecha de inicio" },
    { field: "fechaVen", headerName: "Fecha fin" },
    { field: "fechaAplazo", headerName: "Fecha de aplazo" },
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
    getTest().then((res) => {
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
    console.log("data", data);
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
    const { createdAt, empresaId, Empresas, ...formatData } = data;

    // ! esta campo debe venir de la DB
    formatData.fechaAplazo = "";

    const formatEmpresas = Empresas.map(function (obj) {
      const { id, nombreEmpresa } = obj;
      let newObj = {};
      newObj["value"] = id;
      newObj["label"] = nombreEmpresa;
      return newObj;
    });

    formatData.Empresas = formatEmpresas;
    setdataForm(formatData);
    openModal();
  };

  const openConfirm = (data) => {
    setRowDelete(data);
    setSweetAlert(true);
  };

  const confirmDelete = () => {
    deleteTest(rowDelete.id).then(({ data }) => {
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

  const onFilterTextBoxChanged = useCallback((e) => {
    gridRef.current.api.setQuickFilter(e.target.value);
  }, []);

  return (
    <div className="">
      <div className="bg-white p-3">
        <h2 className="font-bold text-2xl mb-3">Test</h2>
        <div className="flex justify-between gap-3 mb-2">
            <input
              type="text"
              name="empresa"
              placeholder="Buscar"
              id="searchInput"
              onChange={onFilterTextBoxChanged}
              className="input input-bordered input-sm"
            />
            <Button
              description="Registrar"
              icon={faPlus}
              event={openAddModal}
            />
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
          title="Agregar empresa"
        >
          <FormularioTest
            initialForm={dataForm}
            closeModal={closeModal}
            addItem={addItem}
            updateRow={updateRow}
            empresasDb={empresas}
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

export default ListadoTest;
