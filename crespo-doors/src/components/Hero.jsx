import { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, PlayCircle } from 'lucide-react'
import { easeOut, staggerContainer } from '../lib/motion'

const HEADLINE = ['Doors', 'and', 'windows', 'engineered', 'to', 'outlast', 'the', 'weather.']

const STATS = [
  { value: '18,400+', label: 'Windows & doors installed' },
  { value: '4.9 / 5', label: 'Average customer rating' },
  { value: '25-yr', label: 'Craftsmanship warranty' },
  { value: '48-hr', label: 'On-site estimate turnaround' },
]

function DoorPanel() {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{ perspective: 900 }} className="absolute left-[11.25%] top-[36.5%] h-[57%] w-[25.8%]">
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        initial={{ rotateY: 0, opacity: 0 }}
        animate={{ rotateY: hovered ? -58 : -22, opacity: 1 }}
        transition={{ rotateY: { duration: 0.7, ease: easeOut }, opacity: { delay: 1.4, duration: 0.6 } }}
        style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
        className="h-full w-full cursor-pointer rounded-t-[62px] bg-gradient-to-b from-maroon-600 to-maroon-800 shadow-[inset_0_0_0_2px_rgba(244,242,238,0.15)]"
      >
        <span className="absolute right-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-stone-100/80 shadow-sm" />
      </motion.div>
    </div>
  )
}

function MagneticButton({ href, onClick, children, variant = 'primary' }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 })

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.28)
    y.set((e.clientY - r.top - r.height / 2) * 0.4)
  }
  const reset = () => { x.set(0); y.set(0) }

  const base = 'group relative inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-sm font-semibold transition-colors'
  const styles = variant === 'primary'
    ? 'bg-maroon-700 text-stone-50 shadow-xl shadow-maroon-950/50 hover:bg-maroon-600'
    : 'border border-stone-600 text-stone-100 hover:border-stone-300'

  return (
    <motion.a
      href={href}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`${base} ${styles}`}
    >
      {children}
    </motion.a>
  )
}

export default function Hero() {
  const scrollTo = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="relative overflow-hidden bg-stone-950 pt-36 pb-20 sm:pt-44">
      <div className="blueprint-grid absolute inset-0 opacity-70" />
      <motion.div
        aria-hidden
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-maroon-700/20 blur-[120px]"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-0 bottom-0 h-[380px] w-[380px] rounded-full bg-maroon-500/10 blur-[110px]"
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-16 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-stone-700 bg-stone-900/60 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-maroon-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-maroon-400" />
            Sold &middot; Engineered &middot; Installed &middot; Delivered
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={staggerContainer(0.05)}
            className="font-display text-balance text-5xl font-semibold leading-[1.05] text-stone-50 sm:text-6xl lg:text-[3.6rem]"
          >
            {HEADLINE.map((word, i) => (
              <motion.span
                key={i}
                variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } } }}
                className={`inline-block ${word === 'engineered' ? 'italic text-maroon-400' : ''}`}
              >
                {word}
                {i < HEADLINE.length - 1 ? ' ' : ''}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-stone-400"
          >
            Crespo Doors of Engineering Corp. sells top-quality, top-quantity windows and doors, then measures, fabricates, delivers, and installs every unit with our own in-house crews — never a subcontractor guessing at your opening.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="#quote" onClick={(e) => scrollTo(e, '#quote')} variant="primary">
              Get Your Free Quote
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton href="#projects" onClick={(e) => scrollTo(e, '#projects')} variant="secondary">
              <PlayCircle size={16} />
              See Our Work
            </MagneticButton>
          </motion.div>

          <motion.dl
            initial="hidden"
            animate="show"
            variants={staggerContainer(0.1, 0.9)}
            className="mt-14 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-stone-800 pt-8 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
          >
            {STATS.map((s) => (
              <motion.div key={s.label} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                <dt className="font-display text-2xl font-semibold text-stone-50">{s.value}</dt>
                <dd className="mt-1 text-xs text-stone-500">{s.label}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        <div className="relative mx-auto hidden aspect-[480/460] w-full max-w-[480px] lg:block">
          <svg viewBox="0 0 480 460" className="absolute inset-0 h-full w-full overflow-visible">
            <motion.path
              d="M20,430 L20,170 A130,130 0 0 1 280,170 L280,430 Z"
              fill="none"
              stroke="#832a2d"
              strokeWidth="2.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.6, ease: easeOut }}
            />
            <motion.rect
              x="300" y="180" width="160" height="250" rx="2"
              fill="none" stroke="#726e6d" strokeWidth="2.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.3, ease: easeOut, delay: 0.3 }}
            />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.6 }} stroke="#726e6d" strokeWidth="1.5">
              <line x1="380" y1="180" x2="380" y2="430" />
              <line x1="300" y1="305" x2="460" y2="305" />
            </motion.g>
            <motion.line
              x1="280" y1="220" x2="380" y2="180"
              stroke="#832a2d" strokeWidth="2" strokeDasharray="4 5"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.5, duration: 0.8 }}
            />
            <motion.circle cx="280" cy="220" r="7" fill="#17130f" stroke="#832a2d" strokeWidth="2"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.1, type: 'spring', stiffness: 260, damping: 14 }} />
            <motion.circle cx="330" cy="199" r="5" fill="#17130f" stroke="#832a2d" strokeWidth="2"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.25, type: 'spring', stiffness: 260, damping: 14 }} />

            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3, duration: 0.6 }} className="font-mono" fill="#8d8785" fontSize="9" letterSpacing="1">
              <text x="20" y="448">3'-0" O.D.</text>
              <text x="360" y="448" textAnchor="middle">5'-4" O.D.</text>
              <text x="386" y="200" transform="rotate(90 386 200)">LOW-E &middot; U-0.27</text>
            </motion.g>
          </svg>

          <DoorPanel />

          <motion.div
            initial={{ x: '-120%' }}
            animate={{ x: '260%' }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2.4, ease: 'easeInOut', delay: 2.6 }}
            className="pointer-events-none absolute left-[62.5%] top-[39%] h-[54%] w-[8%] -skew-x-12 bg-gradient-to-r from-transparent via-stone-100/25 to-transparent"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4 }}
        className="relative mx-auto mt-16 flex max-w-7xl justify-center px-5 sm:px-8"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} className="flex flex-col items-center gap-2 text-stone-600">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="h-8 w-px bg-stone-700" />
        </motion.div>
      </motion.div>
    </section>
  )
}
