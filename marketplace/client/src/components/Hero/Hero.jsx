import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import Badge from "../Badge/Badge"
import HeroStats from "../HeroStats/HeroStats"
import CaritaUni from "../CaritaUni/CaritaUni"
import Orb from "../ReactBits/Orb/Orb"
import './Hero.css'

const COLORES_ORB = ['#e0702c', '#ffb37a', '#4a1d06']

const Hero = () => {
    const categorias = useSelector((state) => state.categorias.items).slice(0, 6)

    return(
        <section className="hero">
            <div className="contenedor hero-grilla">
                <div className="hero-texto">
                    <Badge texto="PLATAFORMA B2B & B2C DIRECTA DE FÁBRICA" variante="oscuro" />
                    <h1 className="hero-titulo">
                        EL MARKETPLACE LÍDER <br />
                        DE UNIFORMES Y ROPA <br />
                        DE TRABAJO 2025
                    </h1>
                    <p className="hero-descripcion">
                        Conectamos empresas y profesionales con los mejores fabricantes directos de indumentaria laboral: Gastronomía, Salud, Industria, Mantenimiento, Reparto y Logística.
                    </p>
                    <div className="hero-divisor"></div>
                    <HeroStats />
                </div>

                <div className="hero-visual">
                    <Orb colors={COLORES_ORB} backgroundColor="#000000" glow={1.3} size={0.95} hoverIntensity={1.2} />
                </div>
            </div>
        </section>
    )
}

export default Hero
