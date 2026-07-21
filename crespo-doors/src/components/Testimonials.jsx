import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { fadeUp, viewportOnce } from '../lib/motion'

const REVIEWS = [
  { name: 'Marisol Fernandez', role: 'Homeowner, 12 windows + entry door', quote: 'They measured twice, installed once, and cleaned up better than the crew that built our deck. Our energy bill dropped the first month.', rating: 5 },
  { name: 'Devon Whitaker', role: 'General Contractor, 60-unit build', quote: 'Crespo staged deliveries floor by floor so we never had product sitting in the mud. Their install crew kept our schedule, not the other way around.', rating: 5 },
  { name: 'Priya Nandakumar', role: 'Homeowner, impact windows', quote: 'We wanted hurricane-rated glass without losing the look of the house. They engineered a solution and walked us through every wind-load number.', rating: 5 },
  { name: 'Sam Okafor', role: 'Property Manager, storefront glazing', quote: 'Quantity and quality — that\u2019s rare. We ordered 40 storefront units and every single one arrived on spec and on time.', rating: 4 },
]

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = (dir) => {
    setDirection(dir)
    setIndex((i) => (i + dir + REVIEWS.length) % REVIEWS.length)
  }

  const review = REVIEWS[index]

  return (
    <section id="reviews" className="bg-stone-50 py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="text-center">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-maroon-700">Reviews</span>
          <h2 className="mt-4 font-display text-4xl font-semibold text-stone-900 sm:text-5xl">Homeowners & builders agree.</h2>
        </motion.div>

        <div className="relative mt-14">
          <Quote className="mx-auto mb-4 text-maroon-200" size={40} strokeWidth={1.5} />
          <div className="relative min-h-[220px] overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 60 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -80) go(1)
                  else if (info.offset.x > 80) go(-1)
                }}
                className="absolute inset-0 flex flex-col items-center text-center"
              >
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} className={i < review.rating ? 'fill-maroon-600 text-maroon-600' : 'text-stone-300'} />
                  ))}
                </div>
                <p className="mt-5 max-w-xl font-display text-xl leading-relaxed text-stone-800 sm:text-2xl">
                  "{review.quote}"
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-maroon-700 font-semibold text-stone-50">
                    {review.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-stone-900">{review.name}</p>
                    <p className="text-xs text-stone-500">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button onClick={() => go(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-stone-600 transition-colors hover:border-maroon-700 hover:text-maroon-700">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i) }}
                  className={`h-1.5 rounded-full transition-all ${i === index ? 'w-6 bg-maroon-700' : 'w-1.5 bg-stone-300'}`}
                />
              ))}
            </div>
            <button onClick={() => go(1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-stone-600 transition-colors hover:border-maroon-700 hover:text-maroon-700">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
