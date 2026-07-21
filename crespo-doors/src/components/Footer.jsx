import { motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import fullLogo from '../assets/full-logo.png'

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...props}>
      <path d="M13.5 21v-8.2h2.75l.41-3.2h-3.16V7.55c0-.93.26-1.56 1.59-1.56h1.7V3.14C16.5 3.1 15.55 3 14.43 3c-2.33 0-3.93 1.42-3.93 4.03v2.57H7.75v3.2h2.75V21h3z" />
    </svg>
  )
}
function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width={16} height={16} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}
function LinkedinIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3.2 9.5h3.55V21H3.2V9.5Zm6.4 0h3.4v1.57h.05c.47-.9 1.63-1.86 3.36-1.86 3.6 0 4.26 2.37 4.26 5.45V21h-3.55v-5.4c0-1.29-.02-2.94-1.79-2.94-1.8 0-2.07 1.4-2.07 2.85V21H9.6V9.5Z" />
    </svg>
  )
}

const COLUMNS = [
  {
    title: 'Products',
    links: ['Windows', 'Doors', 'Impact / Hurricane', 'Storm Doors', 'Bay & Bow'],
  },
  {
    title: 'Services',
    links: ['Sales & Consultation', 'Engineering & Measurement', 'Installation', 'Delivery & Logistics', 'Warranty Support'],
  },
  {
    title: 'Company',
    links: ['Our Process', 'Reviews', 'FAQ', 'Careers', 'Contact'],
  },
]

const AREAS = ['Metro Core', 'North County', 'South County', 'Coastal District', 'Builder & Commercial']

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  const scrollTo = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-stone-900 pt-20 text-stone-400">
      <button
        onClick={scrollTop}
        aria-label="Back to top"
        className="group absolute -top-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-maroon-700 text-stone-50 shadow-xl shadow-maroon-950/40 transition-transform hover:-translate-y-1"
      >
        <ArrowUp size={18} className="transition-transform group-hover:-translate-y-0.5" />
      </button>

      <div className="mx-auto max-w-7xl px-5 pb-14 sm:px-8">
        <div className="grid grid-cols-1 gap-12 border-b border-stone-800 pb-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <img src={fullLogo} alt="Crespo Doors of Engineering Corp." className="h-20 w-auto" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              Top-quality, top-quantity windows and doors — sold, engineered, delivered, and installed by one accountable team.
            </p>
            <div className="mt-6 flex gap-3">
              {[FacebookIcon, InstagramIcon, LinkedinIcon].map((Icon, i) => (
                <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-700 transition-colors hover:border-maroon-500 hover:text-maroon-400">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-stone-500">{col.title}</h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm transition-colors hover:text-stone-100">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <span className="text-stone-500">Serving:</span>
            {AREAS.map((a, i) => (
              <span key={a} className="text-stone-400">
                {a}{i < AREAS.length - 1 ? ' \u00b7' : ''}
              </span>
            ))}
          </div>
          <p className="text-xs text-stone-600">&copy; {new Date().getFullYear()} Crespo Doors of Engineering Corp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
