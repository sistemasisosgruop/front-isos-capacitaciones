import regexs from  '../../../utils/regexValidations';

const validate = () => {

    // la funcion anonima debe retornar true caso contrario es error
    return  {
      nombres: [ value => value.length >= 1, 'Este campo es requerido' ],
      apellidoPaterno: [ value => value.length >= 1, 'Este campo es requerido' ],
      apellidoMaterno: [ value => value.length >= 1, 'Este campo es requerido' ],
      dni: [ value => regexs.dni.test(value), 'Este DNI no es valido' ],
      genero: [ value => value.length >= 1, 'Este campo es requerido' ],
      edad: [ value => regexs.number.test(value), 'Este campo es requerido' ],
      areadetrabajo: [ value => value.length >= 1, 'Este campo es requerido' ],
      cargo: [ value => value.length >= 1, 'Este campo es requerido' ],
      fechadenac: [ value => value.length >= 1, 'Este campo es requerido' ],
      password: [ value => value.length >= 8, 'Este campo es requerido' ],
      empresa: [ value => value !== "", 'Este campo es requerido' ]
    }
    
};

export default validate;


