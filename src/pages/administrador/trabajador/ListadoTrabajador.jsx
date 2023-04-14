import React, { useCallback, useMemo, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import SweetAlert from "react-bootstrap-sweetalert";
import { deleteEmpresa, getEmpresas } from "../../../services/empresa";
import { useRef } from "react";
import { Modal } from "../../../components/modal/Modal";
import useModals from "../../../hooks/useModal";
import Button from "../../../components/Button";
import { toast } from "react-toastify";
import FormularioTrabajador from "./components/FormularioTrabajador";
import {
  deleteTrabajador,
  getTrabajadores,
} from "../../../services/trabajador";

import {
  faPlus,
  faEdit,
  faTrashAlt,
  faFileImport,
  faFileExport,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import FormularioImportar from "./components/FormularioImportar";


//excel 
import { ExcelFile, ExcelSheet, ExcelColumn } from 'react-export-excel';


const initialForm = {
  id: "",
  nombres: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  dni: "",
  genero: "",
  edad: "",
  areadetrabajo: "",
  cargo: "",
  fechadenac: "",
  password: "",
  empresa: "",
};

const ListadoTrabajador = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "80vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [dataForm, setdataForm] = useState(initialForm);
  const [sweetAlert, setSweetAlert] = useState(false);
  const [rowData, setRowData] = useState();
  const [isOpen1, openModal1, closeModal1] = useModals();
  const [isOpenImport, openModalImport, closeModalImport] = useModals();
  const [rowDelete, setRowDelete] = useState(null);
  const [selectFilter, setSelectFilter] = useState("");
  const [empresas, setEmpresas] = useState([]);
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
        <label className="cursor-pointer" onClick={() => openConfirm(data)}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </label>
      </>
    );
  };

  const [columnDefs, setColumnDefs] = useState([
    { field: "id", hide: true },
    { field: "apellidoPaterno" },
    { field: "apellidoMaterno" },
    { field: "nombres" },
    { field: "dni" },
    { field: "edad" },
    { field: "areadetrabajo" },
    { field: "cargo" },
    { field: "empresaId" },
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
    getTrabajadores().then((res) => {
      const { data } = res;
      if (data) {
        /*    const { empresa, ...newData } = data;
        data.map( e => )
        console.log('data', data)
        newData.empresa = empresa.nombreEmpresa; */
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
    openModal1();
    const { createdAt, userId, empresaId: empresa, user, ...formatData } = data;
    formatData.password = data.user.contraseña;
    formatData.empresa = empresa;
    setdataForm(formatData);
    console.log("formatData", formatData);
  };

  const openConfirm = (data) => {
    setRowDelete(data);
    setSweetAlert(true);
  };

  const confirmDelete = () => {
    deleteTrabajador(rowDelete.id).then((res) => {
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

  const onFilterTextBoxChanged = useCallback((e, isSelect) => {
    if (isSelect) {
      setSelectFilter(e.target.value);
      document.getElementById("searchInput").value = "";
    } else {
      document.getElementById("searchSelect").value = "";
    }
    gridRef.current.api.setQuickFilter(e.target.value);
  }, []);

  //excel

  const dataSet1 = [
    {
        name: "Johson",
        amount: 30000,
        sex: 'M',
        is_married: true
    },
    {
        name: "Monika",
        amount: 355000,
        sex: 'F',
        is_married: false
    },
    {
        name: "John",
        amount: 250000,
        sex: 'M',
        is_married: false
    },
    {
        name: "Josef",
        amount: 450500,
        sex: 'M',
        is_married: true
    }
];

var dataSet2 = [
    {
        name: "Johnson",
        total: 25,
        remainig: 16
    },
    {
        name: "Josef",
        total: 25,
        remainig: 7
    }
];

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
                  <option key={empresa.id} value={empresa.id}>
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
            <Button description="Exportar" icon={faFileExport} />
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
          title="Agregar empresa"
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
          isOpen={isOpenImport}
          openModal={openModalImport}
          closeModal={closeModalImport}
          size={"modal-sm"}
          title="Importar trabajadores"
        >
          <FormularioImportar empresas={empresas} />
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
      <ExcelFile element={<button>Download Data</button>}>
                <ExcelSheet data={dataSet1} name="Employees">
                    <ExcelColumn label="Name" value="name"/>
                    <ExcelColumn label="Wallet Money" value="amount"/>
                    <ExcelColumn label="Gender" value="sex"/>
                    <ExcelColumn label="Marital Status"
                                 value={(col) => col.is_married ? "Married" : "Single"}/>
                </ExcelSheet>
                <ExcelSheet data={dataSet2} name="Leaves">
                    <ExcelColumn label="Name" value="name"/>
                    <ExcelColumn label="Total Leaves" value="total"/>
                    <ExcelColumn label="Remaining Leaves" value="remaining"/>
                </ExcelSheet>
            </ExcelFile>
    </div>
  );
};

export default ListadoTrabajador;
