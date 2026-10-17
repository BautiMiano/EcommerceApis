import PanelHeader from "../PanelHeader/PanelHeader"
import PanelRow from "../PanelRow/PanelRow"

const masVendidos = [
    {
        producto: 'Chaqueta de cocinero clásica',
        talle: 'M',
        unidades: 38,
        total: '$1.463.000'
    },
    {
        producto: 'Ambo quirúrgico antifluido',
        talle: 'L',
        unidades: 29,
        total: '$1.244.100'
    },
    {
        producto: 'Mameluco de grafa con reflectivos',
        talle: 'XL',
        unidades: 17,
        total: '$931.600'
    }
]

const TopProductsPanel = () => {
    return(
        <article className="panel">
            <PanelHeader titulo="MÁS VENDIDOS" resumen="Ranking por unidades vendidas" />
            <ul className="panel-lista">
                {
                    masVendidos.map((value, index)=>(
                        <PanelRow
                        key={index}
                        titulo={(index + 1) + '. ' + value.producto}
                        detalle={'Talle ' + value.talle + ' · ' + value.unidades + ' unidades'}
                        valor={value.total}
                        />
                    ))
                }
            </ul>
        </article>
    )
}

export default TopProductsPanel
