import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ButtonModal = ({ icon = null, description, forModal = "", event }) => {
  return (
    <label htmlFor={ forModal } onClick={event} className="btn btn-active btn-sm btn-accent gap-2 text-white">
      {description}
      {icon && <FontAwesomeIcon icon={ icon } />}
    </label>
  );
};

export default ButtonModal;
