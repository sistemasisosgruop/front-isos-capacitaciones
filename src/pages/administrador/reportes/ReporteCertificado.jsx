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
import { getReporte } from "../../../services/reportes";
import {
  getCapacitaciones,
  getFirmaCertificado,
} from "../../../services/capacitacion";
import { PDFViewer, pdf } from "@react-pdf/renderer";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import DataTable from "react-data-table-component";
import styled from "styled-components";
const StyledDataTable = styled(DataTable)`
  border: 1px solid lightgrey;
  border-radius: 5px;
`;
const ReporteCertificado = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "75vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [selectEmpresa, setSelectEmpresa] = useState("");
  const [selectCapacitacion, setSelectCapacitacion] = useState("");
  const [selectMes, setSelectMes] = useState("");
  const [dataCertificado, setDataCertificado] = useState("");
  const [dataReporte, setDataReporte] = useState([]);
  const [perPage, setPerPage] = useState(15);
  const [totalRows, setTotalRows] = useState(0);
  const [isOpenModal, openModal, closeModal] = useModals();



  const columns = [
    {
      name: "# trabajador",
      selector: (row) => row.trabajadorId,
      sortable: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.nombreTrabajador,
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
      name: "Fecha examen",
      selector: (row) => row.fechaExamen,
      sortable: true,
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

  const getReportes = async (page, empresa, capacitacion, mes) => {
    if (page !== undefined) {
      const response = await getReporte(page, perPage,  empresa, capacitacion, mes);
      if (response.status === 200) {
        setDataReporte(response?.data?.data);
        setRowData(response?.data?.data);
        setTotalRows(response?.data?.pageInfo?.total);
      } else {
        toast.error("Ocurrio un error en el servidor", {
          position: "bottom-right",
        });
      }
    }
  };
  const handlePageChange = (page) => {
    getReportes(page, selectEmpresa, selectCapacitacion, selectMes);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    const response = await getReporte(page, newPerPage);
    if (response.status === 200) {
      setRowData(response.data.data);
      setPerPage(newPerPage);
    }
  };

  useEffect(() => {
    getEmpresas().then(({ data }) => {
      setEmpresas(data);
    });

    getReportes();
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
    console.log(value);
    console.log(filtro);
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
    getReportes(1, selectEmpresa, selectCapacitacion, selectMes);

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
    worksheet.addRows(rowData);

    // Descarga el archivo Excel en el navegador
    workbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        "Reporte certificados.xlsx"
      );
    });
  };

  const descargaCertificado = async (data) => {
    const empresaTrabajador = data.empresaId;
    console.log(data);
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

  const descargarCertificados = async () => {
    try {
      // Obtener el primer trabajador para obtener la empresaId
      const primerTrabajador = rowData[0];
      // Descargar las imágenes de la empresa solo una vez
      const imagenesEmpresa = await fetchImgsEmpresa(primerTrabajador);

      const resultados = await Promise.all(
        rowData
          .filter(
            (data) =>
              data.reporte.asistenciaExamen === true &&
              data.reporte.notaExamen > 10
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
      link.download = `Certificado-${data.nombreTrabajador}.pdf`;
      link.click();
      await new Promise((resolve) => setTimeout(resolve, 500)); // esperar 1 segundo antes de la próxima descarga
    }
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
        <h2 className="font-bold text-2xl mb-3 block">
          Reporte de certificados
        </h2>
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
              className="select select-bordered select-sm w-1/2"
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
              // id="searchSelect"
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
              onClick={descargarCertificados}
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
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
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

export default ReporteCertificado;
