import StatusTag from "../StatusTag/StatusTag"
import './PanelRow.css'

const PanelRow = ({titulo, detalle, valor, estado}) => {

    if(estado){
        return(
            <li className="panel-row">
                <div>
                    <p className="panel-row-titulo">{titulo}</p>
                    <p className="panel-row-detalle">{detalle}</p>
                </div>
                <div className="panel-row-derecha">
                    <StatusTag estado={estado} />
                    <p className="panel-row-valor">{valor}</p>
                </div>
            </li>
        )
    }

    return(
        <li className="panel-row">
            <div>
                <p className="panel-row-titulo">{titulo}</p>
                <p className="panel-row-detalle">{detalle}</p>
            </div>
            <p className="panel-row-valor">{valor}</p>
        </li>
    )
}

export default PanelRow
