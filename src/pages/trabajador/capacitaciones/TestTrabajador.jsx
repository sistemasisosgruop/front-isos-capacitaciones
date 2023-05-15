import React, { useCallback, useEffect, useMemo, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { formatDateDb } from "../../../utils/formtDate";
import { months } from "../../../config";
import getYearsBefore from "../../../utils/yearsBefore";
import { getTests } from "../../../services/test";
import { getTrabajador } from "../../../services/trabajador";
import { AuthContext } from "../../../context/auth/authContext";
import { useContext } from "react";

const TestTrabajador = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "80vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState([]);
  const [selectMonth, setSelectMonth] = useState("");
  const [selectYear, setSelectYear] = useState("");
  const [years, setYears] = useState([]);
  const [dataInit, setDataInit] = useState([]);
  const { authState } = useContext(AuthContext);

  //configuracion de la tabla
  const renderButtons = ({ data }) => {
    return (
      <a
        className="cursor-pointer badge badge-accent badge-outline"
        href={data.urlTest}
        target="_blank"
      >
        Ver enlace
      </a>
    );
  };

  const initColumDefs = [
    { field: "detalle" },
    { field: "fechaCr", headerName: "Fecha de creacion" },
    { field: "fechaVen", headerName: "Fecha de vencimiento" },
    {
      field: "Link",
      cellRenderer: renderButtons,
      cellStyle: { textAlign: "center" },
    },
  ];

  const [columnDefs, setColumnDefs] = useState(initColumDefs);

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);

  //cargar la informacion de la tabla
  const onGridReady = useCallback((params) => {
    getTests().then(({ data }) => {
      getTrabajador(authState.user.idUsuario).then((res) => {
        const idEmpresaTrabajador = res.data.empresaId;
        const newData = data.filter((obj) => {
          let coincideEmpresa = false;
          obj.Empresas.forEach((e) => {
            if (e.id === idEmpresaTrabajador) coincideEmpresa = true;
          });
          if (coincideEmpresa) return true;
        });
        setDataInit(newData);
        setRowData(newData);
      });
    });
  }, []);

  const filter = (obj) => {
    const [day, month, year] = formatDateDb(obj.fechaCr);
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
    var arrFilter = dataInit.filter(filter);
    setRowData(arrFilter);
  };

  useEffect(() => {
    setYears(getYearsBefore(10));
  }, []);

  const handleSelectYear = (e) => {
    setSelectYear(e.target.value);
  };

  const handleSelectMonth = (e) => {
    setSelectMonth(e.target.value);
  };

  useEffect(() => {
    filterData();
  }, [selectMonth, selectYear]);

  return (
    <div className="">
      <div className="bg-white p-3">
        <h2 className="font-bold text-2xl mb-3 block">Tests</h2>
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

        <div style={containerStyle}>
          <div style={gridStyle} className="ag-theme-alpine">
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              onGridReady={onGridReady}
              rowHeight="34"
            ></AgGridReact>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTrabajador;
