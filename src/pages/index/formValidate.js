import { Button } from '@mui/material';
import React,{useState,useEffect} from 'react'
import useForm from './hooks/useForm';
import Loader from './loader';
import Message from './Message';
let initialForm={
  name:"",
  correo:"",
  mensaje:""
}
const validate = (form) => {
  let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/,
      regexEmail = /^(\w+[/./-]?){1,}@[a-z]+[/.]\w{2,}$/,
      regexComments = /^.{1,255}$/;
  let errors={}
if(!form.name){
  errors.name="la variable name esta mal Oe!"
}else if(!regexName.test(form.name.trim())){
  errors.name="la nombre no cumple con lo espcificado"
}
if(!form.correo){
  errors.correo="la variable correo esta mal Oe!"
}else if(!regexEmail.test(form.correo.trim())){
  errors.correo="la correo no cumple con lo espcificado"
}
if(!form.mensaje){
  errors.mensaje="la variable comentario esta mal Oe!"
}else if(!regexComments.test(form.mensaje.trim())){
  errors.mensaje="El comentario no cumple con lo espcificado"
}
return errors; 
}
const ValidarFormulario = () => {
    const {
      form,
      response,
      errors,
      loading,
      HandleForm,
      HandleBlur,
      handleSubmit
    } = useForm(initialForm,validate);
   
  return (  
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" onBlur={HandleBlur} value={form.name} onChange={HandleForm}/>
        {errors.name && <p>{errors.name}</p>}
        <label htmlFor="correo">Correo</label>
        <input type="email" name="correo" id="correo" onBlur={HandleBlur} value={form.correo} onChange={HandleForm}/>
        {errors.correo && <p>{errors.correo}</p>}
        <label htmlFor="mensaje">Mensaje</label>
        <input type="text" name="mensaje" id="mensaje" onBlur={HandleBlur} value={form.mensaje} onChange={HandleForm}/>
        {errors.mensaje && <p>{errors.mensaje}</p>}
        <Button type="submit" variant="outlined">Enviar</Button>
      </form>
      {loading && <Loader/>}
      {response && <Message msg={"el formulario fue neviado"}/>}
    </div>
  )
}

export default ValidarFormulario
