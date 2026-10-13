
import Header from "../components/Header"
import Footer from "../components/Footer"

import Hero from "../components/Hero/Hero"
import FeatureBar from "../components/FeatureBar/FeatureBar"
import CategorySearch from "../components/CategorySearch/CategorySearch"
import RoleSection from "../components/RoleSection/RoleSection"

const Home = () => {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <FeatureBar />
        <CategorySearch />
        <RoleSection />
      </main>

      <Footer />
    </>
  )
}

export default Home
