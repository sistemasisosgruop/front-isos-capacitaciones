import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getEmpresa, getEmpresas, getImgs } from "../../services/empresa";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import { getReporte } from "../../services/reportes";
import { getCapacitaciones } from "../../services/capacitacion";
import { Modal } from "../../components/modal/Modal";
import useModals from "../../hooks/useModal";
import ExamenCapacitacion from "../../components/ExamenCapacitacion";
import { getExamen, getExamenCapacitacion } from "../../services/examenes";
import { months } from "../../config";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import noData from "../../assets/img/no-data.png";
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
import ReporteExamenCapacitacion from "../../components/ReporteExamenCapacitacion";
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
  const [empresaNombre, setEmpresaNombre] = useState("");

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

  const getReportes = async (all) => {
    const response = await getReporte(
      page,
      perPage,
      empresaNombre,
      selectCapacitacion,
      selectMes,
      all
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
    const userIsosString = localStorage.getItem("userIsos");
    const userIsosObject = JSON.parse(userIsosString);
    const empresasId = userIsosObject ? userIsosObject.empresas.map(e => e.id) : []; // Obtener array de IDs
    const empresaObj = empresas.filter(item => empresasId.includes(item.id)); // Filtrar por coincidencia en el array
    const nombresEmpresas = empresaObj?.map(e => e.nombreEmpresa);
    setEmpresaNombre(nombresEmpresas);
  }, [empresas]);

  // Este useEffect se encarga de llamar a getReportes cuando empresaNombre cambia
    useEffect(() => {
      if (empresaNombre && empresaNombre.length > 0) {
        getReportes();
      }
    }, [empresaNombre, page, perPage, selectCapacitacion, selectMes]);
  

  useEffect(() => {
      getEmpresas().then(({ data }) => {
        setEmpresas(Array.isArray(data) ? data : []); // Asegura que siempre se guarde un array
      }).catch(error => {
        console.error("Error al obtener empresas:", error);
      });
  }, []);


  useEffect(() => {
    getCapacitaciones().then(({ data }) => {
      setCapacitaciones(data);
    });
  }, []);

  const descargarDocumento = async (tipo) => {
    // const response = await getReporte(
    //   page,
    //   perPage,
    //   empresaNombre,
    //   selectCapacitacion,
    //   selectMes,
    //   true
    // );
    // if (response.status === 200) {
      if (tipo === "excel") {
        generarExcel(dataReporte); // Llamar a la función para generar Excel
      }
      if (tipo === "pdf") {
        descargarExamenes(dataReporte); // Llamar a la función para generar Excel
      }
      if (tipo === "examen") {
        
        descargarReporteExamenes(dataReporte); // Llamar a la función para generar Excel
      // }
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
  const descargarReporteExamenes = async (data) => {
    console.log(data)
    const arrayTrabajadores = data?.filter(
      (item) => item.asistenciaExamen == true
    );
    if (arrayTrabajadores.length > 0) {
      const imagenesEmpresa = await fetchImgsEmpresa(arrayTrabajadores.at(-1));
      handleDownloadReporte(arrayTrabajadores, imagenesEmpresa);
    } else {
      toast.error("No hay registros con asistencia para la capacitación.", {
        position: "bottom-right",
      });
    }
  };
  const fetchImgsEmpresa = async (data) => {
    try {
      const logo = await getImgs(data?.empresaId, "logo");
      const srcLogo = URL.createObjectURL(new Blob([logo.data]));

      return { srcLogo };
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return { srcLogo: null, srcCertificado: null, srcFirma: null };
    }
  };
  const descargarExamenes = (data) => {
    const arrayTrabajadores = data
      ?.filter((data) => data.asistenciaExamen === true)
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
    handleDownload(arrayTrabajadores);
  };
  const handleDownloadReporte = async (array, logo) => {
    const link = document.createElement("a");
    const pdfBlob = await pdf(
      <ReporteExamenCapacitacion data={array} logo={logo} />
    ).toBlob();
    const pdfUrl = URL.createObjectURL(pdfBlob);
    link.href = pdfUrl;
    link.target = "_blank";
    link.download = `Reporte-${array?.at(-1)?.nombreCapacitacion}.pdf`;
    link.click();
    await new Promise((resolve) => setTimeout(resolve, 500));
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

  return (
    <div className="">
      <div className="bg-white p-3">
        <h2 className="font-bold text-2xl mb-3 block">{titulo}</h2>
        <div className="flex flex-col lg:flex-row justify-between gap-3 mb-3 w-full">
          <div className="flex flex-col md:flex-row w-full lg:w-auto gap-3">
            <select
              className="select select-bordered select-sm w-full md:w-1/3"
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
              className="select select-bordered select-sm w-full md:w-1/5"
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
          <div className="flex flex-col md:flex-row justify-end gap-3 w-full lg:w-auto">
            <button
              className="btn btn-sm btn-outline btn-info w-full md:w-auto"
              onClick={() => {
                if (selectCapacitacion) {
                  descargarDocumento("examen");
                } else {
                  toast.error(
                    "Seleccione una capacitación para realizar la descarga.",
                    {
                      position: "bottom-right",
                    }
                  );
                }
              }}
            >
              Descargar Reporte
            </button>
            <Button
              description="Exportar"
              event={() => descargarDocumento("excel")}
              icon={faFileExport}
            />
            <button
              className="btn btn-sm btn-outline btn-error w-full md:w-auto"
              onClick={() => descargarDocumento("pdf")}
            >
              Descargar PDFS
            </button>
          </div>
        </div>

        {rowData.length > 0 ? (
          <div style={containerStyle}>
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
                }}
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
        ) : (
          <p>Sin registros</p>
        )}
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
