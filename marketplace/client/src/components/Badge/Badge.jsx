import './Badge.css'

const Badge = ({texto, variante}) => {
    return(
        <div className={'badge badge-' + variante}>
            <div className="badge-punto"></div>
            <p>{texto}</p>
        </div>
    )
}

export default Badge
