import regexs from  '../../../../utils/regexValidations';

const validate = () => {

    // la funcion anonima debe retornar true caso contrario es error
    return  {
      nombre:[ value => value.length >= 1, 'Este campo es requerido' ],
      instructor:[ value => value.length >= 1, 'Este campo es requerido' ],
      fechaInicio:[ value => value.length >= 1, 'Este campo es requerido' ],
      fechaCulminacion:[ value => value.length >= 1, 'Este campo es requerido' ],
      urlVideo:[ value => regexs.url.test(value), 'La url no es valida' ],
      horas:[ value => regexs.number.test(value), 'Este campo es requerido' ],
      empresas:[ value => value!="", 'Este campo es requerido' ],
      certificado:[ value => value!="", 'Este campo es requerido' ],
    }

};
export default validate;
