import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { limpiarAvisoProductos, limpiarAvisoCategorias } from '../../redux/slice/ProductSlice'
import { limpiarAvisoOrdenes } from '../../redux/slice/CarritoSlice'

// Muestra los avisos que dejan los slices del panel (productos, categorías y ventas) cuando
// termina un llamado, y los limpia. No dibuja nada: va una sola vez en el layout del panel.
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
