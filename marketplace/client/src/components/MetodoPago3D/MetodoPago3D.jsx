import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { formatoPrecio } from '../../utils/formato'
import { METODO_TARJETA, marcaTarjeta, soloDigitos } from '../../utils/tarjeta'
import '../MetodoPago3D/MetodoPago3D.css'

// Colores e ícono de cada método (solo visual: el nombre del método sale del back).
// Si el back agrega un método nuevo, usa el tema por defecto.
const TEMAS = {
  MERCADOPAGO: { desde: '#00b1ea', hasta: '#0a3d91', acento: '#ffe600', icono: 'account_balance_wallet', particulas: 0x00b1ea },
  TARJETA: { desde: '#2b2b2b', hasta: '#050505', acento: '#e0702c', icono: 'credit_card', particulas: 0xe0702c },
  TRANSFERENCIA: { desde: '#1f7a4d', hasta: '#0b2e1f', acento: '#7ee2a8', icono: 'account_balance', particulas: 0x2e7d32 },
}
const TEMA_POR_DEFECTO = { desde: '#3a3a3a', hasta: '#111111', acento: '#e0702c', icono: 'payments', particulas: 0xe0702c }

const ANCHO = 3.4
const ALTO = 2.14
const PROFUNDIDAD = 0.06

const hayWebGL = () => {
  const canvas = document.createElement('canvas')
  return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')))
}

// Rectángulo con esquinas redondeadas (para el canvas y para la forma 3D)
const trazarRedondeado = (ctx, x, y, ancho, alto, radio) => {
  ctx.beginPath()
  ctx.moveTo(x + radio, y)
  ctx.arcTo(x + ancho, y, x + ancho, y + alto, radio)
  ctx.arcTo(x + ancho, y + alto, x, y + alto, radio)
  ctx.arcTo(x, y + alto, x, y, radio)
  ctx.arcTo(x, y, x + ancho, y, radio)
  ctx.closePath()
}

// Número con los dígitos escritos y puntos en los que faltan: "4111 11•• •••• ••••"
const numeroEnTarjeta = (numero) => {
  const digitos = soloDigitos(numero)
  const molde = marcaTarjeta(numero) === 'AMEX' ? '#### ###### #####' : '#### #### #### ####'
  let indice = 0
  return molde.replace(/#/g, () => {
    const caracter = digitos[indice] || '•'
    indice += 1
    return caracter
  })
}

