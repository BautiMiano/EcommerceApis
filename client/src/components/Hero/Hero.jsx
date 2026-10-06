import Badge from "../Badge/Badge"
import HeroStats from "../HeroStats/HeroStats"
import './Hero.css'

const Hero = () => {
    return(
        <section className="hero">
            <div className="contenedor">
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
        </section>
    )
}

export default Hero
