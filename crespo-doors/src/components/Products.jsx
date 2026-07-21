import { useState, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'
import {
  GlyphSingleHung, GlyphDoubleHung, GlyphSliding, GlyphCasement, GlyphBayBow, GlyphAwning, GlyphImpact,
  GlyphEntry, GlyphFrench, GlyphPatio, GlyphStorm, GlyphBifold,
} from './ProductGlyphs'

const CATALOG = {
  Windows: [
    { Glyph: GlyphSingleHung, name: 'Single-Hung', desc: 'The efficient classic — fixed top sash, operable bottom sash.' },
    { Glyph: GlyphDoubleHung, name: 'Double-Hung', desc: 'Both sashes move for easy cleaning and top-down airflow.' },
    { Glyph: GlyphSliding, name: 'Sliding', desc: 'Wide horizontal glass with a smooth side-to-side glide.' },
    { Glyph: GlyphCasement, name: 'Casement', desc: 'Crank-out design for maximum ventilation and a tight seal.' },
    { Glyph: GlyphBayBow, name: 'Bay & Bow', desc: 'Projects outward to add floor space, light, and curb appeal.' },
    { Glyph: GlyphAwning, name: 'Awning', desc: 'Top-hinged and rain-friendly — ventilate even in a storm.' },
    { Glyph: GlyphImpact, name: 'Impact / Hurricane', desc: 'Laminated, wind-rated glass built for coastal codes.' },
  ],
  Doors: [
    { Glyph: GlyphEntry, name: 'Entry Doors', desc: 'Insulated steel & fiberglass slabs in dozens of profiles.' },
    { Glyph: GlyphFrench, name: 'French Doors', desc: 'Symmetrical double doors with true divided-lite glass.' },
    { Glyph: GlyphPatio, name: 'Sliding Patio', desc: 'Large-format glass panels that glide on a low-profile track.' },
    { Glyph: GlyphStorm, name: 'Storm Doors', desc: 'Retractable-screen protection layered over your entry door.' },
    { Glyph: GlyphImpact, name: 'Impact Doors', desc: 'Reinforced entry systems rated for hurricane-force wind.' },
    { Glyph: GlyphBifold, name: 'Bifold', desc: 'Folding panels that open a full wall to the outdoors.' },
  ],
}

export default function Products() {
  const [tab, setTab] = useState('Windows')
  const layoutId = useId()

  return (
    <section id="products" className="bg-stone-950 py-28 text-stone-100">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-maroon-400">Full catalog</span>
            <h2 className="mt-4 font-display text-4xl font-semibold text-stone-50 sm:text-5xl">
              Every profile, in premium materials.
            </h2>
          </div>

          <div className="inline-flex rounded-full border border-stone-700 bg-stone-900 p-1">
            {Object.keys(CATALOG).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="relative rounded-full px-6 py-2.5 text-sm font-semibold transition-colors"
              >
                {tab === t && (
                  <motion.span layoutId={layoutId} className="absolute inset-0 rounded-full bg-maroon-700" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />
                )}
                <span className={`relative z-10 ${tab === t ? 'text-stone-50' : 'text-stone-400'}`}>{t}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={staggerContainer(0.06)}
            className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {CATALOG[tab].map((item) => (
              <motion.div
                key={item.name}
                variants={fadeUp}
                whileHover={{ y: -6, borderColor: 'rgba(184,93,95,0.6)' }}
                className="group rounded-xl border border-stone-800 bg-stone-900/60 p-6 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-800 transition-transform duration-500 group-hover:scale-110">
                  <item.Glyph />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-stone-50">{item.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-400">{item.desc}</p>
                <a href="#quote" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-maroon-400 opacity-0 transition-opacity group-hover:opacity-100">
                  Request quote <ArrowUpRight size={13} />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
