import { motion } from 'framer-motion'
import { Home, Building2, Store } from 'lucide-react'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'

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
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-maroon-400">Our projects</span>
          <h2 className="mt-4 font-display text-4xl font-semibold text-stone-50 sm:text-5xl">
            Built for every kind of opening.
          </h2>
          <p className="mt-4 text-stone-400">From a single front-door replacement to a 220-unit builder package — the same in-house crews and the same standards on every job.</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.12)}
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3"
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
