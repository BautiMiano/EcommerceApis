import './StockStatus.css'

const StockStatus = ({stockDisponible}) => {

    if(stockDisponible === 0){
        return(
            <div className="stock-status stock-status-agotado">
                <div className="stock-status-punto"></div>
                <p>Sin stock por el momento</p>
            </div>
        )
    }

    if(stockDisponible <= 5){
        return(
            <div className="stock-status stock-status-pocas">
                <div className="stock-status-punto"></div>
                <p>{'Últimas ' + stockDisponible + ' u. disponibles'}</p>
            </div>
        )
    }

    return(
        <div className="stock-status">
            <div className="stock-status-punto"></div>
            <p>{stockDisponible + ' u. listas para despacho'}</p>
        </div>
    )
}

export default StockStatus
