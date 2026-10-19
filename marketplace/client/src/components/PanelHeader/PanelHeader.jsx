import Button from "../Button/Button"
import './PanelHeader.css'

const PanelHeader = ({titulo, resumen, textoBoton}) => {

    if(textoBoton){
        return(
            <div className="panel-header">
                <div>
                    <h3 className="panel-header-titulo">{titulo}</h3>
                    <p className="panel-header-resumen">{resumen}</p>
                </div>
                <Button
                texto={textoBoton}
                icono="/icons/flecha-negra.svg"
                iconoAlt="Flecha"
                variante="linea"
                />
            </div>
        )
    }

    return(
        <div className="panel-header">
            <div>
                <h3 className="panel-header-titulo">{titulo}</h3>
                <p className="panel-header-resumen">{resumen}</p>
            </div>
        </div>
    )
}

export default PanelHeader
