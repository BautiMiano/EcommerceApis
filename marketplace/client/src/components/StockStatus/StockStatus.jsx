import './StockStatus.css'

const StockStatus = ({ nivelStock, mensajeStock }) => {
    return (
        <div className={`stock-status stock-status-${nivelStock}`}>
            <div className="stock-status-punto"></div>
            <p>{mensajeStock}</p>
        </div>
    )
}

export default StockStatus