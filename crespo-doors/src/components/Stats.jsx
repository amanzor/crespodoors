import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { fadeUp, staggerContainer, viewportOnce } from '../lib/motion'

function Counter({ to, decimals = 0, suffix = '', prefix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [inView, to])

  return (
    <span ref={ref}>
      {prefix}{val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{suffix}
    </span>
  )
}

const STATS = [
  { to: 22, suffix: '', label: 'Years engineering doors & windows' },
  { to: 18400, suffix: '+', label: 'Units sold, delivered & installed' },
  { to: 98, suffix: '%', label: 'Customers who\u2019d refer a friend' },
  { to: 4.9, decimals: 1, suffix: ' / 5', label: 'Average verified review rating' },
]

export default function Stats() {
  return (
    <section className="bg-maroon-800 py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={staggerContainer(0.12)}
          className="grid grid-cols-2 gap-10 lg:grid-cols-4"
        >
          {STATS.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="text-center lg:text-left">
              <div className="font-display text-4xl font-bold text-stone-50 sm:text-5xl">
                <Counter to={s.to} decimals={s.decimals} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-sm text-maroon-200">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
