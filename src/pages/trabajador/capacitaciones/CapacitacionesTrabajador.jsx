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
import { getExamen } from "../../../services/examenes";
import { initialFormPreguntas } from "./config";
import { hideLoader, showLoader } from "../../../utils/loader";

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
    const [day, month, year] = formatDateDb(obj.createdAt);
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
    var arrPorID = dataInit.filter(filter);
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

  useEffect(() => {
    getReporte().then(({ data }) => {
      const dataTrabajador = data.filter(
        (capacitacion) =>
          capacitacion.trabajadorId === authState.user.idUsuario &&
          capacitacion.capacitacion.habilitado
      );
      const newData = dataTrabajador.map((capacitacion) => {
        capacitacion["fechaCapacitacion"] = formatDateYMD(
          capacitacion.createdAt
        );
        return capacitacion;
      });

      const array = [];

      newData.forEach((e) => {
        array.push(getExamen(e.examen.id));
      });

      Promise.all(array).then((res) => {
        res.map((examen, index) => {
          newData[index]["maximaNotaExamen"] = examen.data.pregunta.reduce(
            (acumulador, pregunta) => {
              return acumulador + pregunta.puntajeDePregunta;
            },
            0
          );
          return examen;
        });
        setDataInit(newData);
        setData(newData);
      });
    });
  }, [reFetchData]);

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

    Promise.all(promesas.map((prom) => prom.then((res) => res))).then((res) => {
      const srcLogo = URL.createObjectURL(new Blob([res[0].data]));
      const srcCertificado = URL.createObjectURL(new Blob([res[1].data]));
      const srcFirma = URL.createObjectURL(new Blob([res[2].data]));
      const imagenes = { srcLogo, srcCertificado, srcFirma };
      const horasCapacitacion = data.capacitacion.horas;
      data["imagenes"] = imagenes;
      data["fechaCapacitacion"] = formatDateDb(data.createdAt);
      data["horasCapacitacion"] =
        horasCapacitacion < 10 ? "0" + horasCapacitacion : horasCapacitacion;
      setDataCertificado(data);
      openModalCerti();
    });
  };
  return (
    <div className="">
      <div className="bg-white p-3">
        <div className="flex justify-between gap-3">
          <h2 className="font-bold text-2xl mb-3">Capacitaciones</h2>
        </div>
        <div className="flex flex-col lg:flex-row justify-between gap-3 mb-3 w-full">
          <div className="flex flex-col md:flex-row w-full lg:w-3/5 gap-3">
            <select
              className="select select-bordered select-sm"
              id="searchSelect"
              onChange={handleSelectYear}
              value={selectYear}
            >
              <option value={""}>Año</option>
              {years.map((year, index) => {
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
              {months.map((month, index) => {
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
          {data.length !== 0 ? (
            data.map((card, index) => {
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
          {formPreguntas.preguntas.map((objPregunta, index) => {
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
