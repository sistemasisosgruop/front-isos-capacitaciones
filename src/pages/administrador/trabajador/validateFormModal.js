import regexs from  '../../../utils/regexValidations';

const validate = () => {

    return  {
      nombres: [ value => value.length >= 1, 'Este campo es requerido' ],
      apellidoPaterno: [ value => value.length >= 1, 'Este campo es requerido' ],
      apellidoMaterno: [ value => value.length >= 1, 'Este campo es requerido' ],
      dni: [ value => regexs.dni.test(value), 'Este DNI no es valido' ],
      email: [ value => regexs.email.test(value), 'Este Email no es valido' ],
      genero: [ value => value.length >= 1, 'Este campo es requerido' ],
      edad: [ value => regexs.number.test(value), 'Este campo es requerido' ],
      areadetrabajo: [ value => value.length >= 1, 'Este campo es requerido' ],
      cargo: [ value => value.length >= 1, 'Este campo es requerido' ],
      fechadenac: [ value => value.length >= 1, 'Este campo es requerido' ],
      empresa: [ value => value !== "", 'Este campo es requerido' ],
      celular: [value => regexs.celular.test(value), 'Este campo es requerido' ]
    }
    
};

export default validate;


