import StatItem from "../StatItem/StatItem"
import './HeroStats.css'

const stats = [
    {valor: '+450', etiqueta: 'FABRICANTES VERIFICADOS'},
    {valor: '100%', etiqueta: 'FACTURAS AFIP A Y B'},
    {valor: '24-48H', etiqueta: 'DESPACHO FEDERAL'},
    {valor: 'IRAM', etiqueta: 'NORMATIVA VIGENTE'}
]

const HeroStats = () => {
    return(
        <ul className="hero-stats">
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

export default HeroStats
