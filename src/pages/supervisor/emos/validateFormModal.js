import regexs from  '../../../utils/regexValidations';

const validate = () => {

    return  {
      fecha_examen: [ value => value.length >= 1, 'Este campo es requerido' ],
      condicion: [ value => value.length >= 1, 'Este campo es requerido' ],
      clinica: [ value => value.length >= 1, 'Este campo es requerido' ],
      lectura_emo: [ value => value.length >= 1, 'Este campo es requerido' ],
    }
    
};

export default validate;


