import Hero from "../../components/UI/Hero"
import OverView from "../../components/UI/OverView"
import useTitle from "../../hooks/pageTitle"
const Home = () => {
  useTitle("Home | Smart Campus")
  return (
    <>

    <Hero/>

    <OverView/>
    
    </>
  )
}

export default Home