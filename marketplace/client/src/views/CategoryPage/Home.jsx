import Hero from "../../components/Hero/Hero"
import FeatureBar from "../../components/FeatureBar/FeatureBar"
import CategorySearch from "../../components/CategorySearch/CategorySearch"
import RoleSection from "../../components/RoleSection/RoleSection"
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import HomeComprador from "../HomeComprador"

const Home = () => {

    const { token, rol } = useSelector((state) => state.auth)

    if(token && rol === 'COMPRADOR'){
        return <HomeComprador />
    }

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
