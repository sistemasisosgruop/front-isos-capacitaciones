import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import logoIndex from  '../../assets/img/logoIndex.png';
import logoIsos from  '../../assets/img/logoIsos.svg';
import Button from '../../components/Button';
import { AuthContext } from '../../context/auth/authContext';

const Index = ( ) => {
    
  const { login, authState } = useContext( AuthContext )
  const navigate = useNavigate();

  const handleLogin = ( event ) => {
    event.preventDefault();
    login()
    navigate('/menu',{
      replace:true
    })
  }
    
  return (
    <div className="">
     <div className='flex justify-center items-center h-screen bg-slate-200'>
      <div className='flex flex-col md:flex-row items-center'>
        <div className='hidden md:block md:w-1/2'>
          <img src= { logoIndex } className='w-full'/>
        </div>
        <div className='flex justify-center w-full md:w-1/2'>
          <div className='shadow-slate-300 bg-white w-full md:w-3/5 p-5'>
            <figure className='mb-3'>
              <img src={ logoIsos } className='w-28 mx-auto' />
            </figure>
            <form onSubmit={ handleLogin }>
              <label>Usuario</label>
              <input type="text" className="input input-bordered input-sm w-full" />

              <label>Contraseña</label>
              <input type="password" className="input input-bordered input-sm w-full mb-3" />
              <div className='text-center'>
              <Button description='Iniciar sesion'/>
              </div>
            </form>
          </div>
        </div>
      </div>  
     </div>
    </div>
  )
}

export default Index;
