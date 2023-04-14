import regexs from  '../../../utils/regexValidations';

const validate = () => {

    // la funcion anonima debe retornar true caso contrario es error
    return  {
      empresa:[ value => value.length >= 1, 'Este campo es requerido' ],
      ruc:[ value => regexs.ruc.test(value), 'El ruc no es valido' ],
      nombreGerente:[ value => value.length >= 1, 'Este campo es requerido' ],
      numeroContacto:[ value => regexs.number.test(value), 'Este campo es requerido' ],
      direccion:[ value => value.length >= 1, 'Este campo es requerido' ],
      //logoEmpresa:[ value => value.length >= 1, 'Este campo es requerido' ],
      //fondoCertificado:[ value => value.length >= 1, 'Este campo es requerido' ],
    }

};
export default validate;


