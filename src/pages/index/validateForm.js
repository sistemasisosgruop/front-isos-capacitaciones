const validate = () => {

  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/,
    regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/,
    regexText = /^.{1,255}$/;

    return  {
      user: [ (value) => value.length >= 6, 'El correo debe de tener una @'],
      password: [ (value) => value.length >= 6, 'El password debe de tener más de 6 letras.'],
    }

};
export default validate;


