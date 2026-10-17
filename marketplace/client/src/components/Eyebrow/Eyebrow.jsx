import './Eyebrow.css'

const Eyebrow = ({texto, variante}) => {
    return(
        <p className={'eyebrow eyebrow-' + variante}>{texto}</p>
    )
}

export default Eyebrow
