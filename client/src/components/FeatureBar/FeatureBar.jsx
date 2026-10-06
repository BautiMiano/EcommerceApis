import FeatureItem from "../FeatureItem/FeatureItem"
import './FeatureBar.css'

const features = [
    {
        icono: '/icons/envios.svg',
        iconoAlt: 'Ícono de envíos',
        titulo: 'Envíos directos',
        descripcion: 'De fábrica a plantas y depósitos de todo el país.'
    },
    {
        icono: '/icons/factura.svg',
        iconoAlt: 'Ícono de facturación',
        titulo: 'Facturación A y B',
        descripcion: 'Discriminación de IVA y gestión corporativa CUIT.'
    },
    {
        icono: '/icons/escudo-check.svg',
        iconoAlt: 'Ícono de normativa',
        titulo: 'IRAM / ISO 9001',
        descripcion: 'EPP y textiles homologados bajo normativa estricta.'
    },
    {
        icono: '/icons/garantia.svg',
        iconoAlt: 'Ícono de garantía',
        titulo: 'Garantía de Fábrica',
        descripcion: 'Respaldo directo de confección y durabilidad técnica.'
    }
]

const FeatureBar = () => {
    return(
        <section className="feature-bar">
            <ul className="contenedor feature-bar-lista">
                {
                    features.map((value, index)=>(
                        <FeatureItem
                        key={index}
                        icono={value.icono}
                        iconoAlt={value.iconoAlt}
                        titulo={value.titulo}
                        descripcion={value.descripcion}
                        />
                    ))
                }
            </ul>
        </section>
    )
}

export default FeatureBar
