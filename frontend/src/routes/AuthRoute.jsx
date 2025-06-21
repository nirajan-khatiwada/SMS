import AuthContext from "../context/Auth"
import { Outlet,Navigate } from "react-router-dom"
import { useContext } from "react"
const AuthRoute = () => {
    const {isAuthenticated,user} = useContext(AuthContext);
  return (
    isAuthenticated?<Outlet />:<Navigate to={`/login`} replace={true} />
  )
}

export default AuthRoute