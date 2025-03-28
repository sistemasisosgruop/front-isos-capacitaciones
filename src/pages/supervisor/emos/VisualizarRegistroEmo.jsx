import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Button from "../../../components/Button";
import { getEmpresas, getImgs } from "../../../services/empresa";
import { getTrabajadores } from "../../../services/trabajador";
import { AgGridReact } from "ag-grid-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faMailForward,
  faPhone,
  faEye,
  faMailBulk,
  faTrashAlt,
  faEnvelope,
  faFileImport,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { Modal } from "../../../components/modal/Modal";
import useModals from "../../../hooks/useModal";
import { PDFDocument, rgb } from "pdf-lib";
// import FormularioImportar from "./FormularioImportar";
import FormularioTrabajador from "./FormularioTrabajador";
import FormularioEnvios from "./FormularioEnvios";
import FormularioEmos from "./FormularioEmos";
import FormularioCorreos from "./FormularioCorreos";
import { initialForm } from "./config";
import { pdf } from "@react-pdf/renderer";
import { getTrabajadorEmo, postSendEmail, postSendWhatsapp, postSendEmoEmail, postSendEmoWhatsapp, postCrearConstancia, getGenerarConstancia} from "../../../services/emo";
import ConstanciaEmo from "../../../components/ConstanciaEmo";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import getEnvVaribles from "../../../config/getEnvVariables";

