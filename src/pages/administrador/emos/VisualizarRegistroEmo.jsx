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
import { FaEnvelope, FaEdit, FaDownload } from "react-icons/fa";
import { FaEye, FaPhoneAlt, FaEnvelopeOpenText, FaWhatsapp } from "react-icons/fa";
import { Modal } from "../../../components/modal/Modal";
import { PDFDocument, rgb } from "pdf-lib";
import useModals from "../../../hooks/useModal";
import FormularioImportar from "./FormularioImportar";
import FormularioTrabajador from "./FormularioTrabajador";
import FormularioEnvios from "./FormularioEnvios";
import FormularioEmos from "./FormularioEmos";
import FormularioCorreos from "./FormularioCorreos";
import { initialForm } from "./config";
import { pdf } from "@react-pdf/renderer";
import { getTrabajadorEmo, postSendEmail, postSendWhatsapp, postSendEmoEmail, postSendEmoWhatsapp, postCrearConstancia,getGenerarConstancia} from "../../../services/emo";
import ConstanciaEmo from "../../../components/ConstanciaEmo";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import getEnvVaribles from "../../../config/getEnvVariables";

const VisualizarRegistroEmo = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "75vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" } ), []);
  const [isOpen1, openModal1, closeModal1] = useModals();
  const [isOpen2, openModal2, closeModal2] = useModals();
  const [isOpen3, openModal3, closeModal3] = useModals();
  const [isOpen4, openModal4, closeModal4] = useModals();
  const [isOpenImport, openModalImport, closeModalImport] = useModals();
  const [refetchData, setRefetchData] = useState(false);
  const [dataForm, setdataForm] = useState(initialForm);
  const [rowData, setRowData] = useState();
  const [empresas, setEmpresas] = useState([]);
  const [selectFilter, setSelectFilter] = useState("");
  const [rowDelete, setRowDelete] = useState(null);
  const [descripcionModal, setDescripcionModal] = useState("");
  const gridRef = useRef();
  const [selectedRows, setSelectedRows] = useState([]);
  const { VITE_API_URL } = getEnvVaribles();
  const stepApi = 'emo';

  useEffect(() => {
    getEmpresas().then((res) => setEmpresas(res.data));
  }, []);

  useEffect(() => {
    getTrabajadorEmo().then(({ data, message = null }) => {
      if (data) {
        if (selectFilter) {
          const filteredData = data.data.filter((item) =>
            item.nombreEmpresa === selectFilter
          );
          setRowData(filteredData);
        } else {
          setRowData(data.data); // Si no hay filtro, mostrar todos
        }
      } else {
        toast.error("Ocurrió un error en el servidor", {
          position: "bottom-right",
        });
      }
    });
  }, [selectFilter]);
  

  const onGridReady = useCallback((params) => {
    getTrabajadorEmo().then(({ data, message = null }) => {
      if (data) {
        setRowData(data.data);
      } else {
        toast.error("Ocurrio un error en el servidor", {
          position: "bottom-right",
        });
      }
    });
  }, []);

  // console.log(rowData);
  const addItem = useCallback((addIndex, newRow) => {
    const newItem = [newRow];
    gridRef.current.api.applyTransaction({
      add: newItem,
      addIndex: addIndex,
    });
  }, []);

  const updateRow = useCallback((data) => {
    var rowNode = gridRef.current.api.getRowNode(data?.id);
    rowNode.setData(data);
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
      <div className="flex gap-2 items-center">
        <FaWhatsapp 
          className="cursor-pointer text-green-600 hover:text-green transition duration-200" 
          size={16} 
          onClick={() => sendConstanciaButton(data)} 
        />
        <FaEnvelope 
          className="cursor-pointer text-yellow-500 hover:text-yellow-700 transition duration-200" 
          size={16} 
          onClick={() => sendConstanciaEmailButton(data)} 
        />
        <FaEdit 
          className="cursor-pointer text-blue-500 hover:text-blue-700 transition duration-200" 
          size={16} 
          onClick={() => updateConstanciaButton(data)} 
        />
        <FaDownload 
          className="cursor-pointer text-gray-500 hover:text-gray-700 transition duration-200" 
          size={16} 
          onClick={() => handleConstanciaDownload(data)} 
        />
      </div>
    );
  };
  const renderEmoButtons = ({ data }) => {
    return (
      <div className="flex gap-2 items-center">
        <FaEye 
          className="cursor-pointer text-gray-500 hover:text-gray-700 transition duration-200" 
          size={16} 
          onClick={() => sendEmo(data)} 
        />
        <FaPhoneAlt 
          className="cursor-pointer text-gray-500 hover:text-gray-700 transition duration-200" 
          size={16} 
          onClick={() => sendButton(data)} 
        />
        <FaEnvelopeOpenText 
          className="cursor-pointer text-gray-500 hover:text-gray-700 transition duration-200" 
          size={16} 
          onClick={() => sendEmailButton(data)} 
        />
        <FaEnvelope 
        className="cursor-pointer text-yellow-500 hover:text-yellow-700 transition duration-200" 
        size={16} 
        onClick={() => sendEmail(data)} 
        />
        <FaWhatsapp 
          className="cursor-pointer text-green-600 hover:text-green-800 transition duration-200" 
          size={16} 
          onClick={() => sendEmoWhatsapp(data)} 
        />
      </div>
    );
  };
  const updateConstanciaButton = (data) => {
    setDescripcionModal("Actualizar trabajador");
    openModal4();
    setdataForm(data);
  };

  const sendConstanciaButton = async (data) => {
    setDescripcionModal("Enviar por WhatsApp al trabajador");
    const url = `${VITE_API_URL}/${ stepApi }/descargar/constancia/${data.trabajador_id}`;

    if (!data.fecha_examen) {
      toast.error("No importo los datos respectivos", {
        position: "bottom-right",
      });
    } else if (!data.celular) { 
      toast.error("No tiene celular de envio", {
        position: "bottom-right",
      });
    } else {
      confirmAlert({
        title: 'CONFIRMAR EL ENVIO - WHATSAPP',
        message: '¿Estas seguro de enviar por Whatsapp?',
        buttons: [
          {
            label: 'SI',
            onClick: async () => {
              const textToShare = `Su constancia de Examen Médico Ocupacional ha sido generado correctamente, puede revisarlo en el siguiente enlace: ${url}. Si no puede visualizarlo copie el enlace y peguelo en una ventana nueva y presione Enter`;
              // data.celular = '959824954';
              const response = await postSendWhatsapp(data);
              if (response.status === 200) {
                // getTrabajadorEmo().then(({ data, message = null }) => {
                //   if (data) {
                //     setRowData(data.data);
                //   } else {
                //     toast.error("Ocurrio un error en el servidor", {
                //       position: "bottom-right",
                //     });
                //   }
                // });
                toast.success("Se envio el Whatsapp correctamente.", {
                  position: "bottom-right",
                });
                window.open(`https://wa.me/51${data.celular}?text=${textToShare}`, '_blank');
              } else {
                toast.error(message, {
                  position: "bottom-right",
                });
              }
            }
          },
          {
            label: 'NO',
          }
        ]
      });
    }
    



    // setdataForm(data);
  };

  const sendConstanciaEmailButton = async (data) => {
    setDescripcionModal("Enviar por Correo al trabajador");
    // console.log(data);
    if (!data.fecha_examen) {
      toast.error("No importo los datos respectivos", {
        position: "bottom-right",
      });
    } else if (!data.email) {
      toast.error("No tiene correo de envio", {
        position: "bottom-right",
      });
    } else {
      confirmAlert({
        title: 'CONFIRMAR EL ENVIO - CONSTANCIA',
        message: '¿Estas seguro de enviar el correo?',
        buttons: [
          {
            label: 'SI',
            onClick: async () => {
              const response = await postSendEmail(data);
              if (response.status === 200) {
                // getTrabajadorEmo().then(({ data, message = null }) => {
                //   if (data) {
                //     setRowData(data.data);
                //   } else {
                //     toast.error("Ocurrio un error en el servidor", {
                //       position: "bottom-right",
                //     });
                //   }
                // });
                toast.success("Se envio el correo correctamente.", {
                  position: "bottom-right",
                });
              } else {
                toast.error(message, {
                  position: "bottom-right",
                });
              }
            }
          },
          {
            label: 'NO',
            // onClick: () => alert('Click No')
          }
        ]
      });
    }


    
  };

  const sendButton = (data) => {
    setDescripcionModal("Estado de Envios por WhatsApp");
    openModal2();
    setdataForm(data);
  };

  const sendEmo = (data) => {
    setDescripcionModal("Estado de Envios por EMO");
    openModal1();
    setdataForm(data);
  };
  const sendEmailButton = (data) => {
    setDescripcionModal("Estado de Envios por Correo al trabajador");
    openModal3();
    setdataForm(data);
  };

  const sendEmoWhatsapp = async (data) => {
    setDescripcionModal("Enviar EMO por WhatsApp al trabajador");
    const url = `${VITE_API_URL}/${ stepApi }/descargar/emo/${data.trabajador_id}`;

    if (!data.fecha_examen) {
      toast.error("No importo los datos respectivos", {
        position: "bottom-right",
      });
    } else if (!data.celular) {
      toast.error("No tiene celular de envio", {
        position: "bottom-right",
      });
    } else {
      confirmAlert({
        title: 'CONFIRMAR EL ENVIO EXAMEN MÉDICO OCUPACIONAL - WHATSAPP',
        message: '¿Estas seguro de enviar el Examen Médico Ocupacional por Whatsapp?',
        buttons: [
          {
            label: 'SI',
            onClick: async () => {
              const textToShare = `Su Examen Médico Ocupacional ha sido generado correctamente, puede revisarlo en el siguiente enlace: ${url}. Si no puede visualizarlo copie el enlace y peguelo en una ventana nueva y presione Enter`;
              // data.celular = '959824954';
              const response = await postSendEmoWhatsapp(data);
              if (response.status === 200) {
                // getTrabajadorEmo().then(({ data, message = null }) => {
                //   if (data) {
                //     setRowData(data.data);
                //   } else {
                //     toast.error("Ocurrio un error en el servidor", {
                //       position: "bottom-right",
                //     });
                //   }
                // });
                toast.success("Se envio el Whatsapp correctamente.", {
                  position: "bottom-right",
                });
                window.open(`https://wa.me/51${data.celular}?text=${textToShare}`, '_blank');
              } else {
                toast.error(message, {
                  position: "bottom-right",
                });
              }
            }
          },
          {
            label: 'NO',
          }
        ]
      });
    }
  };

  const sendEmail = async (data) => {
    setDescripcionModal("Enviar por Correo al trabajador");
    if (!data.fecha_examen) {
      toast.error("No importo los datos respectivos", {
        position: "bottom-right",
      });
    } else if (!data.email) {
      toast.error("No tiene correo de envio", {
        position: "bottom-right",
      });
    } else {
      confirmAlert({
        title: 'CONFIRMAR EL ENVIO - EXAMEN MÉDICO OCUPACIONAL',
        message: '¿Estas seguro de enviar el correo?',
        buttons: [
          {
            label: 'SI',
            onClick: async () => {
              const response = await postSendEmoEmail(data);
              if (response.status === 200) {
                // getTrabajadorEmo().then(({ data, message = null }) => {
                //   if (data) {
                //     setRowData(data.data);
                //   } else {
                //     toast.error("Ocurrio un error en el servidor", {
                //       position: "bottom-right",
                //     });
                //   }
                // });
                toast.success("Se envio el correo correctamente.", {
                  position: "bottom-right",
                });
              } else {
                toast.error(message, {
                  position: "bottom-right",
                });
              }
            }
          },
          {
            label: 'NO',
          }
        ]
      });
    }
  };

  const [columnDefs, setColumnDefs] = useState([
    { headerCheckboxSelection: true, checkboxSelection: true, width: 50,  pinned: 'left',},
    { field: "nro", hide: true },
    {
      field: "apellidosYNombres",
      headerName: "APELLIDOS Y NOMBRES",
      minWidth: 300,
      pinned: 'left',
      valueGetter: (params) => 
        `${params.data.apellidoPaterno || ''} ${params.data.apellidoMaterno || ''} ${params.data.nombres || ''}`.trim()
    },
    { field: "dni",
       headerName: "DNI",
        width: 110,
        cellStyle: (params) => {
          const state_created = params.data.state_created;
          if(state_created){
            return { backgroundColor: "lightblue", color: "black" };
          }
        }
    },
    { field: "cargo", headerName: "PUESTO LABORAL" },
    {
      field: "fecha_examen",
      headerName: "FECHA EXAMEN MÉDICO",
    },
    {
      field: "condicion_aptitud",
      headerName: "CONDICIÓN DE APTITUD",
    },
    { field: "clinica", headerName: "CLÍNICA" },
    {
      field: "fecha_lectura",
      headerName: "FECHA DE LECTURA EMO",
    },
    {
      field: "fecha_vencimiento",
      headerName: "FECHA DE VENCIMIENTO EMO",
      width: 230 
    },
    { field: "fecha_email", headerName: "FECHA CONSTANCIA CORREO", width: 230 },
    { field: "fecha_whatsapp", headerName: "FECHA CONSTANCIA WHATSAPP" , width: 230},
    {
      field: "estado_emo",
      headerName: "ESTADO CORREO EMO",
    },
    { field: "estado_emo_whatsapp", headerName: "ESTADO WHATSAPP EMO", width: 250 },
    { 
      field: "estado",
      headerName: "ESTADO",
      cellStyle: (params) => {
          const fechaVencimiento = new Date(params.data.fecha_vencimiento);
          const actualizado_fecha_caducidad = params.data.actualizado_fecha_caducidad;
          const actualizado_fecha_examen = params.data.actualizado_fecha_examen;
          const hoy = new Date();

          if (actualizado_fecha_examen === true && actualizado_fecha_caducidad === true) {
            return { backgroundColor: "#205781", color: "white" };
          } else if (actualizado_fecha_caducidad === true) {
            return { backgroundColor: "lightblue", color: "black" };
          }

          if (fechaVencimiento >= hoy) {
            return { backgroundColor: "lightgreen", color: "black" };
          } else if (fechaVencimiento < hoy) {
            return { backgroundColor: "red", color: "white" };
          }

          return {}; // Sin estilo si no cumple ninguna condición
        },
      },
      { field: "CONSTANCIAS", cellRenderer: renderConstanciaButtons, width: 150,cellStyle: { display: "flex", alignItems: "center", justifyContent: "center" } },
      { field: "EMOS", cellRenderer: renderEmoButtons, width: 180, cellStyle: { display: "flex", alignItems: "center", justifyContent: "center" } },
      {
        field: "nombreEmpresa", 
        headerName: "EMPRESAS",
        filter: 'agTextColumnFilter',  
        width: 200,
      },
      { field: "actualizado_fecha_caducidad", headerName: "actualizado_fecha_caducidad" , hide: true},
      { field: "actualizado_fecha_examen", headerName: "actualizado_fecha_examen" , hide: true},
    ]);


  const onFilterTextBoxChanged = useCallback((e, isSelect) => {
    if (isSelect) {
      const selectedValue = e.target.value;
      setSelectFilter(selectedValue);
    
      if (selectedValue) {
        gridRef.current.api.setFilterModel({
          nombreEmpresa: {
            filterType: "text", // Filtro de tipo texto
            type: "equals",   // Busca valores que contienen el texto
            filter: selectedValue, // Valor a buscar
          },
        });
      } else {
        // Limpia solo el filtro de nombreEmpresa, no todos
        gridRef.current.api.setFilterModel({
          nombreEmpresa: null,
        });
      }
    } else {
      // Cuando no es un select (es input), limpiamos la selección del select
      const inputValue = e.target.value;
  
      // Limpiar el valor del select
      document.getElementById("searchSelect").value = "";
      setSelectFilter(""); // Reseteamos el filtro del select
  
      // Reiniciar el filtro de empresa
      gridRef.current.api.setFilterModel(null);
  
      // Aplicar filtro rápido con el texto ingresado
      gridRef.current.api.setQuickFilter(inputValue);
    }
  }, []);


  const handleConstanciaDownload = async (data) => {
    try {
      await postCrearConstancia(data);
      // 📌 Llamamos a la API para generar la constancia antes de la descarga
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
    
  };
  

  const onSelectionChanged = useCallback(() => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    setSelectedRows(selectedNodes);
  }, []);

  const handleDownloadMulitple = async () => {
    try {
      let dataToDownload = [];
      if (selectedRows.length > 0) {
        // Si hay filas seleccionadas, usa esas
        dataToDownload = selectedRows.filter(
          (item) =>
            item.data.fecha_examen !== "" &&
            item.data.clinica !== "" &&
            item.data.fecha_lectura !== "" &&
            item.data.condicion_aptitud !== ""
        );
  
        if (dataToDownload.length === 0) {
          return toast.error("No se encontraron registros completos en la selección.", {
            position: "bottom-right",
          });
        }


    
        // Generar PDFs
        for (const data of dataToDownload) {
          // Obtener logo
          const logo = await getImgs(data.data.empresa_id, "logo");
          const srcLogo = URL.createObjectURL(new Blob([logo.data]));
          const link = document.createElement("a");
          const pdfBlob = await pdf(<ConstanciaEmo data={data.data} logo={srcLogo} />).toBlob();
          const pdfUrl = URL.createObjectURL(pdfBlob);
          
          link.href = pdfUrl;
          link.target = "_blank";
          link.download = `Constancia-${data.data.apellidoPaterno} ${data.data.apellidoMaterno} ${data.data.nombres}.pdf`;
          link.click();
    
          await new Promise((resolve) => setTimeout(resolve, 500)); // Pequeña pausa entre descargas
        }
      } else if (selectFilter !== "") {
        // Si no hay filas seleccionadas, filtrar por empresa
        dataToDownload = rowData.filter(
          (item) =>
            item.nombreEmpresa === selectFilter &&
            item.fecha_examen !== "" &&
            item.clinica !== "" &&
            item.fecha_lectura !== "" &&
            item.condicion_aptitud !== ""
        );
  
        if (dataToDownload.length === 0) {
          return toast.error("No se encontró ningún registro completo para descargar la constancia.", {
            position: "bottom-right",
          });
        }

        // Obtener logo
        const logo = await getImgs(dataToDownload[0].empresa_id, "logo");
        const srcLogo = URL.createObjectURL(new Blob([logo.data]));
    
        // Generar PDFs
        for (const data of dataToDownload) {
          const link = document.createElement("a");
          const pdfBlob = await pdf(<ConstanciaEmo data={data} logo={srcLogo} />).toBlob();
          const pdfUrl = URL.createObjectURL(pdfBlob);
          
          link.href = pdfUrl;
          link.target = "_blank";
          link.download = `Constancia-${data.apellidoPaterno} ${data.apellidoMaterno} ${data.nombres}.pdf`;
          link.click();
    
          await new Promise((resolve) => setTimeout(resolve, 500)); // Pequeña pausa entre descargas
        }
      } else {
        return toast.error("Seleccione una empresa o registros para descargar el PDF.", {
          position: "bottom-right",
        });
      }
      
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("Ocurrió un error al generar los PDFs.", {
        position: "bottom-right",
      });
    }
  };
  

  return (
    <div>
      <div className="flex flex-col justify-between w-full gap-3 mb-3 lg:flex-row">
        <div className="flex flex-col w-full gap-3 md:flex-row lg:w-3/5">
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
            name="nombre"
            placeholder="Busqueda"
            className="input input-bordered input-sm"
            id="searchInput"
            onChange={onFilterTextBoxChanged}
          />
        </div>
        
      <div className="flex flex-col justify-end w-full gap-3 md:flex-row lg:w-2/5">
      
        <div className="flex justify-between gap-3">
          <button
            className="btn btn-sm btn-outline btn-error"
            onClick={handleDownloadMulitple}
          >
            Descargar
          </button>
        </div>
      </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 p-2 bg-white shadow-md rounded-md text-xs border border-gray-300">
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-[#205781] rounded"></span>
          <span>Examen y caducidad actualizados</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4" style={{ backgroundColor: "#ADD8E6" }}></span>
          <span>Solo fecha de caducidad actualizada</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4" style={{ backgroundColor: "#90EE90" }}></span>
          <span>Fecha de vencimiento en regla</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-4 h-4 bg-red-500 rounded"></span>
          <span>Examen vencido</span>
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
            onSelectionChanged={onSelectionChanged}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            rowMultiSelectWithClick={true}
          ></AgGridReact>
        </div>
      </div>

      <Modal
        isOpen={isOpen4}
        openModal={openModal4}
        closeModal={closeModal4}
        size={"w-100"}
        title="Editar información del trabajador"
      >
        <FormularioTrabajador
          initialForm={dataForm}
          closeModal={closeModal4}
          addItem={addItem}
          updateRow={updateRow}
          empresas={empresas}
          getTrabajadorEmo={onGridReady}
        />
      </Modal>
      <Modal
        isOpen={isOpen2}
        openModal={openModal2}
        closeModal={closeModal2}
        size={"w-100"}
        title="Envios por WhatsApp al trabajador"
      >
        <FormularioEnvios
          initialForm={dataForm}
        />
      
      </Modal>
      <Modal
        isOpen={isOpen1}
        openModal={openModal1}
        closeModal={closeModal1}
        size={"w-100"}
        title="Envios de EMO por Correo al trabajador"
      >
        <FormularioEmos
          initialForm={dataForm}
        />
      </Modal>
      <Modal
        isOpen={isOpen3}
        openModal={openModal3}
        closeModal={closeModal3}
        size={"w-100"}
        title="Envios por Correo al trabajador"
      >
        <FormularioCorreos
          initialForm={dataForm}
        />
      </Modal>
      <Modal
        isOpen={isOpenImport}
        openModal={openModalImport}
        closeModal={closeModalImport}
        size={"modal-sm"}
        title="Importar información del trabajador"
      >
        <FormularioImportar
          setRefetchData={setRefetchData}
          closeModal={closeModalImport}
          empresas={empresas}
          actualizar={onGridReady}
        />
      </Modal>
    </div>
  );
};

export default VisualizarRegistroEmo;
