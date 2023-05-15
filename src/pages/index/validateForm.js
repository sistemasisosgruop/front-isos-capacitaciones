const validate = () => {

    return  {
      user: [ (value) => value.length >= 6, 'El usuario no es correcto'],
      password: [ (value) => value.length >= 6, 'El password debe de tener más de 6 letras.'],
    }

};
export default validate;


