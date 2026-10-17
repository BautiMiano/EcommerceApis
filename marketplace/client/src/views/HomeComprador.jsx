import Hero from "../components/Hero/Hero"
import FeatureBar from "../components/FeatureBar/FeatureBar"
import CategorySearch from "../components/CategorySearch/CategorySearch"
import FavoritesSection from "../components/FavoritesSection/FavoritesSection"
import AssistantSection from "../components/AssistantSection/AssistantSection"

const HomeComprador = () => {
    return(
        <main>
            <Hero />
            <FeatureBar />
            <CategorySearch />
            <FavoritesSection />
            <AssistantSection
            titulo="¿BUSCÁS ALGO? PREGUNTALE A UNI"
            descripcion="Pedile recomendaciones de uniformes para tu rubro, consultá en qué estado está tu pedido o cuánto te sale el carrito."
            />
        </main>
    )
}

export default HomeComprador
