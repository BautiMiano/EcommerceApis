import { TALLES_SELECCIONABLES } from '../../utils/talles'
import { MODO_SELECCIONABLES, MODO_UNICO } from '../../utils/productoFormulario'
import './SizeSelector.css'

// Rango S a XXL (uno o varios talles, cada uno con su stock) o talle único: son excluyentes.
// En talle único el stock se carga en "Precio y stock". "reservados" (al editar) avisa lo reservado.
const SizeSelector = ({ formulario, reservados = {}, error, onChange }) => {
  const esUnico = formulario.modoTalle === MODO_UNICO

  const alternarTalle = (talle) => {
    const stocks = { ...formulario.stocks }
    if (talle in stocks) {
      delete stocks[talle]
    } else {
      stocks[talle] = ''
    }
    onChange({ stocks })
  }

  const modos = [
    { valor: MODO_SELECCIONABLES, titulo: 'Rango S a XXL', detalle: 'Permite seleccionar uno o varios talles.' },
    { valor: MODO_UNICO, titulo: 'Talle único', detalle: 'Este producto se vende en un solo talle.' },
  ]

  return (
    <div className="size-selector">
      <div className="size-selector-modos" role="radiogroup" aria-label="Modelo de talles">
        {modos.map((modo) => (
          <label
            key={modo.valor}
            className={'size-selector-modo ' + (formulario.modoTalle === modo.valor ? 'size-selector-modo-activo' : '')}
          >
            <input
              type="radio"
              name="modoTalle"
              checked={formulario.modoTalle === modo.valor}
              onChange={() => onChange({ modoTalle: modo.valor })}
            />
            <span>
              <strong>{modo.titulo}</strong>
              <small>{modo.detalle}</small>
            </span>
          </label>
        ))}
      </div>

      {!esUnico && (
        <div className="size-selector-elegir">
          <p className="size-selector-etiqueta">Seleccioná los talles disponibles <span>*</span></p>
          <div className="size-selector-talles">
            {TALLES_SELECCIONABLES.map((talle) => {
              const elegido = talle in formulario.stocks
              return (
                <div key={talle} className="size-selector-talle">
                  <label className="size-selector-check">
                    <input type="checkbox" checked={elegido} onChange={() => alternarTalle(talle)} />
                    {talle}
                  </label>
                  {elegido && (
                    <label className="size-selector-stock">
                      <span className="visually-hidden">Stock del talle {talle}</span>
                      <input
                        type="number"
                        min={reservados[talle] || 0}
                        step="1"
                        placeholder="Stock"
                        value={formulario.stocks[talle]}
                        onChange={(event) => onChange({ stocks: { ...formulario.stocks, [talle]: event.target.value } })}
                      />
                      {reservados[talle] > 0 && <small>{reservados[talle]} reservado</small>}
                    </label>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {error && <p className="panel-campo-error" role="alert">{error}</p>}
    </div>
  )
}

export default SizeSelector
