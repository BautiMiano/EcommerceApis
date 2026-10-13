import PageHeader from "../components/PageHeader/PageHeader"
import FavoritesCatalog from "../components/FavoritesCatalog/FavoritesCatalog"

const MisFavoritos = () => {
    return(
        <main>
            <PageHeader
            etiqueta="TU CUENTA"
            titulo="MIS FAVORITOS"
            descripcion="Los uniformes que guardaste para más adelante. Cuando estés listo, movelos al carrito."
            />
            <FavoritesCatalog />
        </main>
    )
}

export default MisFavoritos
