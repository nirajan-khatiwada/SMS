import React from 'react'
import { useContext } from 'react'
import AuthContext from '../context/Auth'
import { Outlet,Navigate, replace } from 'react-router-dom'

const TeacherRoute = () => {
    const {user} = useContext(AuthContext)
    
  return (
    user.role === "teacher" ? <Outlet/> : <Navigate to= {`/${user.role}/dashboard`} replace={true}/>
  )
}

export default TeacherRoute