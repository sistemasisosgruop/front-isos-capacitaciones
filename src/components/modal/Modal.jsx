import React from "react";
import "./modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export const Modal = ({
  children,
  isOpen,
  openModal,
  closeModal,
  size,
  title = "titulo del modal",
}) => {
  const handlePropagation = (e) => {
    e.stopPropagation();
  };
  
  isOpen
    ? (document.body.style.overflow = "hidden")
    : (document.body.style.overflow = "auto");

  return (
    <div
      className={`container-modal ${isOpen && "show-modal"}`}
      onClick={closeModal}
    >
      <div className={`modal-content ${size}`} onClick={handlePropagation}>
        <div className="modal-header">
          <h4>{title}</h4>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={closeModal}
            size="lg"
            color="black"
          />
        </div>
        {children}
      </div>
    </div>
  );
};
