import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Phone, ArrowRight } from 'lucide-react'
import iconLogo from '../assets/icon-logo.png'

const LINKS = [
  { href: '#products', label: 'Products' },
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#projects', label: 'Projects' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#faq', label: 'FAQ' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => { document.documentElement.style.overflow = '' }
  }, [open])

  const handleNav = (e, href) => {
    e.preventDefault()
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${
          scrolled ? 'bg-stone-950/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(244,242,238,0.08)]' : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto max-w-7xl px-5 sm:px-8 h-20 flex items-center justify-between">
          <a href="#home" onClick={(e) => handleNav(e, '#home')} className="flex items-center gap-3 group">
            <img src={iconLogo} alt="Crespo Doors of Engineering" className="h-11 w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:rotate-[8deg]" />
            <span className="hidden sm:flex flex-col leading-none">
              <span className="font-display font-semibold tracking-tight text-stone-50 text-lg">Crespo Doors</span>
              <span className="font-mono text-[10px] tracking-[0.25em] text-maroon-400 uppercase">of Engineering</span>
            </span>
          </a>

          <ul className="hidden lg:flex items-center gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNav(e, link.href)}
                  className="relative px-4 py-2 text-sm font-medium text-stone-300 hover:text-stone-50 transition-colors group"
                >
                  {link.label}
                  <span className="pointer-events-none absolute left-4 right-4 -bottom-0.5 h-px bg-maroon-500 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:18005551234" className="flex items-center gap-2 text-sm text-stone-300 hover:text-stone-50 transition-colors">
              <Phone size={16} strokeWidth={2} />
              <span className="font-mono tracking-wide">(800) 555-1234</span>
            </a>
            <a
              href="#quote"
              onClick={(e) => handleNav(e, '#quote')}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-maroon-700 px-5 py-2.5 text-sm font-semibold text-stone-50 shadow-lg shadow-maroon-950/40 transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Get Free Quote</span>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full border border-stone-700 text-stone-100"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-stone-950/98 backdrop-blur-sm lg:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
              className="flex h-full flex-col items-center justify-center gap-2 px-8"
            >
              {LINKS.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => handleNav(e, link.href)}
                    className="font-display text-4xl text-stone-100 hover:text-maroon-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } }}
                className="mt-6 flex flex-col items-center gap-4"
              >
                <a href="#quote" onClick={(e) => handleNav(e, '#quote')} className="rounded-full bg-maroon-700 px-8 py-3 text-lg font-semibold text-stone-50">
                  Get Free Quote
                </a>
                <a href="tel:18005551234" className="font-mono text-stone-400">(800) 555-1234</a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
