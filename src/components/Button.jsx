import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Button = ({ icon = null, description }) => {
  return(
    <button type='submit' className="btn btn-active btn-sm btn-accent gap-2 text-white">
      { description }
      { icon && <FontAwesomeIcon icon={ icon } /> } 
    </button>
)};

export default Button;