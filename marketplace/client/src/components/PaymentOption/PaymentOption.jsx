import './PaymentOption.css'

const PaymentOption = ({valor, nombre, metodoSeleccionado, handleSelect}) => {

    if(valor === metodoSeleccionado){
        return(
            <li className="payment-option">
                <button className="payment-option-activa" onClick={()=>handleSelect(valor)}>{nombre}</button>
            </li>
        )
    }

    return(
        <li className="payment-option">
            <button onClick={()=>handleSelect(valor)}>{nombre}</button>
        </li>
    )
}

export default PaymentOption
