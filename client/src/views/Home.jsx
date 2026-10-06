import Hero from "../components/Hero/Hero"
import FeatureBar from "../components/FeatureBar/FeatureBar"
import CategorySearch from "../components/CategorySearch/CategorySearch"
import RoleSection from "../components/RoleSection/RoleSection"

const Home = () => {
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
