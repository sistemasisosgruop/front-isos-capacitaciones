import React, { useMemo, useEffect, useState } from "react";
import Button from "../../../components/Button";
import { Modal } from "../../../components/modal/Modal";
import useModals from "../../../hooks/useModal";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import SweetAlert from "react-bootstrap-sweetalert";
import { getEmpresas } from "../../../services/empresa";
import DataTable from "react-data-table-component";
import styled from "styled-components";
import FormularioImportar from "./components/FormularioImportar";
import noData from "../../../assets/img/no-data.png";
import {
  getTrabajadoresEmpresa,
  postTrabajador,
  postTrabajadorComparar,
} from "../../../services/trabajador";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImport } from "@fortawesome/free-solid-svg-icons";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { hideLoader, showLoader } from "../../../utils/loader";
import { toast } from "react-toastify";

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
  const [isOpenImport, openModalImport, closeModalImport] = useModals();
  const [empresas, setEmpresas] = useState([]);
  const [perPage, setPerPage] = useState(15);
  const [totalRows, setTotalRows] = useState(0);
  const [empresaData, setEmpresaData] = useState("");
  const [page, setPage] = useState(1);

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
      selector: (row) => row.apellidoPaterno,
      sortable: true,
    },
    {
      name: "Apellido materno",
      selector: (row) => row.apellidoMaterno,
      sortable: true,
    },
    {
      name: "Nombres",
      selector: (row) => row.nombres,
      sortable: true,
    },
    {
      name: "DNI",
      selector: (row) => row.dni,
      center: true,
    },
    {
      name: "EMAIL",
      selector: (row) => row.email,
      center: true,
    },
    {
      name: "Celular",
      selector: (row) => row.celular,
      center: true,
    },
  ];

  const getDataTrabajador = async () => {
    const response = await getTrabajadoresEmpresa(page, perPage, empresaData);
    if (response.status === 200) {
      setRowData(response.data.data);
      // setTotalRows(response.data.pageInfo.total);
    }
  };

  useEffect(() => {
    getDataTrabajador(page, perPage, empresaData);
  }, [page, empresaData]);

  const matchByDni = (row, otherSet) => {
    const rowDniAsString = String(row.dni).trim();
    return otherSet.some((item) => String(item.dni).trim() === rowDniAsString);
  };

  const conditionalRowStyles = [
    {
      when: (row) => rowData2.length > 0 && !matchByDni(row, rowData2),
      style: {
        backgroundColor: "#f45e65",
        color: "white",
      },
    },
    {
      when: (row) => rowData.length > 0 && !matchByDni(row, rowData),
      style: {
        backgroundColor: "#4d871a",
        color: "white",
      },
    },
    {
      when: (row) => rowData.length === 0,
      style: {
        backgroundColor: "#4d871a",
        color: "white",
      },
    },
  ];

  const handleChangeSubmit = async () => {
    const recordsToDisable = rowData?.filter(
      (row) => !matchByDni(row, rowData2)
    );

    const recordsToUpdate = rowData2?.filter(
      (row) => matchByDni(row, rowData)
    );
    // Filtrar registros en rowData2 que no están en rowData (coloreados de verde para crear)
    const recordsToCreate = rowData2?.filter(
      (row) => !matchByDni(row, rowData)
    );

    const empresaId = empresas
      .filter((item) => item.nombreEmpresa === empresaData)
      .map((item) => item.id)
      .at(-1);

    // Combina los registros que serán deshabilitados o creados
    const combinedRecords = [
      ...recordsToDisable?.map((record) => ({
        ...record,
        action: "disable",
        empresa_id: empresaId,
      })),
      ...recordsToUpdate?.map((record) => ({
        ...record,
        action: "update",
        empresa_id: empresaId,
      })),
      ...recordsToCreate?.map((record) => ({
        ...record,
        action: "create",
        empresa_id: empresaId,
        user: { username: record.dni, contraseña: record.dni },
      })),
    ];

    if (combinedRecords.length > 0) {
      // console.log(combinedRecords)
      const response = await postTrabajadorComparar(combinedRecords);
      if (response.status === 201) {
        setRowData2([]);
        getDataTrabajador();
        toast.success("Cambios actualizados.", {
          position: "bottom-right",
        });
      }
    } else {
      toast.error("Hubo un error en actualizar los registros.", {
        position: "bottom-right",
      });
    }
  };
  const paginationComponentOptions = {
    noRowsPerPage: true,    rangeSeparatorText: "de",

  };

  return (
    <div className="" style={{ width: "100%" }}>
      <div className="p-3 bg-white ">
        <div className="flex flex-col justify-between w-full gap-3 mb-3 lg:flex-row">
          <div className="flex flex-col w-full gap-3 md:flex-row lg:w-full">
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
          </div>
          {empresaData !== "" && rowData2.length === 0 ? (
            <div className="flex flex-col justify-start w-full gap-3 md:flex-row lg:w-full">
              <Button
                description="Cargar"
                icon={faFileImport}
                event={openModalImport}
              />
            </div>
          ) : empresaData !== "" && rowData2.length > 0 ? (
            <div className="flex flex-col justify-start w-full gap-3 md:flex-row lg:w-full">
              <Button
                description="Actualizar cambios"
                event={handleChangeSubmit}
              />
            </div>
          ) : null}
        </div>

        <div style={containerStyle}>
          {empresaData !== "" && (
            <div style={gridStyle} className="ag-theme-alpine">
              <StyledDataTable
                columns={columns}
                data={rowData}
                dense
                paginationPerPage={15}
                paginationRowsPerPageOptions={[15, 30, 45, 60]}
                paginationComponentOptions={{
                  noRowsPerPage: true,
                  rangeSeparatorText: "de",
                }}                  rows
                striped
                highlightOnHover
                responsive
                pagination
                paginationTotalRows={totalRows}
                conditionalRowStyles={conditionalRowStyles}
                noDataComponent={
                  <div style={{ display: "flex", flexDirection:"column" }}>
                    <img src={noData} alt="" width={"250px"} />
                  </div>
                }
              />
            </div>
          )}
          {empresaData !== "" && rowData2.length >= 0 && (
            <div style={gridStyle} className="ag-theme-alpine">
              <StyledDataTable
                columns={columns}
                data={rowData2}
                dense
                paginationPerPage={15}
                paginationRowsPerPageOptions={[30, 60, 90, 120]}
                paginationComponentOptions={{
                  noRowsPerPage: true,
                  rangeSeparatorText: "de",
                }}                rows
                striped
                highlightOnHover
                responsive
                pagination
                conditionalRowStyles={conditionalRowStyles}
                noDataComponent={
                  <div style={{ display: "flex", flexDirection:"column" }}>
                    <img src={noData} alt="" width={"250px"} />
                  </div>
                }
              />
            </div>
          )}
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
          setRowData2={setRowData2}
        />
      </Modal>
    </div>
  );
};

export default CompararTrabajadores;
