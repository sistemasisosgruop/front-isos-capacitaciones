import regexs from  '../../../utils/regexValidations';

const validate = () => {

    return  {
      detalle:[ value => value.length >= 1, 'Este campo es requerido' ],
      urlTest:[ value => regexs.url.test(value), 'El ruc no es valido' ],
      fechaCr:[ value => value.length >= 1, 'Este campo es requerido' ],
      fechaVen:[ value => value.length >= 1, 'Este campo es requerido' ],
      empresas:[ value => value !== "", 'Este campo es requerido' ],
    }

};
export default validate;


