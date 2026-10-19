import PanelHeader from "../PanelHeader/PanelHeader"
import PanelRow from "../PanelRow/PanelRow"

const totalPorMes = [
    {mes: 'Octubre 2026', porcentaje: '11%', total: '$648.300'},
    {mes: 'Septiembre 2026', porcentaje: '37%', total: '$2.105.300'},
    {mes: 'Agosto 2026', porcentaje: '30%', total: '$1.692.500'},
    {mes: 'Julio 2026', porcentaje: '22%', total: '$1.248.000'}
]

const MonthlySalesPanel = () => {
    return(
        <article className="panel">
            <PanelHeader titulo="VENTAS POR MES" resumen="Últimos 4 meses · octubre en curso" />
            <ul className="panel-lista">
                {
                    totalPorMes.map((value, index)=>(
                        <PanelRow
                        key={index}
                        titulo={value.mes}
                        detalle={value.porcentaje + ' del total facturado'}
                        valor={value.total}
                        />
                    ))
                }
            </ul>
        </article>
    )
}

export default MonthlySalesPanel
