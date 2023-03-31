const validate = (form) => {

  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/,
    regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/,
    regexText = /^.{1,255}$/;
  let errors = {};
  if (!form.user) {
    errors.user = "el usuario DNI debe ser correcto";
  } else if (!regexName.test(form.user.trim())) {
    errors.user = "la nombre no cumple con lo espcificado";
  }
  if (!form.password) {
    errors.password = "la contraseña e incorrecta";
  } else if (!regexName.test(form.password.trim())) {
    errors.password = "la correo no cumple con lo espcificado";
  }

  return errors;

};
export default validate;
