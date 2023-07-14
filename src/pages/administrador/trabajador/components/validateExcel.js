
const validate = () => {

    return  {
      excel: [ value => value!="", 'Este campo es requerido' ],
    }
    
};

export default validate;


