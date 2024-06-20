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
import { GridApi } from "ag-grid-community";
import DataTable from "react-data-table-component";
import styled from "styled-components";
import noData from "../../../assets/img/no-data.png";

const StyledDataTable = styled(DataTable)`
  border: 1px solid lightgrey;
  border-radius: 5px;
`;
const ReporteExameAsistencia = ({ titulo, esExamen }) => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "80%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [selectEmpresa, setSelectEmpresa] = useState("");
  const [selectCapacitacion, setSelectCapacitacion] = useState("");
  const [selectMes, setSelectMes] = useState("");
  const [dataReporte, setDataReporte] = useState([]);
  const [dataExamen, setDataExamen] = useState("");
  const [perPage, setPerPage] = useState(15);
  const [totalRows, setTotalRows] = useState(0);
  const [isOpenModal, openModal, closeModal] = useModals();
  const [page, setPage] = useState(1);

  const columns = [
    {
      name: "# trabajador",
      selector: (row) => row.trabajadorId,
      sortable: true,
      width: "120px",
      center: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.nombreTrabajador.toUpperCase(),
      sortable: true,
      center: true,
    },
    {
      name: "Capacitación",
      selector: (row) => row.nombreCapacitacion,
      sortable: true,
      center: true,
    },
    {
      name: "Nota examen",
      selector: (row) => row.notaExamen,
      sortable: true,
      center: true,
    },
    {
      name: "Asistencia examen",
      button: true,
      cell: (e) => (
        <label className="cursor-pointer">
          {e.asistenciaExamen ? (
            <FontAwesomeIcon icon={faCheckCircle} size="1x" color="green" />
          ) : (
            <FontAwesomeIcon icon={faTimesCircle} size="1x" color="red" />
          )}
        </label>
      ),
      center: true,
    },
    {
      name: "Fecha examen",
      selector: (row) => row.fechaExamen,
      sortable: true,
      center: true,
    },
    {
      name: "Opciones",
      button: true,
      cell: (e) => (
        <label className="cursor-pointer" onClick={() => descargaExamen(e)}>
          <FontAwesomeIcon icon={faArrowAltCircleDown} />
        </label>
      ),
      center: true,
      omit: esExamen ? false : true,
    },
  ];

  const getReportes = async (page, perPage, empresa, capacitacion, mes) => {
    const response = await getReporte(
      page,
      perPage,
      empresa,
      capacitacion,
      mes
    );
    if (response.status === 200) {
      setDataReporte(response?.data?.data);
      setRowData(response?.data?.data);
      setTotalRows(response?.data?.pageInfo?.total);
    } else {
      toast.error("Ocurrio un error en el servidor", {
        position: "bottom-right",
      });
    }
  };

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

  useEffect(() => {
    getReportes(page, perPage, selectEmpresa, selectCapacitacion, selectMes);
  }, [page, selectEmpresa, selectCapacitacion, selectMes]);

  const descargarDocumento = async (tipo) => {
    const response = await getReporte(
      page,
      perPage,
      selectEmpresa,
      selectCapacitacion,
      selectMes,
      true
    );
    if (response.status === 200) {
      if (tipo === "excel") {
        generarExcel(response.data.data); // Llamar a la función para generar Excel
      }
      if (tipo === "pdf") {
        descargarExamenes(response.data.data); // Llamar a la función para generar Excel
      }
    }
  };

  const generarExcel = async (data) => {
    const workbook = new ExcelJS.Workbook();
    //Agregar una hoja de trabajo
    const worksheet = workbook.addWorksheet("Hoja 1");

    const format = data.map((item) => {
      return {
        trabajadorId: item.trabajadorId,
        nombreTrabajador: item.nombreTrabajador,
        dni: item.trabajador.dni,
        cargo: item.trabajador.cargo,
        nombreCapacitacion: item.nombreCapacitacion,
        nombreEmpresa: item.nombreEmpresa,
        notaExamen: item.notaExamen,
        asistenciaExamen: item.asistenciaExamen,
        fechaExamen: item.fechaExamen,
      };
    });

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

    if (dataRow) {
      const link = document.createElement("a");
      const pdfBlob = await pdf(<ExamenCapacitacion data={dataRow} />).toBlob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      link.href = pdfUrl;
      link.target = "_blank";
      link.download = `Examen-${dataRow.nombreTrabajador}.pdf`;
      link.click();
    }
  };

  const descargarExamenes = (data) => {
    const arrayTrabajadores = data
      ?.filter((data) => data.asistenciaExamen === true)
      ?.map((TrabajadorRep, index) => {
        const arrayRespuestas = [
          TrabajadorRep?.reporte?.rptpregunta1,
          TrabajadorRep?.reporte?.rptpregunta2,
          TrabajadorRep?.reporte?.rptpregunta3,
          TrabajadorRep?.reporte?.rptpregunta4,
          TrabajadorRep?.reporte?.rptpregunta5,
        ];

        const newDataPreguntas = TrabajadorRep.pregunta?.map(
          (pregunta, index) => {
            pregunta["respuestaTrabajador"] = arrayRespuestas[index];
            return pregunta;
          }
        );

        TrabajadorRep["preguntas"] = newDataPreguntas;
        return TrabajadorRep;
      });
    handleDownload(arrayTrabajadores);
  };

  const handleDownload = async (array) => {
    for (let i = 0; i < array.length; i++) {
      const data = array[i];
      const link = document.createElement("a");
      const pdfBlob = await pdf(<ExamenCapacitacion data={data} />).toBlob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      link.href = pdfUrl;
      link.target = "_blank";
      link.download = `Examen-${data.nombreTrabajador}.pdf`;
      link.click();
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };
  const paginationComponentOptions = {
    noRowsPerPage: true,
    rangeSeparatorText: "de",
  };
  return (
    <div className="">
      <div className="p-3 bg-white">
        <h2 className="block mb-3 text-2xl font-bold">{titulo}</h2>
        <div className="flex flex-col justify-between w-full gap-3 mb-3 lg:flex-row">
          <div className="flex flex-col w-full gap-3 md:flex-row lg:w-auto">
            <select
              className="w-1/4 select select-bordered select-sm"
              id="searchSelect"
              onChange={(e) => setSelectEmpresa(e.target.value)}
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
              className="w-1/3 select select-bordered select-sm"
              id="searchSelect"
              onChange={(e) => setSelectCapacitacion(e.target.value)}
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
              className="w-1/5 select select-bordered select-sm"
              id="searchSelect"
              onChange={(e) => setSelectMes(e.target.value)}
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
          <div className="flex flex-col justify-end w-1/2 gap-3 md:flex-row lg:w-1/2">
            <Button
              description="Exportar"
              event={() => descargarDocumento("excel")}
              icon={faFileExport}
            />
            <button
              className="btn btn-sm btn-outline btn-error"
              onClick={() => descargarDocumento("pdf")}
            >
              Descargar PDFS
            </button>
          </div>
        </div>

        <div style={containerStyle}>
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
