import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { fadeUp, viewportOnce } from '../lib/motion'

const FAQS = [
  { q: 'Do you handle both sales and installation, or just one?', a: 'Both. Crespo Doors of Engineering sells windows and doors directly from our showroom and warehouse, and our own in-house crews handle measurement, delivery, and installation — no subcontractors, no handoffs.' },
  { q: 'How fast can I get a quote?', a: 'Most on-site estimates are scheduled within 48 hours of your call. You\u2019ll leave the visit with pricing, a timeline, and financing options if you want them.' },
  { q: 'What warranty comes with installation?', a: 'Every install is backed by our 25-year craftsmanship warranty, in addition to the manufacturer\u2019s product warranty on the window or door itself.' },
  { q: 'Can you supply large quantities for a builder or contractor?', a: 'Yes — we stock and can source high-volume orders for new construction and multi-unit developments, with phased delivery scheduled around your framing timeline.' },
  { q: 'Do you install impact and hurricane-rated products?', a: 'Yes. We carry impact-rated windows and doors engineered to meet coastal wind-load codes, including structural calculations and permitting support.' },
  { q: 'What areas do you deliver and install in?', a: 'We deliver and install across the metro region and surrounding counties. Share your zip code with an estimator to confirm your jobsite is in range.' },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="bg-stone-50 py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-maroon-700">FAQ</span>
          <h2 className="mt-4 font-display text-4xl font-semibold text-stone-900 sm:text-5xl">Questions, answered plainly.</h2>
        </motion.div>

        <div className="mt-12 divide-y divide-stone-200 border-y border-stone-200">
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="font-display text-lg font-medium text-stone-900">{item.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-maroon-700 text-stone-50"
                  >
                    <Plus size={16} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-12 leading-relaxed text-stone-600">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
