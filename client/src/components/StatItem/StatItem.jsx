import './StatItem.css'

const StatItem = ({valor, etiqueta}) => {
    return(
        <li className="stat-item">
            <p className="stat-item-valor">{valor}</p>
            <p className="stat-item-etiqueta">{etiqueta}</p>
        </li>
    )
}

export default StatItem
