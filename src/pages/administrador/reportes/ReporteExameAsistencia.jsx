import React, { useCallback, useEffect, useMemo, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExport,
  faArrowAltCircleDown,
  faTimesCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { getEmpresa, getEmpresas } from "../../../services/empresa";
import Button from "../../../components/Button";
import { toast } from "react-toastify";
import { getReporte } from "../../../services/reportes";
import { getCapacitaciones } from "../../../services/capacitacion";

//excel
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Certificado from "../../../components/Certificado";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { Modal } from "../../../components/modal/Modal";
import useModals from "../../../hooks/useModal";
import Loader from "../../../components/loader/Loader";
import ExamenCapacitacion from "../../../components/ExamenCapacitacion";
import { getExamen } from "../../../services/examenes";

const months = [
  {
    numero: 1,
    descripcion: "Enero",
  },
  {
    numero: 2,
    descripcion: "Febrero",
  },
  {
    numero: 3,
    descripcion: "Marzo",
  },
  {
    numero: 4,
    descripcion: "Abril",
  },
  {
    numero: 5,
    descripcion: "mayo",
  },
  {
    numero: 6,
    descripcion: "Junio",
  },
  {
    numero: 7,
    descripcion: "Julio",
  },
  {
    numero: 8,
    descripcion: "Agosto",
  },
  {
    numero: 9,
    descripcion: "septiembre",
  },
  {
    numero: 10,
    descripcion: "octubre",
  },
  {
    numero: 11,
    descripcion: "noviembre",
  },
  {
    numero: 12,
    descripcion: "diciembre",
  },
];

const ReporteExameAsistencia = ({ titulo, esExamen }) => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "80vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [selectEmpresa, setSelectEmpresa] = useState("");
  const [selectCapacitacion, setSelectCapacitacion] = useState("");
  const [selectMes, setSelectMes] = useState("");
  const [dataReporte, setDataReporte] = useState([]);
  const [dataExamen, setDataExamen] = useState("");

  const [isOpenModal, openModal, closeModal] = useModals();

  //configuracion de la tabla
  const renderButtons = ({ data }) => {
    return (
      <>
        <label className="cursor-pointer" onClick={() => descargaExamen(data)}>
          <FontAwesomeIcon icon={faArrowAltCircleDown} />
        </label>
      </>
    );
  };

  const renderEstado = ({ data }) => {
    return (
      <>
        <label className="cursor-pointer">
          {data.asistenciaExamen ? (
            <FontAwesomeIcon icon={faCheckCircle} size="1x" color="green" />
          ) : (
            <FontAwesomeIcon icon={faTimesCircle} size="1x" color="red" />
          )}
        </label>
      </>
    );
  };

  const initColumDefs = [
    { field: "trabajadorId", headerName: "# trabajador" },
    { field: "nombreTrabajador", headerName: "Nombre trabajador" },
    { field: "nombreCapacitacion", headerName: "Capacitación" },
    { field: "nombreEmpresa" },
    { field: "notaExamen", headerName: "Nota examen" },
    {
      field: "asistenciaExamen",
      cellRenderer: renderEstado,
      cellStyle: { textAlign: "center" },
    },
    { field: "fechaExamen", headerName: "Fecha de examen" },
  ];

  if (esExamen) {
    initColumDefs.push({
      field: "Opciones",
      cellRenderer: renderButtons,
      cellStyle: { textAlign: "center" },
    });
  }

  const [columnDefs, setColumnDefs] = useState(initColumDefs);

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);

  //cargar la informacion de la tabla
  const onGridReady = useCallback((params) => {
    getReporte().then(async (res) => {
      let { data } = res;

      if (data) {
        const array = [];

        data.forEach((e) => {
          array.push(getEmpresa(e.trabajador.empresaId));
        });

        Promise.all(array).then((res) => {
          res.map((empresa, index) => {
            const nombreTrabajador = `
            ${data[index].trabajador.nombres} 
            ${data[index].trabajador.apellidoPaterno} 
            ${data[index].trabajador.apellidoMaterno}`;

            const fechaExamen = data[index].examen.fechadeExamen;
            const d = new Date(fechaExamen);
            let month = d.getMonth() + 1;

            data[index].nombreEmpresa = empresa.data.nombreEmpresa;
            data[index].nombreCapacitacion = data[index].capacitacion.nombre;
            data[index].nombreTrabajador = nombreTrabajador;
            data[index].fechaExamen = fechaExamen;
            data[index].mesExamen = month;
          });
          setDataReporte(data);
          setRowData(data);
          console.log("data", data);
        });
      } else {
        toast.error("Ocurrio un error en el servidor", {
          position: "bottom-right",
        });
      }
    });
  }, []);

  useEffect(() => {
    getEmpresas().then(({ data }) => {
      setEmpresas(data);
    });
  }, []);

  useEffect(() => {
    getCapacitaciones().then(({ data }) => {
      setCapacitaciones(data);
    });
  }, []);

  const filtrarDatos = (filtros, datos) => {
    return datos.filter((dato) => {
      return filtros.every((filtro) => {
        const { propiedad, value } = filtro;
        return dato[propiedad] === value;
      });
    });
  };

  const handleSelectChange = (value, filtro) => {
    //cambiamos estado
    switch (filtro) {
      case "EMPRESA":
        setSelectEmpresa(value);
        break;
      case "CAPACITACION":
        setSelectCapacitacion(value);
        break;
      case "MES":
        setSelectMes(value === "" ? value : Number(value));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const filtrosSelect = [
      { propiedad: "nombreEmpresa", value: selectEmpresa },
      { propiedad: "nombreCapacitacion", value: selectCapacitacion },
      { propiedad: "mesExamen", value: selectMes },
    ].filter((select) => select.value !== "");

    if (filtrosSelect.length <= 0) {
      setRowData(dataReporte);
    } else {
      const dataFiltrada = filtrarDatos(filtrosSelect, dataReporte);
      setRowData(dataFiltrada);
    }
  }, [selectEmpresa, selectCapacitacion, selectMes]);

  const crearExcel = async () => {
    const workbook = new ExcelJS.Workbook();

    //Agregar una hoja de trabajo
    const worksheet = workbook.addWorksheet("Hoja 1");

    // establecemos las filas
    worksheet.columns = [
      {
        header: "# trabajador",
        key: "trabajadorId",
        width: 10,
        color: "D58144",
      },
      { header: "Nombre trabajador ", key: "nombreTrabajador", width: 50 },
      { header: "Nombre Capacitación", key: "nombreCapacitacion", width: 50 },
      { header: "Nombre empresa", key: "nombreEmpresa", width: 50 },
      { header: "Nota examen", key: "notaExamen", width: 10 },
      { header: "asistenciaExamen", key: "asistenciaExamen", width: 10 },
      { header: "Fecha examen", key: "fechaExamen", width: 32 },
    ];

    // Obtener el rango correspondiente a la cabecera
    const headerRange = worksheet.getRow(1);

    // Aplicar un estilo de relleno a la cabecera
    headerRange.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "16A971" },
    };
    // Add an array of rows

    worksheet.addRows(rowData);

    // Descarga el archivo Excel en el navegador
    workbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        "trabajadores.xlsx"
      );
    });
  };

  const descargaExamen = async (data) => {
    const arrayRespuestas = [
      data.rptpregunta1,
      data.rptpregunta2,
      data.rptpregunta3,
      data.rptpregunta4,
      data.rptpregunta5,
    ];

    getExamen(data.examenId).then((examen) => {
      const newData = examen.data.pregunta.map((pregunta, index) => {
        pregunta["respuestaTrabajador"] = arrayRespuestas[index];
        return pregunta;
      });
      data["preguntas"] = newData;
      setDataExamen(data);
      openModal();
    });
  };

  const abrirLoaderDescarga = async (data) => {};
  console.log("new render");
  return (
    <div className="">
      <div className="bg-white p-3">
        <h2 className="font-bold text-2xl mb-3 block">{titulo}</h2>
        <div className="flex justify-between gap-3 mb-2">
          <div>
            <select
              className="select select-bordered select-sm"
              id="searchSelect"
              onChange={(e) => handleSelectChange(e.target.value, "EMPRESA")}
              value={selectEmpresa}
            >
              <option value={""}>Empresa</option>
              {empresas.map((empresa) => {
                return (
                  <option key={empresa.id} value={empresa.nombreEmpresa}>
                    {empresa.nombreEmpresa}
                  </option>
                );
              })}
            </select>
            <select
              className="select select-bordered select-sm"
              id="searchSelect"
              onChange={(e) =>
                handleSelectChange(e.target.value, "CAPACITACION")
              }
              value={selectCapacitacion}
            >
              <option value={""}>Capacitación</option>
              {capacitaciones.map((capacitacion) => {
                return (
                  <option key={capacitacion.id} value={capacitacion.nombre}>
                    {capacitacion.nombre}
                  </option>
                );
              })}
            </select>
            <select
              className="select select-bordered select-sm"
              id="searchSelect"
              onChange={(e) => handleSelectChange(e.target.value, "MES")}
              value={selectMes}
            >
              <option value={""}>Mes</option>
              {months.map((month) => {
                return (
                  <option key={month.numero} value={month.numero}>
                    {month.descripcion}
                  </option>
                );
              })}
            </select>
          </div>
          <Button
            description="Exportar"
            event={crearExcel}
            icon={faFileExport}
          />
        </div>

        <div style={containerStyle}>
          <div style={gridStyle} className="ag-theme-alpine">
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              onGridReady={onGridReady}
              rowHeight="34"
            ></AgGridReact>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpenModal}
        openModal={openModal}
        closeModal={closeModal}
        size={"modal-lg"}
      >
        <PDFViewer width={"100%"} height={"454px"}>
          <ExamenCapacitacion data={dataExamen} />
        </PDFViewer>
      </Modal>
    </div>
  );
};

export default ReporteExameAsistencia;
