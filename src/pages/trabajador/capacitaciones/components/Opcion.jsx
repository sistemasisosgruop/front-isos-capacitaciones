
const Opcion = ({ data, value_radio, indice, handleFormChange }) => {
  return (
    <div className="flex items-center mb-1 gap-x-2">
      <input
        type="radio"
        name="value_radio"
        value={data.value}
        className="radio radio-warning"
        checked={value_radio == data.value}
        onChange={(e) => handleFormChange(indice, e)}
      />
      <span>{data.descripcion}</span>
    </div>
  );
};

export default Opcion;
