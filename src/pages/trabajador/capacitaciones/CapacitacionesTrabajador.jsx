import React, { useState } from "react";
import useModals from "../../../hooks/useModal";
import { Modal } from "../../../components/modal/Modal";
import TarjetasCapacitaciones from "./components/TarjetasCapacitaciones";
import { useEffect } from "react";
import SinRegistros from "../../../components/SinRegistros";
import Pregunta from "./components/Pregunta";

const months = [
  {
    numero: 1,
    descripcion: "Enero",
  },
  {
    numero: 2,
    descripcion: "Febrero",
  },
  {
    numero: 3,
    descripcion: "Marzo",
  },
  {
    numero: 4,
    descripcion: "Abril",
  },
  {
    numero: 5,
    descripcion: "mayo",
  },
  {
    numero: 6,
    descripcion: "Junio",
  },
  {
    numero: 7,
    descripcion: "Julio",
  },
  {
    numero: 8,
    descripcion: "Agosto",
  },
  {
    numero: 9,
    descripcion: "septiembre",
  },
  {
    numero: 10,
    descripcion: "octubre",
  },
  {
    numero: 11,
    descripcion: "noviembre",
  },
  {
    numero: 12,
    descripcion: "diciembre",
  },
];
const dataInit = [
  {
    fecha: "08/01/2015",
    titulo: "ejemplo de titulo 1 08/01/2015",
  },
  {
    fecha: "02/02/2015",
    titulo: "ejemplo de titulo 2 08/02/2015",
  },
  {
    fecha: "03/12/2016",
    titulo: "ejemplo de titulo 1 08/12/2016",
  },
  {
    fecha: "02/02/2016",
    titulo: "ejemplo de titulo 1 08/02/2016",
  },
  {
    fecha: "08/03/2017",
    titulo: "ejemplo de titulo 1 08/03/2017",
  },
];
const CapacitacionesTrabajador = () => {
  const [selectMonth, setSelectMonth] = useState("");
  const [selectYear, setSelectYear] = useState("");
  const [isOpen, openModal, closeModal] = useModals();
  const [data, setData] = useState(dataInit);
  const [dataFilter, setDataFilter] = useState([]);
  const [filterActive, setFilterActive] = useState(false);

  const filter = (obj) => {
    const month = new Date(obj.fecha.split("/")[1]).getMonth() + 1;
    const year = new Date(obj.fecha).getFullYear();
    if (selectMonth !== "" && selectYear !== "") {
      if (year == selectYear && month == selectMonth) {
        return true;
      }
    } else {
      if (selectMonth === "") {
        if (year == selectYear) {
          return true;
        }
      } else if (selectYear === "") {
        if (month == selectMonth) {
          return true;
        }
      }
    }
  };

  const filterData = () => {
    if(selectMonth === "" && selectYear === "") {
      setFilterActive(false);
      return;
    };
    var arrPorID = data.filter(filter); 
    console.log('arrPorID', arrPorID)
    setDataFilter(arrPorID);
  };
  const handleSelectYear = (e) => {
    console.log("cambio el select de años");
    setSelectYear(e.target.value);
  };
  useEffect(() => {
    console.log("estoy ejecutanbdo la funcion");
    setFilterActive(true)
    filterData();
  }, [selectMonth, selectYear]);
  
  const handleSelectMonth = (e) => {
    console.log("cambio el select de meses");
    setSelectMonth(e.target.value);
  };

  let fechaActual = new Date().getFullYear();
  const years = [];

  // creacion de 10 años anteriores
  for (let x = 0; x < 10; x++) years.push(fechaActual - x);

  return (
    <div className="">
      <div className="bg-white p-3">
        <div className="flex justify-between gap-3">
          <h2 className="font-bold text-2xl mb-3">Trabajadores</h2>
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
                  <option key={index} value={month.numero}>
                    {month.descripcion}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {
           (selectMonth ==='' && selectYear==='') ?
            data.map((card, index) =>{
            return ( <TarjetasCapacitaciones
              key={index}
              title={card.titulo}
              date={card.fecha}
              openModal={openModal}
            />
            ) }
          )
          : dataFilter.map((card, index) =>{
            return ( <TarjetasCapacitaciones 
              key={index}
              title={card.titulo}
              date={card.fecha}
              openModal={openModal}
            />
            ) }
          )
          }
          {
            (dataFilter.length <= 0  && filterActive) && <SinRegistros/>
          }
        </div>

        <Modal
          isOpen={isOpen}
          openModal={openModal}
          closeModal={closeModal}
          size={"modal-md"}
          title=""
        >
          <Pregunta/>
        </Modal>
      </div>
    </div>
  );
};

export default CapacitacionesTrabajador;
