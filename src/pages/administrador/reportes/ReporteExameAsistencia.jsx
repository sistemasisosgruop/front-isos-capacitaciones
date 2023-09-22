import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getEmpresa, getEmpresas } from "../../../services/empresa";
import Button from "../../../components/Button";
import { toast } from "react-toastify";
import { getReporte } from "../../../services/reportes";
import { getCapacitaciones } from "../../../services/capacitacion";
import { Modal } from "../../../components/modal/Modal";
import useModals from "../../../hooks/useModal";
import ExamenCapacitacion from "../../../components/ExamenCapacitacion";
import { getExamen, getExamenCapacitacion } from "../../../services/examenes";
import { months } from "../../../config";
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
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Link, PDFViewer, pdf } from "@react-pdf/renderer";

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
      <label className="cursor-pointer">
        {data.asistenciaExamen ? (
          <FontAwesomeIcon icon={faCheckCircle} size="1x" color="green" />
        ) : (
          <FontAwesomeIcon icon={faTimesCircle} size="1x" color="red" />
        )}
      </label>
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
    { field: "mesExamen", hide: true },
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
  const getReportes = async () => {
    const response = await getReporte();
    if (response.status === 200) {
      setDataReporte(response.data);
      setRowData(response.data);
    } else {
      toast.error("Ocurrio un error en el servidor", {
        position: "bottom-right",
      });
    }
  };
  //cargar la informacion de la tabla
  const onGridReady = useCallback((params) => {
    getReportes();
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

    const format = rowData.map(item =>{

      return{
        trabajadorId: item.trabajadorId,
        nombreTrabajador: item.nombreTrabajador,
        dni: item.trabajador.dni,
        cargo: item.trabajador.cargo,
        nombreCapacitacion: item.nombreCapacitacion,
        nombreEmpresa: item.nombreEmpresa,
        notaExamen: item.notaExamen,
        asistenciaExamen: item.asistenciaExamen,
        fechaExamen: item.fechaExamen
      }
    })

    // establecemos las filas
    worksheet.columns = [
      {
        header: "# trabajador",
        key: "trabajadorId",
        width: 10,
        color: "D58144",
      },
      { header: "Nombre trabajador ", key: "nombreTrabajador", width: 50 },
      { header: "DNI", key: "dni", width: 20 },
      { header: "Cargo", key: "cargo", width: 30 },
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
    worksheet.addRows(format);

    // Descarga el archivo Excel en el navegador
    workbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        "Reporte.xlsx"
      );
    });
  };

  const descargaExamen = async (dataRow) => {
    const arrayRespuestas = [
      dataRow?.reporte?.rptpregunta1,
      dataRow?.reporte?.rptpregunta2,
      dataRow?.reporte?.rptpregunta3,
      dataRow?.reporte?.rptpregunta4,
      dataRow?.reporte?.rptpregunta5,
    ];

    const newDataPreguntas = dataRow.pregunta.map((pregunta, index) => {
      pregunta["respuestaTrabajador"] = arrayRespuestas[index];
      return pregunta;
    });
    dataRow["preguntas"] = newDataPreguntas;

    console.log(dataRow);
    if(dataRow){
      const link = document.createElement("a");
      const pdfBlob = await pdf(<ExamenCapacitacion data={dataRow} />).toBlob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      link.href = pdfUrl;
      link.target = "_blank";
      link.download = `Examen-${dataRow.nombreTrabajador}.pdf`;
      link.click();
    }
  };

  const descargarExamenes = () => {
    const arrayTrabajadores = rowData
      .filter((data) => data.asistenciaExamen === true)
      .map((TrabajadorRep, index) => {
        const arrayRespuestas = [
          TrabajadorRep?.reporte?.rptpregunta1,
          TrabajadorRep?.reporte?.rptpregunta2,
          TrabajadorRep?.reporte?.rptpregunta3,
          TrabajadorRep?.reporte?.rptpregunta4,
          TrabajadorRep?.reporte?.rptpregunta5,
        ];

        const newDataPreguntas = TrabajadorRep.pregunta.map(
          (pregunta, index) => {
            pregunta["respuestaTrabajador"] = arrayRespuestas[index];
            return pregunta;
          }
        );

        TrabajadorRep["preguntas"] = newDataPreguntas;
        return TrabajadorRep;
      });
      console.log(arrayTrabajadores);
    handleDownload(arrayTrabajadores);
  };

  const handleDownload = async (array) => {
    for(let i = 0; i < array.length; i++) {
      const data = array[i];
      const link = document.createElement("a");
      const pdfBlob = await pdf(<ExamenCapacitacion data={data} />).toBlob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      link.href = pdfUrl;
      link.target = "_blank";
      link.download = `Examen-${data.nombreTrabajador}.pdf`;
      link.click();
      await new Promise(resolve => setTimeout(resolve, 500)); // esperar 1 segundo antes de la próxima descarga
    }
  };
  

  return (
    <div className="">
      <div className="bg-white p-3">
        <h2 className="font-bold text-2xl mb-3 block">{titulo}</h2>
        <div className="flex flex-col lg:flex-row justify-between gap-3 mb-3 w-full">
          <div className="flex flex-col md:flex-row w-full lg:w-3/5 gap-3">
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
          <div className="flex flex-col md:flex-row justify-end  gap-3 w-full lg:w-1/5">
            <Button
              description="Exportar"
              event={crearExcel}
              icon={faFileExport}
            />
            <button
              className="btn btn-sm btn-outline btn-error"
              onClick={descargarExamenes}
            >
              Descargar PDFS
            </button>
          </div>
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
        title="Reporte de examen"
      >
        <PDFViewer width={"100%"} height={"600px"}>
          <ExamenCapacitacion data={dataExamen} />
        </PDFViewer>
      </Modal>
    </div>
  );
};

export default ReporteExameAsistencia;
