
const validate = () => {

    return  {
      excel: [ value => value!="", 'Este campo es requerido' ],
      empresa: [ value => value.length >= 1, 'Este campo es requerido' ]
    }
    
};

export default validate;


