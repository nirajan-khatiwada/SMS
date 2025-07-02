import AuthContext from "../context/Auth"
import { Outlet,Navigate } from "react-router-dom"
import { useContext } from "react"
const PublicRoute = () => {
    const {isAuthenticated,user} = useContext(AuthContext);
    console.log(isAuthenticated)
   
  return (
    isAuthenticated?<Navigate to={`/${user.role}/dashboard/`} replace={true} />:<Outlet />
  )
}

export default PublicRoute