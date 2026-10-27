import Hero from "../components/Hero/Hero"
import FeatureBar from "../components/FeatureBar/FeatureBar"
import CategorySearch from "../components/CategorySearch/CategorySearch"
import FavoritesSection from "../components/FavoritesSection/FavoritesSection"

const HomeComprador = () => {
    return(
        <main>
            <Hero />
            <FeatureBar />
            <CategorySearch />
            <FavoritesSection />
        </main>
    )
}

export default HomeComprador
