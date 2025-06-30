import Sidebar from "../../components/UI/Sidebar/Nurse"
import { Outlet } from "react-router-dom"

const NLayout = () => {
  return (
        <div className="flex h-screen">
                    <Sidebar />

            <Outlet/>
        </div>
  )
}

export default NLayout