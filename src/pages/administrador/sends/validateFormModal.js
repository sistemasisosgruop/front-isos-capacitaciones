import regexs from  '../../../utils/regexValidations';

const validate = () => {

    return  {
      celular: [ value => value.length >= 1, 'Este campo es requerido' ],
      lectura_envio: [ value => value.length >= 1, 'Este campo es requerido' ],
    }
    
};

export default validate;


