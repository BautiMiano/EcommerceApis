import './CaritaUni.css'

const CaritaUni = ({ tamano }) => {
    const tamanoDibujo = tamano *0.9

    return (
        <span className="carita-uni" style={{ width: tamano, height: tamano }}>
            <img src="/icons/carita-uni.svg" width={tamanoDibujo} height={tamanoDibujo} alt="" />
        </span>
    )
}

export default CaritaUni