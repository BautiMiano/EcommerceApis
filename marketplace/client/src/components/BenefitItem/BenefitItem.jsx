import './BenefitItem.css'

const BenefitItem = ({texto, icono}) => {
    return(
        <li className="benefit-item">
            <img src={icono} alt="Ícono de verificación" />
            <p>{texto}</p>
        </li>
    )
}

export default BenefitItem
