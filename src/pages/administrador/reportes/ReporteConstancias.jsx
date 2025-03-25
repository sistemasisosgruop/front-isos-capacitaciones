import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "../../../components/modal/Modal";
import Certificado from "../../../components/Certificado";
import useModals from "../../../hooks/useModal";
import { months } from "../../../config";
import { getEmpresas } from "../../../services/empresa";
import Button from "../../../components/Button";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PDFDocument, rgb } from "pdf-lib";
import {
  faFileExport,
  faArrowAltCircleDown,
} from "@fortawesome/free-solid-svg-icons";

import { toast } from "react-toastify";
import { getConstancias } from "../../../services/reportes";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import getEnvVaribles from "../../../config/getEnvVariables";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import DataTable from "react-data-table-component";
import styled from "styled-components";
import noData from "../../../assets/img/no-data.png";

const StyledDataTable = styled(DataTable)`
  border: 1px solid lightgrey;
  border-radius: 5px;
`;
const ReporteConstancias = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "75vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [selectEmpresa, setSelectEmpresa] = useState("");
  const [selectMes, setSelectMes] = useState("");
  const [codigoFiltro, setCodigoFiltro] = useState("");
  const [añoFiltro, setAñoFiltro] = useState("");
  const [dataCertificado, setDataCertificado] = useState("");
  const [dataReporte, setDataReporte] = useState([]);
  const [perPage, setPerPage] = useState(15);
  const [totalRows, setTotalRows] = useState(0);
  const [isOpenModal, openModal, closeModal] = useModals();
  const [page, setPage] = useState(1);
  const { VITE_API_URL } = getEnvVaribles();

  const columns = [
    {
      name: "Codigo constancia",
      selector: (row) => `${row.trabajadorId}-${row.serie}`,
      sortable: true,
      center: true,
    },
    {
      name: "Fecha",
      selector: (row) => row.fecha,
      sortable: true,
      center: true,
    },
    {
      name: "Hora",
      selector: (row) => row.hora,
      sortable: true,
      center: true,
    },
    {
      name: "Trabajador",
      selector: (row) => row.nombreTrabajador,
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
      name: "Fecha Examen",
      selector: (row) => row.fechaExamen,
      center: true,
    },
    {
        name: "Fecha Vencimiento",
        selector: (row) => row.fechaVencimiento,
        center: true,
      },
      {
        name: "Fecha Lectura",
        selector: (row) => row.fechaLectura,
        center: true,
      },
      {
        name: "Opciones",
        sortable: true,
        center: true,
        cell: (e) => (
          <label
            className="cursor-pointer text-blue-500 hover:text-blue-700 transition duration-200"
            onClick={() => descargaConstancia(e)}
          >
            <FontAwesomeIcon icon={faArrowAltCircleDown} size="lg" />
          </label>
        ),
      }
  ];

  
const descargaConstancia = async (data) => {
    try {
      // 📌 Construir la URL para obtener el PDF
      const url = `${VITE_API_URL}/${data.url}`;
  
      
      // 📌 Descargar el PDF original
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error al obtener el PDF");
      const existingPdfBytes = await response.arrayBuffer();
  
      // 📌 Cargar el PDF en pdf-lib
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
  
      pages.forEach((page) => {
        const { width, height } = page.getSize(); 
  
        page.drawText(`Código: ${data.trabajadorId}-${data.serie}`, {
          x: width - 150, 
          y: 30, 
          size: 10,
        });
      });
  
      // 📌 Guardar el PDF modificado
      const modifiedPdfBytes = await pdfDoc.save();
  
      // 📌 Descargar el nuevo PDF
      saveAs(new Blob([modifiedPdfBytes], { type: "application/pdf" }), `Constancia-${data.trabajadorId}.pdf`);
  
    } catch (error) {
      console.error("Error al modificar y descargar la constancia:", error);
    }
  };

  const getReportes = async (page, perPage, empresa, mes, codigo, anio) => {
    const response = await getConstancias(
      page,
      perPage,
      empresa,
      mes,
      codigo,
      anio
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
    getReportes(page, perPage, selectEmpresa,selectMes,codigoFiltro, añoFiltro);
  }, [page, selectEmpresa, selectMes, codigoFiltro, añoFiltro]);

  const descargarDocumento = async (tipo) => {
    crearExcel(dataReporte); // Llamar a la función para generar Excel
  };
  
  const crearExcel = async (data) => {
    if (!data || data.length === 0) {
      toast.error("No hay datos para exportar.");
      return;
    }
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte Constancias");
  
    // 📌 Definimos las columnas según tu tabla
    worksheet.columns = [
      { header: "Código Constancia", key: "codigoConstancia", width: 20 },
      { header: "Fecha", key: "fecha", width: 15 },
      { header: "Hora", key: "hora", width: 15 },
      { header: "Trabajador", key: "nombreTrabajador", width: 25 },
      { header: "Empresa", key: "nombreEmpresa", width: 25 },
      { header: "Fecha Examen", key: "fechaExamen", width: 18 },
      { header: "Fecha Vencimiento", key: "fechaVencimiento", width: 18 },
      { header: "Fecha Lectura", key: "fechaLectura", width: 18 },
    ];
  
    // 📌 Aplicar estilos a la cabecera
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "1F4E78" }, // Azul oscuro
    };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
  
    // 📌 Insertamos los datos en el Excel
    data.forEach((item) => {
      worksheet.addRow({
        codigoConstancia: `${item.trabajadorId}-${item.serie}`,
        fecha: item.fecha || "N/A",
        hora: item.hora || "N/A",
        nombreTrabajador: item.nombreTrabajador || "N/A",
        nombreEmpresa: item.nombreEmpresa || "N/A",
        fechaExamen: item.fechaExamen || "N/A",
        fechaVencimiento: item.fechaVencimiento || "N/A",
        fechaLectura: item.fechaLectura || "N/A",
      });
    });
  
    // 📌 Autoajustar el ancho de las columnas
    worksheet.columns.forEach((column) => {
      column.alignment = { horizontal: "center", vertical: "middle" };
    });
  
    // 📌 Generar y descargar el archivo
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "Reporte_Constancias.xlsx");
  };
  

  const paginationComponentOptions = {
    noRowsPerPage: true,
    rangeSeparatorText: "de",
  };

  return (
    <div className="">
      <div className="bg-white p-3">
        <h2 className="font-bold text-2xl mb-3 block">
          Reporte de constancias
        </h2>
        <div className="flex flex-col lg:flex-row justify-between gap-3 mb-3 w-full">
          <div className="flex flex-col md:flex-row w-full gap-3">
            <select
              className="w-1/6 select select-bordered select-sm"
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
            <input
              type="text"
              name="codigo"
              placeholder="Buscar por código"
              className="w-1/6 input input-bordered input-sm"
              value={codigoFiltro}
              onChange={(e) => {
                setCodigoFiltro(e.target.value)
              }}
            />
            <select
              className="select select-bordered select-sm"
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
            <select
              className="w-1/6 select select-bordered select-sm"
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
          <div className="flex flex-col md:flex-row justify-end  gap-3 w-full lg:w-1/6">
            <Button
              description="Exportar"
              event={() => descargarDocumento("excel")}
              icon={faFileExport}
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

export default ReporteConstancias;
