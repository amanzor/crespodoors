import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Phone, ArrowRight } from 'lucide-react'

export default function MobileCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 flex items-stretch gap-px border-t border-stone-800 bg-stone-950/95 backdrop-blur-md lg:hidden"
        >
          <a href="tel:18005551234" className="flex flex-1 items-center justify-center gap-2 py-4 text-sm font-semibold text-stone-100">
            <Phone size={16} /> Call Now
          </a>
          <a
            href="#quote"
            onClick={(e) => scrollTo(e, '#quote')}
            className="flex flex-1 items-center justify-center gap-2 bg-maroon-700 py-4 text-sm font-semibold text-stone-50"
          >
            Get Free Quote <ArrowRight size={15} />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
