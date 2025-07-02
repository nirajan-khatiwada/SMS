import Sidebar from "../../components/UI/Sidebar/Teacher"
import { Outlet } from "react-router-dom"

const TLayout = () => {
  return (
        <div className="flex h-screen">
                    <Sidebar />

            <Outlet/>
        </div>
  )
}

export default TLayout