import Sidebar from '../../components/UI/Sidebar/Library'
import { Outlet } from 'react-router-dom'

const LLayout = () => {
  return (
    <div className="flex h-screen">
    <Sidebar/>
    <Outlet/>
    </div>
  )
}

export default LLayout