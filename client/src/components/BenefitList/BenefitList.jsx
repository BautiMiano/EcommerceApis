import BenefitItem from "../BenefitItem/BenefitItem"
import './BenefitList.css'

const BenefitList = ({beneficios, icono}) => {
    return(
        <ul className="benefit-list">
            {
                beneficios.map((value, index)=>(
                    <BenefitItem
                    key={index}
                    texto={value}
                    icono={icono}
                    />
                ))
            }
        </ul>
    )
}

export default BenefitList