const pintarFondo = (ctx, w, h, tema, invertido = false) => {
  trazarRedondeado(ctx, 0, 0, w, h, 56)
  ctx.clip()
  const fondo = invertido ? ctx.createLinearGradient(w, 0, 0, h) : ctx.createLinearGradient(0, 0, w, h)
  fondo.addColorStop(0, tema.desde)
  fondo.addColorStop(1, tema.hasta)
  ctx.fillStyle = fondo
  ctx.fillRect(0, 0, w, h)

  // Brillo y círculos decorativos
  ctx.globalAlpha = 0.12
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(w * 0.92, h * 0.05, h * 0.75, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(w * 0.05, h * 1.05, h * 0.45, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1
}

const dibujarChip = (ctx) => {
  const chip = ctx.createLinearGradient(70, 200, 200, 300)
  chip.addColorStop(0, '#f5d27a')
  chip.addColorStop(1, '#b8892d')
  ctx.fillStyle = chip
  trazarRedondeado(ctx, 70, 190, 130, 96, 16)
  ctx.fill()
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'
  ctx.lineWidth = 3
  ctx.strokeRect(100, 208, 70, 60)
}

const dibujarEtiqueta = (ctx, texto, x, y, alineacion = 'left') => {
  ctx.globalAlpha = 0.7
  ctx.fillStyle = '#ffffff'
  ctx.font = '600 24px Inter, system-ui, sans-serif'
  ctx.textAlign = alineacion
  ctx.fillText(texto, x, y)
  ctx.globalAlpha = 1
}

// Frente de la tarjeta de crédito/débito: se va completando con lo que escribe el comprador
const dibujarFrenteTarjeta = (ctx, w, h, { tema, tarjeta, total }) => {
  const marca = marcaTarjeta(tarjeta.numero)

  ctx.fillStyle = '#ffffff'
  ctx.font = '700 64px "Bebas Neue", Impact, sans-serif'
  ctx.fillText('UNIFORMA', 70, 60)

  // Marca de la tarjeta, arriba a la derecha (aparece cuando se reconoce por los primeros números)
  ctx.textAlign = 'right'
  ctx.font = marca === 'VISA' ? 'italic 800 70px Inter, system-ui, sans-serif' : '800 52px Inter, system-ui, sans-serif'
  ctx.fillStyle = marca ? '#ffffff' : 'rgba(255,255,255,0.35)'
  ctx.fillText(marca || 'TARJETA', w - 70, 58)
  ctx.textAlign = 'left'

  dibujarChip(ctx)

  // Total a pagar, al lado del chip
  dibujarEtiqueta(ctx, 'TOTAL A PAGAR', w - 70, 205, 'right')
  ctx.textAlign = 'right'
  ctx.fillStyle = tema.acento
  ctx.font = '700 40px Inter, system-ui, sans-serif'
  ctx.fillText(total, w - 70, 240)
  ctx.textAlign = 'left'

  // Número
  ctx.fillStyle = '#ffffff'
  ctx.font = '600 62px "Courier New", ui-monospace, monospace'
  ctx.fillText(numeroEnTarjeta(tarjeta.numero), 70, 340, w - 140)

  // Titular y vencimiento
  dibujarEtiqueta(ctx, 'TITULAR', 70, h - 150)
  dibujarEtiqueta(ctx, 'VENCE', w - 70, h - 150, 'right')
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 38px Inter, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(tarjeta.titular || 'NOMBRE Y APELLIDO', 70, h - 110, w * 0.6)
  ctx.textAlign = 'right'
  ctx.fillText(tarjeta.vencimiento || 'MM/AA', w - 70, h - 110)
  ctx.textAlign = 'left'
}

// Frente para los demás métodos: nombre del método (del back), titular y total
const dibujarFrenteMetodo = (ctx, w, h, { tema, nombreMetodo, titular, total }) => {
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 64px "Bebas Neue", Impact, sans-serif'
  ctx.fillText('UNIFORMA', 70, 60)

  // Ícono del método (fuente de íconos de la app; si todavía no cargó, se omite)
  if (document.fonts.check('96px "Material Symbols Outlined"')) {
    ctx.fillStyle = tema.acento
    ctx.font = '110px "Material Symbols Outlined"'
    ctx.textAlign = 'right'
    ctx.fillText(tema.icono, w - 70, 50)
    ctx.textAlign = 'left'
  }

  ctx.fillStyle = '#ffffff'
  ctx.font = '700 46px Inter, system-ui, sans-serif'
  ctx.fillText(nombreMetodo, 70, 250, w - 140)

  dibujarEtiqueta(ctx, 'TITULAR', 70, h - 150)
  dibujarEtiqueta(ctx, 'TOTAL A PAGAR', w - 70, h - 150, 'right')
  ctx.font = '700 38px Inter, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillStyle = '#ffffff'
  ctx.fillText((titular || '').toUpperCase(), 70, h - 110, w * 0.5)
  ctx.textAlign = 'right'
  ctx.fillStyle = tema.acento
  ctx.fillText(total, w - 70, h - 110)
  ctx.textAlign = 'left'
}

const dibujarFrente = (canvas, datos) => {
  const ctx = canvas.getContext('2d')
  const { width: w, height: h } = canvas
  ctx.clearRect(0, 0, w, h)
  ctx.save()
  pintarFondo(ctx, w, h, datos.tema)
  ctx.textBaseline = 'top'
  datos.tarjeta ? dibujarFrenteTarjeta(ctx, w, h, datos) : dibujarFrenteMetodo(ctx, w, h, datos)
  ctx.restore()
}

// Dorso: banda magnética y, si es tarjeta, el código de seguridad en la franja de firma
const dibujarDorso = (canvas, { tema, tarjeta }) => {
  const ctx = canvas.getContext('2d')
  const { width: w, height: h } = canvas
  ctx.clearRect(0, 0, w, h)
  ctx.save()
  pintarFondo(ctx, w, h, tema, true)
  ctx.textBaseline = 'top'
  ctx.fillStyle = 'rgba(0,0,0,0.8)'
  ctx.fillRect(0, 90, w, 110)

  if (tarjeta) {
    ctx.fillStyle = '#f3f3f3'
    ctx.fillRect(70, 260, w - 300, 80)
    ctx.fillStyle = '#ffffff'
    trazarRedondeado(ctx, w - 210, 260, 140, 80, 10)
    ctx.fill()
    ctx.fillStyle = '#111111'
    ctx.font = 'italic 700 40px "Courier New", ui-monospace, monospace'
    ctx.textAlign = 'center'
    ctx.fillText(tarjeta.cvv || '•••', w - 140, 280)
    ctx.textAlign = 'left'
    dibujarEtiqueta(ctx, 'CÓDIGO DE SEGURIDAD', w - 70, 355, 'right')
  }

  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.font = '600 28px Inter, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Pago protegido por UNIFORMA', 70, h - 90)
  ctx.restore()
}

// Tarjeta 3D que aparece al elegir un medio de pago: gira al cambiar de método,
// flota, sigue al mouse y tiene un anillo de partículas alrededor.
// Con tarjeta de crédito/débito se completa con los datos que se escriben, y se da vuelta
// para mostrar el código de seguridad cuando se está escribiendo (mostrarDorso).
const MetodoPago3D = ({ metodo, titular, total, datosTarjeta, mostrarDorso = false }) => {
  const contenedorRef = useRef(null)
  const escenaRef = useRef(null)
  const [soportado] = useState(hayWebGL)

  // Se arma la escena una sola vez
  useEffect(() => {
    const contenedor = contenedorRef.current
    if (!soportado || !contenedor) {
      return undefined
    }
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    contenedor.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.set(0, 0, 7.2)

    scene.add(new THREE.AmbientLight(0xffffff, 1.2))
    const luz = new THREE.DirectionalLight(0xffffff, 2.2)
    luz.position.set(3, 4, 5)
    scene.add(luz)
    const luzNaranja = new THREE.PointLight(0xe0702c, 6, 12)
    luzNaranja.position.set(-3, -2, 3)
    scene.add(luzNaranja)

    // Cuerpo de la tarjeta: forma redondeada con volumen
    const forma = new THREE.Shape()
    const r = 0.16
    const x = -ANCHO / 2
    const y = -ALTO / 2
    forma.moveTo(x + r, y)
    forma.lineTo(x + ANCHO - r, y)
    forma.quadraticCurveTo(x + ANCHO, y, x + ANCHO, y + r)
    forma.lineTo(x + ANCHO, y + ALTO - r)
    forma.quadraticCurveTo(x + ANCHO, y + ALTO, x + ANCHO - r, y + ALTO)
    forma.lineTo(x + r, y + ALTO)
    forma.quadraticCurveTo(x, y + ALTO, x, y + ALTO - r)
    forma.lineTo(x, y + r)
    forma.quadraticCurveTo(x, y, x + r, y)
    const cuerpoGeo = new THREE.ExtrudeGeometry(forma, { depth: PROFUNDIDAD, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3 })
    cuerpoGeo.translate(0, 0, -PROFUNDIDAD / 2)
    const cuerpoMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.35 })
    const cuerpo = new THREE.Mesh(cuerpoGeo, cuerpoMat)

    // Caras con la textura dibujada en canvas
    const canvasFrente = document.createElement('canvas')
    canvasFrente.width = 1024
    canvasFrente.height = 644
    const canvasDorso = document.createElement('canvas')
    canvasDorso.width = 1024
    canvasDorso.height = 644
    const texFrente = new THREE.CanvasTexture(canvasFrente)
    const texDorso = new THREE.CanvasTexture(canvasDorso)
    texFrente.colorSpace = THREE.SRGBColorSpace
    texDorso.colorSpace = THREE.SRGBColorSpace
    texFrente.anisotropy = renderer.capabilities.getMaxAnisotropy()

    const caraGeo = new THREE.PlaneGeometry(ANCHO, ALTO)
    const frenteMat = new THREE.MeshStandardMaterial({ map: texFrente, transparent: true, roughness: 0.3, metalness: 0.25 })
    const dorsoMat = new THREE.MeshStandardMaterial({ map: texDorso, transparent: true, roughness: 0.4, metalness: 0.2 })
    const frente = new THREE.Mesh(caraGeo, frenteMat)
    frente.position.z = PROFUNDIDAD / 2 + 0.025
    const dorso = new THREE.Mesh(caraGeo, dorsoMat)
    dorso.rotation.y = Math.PI
    dorso.position.z = -PROFUNDIDAD / 2 - 0.025

    const tarjeta = new THREE.Group()
    tarjeta.add(cuerpo, frente, dorso)
    scene.add(tarjeta)

    // Anillo de partículas
    const cantidad = 260
    const posiciones = new Float32Array(cantidad * 3)
    for (let i = 0; i < cantidad; i += 1) {
      const angulo = (i / cantidad) * Math.PI * 2
      const radio = 2.5 + Math.random() * 0.6
      posiciones[i * 3] = Math.cos(angulo) * radio
      posiciones[i * 3 + 1] = (Math.random() - 0.5) * 0.5
      posiciones[i * 3 + 2] = Math.sin(angulo) * radio
    }
    const particulasGeo = new THREE.BufferGeometry()
    particulasGeo.setAttribute('position', new THREE.BufferAttribute(posiciones, 3))
    const particulasMat = new THREE.PointsMaterial({ color: 0xe0702c, size: 0.045, transparent: true, opacity: 0.85 })
    const particulas = new THREE.Points(particulasGeo, particulasMat)
    particulas.rotation.x = 0.35
    scene.add(particulas)

    // Tamaño según el contenedor
    const ajustar = () => {
      const { clientWidth, clientHeight } = contenedor
      renderer.setSize(clientWidth, clientHeight)
      camera.aspect = clientWidth / clientHeight
      camera.position.z = clientWidth < 420 ? 9 : 7.2
      camera.updateProjectionMatrix()
    }
    ajustar()
    const observador = new ResizeObserver(ajustar)
    observador.observe(contenedor)

    // Inclinación con el mouse
    const mouse = { x: 0, y: 0 }
    const alMover = (evento) => {
      const caja = contenedor.getBoundingClientRect()
      mouse.x = ((evento.clientX - caja.left) / caja.width - 0.5) * 2
      mouse.y = ((evento.clientY - caja.top) / caja.height - 0.5) * 2
    }
    const alSalir = () => { mouse.x = 0; mouse.y = 0 }
    contenedor.addEventListener('pointermove', alMover)
    contenedor.addEventListener('pointerleave', alSalir)

    // Giro al cambiar de método: la cara se redibuja cuando la tarjeta está de espaldas
    const giro = { inicio: 0, activo: false, termino: false, redibujado: true, datos: null }
    // Si está de espaldas (código de seguridad), la tarjeta apunta media vuelta
    const vista = { dorso: false }
    const reloj = new THREE.Clock()
    let cuadro = 0

    const animar = () => {
      cuadro = requestAnimationFrame(animar)
      const t = reloj.getElapsedTime()
      let vuelta = 0
      if (giro.activo) {
        const progreso = Math.min((t - giro.inicio) / 0.9, 1)
        const suave = 1 - (1 - progreso) ** 3
        vuelta = suave * Math.PI * 2
        if (progreso >= 0.4 && !giro.redibujado) {
          dibujarFrente(canvasFrente, giro.datos)
          dibujarDorso(canvasDorso, giro.datos)
          texFrente.needsUpdate = true
          texDorso.needsUpdate = true
          giro.redibujado = true
        }
        giro.termino = progreso >= 1
      }
      const movimiento = reducirMovimiento ? 0 : 1
      const mediaVuelta = vista.dorso ? Math.PI : 0
      const balanceo = vista.dorso ? 0 : Math.sin(t * 0.6) * 0.18 * movimiento
      tarjeta.rotation.y += ((mouse.x * 0.45 + balanceo + vuelta + mediaVuelta) - tarjeta.rotation.y) * (giro.activo ? 1 : 0.08)
      // Al terminar la vuelta completa se descuenta, así no vuelve a girar para atrás
      if (giro.activo && giro.termino) {
        giro.activo = false
        tarjeta.rotation.y -= Math.PI * 2
      }
      tarjeta.rotation.x += ((-mouse.y * 0.3 + 0.12) - tarjeta.rotation.x) * 0.08
      tarjeta.position.y = Math.sin(t * 1.4) * 0.08 * movimiento
      particulas.rotation.y = t * 0.25 * movimiento
      renderer.render(scene, camera)
    }
    animar()

    escenaRef.current = {
      darVuelta: (dorso) => { vista.dorso = dorso },
      // Si cambió el método, la tarjeta gira y cambia de colores.
      // Si solo cambió un texto (por ejemplo el titular), se redibuja sin girar.
      actualizar: (datos) => {
        cuerpoMat.color.set(datos.tema.hasta)
        particulasMat.color.setHex(datos.tema.particulas)
        luzNaranja.color.setHex(datos.tema.particulas)
        if (!giro.datos || reducirMovimiento || giro.datos.valor === datos.valor) {
          dibujarFrente(canvasFrente, datos)
          dibujarDorso(canvasDorso, datos)
          texFrente.needsUpdate = true
          texDorso.needsUpdate = true
          giro.datos = datos
          return
        }
        giro.datos = datos
        giro.inicio = reloj.getElapsedTime()
        giro.activo = true
        giro.redibujado = false
        giro.termino = false
      },
    }

    return () => {
      cancelAnimationFrame(cuadro)
      observador.disconnect()
      contenedor.removeEventListener('pointermove', alMover)
      contenedor.removeEventListener('pointerleave', alSalir)
      ;[cuerpoGeo, caraGeo, particulasGeo, cuerpoMat, frenteMat, dorsoMat, particulasMat, texFrente, texDorso].forEach((recurso) => recurso.dispose())
      renderer.dispose()
      contenedor.removeChild(renderer.domElement)
      escenaRef.current = null
    }
  }, [soportado])

  // Cada vez que cambia el método (o los datos), se actualiza la tarjeta
  useEffect(() => {
    const datos = {
      tema: TEMAS[metodo.valor] || TEMA_POR_DEFECTO,
      valor: metodo.valor,
      nombreMetodo: metodo.nombre,
      titular,
      total: formatoPrecio(total),
      tarjeta: metodo.valor === METODO_TARJETA ? datosTarjeta : null,
    }
    // Espera a que carguen las fuentes para que los textos del canvas salgan bien
    let vigente = true
    document.fonts.ready.then(() => { vigente && escenaRef.current && escenaRef.current.actualizar(datos) })
    return () => { vigente = false }
  }, [metodo, titular, total, datosTarjeta])

  useEffect(() => {
    escenaRef.current && escenaRef.current.darVuelta(mostrarDorso)
  }, [mostrarDorso])

  if (!soportado) {
    return null
  }

  return (
    <div className="metodo-3d">
      <div ref={contenedorRef} className="metodo-3d-lienzo" aria-hidden="true" />
      <p className="metodo-3d-leyenda">
        <span className="material-symbols-outlined" aria-hidden="true">lock</span>
        Vas a pagar con <strong>{metodo.nombre}</strong>
      </p>
    </div>
  )
}

export default MetodoPago3D
