import { Outlet } from "react-router-dom"
import { useContext,Navigate } from "react"
import AuthContext from "../context/Auth";
const NurseRoute = () => {
const {user} = useContext(AuthContext);
  return (
    user.role==="nurse" ? <Outlet /> : <Navigate to={`/${user.role}/dashboard/`} replace={true} />
  )
}

export default NurseRoute