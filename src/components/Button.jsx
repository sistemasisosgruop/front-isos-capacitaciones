import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button = ({ icon = null, description, event, classname = "" }) => {
  return (
    <button
      type="submit"
      className={`gap-2 text-white btn btn-active btn-sm btn-accent ${classname}`}
      onClick={event}
    >
      {description}
      {icon && <FontAwesomeIcon icon={icon} />}
    </button>
  );
};

export default Button;
