import { useNavigate } from "react-router-dom"
import RoleCard from "../RoleCard/RoleCard"
import './RoleSection.css'

const beneficios = [
    'Precios mayoristas y descuentos progresivos por volumen para empresas.',
    'Panel para gestionar tu catálogo, stock y pedidos si sos vendedor.',
    'Facturación A y B, cobro garantizado y envíos a todo el país.'
]

const RoleSection = () => {

    const navigate = useNavigate()

    const handleClick = () => {navigate('/registro')}

    return(
        <section className="role-section">
            <div className="contenedor">
                <h2 className="role-section-titulo">COMPRÁ Y VENDÉ UNIFORMES</h2>
                <div className="role-section-tarjetas">
                    <RoleCard
                    variante="oscuro"
                    icono="/icons/tienda-negra.svg"
                    iconoAlt="Ícono de tienda"
                    varianteIcono="claro"
                    etiqueta="PARA EMPRESAS, CONFECCIONISTAS & DISTRIBUIDORES"
                    varianteEtiqueta="claro"
                    titulo="FORMÁ PARTE DE UNIFORMA"
                    descripcion="Hacete comprador o vendedor y sumate al marketplace de uniformes y EPP de Argentina. Las empresas compran indumentaria homologada a precios mayoristas, y los fabricantes y distribuidores publican su catálogo para venderle a todo el país."
                    beneficios={beneficios}
                    iconoBeneficio="/icons/check-lima.svg"
                    textoBoton="Registrarse"
                    iconoBoton="/icons/flecha-negra.svg"
                    iconoBotonAlt="Flecha"
                    varianteBoton="claro"
                    handleClick={handleClick}
                    />
                </div>
            </div>
        </section>
    )
}

export default RoleSection
