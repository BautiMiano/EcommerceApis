import Hero from "../../components/Hero/Hero"
import FeatureBar from "../../components/FeatureBar/FeatureBar"
import CategorySearch from "../../components/CategorySearch/CategorySearch"
import RoleSection from "../../components/RoleSection/RoleSection"
import HomeComprador from "../HomeComprador"

const Home = () => {

    const token = localStorage.getItem('token')
    const rol = localStorage.getItem('userRole')

    if(token && rol === 'COMPRADOR'){
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
