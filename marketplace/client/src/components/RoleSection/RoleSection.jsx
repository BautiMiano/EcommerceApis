import Eyebrow from "../Eyebrow/Eyebrow"
import RoleCard from "../RoleCard/RoleCard"
import './RoleSection.css'

const roles = [
    {
        variante: 'claro',
        icono: '/icons/edificio-blanco.svg',
        iconoAlt: 'Ícono de empresa',
        varianteIcono: 'oscuro',
        etiqueta: 'PARA COMPRAS CORPORATIVAS & PROFESIONALES',
        varianteEtiqueta: 'gris',
        titulo: '¿COMPRÁS PARA TU EMPRESA?',
        descripcion: 'Optimizá las compras de uniformes y EPP. Accedé a precios mayoristas por volumen, consolidación de múltiples marcas en un solo envío y facturación unificada con cuenta corriente habilitada.',
        beneficios: [
            'Descuentos progresivos por compras superiores a 20 unidades.',
            'Validación automática de CUIT para emisión de Factura A instantánea.',
            'Muestras físicas a plantas industriales y oficinas sin costo de envío.'
        ],
        iconoBeneficio: '/icons/check-negro.svg',
        textoBoton: 'Registrarse como Comprador',
        iconoBoton: '/icons/flecha-blanca.svg',
        iconoBotonAlt: 'Flecha',
        varianteBoton: 'oscuro'
    },
    {
        variante: 'oscuro',
        icono: '/icons/fabrica-negra.svg',
        iconoAlt: 'Ícono de fábrica',
        varianteIcono: 'claro',
        etiqueta: 'PARA CONFECCIONISTAS & DISTRIBUIDORES',
        varianteEtiqueta: 'claro',
        titulo: '¿FABRICÁS O DISTRIBUÍS INDUMENTARIA?',
        descripcion: 'Publicá tu catálogo técnico y conectá con directores de compras, jefes de seguridad e higiene y pymes de toda la Argentina. Cobro garantizado y logística simplificada.',
        beneficios: [
            'Panel B2B para gestión masiva de stock, curvas de talles y pedidos.',
            'Liquidaciones quincenales transparentes directo a tu CBU.',
            'Validación de homologaciones IRAM/INTI para destacar tus productos.'
        ],
        iconoBeneficio: '/icons/check-lima.svg',
        textoBoton: 'Registrarse como Vendedor',
        iconoBoton: '/icons/tienda-negra.svg',
        iconoBotonAlt: 'Ícono de tienda',
        varianteBoton: 'claro'
    }
]

const RoleSection = () => {
    return(
        <section className="role-section">
            <div className="contenedor">
                <Eyebrow texto="ARQUITECTURA MARKETPLACE" variante="gris" />
                <h2 className="role-section-titulo">ELEGÍ TU ROL EN UNIFORMA</h2>
                <div className="role-section-tarjetas">
                    {
                        roles.map((value, index)=>(
                            <RoleCard
                            key={index}
                            variante={value.variante}
                            icono={value.icono}
                            iconoAlt={value.iconoAlt}
                            varianteIcono={value.varianteIcono}
                            etiqueta={value.etiqueta}
                            varianteEtiqueta={value.varianteEtiqueta}
                            titulo={value.titulo}
                            descripcion={value.descripcion}
                            beneficios={value.beneficios}
                            iconoBeneficio={value.iconoBeneficio}
                            textoBoton={value.textoBoton}
                            iconoBoton={value.iconoBoton}
                            iconoBotonAlt={value.iconoBotonAlt}
                            varianteBoton={value.varianteBoton}
                            />
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default RoleSection
