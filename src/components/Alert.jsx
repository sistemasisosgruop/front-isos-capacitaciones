import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import React from "react";


const Alert = ({message = '' }) => {
  return (
    <div className="alert alert-error shadow-lg my-3">
      <div>
       <FontAwesomeIcon icon={ faTimes }/>
        <span> { message } </span>
      </div>
    </div>
  );
};

export default Alert;
