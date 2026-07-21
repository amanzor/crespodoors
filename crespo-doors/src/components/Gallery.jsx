import { useRef, useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Home, Building2, Store, MoveHorizontal } from 'lucide-react'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'

function BeforeAfterSlider() {
  const containerRef = useRef(null)
  const x = useMotionValue(50)
  const clipPath = useTransform(x, (v) => `inset(0 ${100 - v}% 0 0)`)
  const [dragging, setDragging] = useState(false)

  const updateFromClientX = (clientX) => {
    const rect = containerRef.current.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    x.set(Math.min(100, Math.max(0, pct)))
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-2xl border border-stone-800 bg-stone-950"
      onMouseMove={(e) => dragging && updateFromClientX(e.clientX)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchMove={(e) => updateFromClientX(e.touches[0].clientX)}
    >
      {/* AFTER layer (full) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-stone-900 to-stone-950 p-8">
        <svg viewBox="0 0 200 160" className="h-40 w-auto sm:h-52">
          <rect x="30" y="10" width="140" height="140" rx="2" fill="none" stroke="#b1adaa" strokeWidth="2" />
          <line x1="100" y1="10" x2="100" y2="150" stroke="#b1adaa" strokeWidth="1.5" />
          <line x1="30" y1="80" x2="170" y2="80" stroke="#b1adaa" strokeWidth="1.5" />
          <rect x="34" y="14" width="62" height="62" fill="#832a2d" opacity="0.12" />
          <rect x="104" y="14" width="62" height="62" fill="#832a2d" opacity="0.12" />
          <rect x="34" y="84" width="62" height="62" fill="#832a2d" opacity="0.12" />
          <rect x="104" y="84" width="62" height="62" fill="#832a2d" opacity="0.12" />
        </svg>
        <span className="absolute bottom-5 right-5 rounded-full bg-maroon-700 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-stone-50">
          After &middot; Low-E argon
        </span>
      </div>

      {/* BEFORE layer (clipped) */}
      <motion.div style={{ clipPath }} className="absolute inset-0 flex flex-col items-center justify-center bg-stone-800 p-8">
        <svg viewBox="0 0 200 160" className="h-40 w-auto sm:h-52">
          <rect x="30" y="10" width="140" height="140" rx="2" fill="none" stroke="#726e6d" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="100" y1="10" x2="100" y2="150" stroke="#726e6d" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="30" y1="80" x2="170" y2="80" stroke="#726e6d" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M45 25 L70 55 M60 20 L50 65" stroke="#4a4038" strokeWidth="1.5" />
          <path d="M120 100 L150 130" stroke="#4a4038" strokeWidth="1.5" />
        </svg>
        <span className="absolute bottom-5 left-5 rounded-full bg-stone-700 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-stone-200">
          Before &middot; Single-pane
        </span>
      </motion.div>

      {/* Handle */}
      <motion.div
        style={{ left: useTransform(x, (v) => `${v}%`) }}
        onMouseDown={() => setDragging(true)}
        onTouchStart={() => setDragging(true)}
        className="absolute inset-y-0 z-10 flex w-0 -translate-x-1/2 items-center justify-center"
      >
        <div className="h-full w-0.5 bg-stone-50/70" />
        <div className="absolute flex h-10 w-10 cursor-ew-resize items-center justify-center rounded-full border border-stone-300 bg-stone-50 text-stone-800 shadow-lg">
          <MoveHorizontal size={16} />
        </div>
      </motion.div>
    </div>
  )
}

const PROJECT_TYPES = [
  { icon: Home, title: 'Residential replacement', spec: 'Avg. 14 openings \u00b7 3-day install' },
  { icon: Building2, title: 'New construction, builder package', spec: 'Avg. 220 units \u00b7 phased delivery' },
  { icon: Store, title: 'Commercial storefront', spec: 'Impact-rated \u00b7 code compliance included' },
]

export default function Gallery() {
  return (
    <section id="projects" className="bg-stone-950 py-28 text-stone-100">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-maroon-400">See the difference</span>
          <h2 className="mt-4 font-display text-4xl font-semibold text-stone-50 sm:text-5xl">
            Drag the line. Feel the upgrade.
          </h2>
          <p className="mt-4 text-stone-400">Every replacement swaps drafty, single-pane glass for sealed, Low-E argon units engineered to your exact opening.</p>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="mt-12">
          <BeforeAfterSlider />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.12)}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {PROJECT_TYPES.map((p) => (
            <motion.div key={p.title} variants={fadeUp} whileHover={{ y: -6 }} className="flex items-start gap-4 rounded-xl border border-stone-800 bg-stone-900/60 p-6">
              <p.icon size={22} className="mt-0.5 shrink-0 text-maroon-400" strokeWidth={1.75} />
              <div>
                <h3 className="font-display font-semibold text-stone-50">{p.title}</h3>
                <p className="mt-1 font-mono text-xs text-stone-500">{p.spec}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
