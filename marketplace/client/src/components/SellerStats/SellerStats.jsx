import StatItem from "../StatItem/StatItem"
import './SellerStats.css'

const stats = [
    {valor: '$5,69 M', etiqueta: 'TOTAL FACTURADO'},
    {valor: '64', etiqueta: 'VENTAS CONCRETADAS'},
    {valor: '127', etiqueta: 'UNIDADES VENDIDAS'},
    {valor: '18', etiqueta: 'PUBLICACIONES ACTIVAS'}
]

const SellerStats = () => {
    return(
        <ul className="seller-stats">
            {
                stats.map((value, index)=>(
                    <StatItem
                    key={index}
                    valor={value.valor}
                    etiqueta={value.etiqueta}
                    />
                ))
            }
        </ul>
    )
}

export default SellerStats