const VisualizarRegistroEmo = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "75vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [isOpen1, openModal1, closeModal1] = useModals();
  const [isOpen2, openModal2, closeModal2] = useModals();
  const [isOpen3, openModal3, closeModal3] = useModals();
  const [isOpen4, openModal4, closeModal4] = useModals();
  const [isOpenImport, openModalImport, closeModalImport] = useModals();
  const [refetchData, setRefetchData] = useState(false);
  const [dataForm, setdataForm] = useState(initialForm);
  const [rowData, setRowData] = useState();
  const [rowNombreEmpresa, setNombreEmpresa] = useState();
  const [empresas, setEmpresas] = useState([]);
  const [selectFilter, setSelectFilter] = useState("");
  const [rowDelete, setRowDelete] = useState(null);
  const [descripcionModal, setDescripcionModal] = useState("");
  const gridRef = useRef();
  const { VITE_API_URL } = getEnvVaribles();
  const stepApi = 'emo';

  useEffect(() => {
    getEmpresas().then((res) => {
      const userIsosString = localStorage.getItem("userIsos");
      const userIsosObject = JSON.parse(userIsosString);
      const empresasId = userIsosObject ? userIsosObject.empresas.map(e => e.id) : []; // Obtener array de IDs
  
      const filtered = res.data.filter(item => empresasId.includes(item.id)); // Filtrar por coincidencia en el array
      
      if (filtered.length > 0) {
        setEmpresas([filtered[0]]); // 🔥 Guardar solo la primera empresa en el estado
        setSelectFilter([filtered[0].nombreEmpresa]); // 🔥 Guardar solo el nombre de la primera empresa
      } else {
        setEmpresas([]); // Si no hay empresas coincidentes, dejar vacío
        setSelectFilter([]);
      }
    });
  }, []);
  
  
  const onGridReady = useCallback((params) => {
    const userIsosString = localStorage.getItem("userIsos");
    const userIsosObject = JSON.parse(userIsosString);
    const empresasId = userIsosObject ? userIsosObject.empresas.map(e => e.id) : []; // Obtener array de IDs
    getTrabajadorEmo().then(({ data, message = null }) => {
      if (data) {
        const filtered = data.data.filter(trabajador => {
          return empresasId[0] == trabajador.empresa_id // Compara directamente
        });

        const nombresEmpresas = data.data.nombreEmpresa;
        setRowData(filtered);  
        setNombreEmpresa(nombresEmpresas); // Convertir nombres a string separados por comas
      } else {
        toast.error("Ocurrió un error en el servidor", {
          position: "bottom-right",
        });
      }
    });
  }, []);

  const getRowId = useMemo(() => {
    return (params) => {
      return params.data.nro;
    };
  }, []);
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
    };
  }, []);
  const renderConstanciaButtons = ({ data }) => {
    return (
      <>
        <label
          onClick={() => sendDownLoadEmo(data)}
          className="cursor-pointer"
        >
          <FontAwesomeIcon icon={faDownload} />
        </label>
      </>
    );
  };

  const sendDownLoadEmo= async (data) => {
    try {
      await postCrearConstancia(data);
      const response = await getGenerarConstancia(data.trabajador_id, data.empresa_id);
      if (!response) {
        toast.error("No se pudo generar la constancia.");
        return;
      }
  
      toast.success("Constancia generada correctamente.");
  
        const url = `${VITE_API_URL}/emo/descargar/constancia/${data.trabajador_id}`;
    
        
        // 📌 Descargar el PDF original
        const response2 = await fetch(url);
        if (!response2.ok) throw new Error("Error al obtener el PDF");
        const existingPdfBytes = await response2.arrayBuffer();
    
        // 📌 Cargar el PDF en pdf-lib
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
    
        pages.forEach((page) => {
          const { width, height } = page.getSize(); 
    
          page.drawText(`Código: ${data.trabajador_id}-${response.serial}`, {
            x: width - 150, 
            y: 30, 
            size: 10,
          });
        });
    
        // 📌 Guardar el PDF modificado
        const modifiedPdfBytes = await pdfDoc.save();
    
        // 📌 Descargar el nuevo PDF
        saveAs(new Blob([modifiedPdfBytes], { type: "application/pdf" }), `Constancia-${data.trabajador_id}-${response.serial}.pdf`);
    
      } catch (error) {
        console.error("Error al modificar y descargar la constancia:", error);
      }
  }

  const [columnDefs, setColumnDefs] = useState([
    { field: "nro", hide: true },
    {
      field: "apellidoPaterno",
      headerName: "APELLIDO PATERNO",
      minWidth: 200,
      pinned: 'left'
    },
    {
      field: "apellidoMaterno",
      headerName: "APELLIDO MATERNO",
      minWidth: 200,
      pinned: 'left'
    },
    { field: "nombres", headerName: "NOMBRES 1", minWidth: 200, pinned: 'left' },
    { field: "dni", headerName: "DNI", width: 110 },
    {
      field: "fecha_examen",
      headerName: "FECHA EXAMEN MÉDICO",
    },
    {
      field: "fecha_lectura",
      headerName: "FECHA DE LECTURA EMO",
    },
    {
      field: "fecha_vencimiento",
      headerName: "FECHA DE VENCIMIENTO EMO",
      width: 230 
    },
    {
      field: "estado_emo",
      headerName: "ESTADO CORREO EMO",
    },
    { field: "estado_emo_whatsapp", headerName: "ESTADO WHATSAPP EMO", width: 250 },
    { field: "CONSTANCIAS", cellRenderer: renderConstanciaButtons, width: 150 },
    {
      field: "nombreEmpresa",
      headerName: "EMPRESAS",
      valueGetter: (params) =>
        params.data.nombreEmpresa, // Muestra todas las empresas separadas por coma
      filter: true,
      width: 300,
      hide: true
    },
  ]);
  
  const onFilterTextBoxChanged = useCallback((e, isSelect) => {
    if (isSelect) {
      const empresaNombre = e.target.value;
      setSelectFilter(empresaNombre);
  
      if (empresaNombre !== "") {
        gridRef.current.api.setFilterModel({
          nombreEmpresa: {
            type: "contains",
            filter: empresaNombre,
          },
        });
      } else {
        gridRef.current.api.setFilterModel(null);
      }
    } else {
      const input = e.target.value;
      gridRef.current.api.setQuickFilter(input);
    }
  }, []);
  
  const handleDownloadMulitple = async (data) => {

    if (selectFilter !== "") {
      const filterData = rowData.filter(
        (item) =>
          item.nombreEmpresa === selectFilter[0] &&
          item.fecha_examen !== "" &&
          item.clinica !== "" &&
          item.fecha_lectura !== "" &&
          item.condicion_aptitud !== ""
      );
      if(filterData.length === 0){

        return toast.error("No se encontro ningun registro completo para descargar la constancia.", {
          position: "bottom-right",
        });
      }


      const logo = await getImgs(filterData[0].empresa_id, "logo");
      const srcLogo = URL.createObjectURL(new Blob([logo.data]));
      for (let i = 0; i < filterData.length; i++) {
        const link = document.createElement("a");
        const pdfBlob = await pdf(<ConstanciaEmo data={data} logo={srcLogo} />).toBlob();
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        link.href = pdfUrl;
        link.target = "_blank";
        link.download = `Constancia-${data.apellidoPaterno} ${data.apellidoMaterno} ${data.nombres}.pdf`;
        link.click();
  
        await new Promise((resolve) => setTimeout(resolve, 500)); 
      
      };
    } else {
      toast.error("Seleccione una empresa para descargar el pdf.", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div>
      <div className="flex flex-row w-full gap-3 mt-2 mb-2 md:flex-row">
        <div className="flex w-full gap-3 flx-row md:w-2/4">
          <select
            className="w-6/12 select select-bordered select-sm"
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
        </div>
      </div>
      <div className="flex flex-row justify-between gap-3 mt-2 mb-2 md:flex-row w-12/12">
        <input
          type="text"
          name="nombre"
          placeholder="Busqueda"
          className="w-3/12 input input-bordered input-sm"
          id="searchInput"
          onChange={onFilterTextBoxChanged}
        />

        <div className="flex justify-between gap-3">
          {/* <Button
            description="Importar"
            icon={faFileImport}
            event={openModalImport}
          /> */}
          <button
            className="btn btn-sm btn-outline btn-error"
            onClick={handleDownloadMulitple}
          >
            Descargar
          </button>
        </div>
      </div>

      <div style={containerStyle}>
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoSizeColumns={true}
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
  );
};

export default VisualizarRegistroEmo;
