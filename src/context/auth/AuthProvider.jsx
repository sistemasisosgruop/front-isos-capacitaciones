import React, { useReducer } from 'react'
import { types } from '../types/types'
import { AuthContext } from './authContext'
import authReducer from './authReducer'


const getUserLocalStorage = () => {

  const user = JSON.parse(localStorage.getItem( 'userIsos' ));
  const userFormat = user ? { logged: true, user:user } : { logged: false, user: {} } 
  
  return userFormat;
}

const AuthProvider = ({ children }) => {
  
  const [authState, dispatch] = useReducer(authReducer, {}, getUserLocalStorage)
  console.log("me ejecute");

  const login = ( user = {} ) => {

    const action = {
      type: types.login,
      payload: user
    }
    localStorage.setItem('userIsos', JSON.stringify(user))
    dispatch( action )

  }

  const logout = ( user = {} ) => {

    const action = {
      type: types.logout,
      payload: {}
    }
    dispatch( action )

  }

  return (
    <AuthContext.Provider 
    value={{ authState, login, logout }}>
      { children }
    </AuthContext.Provider>
  )
}

export default AuthProvider;
