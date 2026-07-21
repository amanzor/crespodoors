import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ClipboardList, Ruler, Factory, Truck, ShieldCheck } from 'lucide-react'
import { fadeUp, viewportOnce } from '../lib/motion'

const STEPS = [
  { icon: ClipboardList, title: 'Free consultation', body: 'Walk your project with an estimator and get straight answers on materials, budget, and timeline — no pressure, no hidden fees.' },
  { icon: Ruler, title: 'Precision measurement & engineering', body: 'Laser measurements and structural calculations turn your opening into an exact, code-compliant spec sheet.' },
  { icon: Factory, title: 'Fabrication & ordering', body: 'Your units are built or ordered to spec from our partner mills and staged in our warehouse for quality control.' },
  { icon: Truck, title: 'Delivery & installation', body: 'Our own trucks and our own licensed crews — never a subcontractor discovering surprises on install day.' },
  { icon: ShieldCheck, title: 'Walkthrough & warranty', body: 'A final inspection with you, paperwork for your records, and a 25-year craftsmanship warranty on file.' },
]

export default function Process() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.4'] })
  const lineHeight = useSpring(scrollYProgress, { stiffness: 80, damping: 22 })

  return (
    <section id="process" className="bg-stone-50 py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-maroon-700">How it works</span>
          <h2 className="mt-4 font-display text-4xl font-semibold text-stone-900 sm:text-5xl">
            From first measurement to final seal.
          </h2>
        </motion.div>

        <div ref={ref} className="relative mt-16">
          <div className="absolute left-6 top-2 bottom-2 w-px bg-stone-200 sm:left-8" />
          <motion.div
            style={{ scaleY: lineHeight }}
            className="absolute left-6 top-2 bottom-2 w-px origin-top bg-maroon-700 sm:left-8"
          />

          <ol className="space-y-14">
            {STEPS.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="relative flex gap-6 pl-16 sm:gap-8 sm:pl-20"
              >
                <span className="absolute left-0 top-0 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-maroon-700 bg-stone-50 font-mono text-sm font-semibold text-maroon-700 sm:h-16 sm:w-16">
                  0{i + 1}
                </span>
                <div className="flex-1 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <step.icon size={20} className="text-maroon-700" strokeWidth={1.75} />
                    <h3 className="font-display text-lg font-semibold text-stone-900">{step.title}</h3>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-stone-600">{step.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
