import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { limpiarAvisoProductos, limpiarAvisoCategorias } from '../../redux/slice/ProductSlice'
import { limpiarAvisoOrdenes } from '../../redux/slice/CarritoSlice'

const AvisosPanel = () => {
  const dispatch = useDispatch()
  const avisoProductos = useSelector((state) => state.productos.aviso)
  const avisoCategorias = useSelector((state) => state.categorias.aviso)
  const avisoOrdenes = useSelector((state) => state.ordenes.aviso)

  useEffect(() => {
    avisoProductos && toast[avisoProductos.tipo](avisoProductos.texto)
    avisoProductos && dispatch(limpiarAvisoProductos())
  }, [dispatch, avisoProductos])

  useEffect(() => {
    avisoCategorias && toast[avisoCategorias.tipo](avisoCategorias.texto)
    avisoCategorias && dispatch(limpiarAvisoCategorias())
  }, [dispatch, avisoCategorias])

  useEffect(() => {
    avisoOrdenes && toast[avisoOrdenes.tipo](avisoOrdenes.texto)
    avisoOrdenes && dispatch(limpiarAvisoOrdenes())
  }, [dispatch, avisoOrdenes])

  return null
}

export default AvisosPanel
