import React, { useCallback, useMemo, useEffect, useState } from "react";
import Button from "../../../components/Button";
import { Modal } from "../../../components/modal/Modal";
import useModals from "../../../hooks/useModal";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import SweetAlert from "react-bootstrap-sweetalert";
import { getEmpresas } from "../../../services/empresa";
import { useRef } from "react";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import styled from "styled-components";
import FormularioImportar from "./components/FormularioImportar";

import { getTrabajadores } from "../../../services/trabajador";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImport } from "@fortawesome/free-solid-svg-icons";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
const StyledDataTable = styled(DataTable)`
  border: 1px solid lightgrey;
  border-radius: 5px;
`;
const CompararTrabajadores = () => {
  const containerStyle = useMemo(
    () => ({ width: "100%", height: "80vh", display: "flex", gap: "10px" }),
    []
  );
  const gridStyle = useMemo(() => ({ height: "100%", width: "50%" }), []);
  const [sweetAlert, setSweetAlert] = useState(false);
  const [sweetAlertState, setSweetAlertState] = useState(false);
  const [rowData, setRowData] = useState();
  const [rowData2, setRowData2] = useState([]);
  const [isOpen1, openModal1, closeModal1] = useModals();
  const [isOpenImport, openModalImport, closeModalImport] = useModals();
  const [selectFilter, setSelectFilter] = useState("");
  const [empresas, setEmpresas] = useState([]);
  const [descripcionModal, setDescripcionModal] = useState("");
  const [modalEmo, setModalEmo] = useState(false);
  const [perPage, setPerPage] = useState(15);
  const [totalRows, setTotalRows] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [search, setSearch] = useState("");
  const [empresaData, setEmpresaData] = useState("");

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
      name: "Celular",
      selector: (row) => row.celular,
      center: true,
    },
  ];

  const getDataTrabajador = async (page, empresa, search) => {
    if (page !== undefined) {
      const response = await getTrabajadores(page, perPage, empresa, search);
      if (response.status === 200) {
        setRowData(response.data.data);
        setTotalRows(response.data.pageInfo.total);
      }
    }
  };

  const handlePageChange = (page) => {
    setPageCount(page);
    if (empresaData || search) {
      getDataTrabajador(page, empresaData, search);
    } else {
      getDataTrabajador(page);
    }
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    const response = await getTrabajadores(page, newPerPage);
    if (response.status === 200) {
      setRowData(response.data.data);
      setPerPage(newPerPage);
    }
  };

  useEffect(() => {
    getDataTrabajador();
  }, [selectFilter]);

  const cargarEmoPdf = (data) => {
    setDescripcionModal("SUBIR EMO DE TRABAJADOR");
    setModalEmo(true);
    setdataForm(data);
    handlePageChange();
    // setdataForm(initialForm);
  };

  const onFilterTextBoxChanged = async (e, isSelect) => {
      setEmpresaData(e.target.value);

    await getDataTrabajador(1, empresaData, search);
  };

  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    rowsPerPage: 50,
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  return (
    <div className="" style={{ width: "100%"}}>
      <div className="bg-white p-3 ">
        <div className="flex justify-between gap-3">
          <h2 className="font-bold text-2xl mb-3">Trabajadores</h2>
        </div>
        <div className="flex flex-col lg:flex-row justify-between gap-3 mb-3 w-full">
          <div className="flex flex-col md:flex-row w-full lg:w-full gap-3" >
            <select
              className="select select-bordered select-sm"
              id="searchSelect"
              onChange={(e) => onFilterTextBoxChanged(e, true)}
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
          </div>
          <div className="flex flex-col md:flex-row justify-start  gap-3 w-full lg:w-full" >
            <Button
              description="Cargar"
              icon={faFileImport}
              event={openModalImport}
            />
          </div>
        </div>

        <div style={containerStyle}>
          {empresaData !== "" &&
          <div style={gridStyle} className="ag-theme-alpine">
            <StyledDataTable
              columns={columns}
              data={rowData}
              dense
              paginationPerPage={15}
              paginationRowsPerPageOptions={[15, 30, 45, 60]}
              paginationComponentOptions={paginationComponentOptions}
              rows
              striped
              highlightOnHover
              responsive
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
            />
          </div>
          }
          {empresaData !== "" && rowData2.length >= 0 &&
          <div style={gridStyle} className="ag-theme-alpine">
            <StyledDataTable
              columns={columns}
              data={rowData2}
              dense
              paginationPerPage={15}
              paginationRowsPerPageOptions={[30, 60, 90, 120]}
              paginationComponentOptions={paginationComponentOptions}
              rows
              striped
              highlightOnHover
              responsive
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
            />
          </div>
          }
        </div>

      </div>
      <Modal
          isOpen={isOpenImport}
          openModal={openModalImport}
          closeModal={closeModalImport}
          size={"modal-sm"}
          title="Importar trabajadores"
        >
          <FormularioImportar
            // setRefetchData={setRefetchData}
            closeModal={closeModalImport}
            empresas={empresas}
            actualizar={getDataTrabajador}
          />
        </Modal>
    </div>
  );
};

export default CompararTrabajadores;
