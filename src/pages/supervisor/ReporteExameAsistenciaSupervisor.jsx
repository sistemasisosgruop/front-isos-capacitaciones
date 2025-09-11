import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getEmpresa, getEmpresas, getImgs } from "../../services/empresa";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import { getReporte } from "../../services/reportes";
import { getCapacitacionEmpresa, getCapacitaciones, getFirmaCertificado } from "../../services/capacitacion";
import { Modal } from "../../components/modal/Modal";
import useModals from "../../hooks/useModal";
import ExamenCapacitacion from "../../components/ExamenCapacitacion";
import { getExamen, getExamenCapacitacion } from "../../services/examenes";
import { generateYearOptions, months } from "../../config";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import noData from "../../assets/img/no-data.png";
import {
  faFileExport,
  faArrowAltCircleDown,
  faTimes,
  faCheck,
  faFileExcel,
  faDownload,
  faTimesCircle,
  faCheckCircle,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Link, PDFViewer, pdf } from "@react-pdf/renderer";
import { GridApi } from "ag-grid-community";
import DataTable from "react-data-table-component";
import styled from "styled-components";
import ReporteExamenCapacitacion from "../../components/ReporteExamenCapacitacion";
import SpinnerLoader from "../../components/SpinnerLoader";
import Certificado from "../../components/Certificado";
import { formatDateDb } from "../../utils/formtDate";
import SinRegistros from "../../components/SinRegistros";
import ProgressCapacitacion from "../../components/ProgressCapacitacion";
const StyledDataTable = styled(DataTable)`
  border: 1px solid lightgrey;
  border-radius: 5px;
`;
const ReporteExameAsistencia = ({ titulo, esExamen }) => {
  const containerStyle = useMemo(() => ({ width: "100%", height:'60vh' }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generate, setGenerate] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [selectEmpresa, setSelectEmpresa] = useState("");
  const [selectCapacitacion, setSelectCapacitacion] = useState("");
  const [selectMes, setSelectMes] = useState("");
  const [selectYear, setSelectYear] = useState("");
  const [dataReporte, setDataReporte] = useState([]);
  const [dataExamen, setDataExamen] = useState("");
  const [perPage, setPerPage] = useState(15);
  const [totalRows, setTotalRows] = useState(0);
  const [isOpenModal, openModal, closeModal] = useModals();
  const [isOpenModalCertificado, openModalCertificado, closeModalCertificado] = useModals();
  const [page, setPage] = useState(1);
  const [empresaNombre, setEmpresaNombre] = useState("");
  const [dniName, setDniName] = useState("");
  const [dataCertificado, setDataCertificado] = useState("");
  const [totalCapacitacion, setTotalCapacitacion] = useState("");
  const [totalAcumulado, setTotalAcumulado] = useState("");

  const [submitClicked, setSubmitClicked] = useState(false);

  const currentYear = new Date().getFullYear();
  const yearOptions = generateYearOptions(2016, currentYear);

  const columns = [
    {
      name: "DNI",
      selector: (row) => row.trabajador.dni,
      sortable: true,
      width: "100px",
      center: true,
    },
    {
      name: "Nombres de Trabajador",
      selector: (row) => row.nombreTrabajador.toUpperCase(),
      sortable: true,
      center: true,
      width: "220px",
    },
    {
      name: "Capacitación",
      selector: (row) => row.nombreCapacitacion,
      sortable: true,
      center: true,
      width: "300px",
    },
    {
      name: "Fecha de Capacitación",
      selector: (row) => row.capacitacion.fechaCulminacion,
      sortable: true,
      width: "180px",
      center: true,
    },
    {
      name: "Nota de Exámen",
      selector: (row) => row.notaExamen,
      sortable: true,
      width: "140px",
      center: true,
    },
    {
      name: "Fecha de Realización",
      selector: (row) => row.fechaExamen,
      sortable: true,
      width: "180px",
      center: true,
    },
    {
      name: "Asistencia",
      button: true,
      width: "100px",
      cell: (e) => (
        <label className="cursor-pointer">
          {e.asistenciaExamen ? (
            <FontAwesomeIcon icon={faCheck} size="lg" color="green" />
          ) : (
            <FontAwesomeIcon icon={faTimes} size="lg" color="red" />
          )}
        </label>
      ),
      center: true,
    },
    {
      name: "Descarga Exámen",
      // button: true,
      cell: (e) => (
        <label className="cursor-pointer" onClick={() => descargaExamen(e)}>
          {e.asistenciaExamen && (
          <FontAwesomeIcon icon={faDownload} color="red" size="lg" />
          )}
        </label>
      ),
      center: true,
      with: "120px",
      omit: esExamen ? false : true,
    },
    {
      name: "Descarga Certificado",
      width: "180px",
      center: true,
      omit: esExamen ? false : true,
      cell: (e) => (
        <label
          className="cursor-pointer"
          onClick={() => descargaCertificado(e)}
        >
          {e.asistenciaExamen && e.notaExamen >= 12 && (
            <FontAwesomeIcon icon={faDownload} color="orange" size="lg" />
          )}
        </label>
      ),
    },
  ];

  const getReportes = async (all) => {
    const response = await getReporte(
      page,
      perPage,
      empresaNombre,
      selectCapacitacion,
      selectMes,
      all,
      selectYear,
      dniName.toUpperCase()
    );
    if (response.status === 200) {
        setDataReporte(response?.data?.data);
        setRowData(response?.data?.data);
        setTotalRows(response?.data?.pageInfo?.total);
        setTotalCapacitacion(response?.data?.pageInfo?.total);
        setTotalAcumulado(response?.data?.pageInfo?.acumulado);
    } else {
      toast.error("Ocurrio un error en el servidor", {
        position: "bottom-right",
      });
    }
  };
  useEffect(() => {
    const userIsosString = localStorage.getItem("userIsos");
    const userIsosObject = JSON.parse(userIsosString);
    const empresaId = userIsosObject ? userIsosObject.empresaId : null;

    const empresaObj = empresas.find((item) => item.id == empresaId);
    const empresa = empresaObj ? empresaObj.nombreEmpresa : null;
    setEmpresaNombre(empresa);
  }, [empresas]); // Dependencias para este useEffect

  // Este useEffect se encarga de llamar a getReportes cuando empresaNombre cambia
  
  const handleFilter = () => {
    setIsLoading(true)
    setDataReporte("");
    setRowData("");
    setTotalRows("");
    try {
      setTimeout(() => {
        getReportes();    
        setIsLoading(false)
        setSubmitClicked(true);
      }, 700)
    } catch (error) {
      console.log(error)
    } 
  }
  useEffect(() => {
    getReportes();
  }, [empresaNombre, page, perPage, selectCapacitacion, selectMes, selectYear]);

  useEffect(() => {
    getEmpresas().then(({ data }) => {
      setEmpresas(data);
    });
  }, []);

  useEffect(() => {
    const userIsosString = localStorage.getItem("userIsos");
    const userIsosObject = JSON.parse(userIsosString);
    const empresaId = userIsosObject ? userIsosObject.empresaId : null;
    getCapacitacionEmpresa(empresaId).then(({ data }) => {
      setCapacitaciones(data);
    });
  }, []);

  const descargarDocumento = async (tipo) => {
    const response = await getReporte(
      page,
      perPage,
      empresaNombre,
      selectCapacitacion,
      selectMes,
      true,
      selectYear,
      dniName.toUpperCase()
    );
    if (response.status === 200) {
      if (tipo === "excel") {
        generarExcel(response.data.data); // Llamar a la función para generar Excel
      }
      if (tipo === "pdf") {
        descargarExamenes(response.data.data); // Llamar a la función para generar Excel
      }
      if (tipo === "examen") {
        descargarReporteExamenes(response.data.data); // Llamar a la función para generar Excel
      }
      if (tipo === "certificado") {
        descargarCertificados(response.data.data); // Llamar a la función para generar Excel
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
  const descargarReporteExamenes = async (data) => {
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
  

  const descargaCertificado = async (data) => {
      const empresaTrabajador = data.empresaId;
      const promesas = [
        getImgs(empresaTrabajador, "logo"),
        getImgs(empresaTrabajador, "certificado"),
        getFirmaCertificado(data.capacitacionId),
      ];
  
      Promise.all(promesas.map((prom) => prom.then((res) => res))).then((res) => {
        const srcLogo = URL.createObjectURL(new Blob([res[0].data]));
        const srcCertificado = URL.createObjectURL(new Blob([res[1].data]));
        const srcFirma = URL.createObjectURL(new Blob([res[2].data]));
  
        const imagenes = { srcLogo, srcCertificado, srcFirma };
        const horasCapacitacion = data.capacitacion.horas;
        data["imagenes"] = imagenes;
        data["fechaCapacitacion"] = formatDateDb(data.capacitacion.fechaInicio);
        data["horasCapacitacion"] =
          horasCapacitacion < 10 ? "0" + horasCapacitacion : horasCapacitacion;
        setDataCertificado(data);
        openModalCertificado();
      });
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

  const fetchImgsEmpresaCertificado = async (data) => {
      try {
        const logo = await getImgs(data.empresaId, "logo");
        const certificado = await getImgs(data.empresaId, "certificado");
        const firma = await getFirmaCertificado(data.capacitacionId);
  
        const srcLogo = URL.createObjectURL(new Blob([logo.data]));
        const srcCertificado = URL.createObjectURL(new Blob([certificado.data]));
        const srcFirma = URL.createObjectURL(new Blob([firma.data]));
  
        return { srcLogo, srcCertificado, srcFirma };
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

  const fetchCertificados = async (dataReporte, imagenesEmpresa) => {
      try {
        const horasCapacitacion = dataReporte.capacitacion.horas;
  
        dataReporte["imagenes"] = imagenesEmpresa;
        dataReporte["fechaCapacitacion"] = formatDateDb(
          dataReporte.capacitacion.fechaInicio
        );
        dataReporte["horasCapacitacion"] =
          horasCapacitacion < 10 ? "0" + horasCapacitacion : horasCapacitacion;
  
        return { ...dataReporte };
      } catch (error) {
        console.error("Error en la solicitud:", error);
        return { empresas: null, cargo: null };
      }
    };
  const descargarCertificados = async (data) => {
    try {
      // Obtener el primer trabajador para obtener la empresaId
      const primerTrabajador = data[0];
      // Descargar las imágenes de la empresa solo una vez
      const imagenesEmpresa = await fetchImgsEmpresaCertificado(primerTrabajador);

      const resultados = await Promise.all(
        data
          ?.filter(
            (data) =>
              data.reporte.asistenciaExamen === true &&
              data.reporte.notaExamen > 10
          )
          .map(async (reporte) => {
            const data = await fetchCertificados(reporte, imagenesEmpresa);
            return data;
          })
      );

      handleDownloadCerticado(resultados);
      // Aquí puedes procesar los resultados obtenidos para cada trabajador
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const handleDniName = (e) => {
    const dniName = e.target.value;
    setDniName(dniName);
  }
  
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

  const handleDownloadCerticado = async (list) => {
      for (let i = 0; i < list.length; i++) {
        const data = list[i];
        const link = document.createElement("a");
        const srcLogo = data.imagenes.srcLogo;
        const pdfBlob = await pdf(
          <Certificado data={data} logo={srcLogo} />
        ).toBlob();
        const pdfUrl = URL.createObjectURL(pdfBlob);
        link.href = pdfUrl;
        link.target = "_blank";
        link.download = `Certificado-${data.nombreTrabajador}.pdf`;
        link.click();
        await new Promise((resolve) => setTimeout(resolve, 500)); // esperar 1 segundo antes de la próxima descarga
      }
    };

  return (
    <div className="">
      <div className="p-3 bg-white">
        <h2 className="block mb-3 text-2xl font-bold">{titulo}</h2>
        <div className="flex flex-col justify-between w-full gap-3 mb-3 lg:flex-row">
          <div className="flex flex-col w-full gap-3 md:flex-row lg:w-auto">
            <select
              className="w-full select select-bordered select-sm md:w-5/12"
              id="searchSelectCapacitacion"
              onChange={(e) => {
                setSelectCapacitacion(e.target.value);
                setSubmitClicked(false);
              }}
              value={selectCapacitacion}
            >
              <option value={""}>Capacitación</option>
              {capacitaciones.map((capacitacion) => {
                return (
                  <option key={capacitacion.id} value={capacitacion.codigo}>
                    {capacitacion.codigo} - {capacitacion.nombre}
                  </option>
                );
              })}
            </select>
            <select
              className="w-full select select-bordered select-sm md:w-1/12"
              id="searchSelect"
              onChange={(e) => {
                if (e.target.value === "") {
                  setSelectMes("");
                  setSelectYear("");
                  setSubmitClicked(false);
                } else {
                  setSelectMes(e.target.value)
                  setSubmitClicked(false);
                }
              }}
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

            <select
              className="w-full select select-bordered select-sm md:w-1/12"
              id="searchYear"
              onChange={(e) => {
                if (e.target.value === "") {
                  setSelectYear("");
                  setSubmitClicked(false);
                } else {
                  setSelectYear(e.target.value)
                  setSubmitClicked(false);
                }
              }}
              value={selectYear}
            >
              <option value={""}>Año</option>
              {yearOptions.map((year) => {
                return (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                );
              })}
            </select>
            <input
              type="text"
              name="dniname"
              placeholder="DNI / Nombre del Trabajador"
              className="w-full input input-bordered input-sm md:w-2/12"
              id="dniname"
              onChange={handleDniName}
            />
            <button
              className="w-full gap-2 text-white capitalize btn btn-sm btn-search md:w-2/12"
              onClick={handleFilter}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faSearch} />
               {isLoading ? "Buscando..." : "Aplicar Búsqueda"}
            </button>
          </div>
        </div>
        {submitClicked && totalCapacitacion > 0 ? 
          <div className="flex flex-col justify-between w-full mt-1 mb-6 md:flex-row lg:w-auto">
              <div className="w-full text-accent md:w-4/12">
                <span className="ml-1 text-sm">La empresa tiene { totalCapacitacion } { totalCapacitacion < 2 ? 'Colaborador' : 'Colaboradores'}</span>
                <ProgressCapacitacion progress={totalAcumulado} total={totalCapacitacion} />
              </div>
              <div className="justify-end mt-6"> 
                <Button
                  description="Exportar Progreso"
                  event={() => descargarDocumento("excel")}
                  classname="w-full mb-2 mr-2 capitalize md:w-auto"
                  icon={faFileExcel}
                />
                <button
                  className="w-full mb-2 mr-2 text-white capitalize btn btn-sm btn-error md:w-auto"
                  onClick={() => descargarDocumento("pdf")}
                >
                  Descargar Exámenes
                </button>
                <button
                  className="w-full text-white capitalize btn btn-sm btn-error md:w-auto"
                  onClick={() => descargarDocumento("certificado")}
                >
                  Descargar Certificados
                </button>
              </div>
          </div>
          : null
        }

        {submitClicked ? (
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
        ) : 
          (
            <span>
              {isLoading ? <SpinnerLoader isLoading={isLoading} /> : <SinRegistros text="Debe aplicar un criterio de búsqueda" classname="bg-white" />}
            </span>
          )
        }
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

      <Modal
        isOpen={isOpenModalCertificado}
        openModal={openModalCertificado}
        closeModal={closeModalCertificado}
        title=""
        size={"modal-lg"}
      >
        <PDFViewer width={"100%"} height={"454px"}>
          <Certificado data={dataCertificado} />
        </PDFViewer>
      </Modal>
    </div>
    );
};

export default ReporteExameAsistencia;
