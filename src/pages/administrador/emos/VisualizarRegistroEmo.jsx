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
  faTrashAlt,
  faFileImport,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { Modal } from "../../../components/modal/Modal";
import useModals from "../../../hooks/useModal";
import FormularioImportar from "./FormularioImportar";
import FormularioTrabajador from "./FormularioTrabajador";
import { initialForm } from "./config";
import { pdf } from "@react-pdf/renderer";
import { getTrabajadorEmo } from "../../../services/emo";
import ConstanciaEmo from "../../../components/ConstanciaEmo";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const VisualizarRegistroEmo = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "75vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [isOpen1, openModal1, closeModal1] = useModals();
  const [isOpenImport, openModalImport, closeModalImport] = useModals();
  const [refetchData, setRefetchData] = useState(false);
  const [dataForm, setdataForm] = useState(initialForm);
  const [rowData, setRowData] = useState();
  const [empresas, setEmpresas] = useState([]);
  const [selectFilter, setSelectFilter] = useState("");
  const [rowDelete, setRowDelete] = useState(null);
  const [descripcionModal, setDescripcionModal] = useState("");
  const gridRef = useRef();

  useEffect(() => {
    getEmpresas().then((res) => setEmpresas(res.data));
  }, []);

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
  const renderButtons = ({ data }) => {
    return (
      <>
        <label
          onClick={() => updateButton(data)}
          className="mr-2 cursor-pointer"
        >
          <FontAwesomeIcon icon={faEdit} />
        </label>
        <label
          onClick={() => handleDownload(data)}
          className="mr-2 cursor-pointer"
        >
          <FontAwesomeIcon icon={faDownload} />
        </label>
      </>
    );
  };
  const updateButton = (data) => {
    setDescripcionModal("Actualizar trabajador");
    openModal1();
    setdataForm(data);
  };

  const [columnDefs, setColumnDefs] = useState([
    { field: "nro", hide: true },
    {
      field: "apellidoPaterno",
      headerName: "APELLIDO PATERNO",
      minWidth: 200,
    },
    {
      field: "apellidoMaterno",
      headerName: "APELLIDO MATERNO",
      minWidth: 200,
    },
    { field: "nombres", headerName: "NOMBRES", minWidth: 200 },
    { field: "dni", headerName: "DNI", width: 110 },
    { field: "edad", headerName: "EDAD", width: 80 },
    { field: "area", headerName: "AREA" },
    { field: "cargo", headerName: "PUESTO LABORAL" },
    { field: "estado_email", headerName: "ESTADO CORREO" },
    { field: "fecha_email", headerName: "FECHA CORREO" },
    { field: "estado_whastapp", headerName: "ESTADO WHATSAPP" },
    { field: "fecha_whastapp", headerName: "FECHA WHATSAPP" },
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
    { field: "estado", headerName: "ESTADO" },
    { field: "acciones", cellRenderer: renderButtons, width: 100 },
    { field: "nombreEmpresa", hide: true, filter: true },
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
      // Cuando se comienza a escribir en el input, borramos la selección del select
      document.getElementById("searchSelect").value = "";
      setSelectFilter("");
  
      // Reiniciamos el filtro de la empresa
      gridRef.current.api.setFilterModel(null);
  
      const input = e.target.value;
      gridRef.current.api.setQuickFilter(input);
    }
  }, []);
  
  


  const handleDownload = async (data) => {
    const logo = await getImgs(data.empresa_id, "logo");
    const srcLogo = URL.createObjectURL(new Blob([logo.data]));
    const link = document.createElement("a");
    const pdfBlob = await pdf(
      <ConstanciaEmo data={data} logo={srcLogo} />
    ).toBlob();
    const pdfUrl = URL.createObjectURL(pdfBlob);
    link.href = pdfUrl;
    link.target = "_blank";
    link.download = `Constancia-${data.apellidoPaterno + " " + data.apellidoMaterno + " " + data.nombres}.pdf`;
    link.click();
  };

  const handleDownloadMulitple = async (data) => {


    if (selectFilter !== "") {

      const filterData = rowData.filter(
        (item) =>
          item.nombreEmpresa === selectFilter &&
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
        const data = filterData[i];
        const link = document.createElement("a");
        const pdfBlob = await pdf(<ConstanciaEmo data={data} logo={srcLogo} />).toBlob();
        const pdfUrl = URL.createObjectURL(pdfBlob);
        link.href = pdfUrl;
        link.target = "_blank";
        link.download = `Constancia-${data.apellidoPaterno + " " + data.apellidoMaterno + " " + data.nombres}.pdf`;
        link.click();
      
        // Agregamos el 'setTimeout' aquí
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
        <div className="flex w-full gap-3 flx-row md:w-2/4 ">
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
          <Button
            description="Importar"
            icon={faFileImport}
            event={openModalImport}
          />
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

      <Modal
        isOpen={isOpen1}
        openModal={openModal1}
        closeModal={closeModal1}
        size={"w-100"}
        title="Editar información del trabajador"
      >
        <FormularioTrabajador
          initialForm={dataForm}
          closeModal={closeModal1}
          addItem={addItem}
          updateRow={updateRow}
          empresas={empresas}
          getTrabajadorEmo={onGridReady}
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
