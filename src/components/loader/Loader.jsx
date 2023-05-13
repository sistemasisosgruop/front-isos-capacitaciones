import { useState } from "react";
import "./loader.css";

const Loader = ({activeInit}) => {
  const [active, setActive] = useState(false);
  return (
    <section
      className="seccion-general-loader" id="loader"
    >
      <div className="loader loader-1">
        <div className="loader-outter"></div>
        <div className="loader-inner"></div>
      </div>
    </section>
  );
};

export default Loader;
