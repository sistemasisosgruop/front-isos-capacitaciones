import { useState, useMemo} from "react";
import { AgGridReact } from "ag-grid-react";

const FormularioEnvios = ({
  initialForm,
}) => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "50vh" }), []);
  const gridStyle = useMemo(() => ({ height: "65%", width: "100%" }), []);
  
  const registroData = initialForm.registroDescarga;
  let approved = registroData.filter(reg => reg.tipo == 'whatsapp');
  // console.log(initialForm)

  const DataCard = props => {
    return (
      <div className="overflow-x-auto">
        <div className="flex items-center gap-1">
          <div>
            <label><h4>Nombres y Apellidos:</h4></label>
            <div className="font-bold">{initialForm.nombres} {initialForm.apellidoPaterno} {initialForm.apellidoMaterno}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div>
            <label><h4>DNI:</h4></label>
            <div className="font-bold">{initialForm.dni}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div>
            <label><h4>Empresa:</h4></label>
            <div className="font-bold">{initialForm.nombreEmpresa}</div>
          </div>
        </div>
      </div>
    );
  }

  const NotFound = () => {
    return (
      <div className="w-full mt-6 bg-orange-300 shadow-xl card">
        <div className="card-body">
          <h2 className="card-title">Alerta!</h2>
          <h1>Está pendiente el envío</h1>
      </div>
      </div>
    );
  }

  const RegistroCard = props => {
    const [rowData, setRowData] = useState(approved);
    const [columnDefs, setColumnDefs] = useState([
      { field: "id", hide: true },
      { field: "fecha" },
      { field: "hora" },
    ]);
    // console.log(rowData)

    return (
      <AgGridReact 
        rowData={rowData} 
        columnDefs={columnDefs} 
        autoSizeColumns={true}
        rowGroupPanelShow={"always"}
        rowHeight="34"
        pagination={true}
      />
    );
  }

  return (
    <div style={containerStyle}>
      <DataCard />
      <div style={gridStyle} className="ag-theme-alpine">
        {approved.length >= 1  ? <RegistroCard /> : <NotFound /> }
      </div>
    </div>
  );
};

export default FormularioEnvios;
