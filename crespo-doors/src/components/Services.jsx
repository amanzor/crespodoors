import { motion } from 'framer-motion'
import { ShoppingBag, Wrench, Truck, ArrowUpRight } from 'lucide-react'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'

const SERVICES = [
  {
    icon: ShoppingBag,
    tag: 'Sell',
    title: 'Top-quality product, in top quantity.',
    body: 'A showroom and warehouse stocked with premium vinyl, fiberglass, wood-clad, and impact-rated windows and doors — ready for single-unit homeowners and full-development builders alike.',
    points: ['Volume pricing for builders & contractors', 'Every major style, material & finish', 'Financing available on approved credit'],
  },
  {
    icon: Wrench,
    tag: 'Engineer & Install',
    title: 'Measured, fabricated, and set by our own crews.',
    body: 'Our estimators laser-measure every opening and our installers — full-time employees, never day-labor subs — set each unit to exact tolerance, sealed and flashed to code.',
    points: ['Licensed, factory-trained install teams', 'Structural & wind-load calculations included', 'Permitting & inspection handled for you'],
  },
  {
    icon: Truck,
    tag: 'Deliver',
    title: 'On your schedule, on your jobsite.',
    body: 'A dedicated logistics fleet gets product to residential driveways and active commercial sites on time, protected, and staged exactly where your crew needs it.',
    points: ['Job-site & showroom delivery', '48-hour rush delivery available', 'White-glove unload & placement'],
  },
]

export default function Services() {
  return (
    <section id="services" className="bg-stone-50 py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-maroon-700">What we do</span>
          <h2 className="mt-4 font-display text-4xl font-semibold text-stone-900 sm:text-5xl">
            One company. The entire lifecycle of your opening.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.15)}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.tag}
              variants={fadeUp}
              whileHover={{ y: -10 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="group relative flex flex-col rounded-2xl border border-stone-200 bg-white p-8 shadow-sm"
            >
              <span className="absolute right-6 top-6 font-mono text-xs text-stone-300">0{i + 1}</span>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-maroon-700 text-stone-50 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                <s.icon size={26} strokeWidth={1.75} />
              </div>
              <span className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-maroon-700">{s.tag}</span>
              <h3 className="mt-2 font-display text-xl font-semibold text-stone-900">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">{s.body}</p>
              <ul className="mt-5 space-y-2 border-t border-stone-100 pt-5">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-stone-700">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-maroon-500" />
                    {p}
                  </li>
                ))}
              </ul>
              <a href="#quote" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-maroon-700 transition-colors hover:text-maroon-800">
                Learn more <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
