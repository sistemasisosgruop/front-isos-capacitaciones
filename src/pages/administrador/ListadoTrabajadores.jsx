import React, { useCallback, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const ListadoTrabajadores = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '85vh' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [rowData, setRowData] = useState();
  
  const hola =(props) => {
    console.log('props :>> ', props);
    const cellValue = props.valueFormatted ? props.valueFormatted : props.value;
    return (
        <button className='cursor-pointer' onClick={() => buttonClicked()}>
          <FontAwesomeIcon icon={ faEdit }/>
        </button>
    );
  }
  const [columnDefs, setColumnDefs] = useState([
    { field: 'athlete'},
    { field: 'age', hide:true},
    { field: 'country' },
    { field: 'year' },
    { field: 'date' },
    { field: 'sport' },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total', cellRenderer: hola },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const onGridReady = useCallback((params) => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowGroupPanelShow={'always'}
          pagination={true}
          onGridReady={onGridReady}
        ></AgGridReact>
      </div>
    </div>
  );
};
export default ListadoTrabajadores;