import PanelHeader from "../PanelHeader/PanelHeader"
import PanelRow from "../PanelRow/PanelRow"
import Button from "../Button/Button"

const productos = [
    {
        id: 12,
        nombre: 'Chaqueta de cocinero clásica',
        categoria: 'Gastronomía',
        talle: 'M',
        precio: '$38.500',
        stockDisponible: 24
    },
    {
        id: 15,
        nombre: 'Ambo quirúrgico antifluido',
        categoria: 'Salud',
        talle: 'L',
        precio: '$42.900',
        stockDisponible: 12
    },
    {
        id: 18,
        nombre: 'Mameluco de grafa con reflectivos',
        categoria: 'Mantenimiento',
        talle: 'XL',
        precio: '$54.800',
        stockDisponible: 3
    },
    {
        id: 21,
        nombre: 'Delantal de jean con tiras de cuero',
        categoria: 'Gastronomía',
        talle: 'Único',
        precio: '$13.200',
        stockDisponible: 0
    }
]

const ProductsPanel = () => {
    return(
        <article className="panel">
            <PanelHeader titulo="MIS PRODUCTOS" resumen="21 publicaciones · 18 activas · 3 inactivas" textoBoton="Ver todos" />
            <ul className="panel-lista">
                {
                    productos.map((value)=>(
                        <PanelRow
                        key={value.id}
                        titulo={value.nombre}
                        detalle={value.categoria + ' · Talle ' + value.talle + ' · Stock ' + value.stockDisponible}
                        valor={value.precio}
                        />
                    ))
                }
            </ul>
            <div className="panel-pie">
                <Button
                texto="Nuevo producto"
                icono="/icons/mas-blanco.svg"
                iconoAlt="Ícono de agregar"
                variante="oscuro"
                />
            </div>
        </article>
    )
}

export default ProductsPanel
