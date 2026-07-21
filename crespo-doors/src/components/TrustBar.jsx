import { motion } from 'framer-motion'
import { ShieldCheck, Award, Leaf, Clock3, HardHat, Star } from 'lucide-react'

const ITEMS = [
  { icon: ShieldCheck, label: 'Licensed & Fully Insured' },
  { icon: Leaf, label: 'ENERGY STAR® Partner' },
  { icon: Award, label: '25-Year Craftsmanship Warranty' },
  { icon: HardHat, label: 'In-House Installation Crews' },
  { icon: Clock3, label: '48-Hour Estimate Turnaround' },
  { icon: Star, label: '4.9/5 From 2,300+ Homeowners' },
]

export default function TrustBar() {
  const loop = [...ITEMS, ...ITEMS]
  return (
    <div className="relative overflow-hidden border-y border-stone-800 bg-stone-900 py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-stone-900 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-stone-900 to-transparent" />
      <motion.div
        className="flex w-max gap-14"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {loop.map((item, i) => (
          <div key={i} className="flex shrink-0 items-center gap-2.5 text-stone-400">
            <item.icon size={17} className="text-maroon-400" strokeWidth={1.75} />
            <span className="whitespace-nowrap text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
