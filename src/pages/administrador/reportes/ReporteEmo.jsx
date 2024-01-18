import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getEmpresas } from "../../../services/empresa";
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
import Button from "../../../components/Button";
import { getReporteEmo } from "../../../services/emo";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import DataTable from "react-data-table-component";
import styled from "styled-components";
const StyledDataTable = styled(DataTable)`
  border: 1px solid lightgrey;
  border-radius: 5px;
`;
const ReporteEmo = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "80%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [empresas, setEmpresas] = useState([]);
  const [selectFilter, setSelectFilter] = useState("");
  const [rowData, setRowData] = useState();
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(15);
  const [totalRows, setTotalRows] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [empresaData, setEmpresaData] = useState("");

  useEffect(() => {
    getEmpresas().then((res) => setEmpresas(res.data));
  }, []);

  const columns = [
    {
      name: "id",
      selector: (row) => row.nro,
      sortable: true,
      hide: true,
    },
    {
      name: "Apellido paterno",
      selector: (row) => row.apellidoPaterno,
      sortable: true,
      center: true,
    },
    {
      name: "Apellido materno",
      selector: (row) => row.apellidoMaterno,
      sortable: true,
      center: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.nombres,
      sortable: true,
      center: true,
    },
    {
      name: "Empresa",
      selector: (row) => row.nombreEmpresa,
      sortable: true,
      center: true,
    },
    {
      name: "Fecha",
      selector: (row) => row.fecha_examen,
      sortable: true,
      center: true,
    },
    {
      name: "Hora",
      selector: (row) => row.hora,
      sortable: true,
      center: true,
    },
  ];

  const getDataReporte = async (page, empresa, search) => {
    if (page !== undefined) {

    const response = await getReporteEmo(page, perPage, empresa, search);
    if (response.status === 200) {
      setRowData(response.data.data);
      setTotalRows(response.data.pageInfo.total);
    }
  }
  };

  useEffect(() => {
    getDataReporte();
  }, []);

  const onFilterTextBoxChanged = async (e, isSelect) => {
    if (isSelect) {
      setEmpresaData(e.target.value);
    } else {
      setSearch(e.target.value);
    }
    await getReporteEmo(1, empresaData, search);
  };
  const handlePageChange = (page) => {
    setPageCount(page);
    if (empresaData || search) {
      getDataReporte(page, empresaData, search);
    } else {
      getDataReporte(page);
    }
  };
  const handlePerRowsChange = async (newPerPage, page) => {
    const response = await getDataReporte(page, newPerPage);
    if (response.status === 200) {
      setRowData(response.data.data);
      setPerPage(newPerPage);
    }
  };

  const crearExcel = async () => {
    const workbook = new ExcelJS.Workbook();

    //Agregar una hoja de trabajo
    const worksheet = workbook.addWorksheet("Hoja 1");

    // establecemos las filas
    worksheet.columns = [
      {
        header: "Apellido paterno",
        key: "apellidoPaterno",
        width: 32,
        color: "D58144",
      },
      { header: "Apellido materno", key: "apellidoMaterno", width: 32 },
      { header: "Nombres", key: "nombre", width: 32 },
      { header: "Empresa", key: "empresa", width: 10 },
      { header: "Fecha", key: "fecha", width: 10 },
      { header: "Hora", key: "hora", width: 10 },
    ];

    // Obtener el rango correspondiente a la cabecera
    const headerRange = worksheet.getRow(1);

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
  const paginationComponentOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    rowsPerPage: 50,
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
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
              description="Exportar"
              icon={faFileExport}
              event={crearExcel}
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
        </div>
      </div>
    </div>
  );
};

export default ReporteEmo;
