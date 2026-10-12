import './IconCircle.css'

const IconCircle = ({icono, alt, variante}) => {
    return(
        <div className={'icon-circle icon-circle-' + variante}>
            <img src={icono} alt={alt} />
        </div>
    )
}

export default IconCircle
