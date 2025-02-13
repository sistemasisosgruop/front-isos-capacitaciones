import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "../../../components/modal/Modal";
import Certificado from "../../../components/Certificado";
import useModals from "../../../hooks/useModal";
import { formatDateDb } from "../../../utils/formtDate";
import { months } from "../../../config";
import { getEmpresa, getEmpresas, getImgs } from "../../../services/empresa";
import Button from "../../../components/Button";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExport,
  faArrowAltCircleDown,
} from "@fortawesome/free-solid-svg-icons";

import { toast } from "react-toastify";
import { getReporte,getCertificados } from "../../../services/reportes";
import {
  getCapacitaciones,
  getFirmaCertificado,
} from "../../../services/capacitacion";
import { PDFViewer, pdf } from "@react-pdf/renderer";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import DataTable from "react-data-table-component";
import styled from "styled-components";
import noData from "../../../assets/img/no-data.png";

const StyledDataTable = styled(DataTable)`
  border: 1px solid lightgrey;
  border-radius: 5px;
`;

const ReporteCertificadosTrabajador = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "75vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [selectEmpresa, setSelectEmpresa] = useState("");
  const [selectCapacitacion, setSelectCapacitacion] = useState("");
  const [selectMes, setSelectMes] = useState("");
  const [añoFiltro, setAñoFiltro] = useState("");
  const [dataCertificado, setDataCertificado] = useState("");
  const [dataReporte, setDataReporte] = useState([]);
  const [perPage, setPerPage] = useState(15);
  const [totalRows, setTotalRows] = useState(0);
  const [isOpenModal, openModal, closeModal] = useModals();
  const [page, setPage] = useState(1);
  const [empresaNombre, setEmpresaNombre] = useState("");

  const columns = [
    {
      name: "Codigo",
      selector: (row) => row.capacitacion.codigo,
      sortable: true,
    },
    {
      name: "Capacitacion",
      selector: (row) => row.capacitacion.nombre,
      sortable: true,
      center: true,
    },
    {
      name: "Fecha Examen",
      selector: (row) => row.fechaExamen,
      center: true,
    },
    {
      name: "Hora Examen",
      selector: (row) => row.horaExamen,
      center: true,
    },
    {
      name: "Nota",
      selector: (row) => row.notaExamen,
      center: true,
    },
    {
      name: "Opciones",
      sortable: true,
      center: true,
      cell: (e) => (
        <label
          className="cursor-pointer"
          onClick={() => descargaCertificado(e)}
        >
          {e.asistenciaExamen && (
            <FontAwesomeIcon icon={faArrowAltCircleDown} />
          )}
        </label>
      ),
      center: true,
    },
  ];

  const getReportes = async () => {
    const dni =JSON.parse(localStorage.getItem("userIsos")).dni;
    const response = await getCertificados(
      page,
      perPage,
      selectCapacitacion,
      selectMes,
      añoFiltro,
      dni
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
      getReportes();
  }, [page, selectCapacitacion, selectMes, añoFiltro]);

  useEffect(() => {
    getCapacitaciones().then(({ data }) => {
      setCapacitaciones(data);
    });
  }, []);

  const descargarDocumento = async (tipo) => {
    // const response = await getReporte(
    //   page,
    //   perPage,
    //   selectEmpresa,
    //   selectCapacitacion,
    //   selectMes,
    //   true
    // );
    // if (response.status === 200) {
      if (tipo === "excel") {
        crearExcel(dataReporte); // Llamar a la función para generar Excel
      }
      if (tipo === "pdf") {
        descargarCertificados(dataReporte); // Llamar a la función para generar Excel
      }
    // }
  };

  const crearExcel = async (data) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Hoja 1");

    // Definir las columnas
    worksheet.columns = [
      { header: "# Trabajador", key: "trabajadorId", width: 10 },
      { header: "Nombre trabajador", key: "trabajadorNombre", width: 50 },
      { header: "Codigo Capacitación", key: "capacitacionCodigo", width: 50 },
      { header: "Nombre Capacitación", key: "capacitacionNombre", width: 50 },
      { header: "Nombre empresa", key: "empresaNombre", width: 50 },
      { header: "Nota examen", key: "notaExamen", width: 10 },
      { header: "Asistencia Examen", key: "asistenciaExamen", width: 10 },
      { header: "Fecha examen", key: "fechaExamen", width: 32 },
      { header: "Hora examen", key: "horaExamen", width: 32 },
    ];

    // Convertir datos anidados a formato plano
    const formattedData = data.map((item) => ({
      trabajadorId: item.trabajador?.id || "",
      trabajadorNombre: item.trabajador?.nombreCompleto || "",
      capacitacionCodigo: item.capacitacion.codigo || "",
      capacitacionNombre: item.capacitacion?.nombre || "",
      empresaNombre: item.empresa?.nombreEmpresa || "",
      notaExamen: item.notaExamen || "",
      asistenciaExamen: item.asistenciaExamen || "",
      fechaExamen: item.fechaExamen || "",
      horaExamen: item.horaExamen || ""
    }));

    // Agregar datos a la hoja
    worksheet.addRows(formattedData);

    // Estilizar encabezados
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "16A971" },
        };
        cell.font = { bold: true, color: { argb: "FFFFFF" } };
    });

    // Generar y descargar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), "Reporte_certificados.xlsx");
};


  const descargaCertificado = async (data) => {
    const empresaTrabajador = data.empresa.id;
    const promesas = [
      getImgs(empresaTrabajador, "logo"),
      getImgs(empresaTrabajador, "certificado"),
      getFirmaCertificado(data.capacitacion.id),
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
      openModal();
    });
  };

  const fetchImgsEmpresa = async (data) => {
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
      const imagenesEmpresa = await fetchImgsEmpresa(primerTrabajador);

      const resultados = await Promise.all(
        data
          ?.filter(
            (data) =>
              data.asistenciaExamen === true &&
              data.notaExamen > 10
          )
          .map(async (reporte) => {
            const data = await fetchCertificados(reporte, imagenesEmpresa);
            return data;
          })
      );

      handleDownload(resultados);
      // Aquí puedes procesar los resultados obtenidos para cada trabajador
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const handleDownload = async (list) => {
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
      link.download = `Certificado-${data.trabajador.nombreCompleto}.pdf`;
      link.click();
      await new Promise((resolve) => setTimeout(resolve, 500)); // esperar 1 segundo antes de la próxima descarga
    }
  };
  const paginationComponentOptions = {
    noRowsPerPage: true,
    rangeSeparatorText: "de",
  };
  return (
    <div className="">
      <div className="bg-white p-3">
        <h2 className="font-bold text-2xl mb-3 block">
          Reporte de certificados
        </h2>
        <div className="flex flex-col lg:flex-row justify-between gap-3 mb-3 w-full">
          <div className="flex flex-col md:flex-row w-full lg:w-3/5 gap-3">
            <select
              className="select select-bordered select-sm w-1/2"
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
              className="select select-bordered select-sm"
              // id="searchSelect"
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
             {/* Filtro por año */}
             <select
              className="w-1/5 select select-bordered select-sm"
              value={añoFiltro}
              onChange={(e) => setAñoFiltro(e.target.value)}
            >
              <option value="">Seleccionar año</option>
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-col md:flex-row justify-end  gap-3 w-full lg:w-1/5">
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
                <div style={{ display: "flex", flexDirection: "column" }}>
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

export default ReporteCertificadosTrabajador;
