import { Outlet } from 'react-router-dom'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBuilding,
  faListOl,
  faChalkboardTeacher,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";
import './styles.css';

const opcionesTrabajador = () => {
  return (
    <div>
    <div className="w-full" style={{ height: "90vh" }}>
        <div className="flex justify-center items-center h-full">
          <div className="container-menu">
            <div className="box-1 text-center p-5 rounded-2xl">
              <h3 className="font-bold text-lg mb-3">TRABAJADORES</h3>
              <FontAwesomeIcon icon={faUsers} size="3x" />
            </div>
            <div className="box-2 text-center p-5 rounded-2xl">
              <h3 className="font-bold text-lg mb-3">EMPRESAS</h3>
              <FontAwesomeIcon icon={faBuilding} size="3x" />
            </div>
            <div className="box-3 text-center p-5 rounded-2xl">
              <h3 className="font-bold text-lg mb-3">CAPACITACIONES</h3>
              <FontAwesomeIcon icon={faChalkboardTeacher} size="3x" />
            </div>
            <div className="box-4 text-center p-5 rounded-2xl">
              <h3 className="font-bold text-lg mb-3">TEST</h3>
              <FontAwesomeIcon icon={faListOl} size="3x" />
            </div>
            <div className="box-5 text-center p-5 rounded-2xl">
              <h3 className="font-bold text-lg mb-3">REPORTES</h3>
              <FontAwesomeIcon icon={faFileInvoice} size="3x" />
            </div>
          </div>
        </div>
      </div>
      <Outlet/>
    </div>
  )
}

export default opcionesTrabajador;
