import PageTitle from "../components/PageTitle/PageTitle"
import FavoritesCatalog from "../components/FavoritesCatalog/FavoritesCatalog"

const MisFavoritos = () => {
    return(
        <main>
            <PageTitle
            variante="seccion"
            etiqueta="TU CUENTA"
            titulo="MIS FAVORITOS"
            descripcion="Los uniformes que guardaste para más adelante. Cuando estés listo, movelos al carrito."
            />
            <FavoritesCatalog />
        </main>
    )
}

export default MisFavoritos
