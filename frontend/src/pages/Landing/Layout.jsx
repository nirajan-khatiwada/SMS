import { Outlet } from "react-router-dom"
import Footer from "../../components/UI/Footer"
import Navbar from "../../components/UI/Navbar"

const Layout = () => {
  return (
    <>
    <Navbar />
    <Outlet />
    <Footer />
    </>
  )
}

export default Layout