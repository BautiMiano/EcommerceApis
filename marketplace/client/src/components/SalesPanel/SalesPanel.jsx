import PanelHeader from "../PanelHeader/PanelHeader"
import PanelRow from "../PanelRow/PanelRow"

const ventas = [
    {
        ordenId: 1064,
        fecha: '12/10/2026',
        estado: 'CONFIRMADA',
        producto: 'Chaqueta de cocinero clásica',
        talle: 'M',
        cantidad: 3,
        subtotal: '$115.500'
    },
    {
        ordenId: 1063,
        fecha: '11/10/2026',
        estado: 'ENVIADA',
        producto: 'Ambo quirúrgico antifluido',
        talle: 'L',
        cantidad: 2,
        subtotal: '$85.800'
    },
    {
        ordenId: 1061,
        fecha: '09/10/2026',
        estado: 'ENVIADA',
        producto: 'Mameluco de grafa con reflectivos',
        talle: 'XL',
        cantidad: 1,
        subtotal: '$54.800'
    },
    {
        ordenId: 1058,
        fecha: '06/10/2026',
        estado: 'ENTREGADA',
        producto: 'Chaqueta de cocinero clásica',
        talle: 'M',
        cantidad: 5,
        subtotal: '$192.500'
    }
]

const SalesPanel = () => {
    return(
        <article className="panel">
            <PanelHeader titulo="HISTORIAL DE VENTAS" resumen="64 ventas concretadas" textoBoton="Ver historial" />
            <ul className="panel-lista">
                {
                    ventas.map((value, index)=>(
                        <PanelRow
                        key={index}
                        titulo={value.producto}
                        detalle={'Orden #' + value.ordenId + ' · ' + value.fecha + ' · Talle ' + value.talle + ' · ' + value.cantidad + ' u.'}
                        estado={value.estado}
                        valor={value.subtotal}
                        />
                    ))
                }
            </ul>
        </article>
    )
}

export default SalesPanel
