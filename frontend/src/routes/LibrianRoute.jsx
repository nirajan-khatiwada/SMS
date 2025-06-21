import AuthContext from "../context/Auth"
import { Outlet,Navigate } from "react-router-dom"
import { useContext } from "react"

const LibrianRoute = () => {
const  {user} = useContext(AuthContext);
  return (
    user.role==="librarian"?<Outlet />:<Navigate to={`/${user.role}`} replace={true} />
  )

}

export default LibrianRoute