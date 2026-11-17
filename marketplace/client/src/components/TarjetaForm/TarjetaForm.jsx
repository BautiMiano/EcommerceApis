import CampoFormulario from '../CampoFormulario/CampoFormulario'
import { formatearNumero, formatearTitular, formatearVencimiento, largoCvv, marcaTarjeta, soloDigitos } from '../../utils/tarjeta'
import './TarjetaForm.css'

const TarjetaForm = ({ tarjeta, errores, onCambiar, onEnfocar }) => {
  const marca = marcaTarjeta(tarjeta.numero)

  const campo = (nombre, formatear) => ({
    name: `tarjeta-${nombre}`,
    value: tarjeta[nombre],
    error: errores[`tarjeta-${nombre}`],
    onChange: (evento) => onCambiar(nombre, formatear(evento.target.value)),
    onFocus: () => onEnfocar(nombre),
    onBlur: () => onEnfocar(''),
  })

  return (
    <div className="tarjeta-form">
      <p className="tarjeta-form-aviso">
        <span className="material-symbols-outlined" aria-hidden="true">shield_lock</span>
        Tus datos de tarjeta se validan en el momento y no se guardan en Uniforma.
      </p>

      <div className="tarjeta-form-campos">
        <div className="tarjeta-form-ancho">
          <CampoFormulario
            label="Número de tarjeta"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 5678 9012 3456"
            {...campo('numero', formatearNumero)}
          >
            {marca && <span className="tarjeta-form-marca">{marca}</span>}
          </CampoFormulario>
        </div>
        <div className="tarjeta-form-ancho">
          <CampoFormulario
            label="Nombre como figura en la tarjeta"
            autoComplete="cc-name"
            placeholder="JUAN PÉREZ"
            {...campo('titular', formatearTitular)}
          />
        </div>
        <CampoFormulario
          label="Vencimiento"
          inputMode="numeric"
          autoComplete="cc-exp"
          placeholder="MM/AA"
          {...campo('vencimiento', formatearVencimiento)}
        />
        <CampoFormulario
          label="Código de seguridad"
          inputMode="numeric"
          autoComplete="cc-csc"
          placeholder={marca === 'AMEX' ? '1234' : '123'}
          {...campo('cvv', (valor) => soloDigitos(valor).slice(0, largoCvv(marca)))}
        />
      </div>
    </div>
  )
}

export default TarjetaForm
