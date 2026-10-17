import Hero from "../../components/Hero/Hero"
import FeatureBar from "../../components/FeatureBar/FeatureBar"
import CategorySearch from "../../components/CategorySearch/CategorySearch"
import RoleSection from "../../components/RoleSection/RoleSection"
import HomeComprador from "../HomeComprador"

const Home = () => {

    const rol = localStorage.getItem('rol')

    if(rol === 'COMPRADOR'){
        return <HomeComprador />
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
