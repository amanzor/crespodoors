import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowRight, PlayCircle, ChevronsDown, FastForward } from 'lucide-react'
import { easeOut, staggerContainer } from '../lib/motion'
import DoorScene from './intro/DoorScene'
import { STEPS, SCREWS, T, cameraAt, progress, stepAt, lerp } from './intro/timeline'

const BASE = import.meta.env.BASE_URL
const POSTER = `${BASE}intro/interior.jpg`

const HEADLINE = ['Doors', 'and', 'windows', 'engineered', 'to', 'outlast', 'the', 'weather.']

const STATS = [
  { value: '18,400+', label: 'Windows & doors installed' },
  { value: '4.9 / 5', label: 'Average customer rating' },
  { value: '25-yr', label: 'Craftsmanship warranty' },
  { value: '48-hr', label: 'On-site estimate turnaround' },
]

const scrollTo = (e, href) => {
  e.preventDefault()
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
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
    : 'border border-stone-300/50 bg-stone-950/30 text-stone-100 backdrop-blur-sm hover:border-stone-100'

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

/** The headline block that greets visitors once they've stepped inside. */
function HeroContent({ show, afterIntro = true }) {
  const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } } }
  return (
    <motion.div
      initial="hidden"
      animate={show ? 'show' : 'hidden'}
      variants={staggerContainer(0.08)}
      className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-5 pt-20 sm:px-8"
    >
      <div className="max-w-2xl">
        <motion.div
          variants={item}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-100/15 bg-stone-950/50 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-maroon-200 backdrop-blur-sm sm:text-[11px]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-maroon-400" />
          Welcome to Crespo Doors of Engineering
        </motion.div>

        <motion.h1
          variants={staggerContainer(0.05)}
          className="font-display text-balance text-[2.6rem] font-semibold leading-[1.04] text-stone-50 drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)] sm:text-6xl lg:text-[4.1rem]"
        >
          {HEADLINE.map((word, i) => (
            <motion.span
              key={i}
              variants={item}
              className={`inline-block ${word === 'engineered' ? 'italic text-maroon-300' : ''}`}
            >
              {word}
              {i < HEADLINE.length - 1 ? ' ' : ''}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p variants={item} className="mt-5 max-w-lg text-base leading-relaxed text-stone-300 sm:mt-6 sm:text-lg">
          {afterIntro ? 'You just watched it happen: we' : 'Crespo Doors of Engineering Corp.'} measure, engineer, deliver, and install every unit with our own in-house crews — never a subcontractor guessing at your opening.
        </motion.p>

        <motion.div variants={item} className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4">
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
          variants={staggerContainer(0.08, 0.2)}
          className="mt-9 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-stone-100/15 pt-6 sm:mt-12 sm:grid-cols-4 sm:pt-8"
        >
          {STATS.map((s) => (
            <motion.div key={s.label} variants={item}>
              <dt className="font-display text-xl font-semibold text-stone-50 sm:text-2xl">{s.value}</dt>
              <dd className="mt-1 text-[11px] text-stone-400 sm:text-xs">{s.label}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </motion.div>
  )
}

function useViewport() {
  const read = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    return { w, h, unit: Math.min(h * 0.0029, w * 0.0072) }
  }
  const [vp, setVp] = useState(read)
  useEffect(() => {
    const onResize = () => {
      setVp((prev) => {
        const next = read()
        // ignore mobile URL-bar show/hide so the scene doesn't jump mid-scroll
        if (next.w === prev.w && Math.abs(next.h - prev.h) < 140) return prev
        return next
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return vp
}

/** Smallest scale at which the arched opening (centred on 50,120) covers the viewport. */
function coverScale({ w, h, unit }) {
  const covers = (S) => {
    const hw = w / (2 * S * unit)
    const hh = h / (2 * S * unit)
    if (hw > 42 || 120 + hh > 214) return false
    const top = 120 - hh
    if (top < 50) {
      const dy = 50 - top
      if (hw * hw + dy * dy > 42 * 42) return false
    }
    return true
  }
  let lo = 0.5
  let hi = 60
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    if (covers(mid)) hi = mid
    else lo = mid
  }
  return hi * 1.04
}

function Hud({ s, onSkip }) {
  const [state, setState] = useState({ step: 0, screws: 0, sealed: false })
  useMotionValueEvent(s, 'change', (v) => {
    const next = {
      step: stepAt(v),
      screws: SCREWS.filter((k) => v >= k.at[1]).length,
      sealed: v >= T.seal[1],
    }
    setState((prev) => (prev.step === next.step && prev.screws === next.screws && prev.sealed === next.sealed ? prev : next))
  })
  const opacity = useTransform(s, (v) => 1 - progress(v, [0.76, 0.82]))
  const hint = useTransform(s, (v) => 1 - progress(v, [0.005, 0.03]))
  const intro = useTransform(s, (v) => 1 - progress(v, [0.004, 0.035]))
  const introY = useTransform(s, (v) => -60 * progress(v, [0.004, 0.035]))
  const captionIn = useTransform(s, (v) => progress(v, [0.02, 0.045]))
  const rail = useTransform(s, (v) => progress(v, [0, 0.68]))
  const step = STEPS[state.step]

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0 z-20">
      {/* mobile chip */}
      <div className="absolute inset-x-0 top-24 flex justify-center lg:hidden">
        <div className="flex items-center gap-3 rounded-full border border-stone-700/80 bg-stone-950/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400 backdrop-blur">
          <span className="text-maroon-300">{step.n}/06</span>
          <span className="text-stone-200">{step.label}</span>
          <span className="h-3 w-px bg-stone-700" />
          <span>Screws {String(state.screws).padStart(2, '0')}/{SCREWS.length}</span>
        </div>
      </div>

      {/* step rail */}
      <div className="absolute left-8 top-1/2 hidden -translate-y-1/2 lg:block xl:left-12">
        <div className="relative pl-6">
          <div className="absolute left-0 top-1 bottom-1 w-px bg-stone-800" />
          <motion.div style={{ scaleY: rail }} className="absolute left-0 top-1 bottom-1 w-px origin-top bg-maroon-500" />
          <ul className="space-y-4">
            {STEPS.map((st, i) => (
              <li key={st.n} className={`flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-300 ${i === state.step ? 'text-stone-50' : i < state.step ? 'text-stone-500' : 'text-stone-700'}`}>
                <span className={i <= state.step ? 'text-maroon-400' : ''}>{st.n}</span>
                {st.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* spec readouts */}
      <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 space-y-5 text-right font-mono text-[10px] uppercase tracking-[0.22em] text-stone-500 lg:block xl:right-12">
        <div>
          <div>Screws driven</div>
          <div className="mt-1 font-display text-3xl normal-case tracking-normal text-stone-100 tabular-nums">
            {String(state.screws).padStart(2, '0')}<span className="text-stone-600">/{SCREWS.length}</span>
          </div>
        </div>
        <div>
          <div>Tolerance</div>
          <div className="mt-1 text-sm text-stone-200">± 1/32″</div>
        </div>
        <div>
          <div>Air seal</div>
          <div className={`mt-1 text-sm ${state.sealed ? 'text-emerald-400' : 'text-maroon-300'}`}>{state.sealed ? 'Sealed · U-0.27' : 'Open'}</div>
        </div>
      </div>

      {/* caption */}
      <motion.div style={{ opacity: captionIn }} className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent px-5 pb-8 pt-24 sm:px-8 lg:bg-none lg:pb-12">
        <div className="mx-auto max-w-7xl lg:pl-44">
          <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.45, ease: easeOut }}
              className="max-w-xl"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-maroon-300">Step {step.n} · {step.label}</div>
              <div className="mt-2 font-display text-2xl font-semibold leading-tight text-stone-50 sm:text-4xl">{step.title}</div>
              <div className="mt-2 font-mono text-[11px] text-stone-400 sm:text-xs">{step.spec}</div>
            </motion.div>
        </div>
      </motion.div>

      {/* opening statement */}
      <motion.div style={{ opacity: intro, y: introY }} className="absolute inset-x-0 top-[24%] px-6 text-center sm:top-[30%]">
        <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-maroon-300 sm:text-[11px]">Crespo Doors of Engineering</div>
        <div className="mx-auto mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] text-stone-50 sm:text-6xl">
          We don’t just sell doors.<br /><span className="italic text-maroon-400">We engineer them.</span>
        </div>
      </motion.div>

      {/* scroll hint */}
      <motion.div style={{ opacity: hint }} className="absolute inset-x-0 top-[52%] flex flex-col items-center gap-3 text-stone-400 sm:top-[58%]">
        <span className="font-mono text-[10px] uppercase tracking-[0.35em]">Scroll to build your door</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronsDown size={18} className="text-maroon-400" />
        </motion.span>
      </motion.div>

      <button
        type="button"
        onClick={onSkip}
        className="pointer-events-auto absolute bottom-8 right-5 hidden items-center gap-2 rounded-full border border-stone-700 bg-stone-950/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400 backdrop-blur transition-colors hover:border-stone-400 hover:text-stone-100 sm:inline-flex sm:right-8"
      >
        Skip intro <FastForward size={13} />
      </button>
    </motion.div>
  )
}

function DoorIntro() {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const vp = useViewport()
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const s = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.35, restDelta: 0.00005 })

  const cover = coverScale(vp)
  const endScale = cover * 1.3
  const endRef = useRef(endScale)
  endRef.current = endScale

  const toCamera = (v) => {
    const [fx, fy, S, ry, rx] = cameraAt(v, endRef.current)
    return `rotateX(${rx}deg) rotateY(${ry}deg) scale3d(${S}, ${S}, ${S}) translate3d(calc(var(--u) * ${-fx}), calc(var(--u) * ${-fy}), 0)`
  }
  const camera = useMotionValue(toCamera(0))
  useEffect(() => { camera.set(toCamera(s.get())); clip.set(toClip(s.get())) }) // keep in sync after resizes

  const stickyRef = useRef(null)
  const clip = useMotionValue('inset(50%)')
  // The camera is square-on (no rotation) whenever the doorway is open, so the
  // opening projects to a plain rectangle with a semicircular top.
  const toClip = (v) => {
    const el = stickyRef.current
    const W = el ? el.clientWidth : vp.w
    const H = el ? el.clientHeight : vp.h
    const [fx, fy, S] = cameraAt(v, endRef.current)
    const k = vp.unit * S
    const L = W / 2 + (8 - fx) * k
    const R = W / 2 + (92 - fx) * k
    const Tp = H / 2 + (8 - fy) * k
    const B = H / 2 + (214 - fy) * k
    if (S >= cover) return 'none'
    const r = 42 * k
    return `inset(${Tp}px ${W - R}px ${H - B}px ${L}px round ${r}px ${r}px 0 0)`
  }
  const [heroOn, setHeroOn] = useState(false)
  const seek = useRef({ busy: false, target: 0 })

  useMotionValueEvent(s, 'change', (v) => {
    camera.set(toCamera(v))
    if (v >= T.swing[0] - 0.01) clip.set(toClip(v))
    setHeroOn(v >= T.hero[0])

    const vid = videoRef.current
    if (!vid || !vid.duration) return
    const t = progress(v, T.video) * (vid.duration - 0.05)
    seek.current.target = t
    if (!seek.current.busy && Math.abs(vid.currentTime - t) > 1 / 48) {
      seek.current.busy = true
      vid.currentTime = t
    }
  })

  const onSeeked = () => {
    const vid = videoRef.current
    seek.current.busy = false
    if (vid && Math.abs(vid.currentTime - seek.current.target) > 1 / 48) {
      seek.current.busy = true
      vid.currentTime = seek.current.target
    }
  }

  const grid = useTransform(s, (v) => 1 - progress(v, T.gridOut))
  const bloom = useTransform(s, (v) => (v < 0.86 ? progress(v, [0.78, 0.86]) * 0.5 : lerp(0.5, 0, progress(v, [0.86, 0.96]))))
  const shade = useTransform(s, (v) => progress(v, T.hero))

  const skip = () => {
    const el = sectionRef.current
    if (!el) return
    window.scrollTo({ top: el.offsetTop + el.offsetHeight - window.innerHeight, behavior: 'smooth' })
  }

  const interior = useTransform(s, (v) => progress(v, [T.swing[0], T.swing[0] + 0.008]))
  const videoScale = useTransform(s, (v) => 1.12 - 0.12 * progress(v, [T.swing[0], 1]))
  const glare = useTransform(s, (v) => (v < 0.74 ? progress(v, [0.715, 0.74]) * 0.9 : lerp(0.9, 0, progress(v, [0.74, 0.9]))))
  const small = vp.w < 900
  const video = (
    <motion.video
      ref={videoRef}
      src={`${BASE}intro/${small ? 'walkthrough-sm' : 'walkthrough'}.mp4`}
      poster={POSTER}
      muted
      playsInline
      preload="auto"
      onSeeked={onSeeked}
      onLoadedMetadata={() => { videoRef.current.currentTime = 0.001 }}
      className="absolute inset-0 h-full w-full object-cover"
      style={{ scale: videoScale }}
    />
  )

  return (
    <section id="home" ref={sectionRef} className="relative bg-stone-950" style={{ height: small ? '620vh' : '720vh' }}>
      <div ref={stickyRef} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* backdrop */}
        <motion.div style={{ opacity: grid }} className="absolute inset-0">
          <div className="blueprint-grid absolute inset-0 opacity-70" />
          <div className="absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-maroon-700/20 blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-[380px] w-[380px] rounded-full bg-maroon-500/10 blur-[110px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(23,19,15,0.85)_100%)]" />
        </motion.div>

        {/* the showroom, seen through the doorway */}
        <motion.div style={{ clipPath: clip, opacity: interior }} className="absolute inset-0 overflow-hidden bg-stone-950">
          {video}
          <motion.div
            style={{ opacity: glare }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,236,210,1)_0%,rgba(255,200,140,0.75)_35%,rgba(255,170,110,0.25)_70%,transparent_100%)]"
          />
        </motion.div>

        {/* 3D stage */}
        <div className="absolute inset-0" style={{ perspective: '1800px' }} aria-hidden>
          <DoorScene s={s} camera={camera} unit={vp.unit} />
        </div>

        {/* light bloom as the door opens */}
        <motion.div
          style={{ opacity: bloom }}
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,226,190,0.9)_0%,rgba(255,190,130,0.35)_45%,transparent_75%)] mix-blend-screen"
        />

        {/* legibility shade behind the headline */}
        <motion.div
          style={{ opacity: shade }}
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(23,19,15,0.88)_0%,rgba(23,19,15,0.6)_45%,rgba(23,19,15,0.1)_100%)]"
        />
        <motion.div style={{ opacity: shade }} className="pointer-events-none absolute inset-0 bg-stone-950/45 sm:hidden" />
        <motion.div style={{ opacity: shade }} className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-stone-950/80 to-transparent" />

        <Hud s={s} onSkip={skip} />

        <div className={`absolute inset-0 z-30 ${heroOn ? '' : 'pointer-events-none'}`}>
          <HeroContent show={heroOn} />
        </div>
      </div>
    </section>
  )
}

/** Reduced-motion visitors get the finished scene straight away. */
function StaticHero() {
  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-stone-950">
      <img src={POSTER} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,19,15,0.9)_0%,rgba(23,19,15,0.6)_50%,rgba(23,19,15,0.15)_100%)]" />
      <div className="absolute inset-0 bg-stone-950/45 sm:hidden" />
      <div className="relative min-h-[100svh] py-24">
        <HeroContent show afterIntro={false} />
      </div>
    </section>
  )
}

export default function Hero() {
  const reduce = useReducedMotion()
  return reduce ? <StaticHero /> : <DoorIntro />
}
