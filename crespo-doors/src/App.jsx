import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TrustBar from './components/TrustBar'
import Services from './components/Services'
import Products from './components/Products'
import Process from './components/Process'
import Stats from './components/Stats'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import CTAForm from './components/CTAForm'
import Footer from './components/Footer'
import MobileCTA from './components/MobileCTA'

export default function App() {
  return (
    <div className="pb-16 lg:pb-0">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <Products />
        <Process />
        <Stats />
        <Gallery />
        <Testimonials />
        <FAQ />
        <CTAForm />
      </main>
      <Footer />
      <MobileCTA />
    </div>
  )
}
