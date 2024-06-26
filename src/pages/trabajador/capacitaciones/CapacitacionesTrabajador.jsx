import React, { useContext, useState } from "react";
import useModals from "../../../hooks/useModal";
import { Modal } from "../../../components/modal/Modal";
import TarjetasCapacitaciones from "./components/TarjetasCapacitaciones";
import { useEffect } from "react";
import SinRegistros from "../../../components/SinRegistros";
import Pregunta from "./components/Pregunta";
import Certificado from "../../../components/Certificado";
import { PDFViewer } from "@react-pdf/renderer";
import {
  getFirmaCertificado,
  getPreguntas,
} from "../../../services/capacitacion";
import Button from "../../../components/Button";
import randomArray from "../../../utils/randomArray";
import { toast } from "react-toastify";
import { getReporte, patchDarExamen } from "../../../services/reportes";
import { AuthContext } from "../../../context/auth/AuthContext";
import { formatDateDb, formatDateYMD } from "../../../utils/formtDate";
import { getImgs } from "../../../services/empresa";
import { months } from "../../../config";
import getYearsBefore from "../../../utils/yearsBefore";
import { getExamenCapacitacion } from "../../../services/examenes";
import { initialFormPreguntas } from "./config";
import { hideLoader, showLoader } from "../../../utils/loader";
import { pdf } from "@react-pdf/renderer";

