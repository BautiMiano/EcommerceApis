import './CaritaUni.css'

const CaritaUni = ({ tamano }) => {
    return (
        <span className="carita-uni" style={{ width: tamano, height: tamano }}>
            <img src="/icons/carita-uni.png" width={tamano} height={tamano} alt="" />
            <img src="/icons/carita-uni-guino.png" width={tamano} height={tamano} alt=""
                className="carita-uni-guino" />
        </span>
    )
}

export default CaritaUni
