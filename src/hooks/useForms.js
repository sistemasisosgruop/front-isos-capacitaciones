import { useState, useEffect } from "react";

const useForm = (initialForm, validate) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const HandleForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const HandleBlur = (e) => {
    setErrors(validate(form));
  };

  const getDataForm = () => {
    return {
      dni: form.user,
      contraseña: form.password,
    }
  };

  return {
    form,
    errors,
    HandleForm,
    HandleBlur,
    getDataForm,
  };
};

export default useForm;