const CapacitacionesTrabajador = () => {
  const [selectMonth, setSelectMonth] = useState("");
  const [selectYear, setSelectYear] = useState("");
  const [data, setData] = useState([]);
  const [dataInit, setDataInit] = useState([]);
  const [formPreguntas, setFormPreguntas] = useState(initialFormPreguntas);
  const [dataCertificado, setDataCertificado] = useState("");
  const [years, setYears] = useState([]);
  const [reFetchData, setReFetchData] = useState(true);
  const [descripcionModal, setDescripcionModal] = useState('')

  const [isOpen, openModal, closeModal] = useModals();
  const [isOpenCerti, openModalCerti, closeModalCerti] = useModals();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    setYears(getYearsBefore(10));
  }, []);
  const filter = (obj) => {
    const [day, month, year] = formatDateDb(obj.fechaCapacitacion);

    if (selectMonth !== "" && selectYear !== "") {
      if (year == selectYear && month == selectMonth) {
        return true;
      }
    } else {
      if (selectMonth === "") {
        if (year == selectYear) return true;
      } else if (selectYear === "") {
        if (month == selectMonth) return true;
      }
    }
  };

  const filterData = () => {
    if (selectMonth === "" && selectYear === "") {
      return;
    }
    // console.log(dataInit);
    var arrPorID = dataInit?.filter(filter);
    setData(arrPorID);
  };

  const handleSelectYear = (e) => {
    setSelectYear(e.target.value);
  };
  const handleSelectMonth = (e) => {
    setSelectMonth(e.target.value);
  };

  useEffect(() => {
    filterData();
  }, [selectMonth, selectYear]);

  const getData = async () =>{
    const dni =JSON.parse(localStorage.getItem("userIsos")).dni;
    const response = await getExamenCapacitacion(dni)
    if(response){
      setDataInit(response.data)
      setData(response.data)
    }

  }
  // console.log(dataInit);
  useEffect(() => {
    getData()
  }, []);


  const handleFormChange = (index, event) => {
    let data = { ...formPreguntas };
    data["preguntas"][index][event.target.name] = event.target.value;
    setFormPreguntas(data);
  };

  const verPreguntas = (capacitacion) => {
    setDescripcionModal(capacitacion.capacitacion.nombre)
    openModal();
    showLoader();
    const capacitacionId = capacitacion.capacitacion.id;
    getPreguntas(capacitacionId).then(({ data }) => {
      const newData = data.preguntas.map((pregunta) => {
        const arrayCustom = [
          { descripcion: pregunta.opcion1, value: 1 },
          { descripcion: pregunta.opcion2, value: 2 },
          { descripcion: pregunta.opcion3, value: 3 },
          { descripcion: pregunta.opcion4, value: 4 },
          { descripcion: pregunta.opcion5, value: 5 },
        ];
        pregunta.opciones = randomArray(arrayCustom);
        pregunta.value_radio = "";

        return pregunta;
      });

      let newDataFormPreguntas = { ...formPreguntas };
      newDataFormPreguntas.trabajadorID = capacitacion.trabajadorId;
      newDataFormPreguntas.examenId = capacitacion.examenId;
      newDataFormPreguntas.capacitacionId = capacitacionId;
      newDataFormPreguntas.preguntas = newData;
      setFormPreguntas(newDataFormPreguntas);
      hideLoader();
    });
  };

  const validateGetPreguntas = () => {
    return new Promise((resolve, reject) => {
      formPreguntas.preguntas.forEach((pregunta) => {
        let campoVacio = false;
        if (pregunta.value_radio === "") campoVacio = true;
        if (campoVacio) resolve(false);
      });
      resolve(formPreguntas);
    });
  };

  const enviarExamen = async () => {
    const validatePreguntas = await validateGetPreguntas();
    if (!validatePreguntas) {
      return toast.warning("Todos las preguntas deben llenadas correctamente", {
        position: "bottom-right",
      });
    }
    console.log(validatePreguntas);
    const { examenId, capacitacionId, trabajadorID, preguntas } =
      validatePreguntas;
    const newFormatPreguntas = preguntas.map((e) => {
      let obj = {};
      obj["preguntaId"] = e.id;
      obj["respuesta"] = Number(e.value_radio);
      return obj;
    });

    let newFormatObj = {};
    newFormatObj["respuestas"] = newFormatPreguntas;
    patchDarExamen(capacitacionId, trabajadorID, examenId, newFormatObj).then(
      ({data, message =null}) => {
        if (data) {
          toast.success("Examen enviado", {
            position: "bottom-right",
          });
          setReFetchData(!reFetchData);
          closeModal();
          getData()
        } else {
          toast.error(message, {
            position: "bottom-right",
          });
        }
      }
    );
  };
  const verCertificado = async (data) => {
    const empresaTrabajador = data.trabajador.empresaId;
    const promesas = [
      getImgs(empresaTrabajador, "logo"),
      getImgs(empresaTrabajador, "certificado"),
      getFirmaCertificado(data.capacitacionId),
    ];
  
    Promise.all(promesas.map((prom) => prom.then((res) => new Blob([res.data]))))
      .then((logos) => {
        const srcLogo = URL.createObjectURL(logos[0]);
        const srcCertificado = URL.createObjectURL(logos[1]);
        const srcFirma = URL.createObjectURL(logos[2]);
        const imagenes = { srcLogo, srcCertificado, srcFirma };
        const horasCapacitacion = data.capacitacion.horas;
        data["imagenes"] = imagenes;
        data["fechaCapacitacion"] = formatDateDb(data?.fechaCapacitacion);
        data["horasCapacitacion"] =
          horasCapacitacion < 10 ? "0" + horasCapacitacion : horasCapacitacion;
  
        // create PDF
        createPDF(data);
      })
      .catch((error) => console.error(error));
  };
  
  const createPDF = async (data) => {
    const link = document.createElement("a");
    const pdfBlob = await pdf(<Certificado data={data} />).toBlob();
    const pdfUrl = URL.createObjectURL(pdfBlob);
    link.href = pdfUrl;
    link.target = "_blank";
    link.download = `Certificado.pdf`;
    link.click();
  };
  
  return (
    <div className="">
      <div className="p-3 bg-white">
        <div className="flex justify-between gap-3">
          <h2 className="mb-3 text-2xl font-bold">Capacitaciones</h2>
        </div>
        <div className="flex flex-col justify-between w-full gap-3 mb-3 lg:flex-row">
          <div className="flex flex-col w-full gap-3 md:flex-row lg:w-3/5">
            <select
              className="select select-bordered select-sm"
              id="searchSelect"
              onChange={handleSelectYear}
              value={selectYear}
            >
              <option value={""}>Año</option>
              {years?.map((year, index) => {
                return (
                  <option key={index} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
            <select
              className="select select-bordered select-sm"
              id="searchSelect"
              onChange={handleSelectMonth}
              value={selectMonth}
            >
              <option value={""}>Mes</option>
              {months?.map((month, index) => {
                return (
                  <option key={index} value={month.descripcion}>
                    {month.descripcion}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {data?.length !== 0 ? (
            data?.map((card, index) => {
              return (
                <TarjetasCapacitaciones
                  key={index}
                  data={card}
                  verPreguntas={verPreguntas}
                  verCertificado={verCertificado}
                />
              );
            })
          ) : (
            <SinRegistros />
          )}
        </div>
        <Modal
          isOpen={isOpen}
          openModal={openModal}
          closeModal={closeModal}
          size={"modal-md"}
          title={descripcionModal}
        >
          {formPreguntas?.preguntas?.map((objPregunta, index) => {
            return (
              <Pregunta
                key={objPregunta.id}
                indice={index}
                data={objPregunta}
                handleFormChange={handleFormChange}
              />
            );
          })}
          <div className="text-end">
            <Button description="Enviar prueba" event={enviarExamen} />
          </div>
        </Modal>
        <Modal
          isOpen={isOpenCerti}
          openModal={openModalCerti}
          closeModal={closeModalCerti}
          size={"modal-lg"}
          title=""
        >
          <PDFViewer width={"100%"} height={"454px"}>
            <Certificado data={dataCertificado} />
          </PDFViewer>
        </Modal>
      </div>
    </div>
  );
};

export default CapacitacionesTrabajador;
