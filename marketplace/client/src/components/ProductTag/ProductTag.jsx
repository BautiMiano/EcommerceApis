import './ProductTag.css'

const ProductTag = ({categoria, descuento}) => {

    if(descuento){
        return(
            <p className="product-tag product-tag-descuento">{descuento + '% OFF'}</p>
        )
    }

    return(
        <p className="product-tag">{categoria}</p>
    )
}

export default ProductTag
