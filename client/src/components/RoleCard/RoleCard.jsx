import IconCircle from "../IconCircle/IconCircle"
import Eyebrow from "../Eyebrow/Eyebrow"
import BenefitList from "../BenefitList/BenefitList"
import Button from "../Button/Button"
import './RoleCard.css'

const RoleCard = ({variante, icono, iconoAlt, varianteIcono, etiqueta, varianteEtiqueta, titulo, descripcion, beneficios, iconoBeneficio, textoBoton, iconoBoton, iconoBotonAlt, varianteBoton}) => {
    return(
        <article className={'role-card role-card-' + variante}>
            <IconCircle icono={icono} alt={iconoAlt} variante={varianteIcono} />
            <Eyebrow texto={etiqueta} variante={varianteEtiqueta} />
            <h3 className="role-card-titulo">{titulo}</h3>
            <p className="role-card-descripcion">{descripcion}</p>
            <div className="role-card-divisor"></div>
            <BenefitList beneficios={beneficios} icono={iconoBeneficio} />
            <Button
            texto={textoBoton}
            icono={iconoBoton}
            iconoAlt={iconoBotonAlt}
            variante={varianteBoton}
            />
        </article>
    )
}

export default RoleCard
