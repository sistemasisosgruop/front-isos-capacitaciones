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
import { AgGridReact } from "ag-grid-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ReporteEmo = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "80vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [empresas, setEmpresas] = useState([]);
  const [selectFilter, setSelectFilter] = useState("");
  const [rowData, setRowData] = useState();
  const gridRef = useRef();
  useEffect(() => {
    getEmpresas().then((res) => setEmpresas(res.data));
  }, []);

  const [columnDefs, setColumnDefs] = useState([
    { field: "id", hide: true },
    { field: "apellidoPaterno", headerName: "Apellido paterno" },
    { field: "apellidoMaterno", headerName: "Apellido materno" },
    { field: "nombre", headerName: "Nombres" },
    { field: "empresa", headerName: "Empresa" },
    { field: "fecha", headerName: "Fecha" },
    { field: "hora", headerName: "Hora" },
  ]);
  const getRowId = useMemo(() => {
    return (params) => {
      return params.data.id;
    };
  }, []);

  const onGridReady = useCallback((params) => {
    getReporteEmo().then(({ data, message = null }) => {
      if (data) {
        setRowData(data.data);
      } else {
        toast.error("Ocurrio un error en el servidor", {
          position: "bottom-right",
        });
      }
    });
  }, []);
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);
  const onFilterTextBoxChanged = useCallback((e, isSelect) => {
    if (isSelect) {
      setSelectFilter(e.target.value);
      document.getElementById("searchInput").value = "";
    } else {
      document.getElementById("searchSelect").value = "";
    }
    gridRef.current.api.setQuickFilter(e.target.value);
  }, []);

  const crearExcel = async () => {
    const workbook = new ExcelJS.Workbook();

    //Agregar una hoja de trabajo
    const worksheet = workbook.addWorksheet("Hoja 1");

    // establecemos las filas
    worksheet.columns = [
      { header: "Apellido paterno", key: "apellidoPaterno", width: 32, color: "D58144" },
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
      </div>
    </div>
  );
};

export default ReporteEmo;
