import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getEmpresas } from "../../services/empresa";
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
import Button from "../../components/Button";
import { getReporteEmo } from "../../services/emo";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import DataTable from "react-data-table-component";
import styled from "styled-components";
import noData from "../../assets/img/no-data.png";

const StyledDataTable = styled(DataTable)`
  border: 1px solid lightgrey;
  border-radius: 5px;
`;
const ReporteEmo = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "80%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [empresas, setEmpresas] = useState([]);
  const [rowData, setRowData] = useState();
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(15);
  const [totalRows, setTotalRows] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [empresaData, setEmpresaData] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getEmpresas().then((res) => setEmpresas(res.data));
  }, []);

  const columns = [
    {
      name: "id",
      selector: (row) => row?.id,
      sortable: true,
      hide: true,
    },
    {
      name: "Apellido paterno",
      selector: (row) => row?.apellidoPaterno,
      sortable: true,
      center: true,
    },
    {
      name: "Apellido materno",
      selector: (row) => row?.apellidoMaterno,
      sortable: true,
      center: true,
    },
    {
      name: "Nombre",
      selector: (row) => row?.nombre,
      sortable: true,
      center: true,
    },
    {
      name: "Empresa",
      selector: (row) => row?.empresa,
      sortable: true,
      center: true,
    },
    {
      name: "Fecha",
      selector: (row) => row?.fecha,
      sortable: true,
      center: true,
    },
    {
      name: "Hora",
      selector: (row) => row?.hora,
      sortable: true,
      center: true,
    },
  ];

  const getDataReporte = async (page, perPage, empresa, search) => {
    const response = await getReporteEmo(page, perPage, empresa, search);
    if (response.status === 200) {
      setRowData(response.data.data);
      setTotalRows(response.data.pageInfo.total);
    }
  };

  useEffect(() => {
    const userIsosString = localStorage.getItem("userIsos");
    const userIsosObject = JSON.parse(userIsosString);
    const empresaId = userIsosObject ? userIsosObject.empresaId : null;

    const empresaObj = empresas.find((item) => item.id == empresaId);
    const empresaNombre = empresaObj ? empresaObj.nombreEmpresa : null;
    if (empresaNombre) {
      getDataReporte(page, perPage, empresaNombre, search);
    }
  }, [page, empresas, empresaData, search]);
  const descargarDocumento = async (tipo) => {
    const response = await getReporteEmo(
      page,
      perPage,
      empresaData,
      search,
      true
    );
    if (response.status === 200) {
      crearExcel(response.data.data); // Llamar a la función para generar Excel
    }
  };
  const crearExcel = async (data) => {
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
  };
  const paginationComponentOptions = {
    noRowsPerPage: true,    rangeSeparatorText: "de",

  };
  return (
    <div className="">
      <div className="bg-white p-3">
        <div className="flex justify-between gap-3">
          <h2 className="font-bold text-2xl mb-3">Trabajadores</h2>
        </div>
        <div className="flex flex-col lg:flex-row justify-between gap-3 mb-3 w-full">
          <div className="flex flex-col md:flex-row w-full lg:w-3/5 gap-3">
            <input
              type="text"
              name="empresa"
              placeholder="Buscar"
              id="searchInput"
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered input-sm"
            />
          </div>
          <div className="flex flex-col md:flex-row justify-end  gap-3 w-full lg:w-2/5">
            <Button
              description="Exportar"
              icon={faFileExport}
              event={() => descargarDocumento()}
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
              paginationComponentOptions={{
                noRowsPerPage: true,
                rangeSeparatorText: "de",
              }}              rows
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
      </div>
    </div>
  );
};

export default ReporteEmo;
