import React, { useReducer } from 'react'
import { types } from '../types/types'
import { AuthContext } from './authContext'
import authReducer from './authReducer'

const initialPayload = {
  id:'15',
  nombre:'Miguel Mendoza',
  rol:'ADMIN'
} 
const initialState = {
  logged:false,
  user:{}
} 

const AuthProvider = ({ children }) => {
  
  const [authState, dispatch] = useReducer(authReducer, initialState)

  const login = ( user = initialPayload ) => {

    const action = {
      type: types.login,
      payload: user
    }
    dispatch( action )

  }

  const logout = ( user = initialPayload ) => {

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
