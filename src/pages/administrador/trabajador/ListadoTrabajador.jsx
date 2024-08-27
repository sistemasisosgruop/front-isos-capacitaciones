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
import DataTable from "react-data-table-component";
import styled from "styled-components";
import noData from "../../../assets/img/no-data.png";

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
const StyledDataTable = styled(DataTable)`
  border: 1px solid lightgrey;
  border-radius: 5px;
`;
const ListadoTrabajador = () => {
  const containerStyle = useMemo(() => ({ width: "100%" }), []);
  const gridStyle = useMemo(() => ({ width: "100%" }), []);
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
  const [perPage, setPerPage] = useState(15);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const [empresaData, setEmpresaData] = useState("");
  const [page, setPage] = useState(1);

  const gridRef = useRef();

  useEffect(() => {
    getEmpresas().then((res) => setEmpresas(res.data));
  }, []);

  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Apellido paterno",
      selector: (row) => row.apellidoPaterno.toUpperCase(),
      sortable: true,
    },
    {
      name: "Apellido materno",
      selector: (row) => row.apellidoMaterno.toUpperCase(),
      sortable: true,
    },
    {
      name: "Nombres",
      selector: (row) => row.nombres.toUpperCase(),
      sortable: true,
    },

    {
      name: "DNI",
      selector: (row) => row.dni,
      center: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      center: true,
    },
    {
      name: "Edad",
      selector: (row) => row.edad,
      center: true,
    },
    {
      name: "Área",
      selector: (row) => row.areadetrabajo,
      center: true,
    },
    {
      name: "Celular",
      selector: (row) => row.celular,
      center: true,
    },
    {
      name: "Cargo",
      selector: (row) => row.cargo,
      center: true,
    },
    {
      name: "Empresa",
      selector: (row) => row?.empresa?.nombreEmpresa,
      sortable: true,
      center: true,
    },
    {
      name: "Rol",
      // selector: (row) => row?.user?.rol === "Supervisor" ? "Si" : "No",
      selector: (row) => row?.user?.rol === "Trabajador" ? "" : row?.user?.rol,
      center: true,
    },
    {
      name: "EMO",
      button: true,
      cell: (e) => (
        <label className="cursor-pointer" onClick={() => cargarEmoPdf(e)}>
          EMO{" "}
          {e.emoPdf !== null ? (
            <FontAwesomeIcon style={{ color: "green" }} icon={faCheck} />
          ) : (
            <FontAwesomeIcon style={{ color: "red" }} icon={faClose} />
          )}
        </label>
      ),
      center: true,
    },
    {
      name: "Habil/desab",
      button: true,
      cell: (e) => (
        <label
          className="cursor-pointer"
          onClick={() => openConfirm(e, "UPDATE")}
        >
          {e.habilitado ? (
            <div className="bg-red-500 badge">Deshabilitar</div>
          ) : (
            <div className="bg-teal-700 badge">Habilitar</div>
          )}
        </label>
      ),
      center: true,
    },

    {
      name: "Opciones",
      button: true,
      cell: (e) => (
        <>
          <label
            onClick={() => updateButton(e)}
            className="mr-2 cursor-pointer"
          >
            <FontAwesomeIcon icon={faEdit} />
          </label>
          <label
            className="cursor-pointer"
            onClick={() => openConfirm(e, "DELETE")}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </label>
        </>
      ),
      center: true,
    },
  ];

  //funciones para refrescar la tabla
  const addItem = useCallback((addIndex, newRow) => {
    const newItem = [newRow];
    gridRef.current.api.applyTransaction({
      add: newItem,
      addIndex: addIndex,
    });
  }, []);

  const updateRow = useCallback((data) => {
    // var rowNode = gridRef.current.api.getRowNode(data?.id);
    // rowNode.setData(data);
  }, []);

  const removeItem = useCallback((data) => {
    const arrayItems = [data];
    gridRef.current.api.applyTransaction({ remove: arrayItems });
  }, []);

  const getDataTrabajador = async () => {
    const response = await getTrabajadores(page, perPage, empresaData, search);
    if (response.status === 200) {
      setRowData(response.data.data);
      setTotalRows(response.data.pageInfo.total);
    }
  };
  useEffect(() => {
    getDataTrabajador();
  }, [page, empresaData, search]);



  const openAddModal = () => {
    setDescripcionModal("Agregar trabajador");
    openModal1();
    setdataForm(initialForm);
  };

  const cargarEmoPdf = (data) => {
    setDescripcionModal("SUBIR EMO DE TRABAJADOR");
    setModalEmo(true);
    setdataForm(data);
    handlePageChange();
    // setdataForm(initialForm);
  };

  const updateButton = (data) => {
    setDescripcionModal("Actualizar trabajador");
    openModal1();
    const { createdAt, userId, empresaId: empresa, user, ...formatData } = data;
    formatData.password = "";
    formatData.empresa = empresa;
    formatData.rol = user.rol
    setdataForm(formatData);
  };

  const openConfirm = (data, action) => {
    setRowDelete(data);
    if (action === "DELETE") {
      setSweetAlert(true);
      getDataTrabajador()

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
        getDataTrabajador()
      } else {
        toast.error(message, {
          position: "bottom-right",
        });
      }
      hideLoader();
    });
  };

  const closeModalEmo = () => {
    setModalEmo(false);
  };


  //excel
  const crearExcel = async () => {
    const response = await getTrabajadores(
      page,
      perPage,
      empresaData,
      search,
      true
    );
    if (response.status === 200) {
      generarExcel(response.data.data);  // Llamar a la función para generar Excel
    }
  };
  
  const generarExcel = (data) => {
    if (data.length > 0) {
      const workbook = new ExcelJS.Workbook();

      //Agregar una hoja de trabajo
      const worksheet = workbook.addWorksheet("Hoja 1");

      // establecemos las filas
      worksheet.columns = [
        { header: "Nombre", key: "nombres", width: 32, color: "D58144" },
        { header: "Apellido paterno", key: "apellidoPaterno", width: 32 },
        { header: "Apellido materno", key: "apellidoMaterno", width: 32 },
        { header: "DNI", key: "dni", width: 10 },
        { header: "Email", key: "email", width: 10 },
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
      worksheet.addRows(data);

      // Descarga el archivo Excel en el navegador
      workbook.xlsx.writeBuffer().then(function (buffer) {
        saveAs(
          new Blob([buffer], { type: "application/octet-stream" }),
          "trabajadores.xlsx"
        );
      });
    }
  };

  return (
    <div
      className=""
      style={{ width: "100%", padding: "20px", height: "20% !important" }}
    >
      <div className="p-3 bg-white ">
        <div className="flex justify-between gap-3">
          <h2 className="mb-3 text-2xl font-bold">Trabajadores</h2>
        </div>
        <div className="flex flex-col justify-between w-full gap-3 mb-3 lg:flex-row">
          <div className="flex flex-col w-full gap-3 md:flex-row lg:w-3/5">
            <select
              className="select select-bordered select-sm"
              id="searchSelect"
              onChange={(e) => setEmpresaData(e.target.value)}
              value={empresaData}
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
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered input-sm"
            />
          </div>
          <div className="flex flex-col justify-end w-full gap-3 md:flex-row lg:w-2/5">
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
            <StyledDataTable
              columns={columns}
              data={rowData}
              dense
              paginationPerPage={15}
              paginationRowsPerPageOptions={[30, 60, 90, 120]}
              paginationComponentOptions={{ noRowsPerPage: true, rangeSeparatorText: "de" }}
              rows
              striped
              highlightOnHover
              responsive
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangePage={(page) => setPage(page)}
              noDataComponent={
                <div style={{ display: "flex", flexDirection:"column" }}>
                  <img src={noData} alt="" width={"250px"} />
                </div>
              }
            />
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
            updateData = {getDataTrabajador}
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
            updateData = {getDataTrabajador}
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
            actualizar={getDataTrabajador}
            updateData = {getDataTrabajador}
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
