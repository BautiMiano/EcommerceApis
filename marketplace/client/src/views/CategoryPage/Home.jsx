import Hero from "../../components/Hero/Hero"
import FeatureBar from "../../components/FeatureBar/FeatureBar"
import CategorySearch from "../../components/CategorySearch/CategorySearch"
import RoleSection from "../../components/RoleSection/RoleSection"
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import HomeComprador from "../HomeComprador"

const Home = () => {

    // La sesión sale de Redux (AuthSlice)
    const { token, rol } = useSelector((state) => state.auth)

    if(token && rol === 'COMPRADOR'){
        return <HomeComprador />
    }

    // El vendedor tiene su propio inicio en el panel
    if(token && rol === 'VENDEDOR'){
        return <Navigate to="/vendedor" replace />
    }

    return(
        <main>
            <Hero />
            <FeatureBar />
            <CategorySearch />
            <RoleSection />
        </main>
    )
}

export default Home
