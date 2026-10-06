import IconCircle from "../IconCircle/IconCircle"
import './FeatureItem.css'

const FeatureItem = ({icono, iconoAlt, titulo, descripcion}) => {
    return(
        <li className="feature-item">
            <IconCircle icono={icono} alt={iconoAlt} variante="gris" />
            <div>
                <h3 className="feature-item-titulo">{titulo}</h3>
                <p className="feature-item-descripcion">{descripcion}</p>
            </div>
        </li>
    )
}

export default FeatureItem
