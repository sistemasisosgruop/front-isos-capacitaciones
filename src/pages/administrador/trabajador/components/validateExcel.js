
const validate = () => {

    // la funcion anonima debe retornar true caso contrario es error
    return  {
      //excel: [ value => console.log('value', value), 'Este campo es requerido' ],
      empresa: [ value => value.length >= 1, 'Este campo es requerido' ]
    }
    
};

export default validate;


