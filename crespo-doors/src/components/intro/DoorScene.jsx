import { motion, useTransform } from 'framer-motion'
import {
  T, SCREWS, HINGES, LEAF, STILE, RAIL, SECTIONS, PLATE, LEVER_Y, FRAME,
  ease, progress, clamp01, lerp,
} from './timeline'

// All geometry is expressed in frame units; --u is set on the scene root.
const U = (n) => `calc(var(--u) * ${n})`
const box = (x, y, w, h) => ({ left: U(x), top: U(y), width: U(w), height: U(h) })
const P3D = { transformStyle: 'preserve-3d' }

const xf = ({ x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, scale = 1 }, k) =>
  `translate3d(${U(x * k)}, ${U(y * k)}, ${U(z * k)}) rotateX(${rx * k}deg) rotateY(${ry * k}deg) rotateZ(${rz * k}deg) scale(${1 + (scale - 1) * k})`

/** Walnut: warm base plus two layers of grain running along the board. */
const walnut = (angle = 90, tone = 0) => {
  const base = [
    ['#4b2c18', '#613c23', '#3a2112'],
    ['#3b2213', '#4d2e1a', '#2c190c'],
    ['#57341f', '#6d4329', '#45281a'],
  ][tone]
  return `repeating-linear-gradient(${angle}deg, rgba(255,226,190,0.05) 0 ${U(0.25)}, transparent ${U(0.25)} ${U(1.15)}),
    repeating-linear-gradient(${angle + 1.5}deg, rgba(30,15,5,0.16) 0 ${U(0.4)}, transparent ${U(0.4)} ${U(2.6)}),
    repeating-linear-gradient(${angle - 0.8}deg, transparent 0 ${U(4)}, rgba(30,15,5,0.12) ${U(4)} ${U(4.5)}, transparent ${U(4.5)} ${U(9)}),
    linear-gradient(${angle + 90}deg, ${base[0]} 0%, ${base[1]} 48%, ${base[2]} 100%)`
}
const BEVEL = `inset 0 0 0 ${U(0.25)} rgba(0,0,0,0.35), inset ${U(0.5)} ${U(0.5)} ${U(0.8)} rgba(255,220,180,0.1), inset ${U(-0.5)} ${U(-0.5)} ${U(0.9)} rgba(0,0,0,0.35)`
const BLACK = 'linear-gradient(180deg, #4a4a4a 0%, #1c1c1c 35%, #0b0b0b 70%, #2a2a2a 100%)'
const BLACK_V = 'linear-gradient(90deg, #2c2c2c 0%, #0d0d0d 40%, #1f1f1f 70%, #050505 100%)'

/** A piece that flies in from `from` and lands at rest during `range`. */
function Part({ s, range, from = {}, easing = ease.back, fade = 0.3, className = '', style, children }) {
  const transform = useTransform(s, (v) => xf(from, 1 - easing(progress(v, range))))
  const opacity = useTransform(s, (v) =>
    from.opacity === undefined ? 1 : lerp(from.opacity, 1, clamp01((v - range[0]) / ((range[1] - range[0]) * fade))),
  )
  return (
    <motion.div className={`absolute ${className}`} style={{ ...P3D, ...style, transform, opacity }}>
      {children}
    </motion.div>
  )
}

/** A screw that drops in, spins down and seats with a flash. */
function Screw({ s, x, y, r = 1.15, at, dark = false }) {
  const [a, b] = at
  const zAt = (t) => (t < 0.35 ? lerp(34, 5, ease.out(t / 0.35)) : lerp(5, 0, ease.out((t - 0.35) / 0.65)))
  const head = useTransform(s, (v) => {
    const t = progress(v, at)
    const appr = ease.out(clamp01(t / 0.35))
    const drive = ease.out(clamp01((t - 0.35) / 0.65))
    return `translateZ(${U(zAt(t))}) rotate(${appr * 50 + drive * 1080}deg)`
  })
  const opacity = useTransform(s, (v) => clamp01((v - a) / ((b - a) * 0.12)))
  const shadow = useTransform(s, (v) => {
    const z = zAt(progress(v, at))
    return `translate(${U(z * 0.14)}, ${U(z * 0.22)}) scale(${1 + z / 30})`
  })
  const shadowOpacity = useTransform(opacity, (o) => o * 0.55)
  const holeOpacity = useTransform(s, (v) => clamp01((v - (a - 0.02)) / 0.01) * 0.85)
  const flashT = useTransform(s, (v) => progress(v, [b - 0.001, b + 0.016]))
  const flashScale = useTransform(flashT, (t) => 1 + t * 2.2)
  const flashOpacity = useTransform(flashT, (t) => (t <= 0 || t >= 1 ? 0 : 1 - t))

  const d = r * 2
  return (
    <div className="absolute" style={{ ...P3D, ...box(x - r, y - r, d, d), transform: `translateZ(${U(0.12)})` }}>
      <motion.div className="absolute inset-[18%] rounded-full bg-black" style={{ opacity: holeOpacity }} />
      <motion.div className="absolute inset-0 rounded-full bg-black/80 blur-[1.5px]" style={{ transform: shadow, opacity: shadowOpacity }} />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          transform: head,
          opacity,
          background: dark
            ? 'radial-gradient(circle at 34% 30%, #9a9a9a 0%, #4a4a4a 35%, #161616 80%, #000 100%)'
            : 'radial-gradient(circle at 34% 30%, #ffffff 0%, #d9d5cf 30%, #8d8785 72%, #4a4038 100%)',
          boxShadow: '0 0 0 0.5px rgba(0,0,0,0.5)',
        }}
      >
        <span className={`absolute left-1/2 top-[20%] h-[60%] w-[16%] -translate-x-1/2 rounded-[1px] ${dark ? 'bg-black' : 'bg-stone-800'}`} />
        <span className={`absolute top-1/2 left-[20%] w-[60%] h-[16%] -translate-y-1/2 rounded-[1px] ${dark ? 'bg-black' : 'bg-stone-800'}`} />
      </motion.div>
      <motion.div
        className="absolute inset-0 rounded-full border border-amber-200"
        style={{ scale: flashScale, opacity: flashOpacity, boxShadow: '0 0 6px rgba(255,214,160,0.9)' }}
      />
    </div>
  )
}

function Hinge({ s, y, side, at }) {
  const left = side === 'left'
  return (
    <Part s={s} range={at} from={{ x: left ? -24 : 24, z: 30, rz: left ? -25 : 25, opacity: 0 }} style={box(left ? 3.6 : 141.6, y - 7.5, 4.8, 15)}>
      <div className="absolute rounded-[1px]" style={{ ...box(left ? 0 : 1.4, 0, 3.4, 15), transform: `translateZ(${U(0.05)})`, background: BLACK_V, boxShadow: '0 1px 2px rgba(0,0,0,0.6)' }} />
      <div
        className="absolute rounded-full"
        style={{
          ...box(left ? 2.7 : 0, -0.3, 2.1, 15.6),
          transform: `translateZ(${U(0.9)})`,
          background: 'linear-gradient(90deg, #050505 0%, #3d3d3d 38%, #6a6a6a 48%, #1a1a1a 70%, #000 100%)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.6)',
        }}
      >
        {[0.25, 0.5, 0.75].map((f) => <span key={f} className="absolute inset-x-0 h-px bg-black/70" style={{ top: `${f * 100}%` }} />)}
      </div>
    </Part>
  )
}

/** Inner face of a jamb (gives the frame real depth when the camera orbits). */
function JambFace({ height, atLeft }) {
  return (
    <div
      className="absolute top-0"
      style={{
        left: atLeft ? 0 : '100%',
        width: U(14),
        height: U(height),
        transformOrigin: 'left center',
        transform: 'rotateY(90deg)',
        background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%), ${walnut(0, 1)}`,
      }}
    />
  )
}

function SurveyLayer({ s }) {
  const draw = useTransform(s, (v) => ease.inOut(progress(v, T.survey)))
  const outline = useTransform(s, (v) => 1 - progress(v, T.surveyOut))
  const dims = useTransform(s, (v) => (v < 0.02 ? progress(v, [0, 0.02]) : lerp(1, 0.3, progress(v, [0.11, 0.2])) * (1 - progress(v, [0.74, 0.78]))))
  const scanY = useTransform(s, (v) => lerp(203, -4, ease.inOut(progress(v, [0.005, 0.07]))))
  const scanOpacity = useTransform(s, (v) => (v < 0.07 ? 1 : 1 - progress(v, [0.07, 0.085])))

  return (
    <svg className="pointer-events-none absolute overflow-visible" style={box(-22, -32, 194, 265)} viewBox="-22 -32 194 265">
      <defs>
        <filter id="laser-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <motion.path d="M0 201 L0 0 L150 0 L150 201" fill="none" stroke="#b85d5f" strokeWidth="0.5" filter="url(#laser-glow)" style={{ pathLength: draw, opacity: outline }} />
      <motion.g style={{ opacity: dims }} fill="#8d8785" stroke="#726e6d" strokeWidth="0.3" fontFamily="IBM Plex Mono, monospace">
        <line x1="0" y1="-14" x2="150" y2="-14" />
        <line x1="0" y1="-18" x2="0" y2="-10" />
        <line x1="150" y1="-18" x2="150" y2="-10" />
        <text x="75" y="-17" textAnchor="middle" fontSize="4.2" stroke="none" letterSpacing="0.6">72″ R.O.</text>
        <line x1="164" y1="0" x2="164" y2="201" />
        <line x1="160" y1="0" x2="168" y2="0" />
        <line x1="160" y1="201" x2="168" y2="201" />
        <text x="168.5" y="100" fontSize="4.2" stroke="none" letterSpacing="0.6" transform="rotate(90 168.5 100)" textAnchor="middle">96″ R.O.</text>
        {[[0, 201], [150, 201], [0, 0], [150, 0], [75, 0], [75, 201]].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`} stroke="#b85d5f" strokeWidth="0.35">
            <line x1={cx - 3} y1={cy} x2={cx + 3} y2={cy} />
            <line x1={cx} y1={cy - 3} x2={cx} y2={cy + 3} />
          </g>
        ))}
        <line x1="75" y1="0" x2="75" y2="201" strokeDasharray="1.5 2.5" stroke="#4a4038" />
      </motion.g>
      <motion.g style={{ opacity: scanOpacity }}>
        <motion.line x1="-16" x2="166" y1={scanY} y2={scanY} stroke="#d59496" strokeWidth="0.45" filter="url(#laser-glow)" />
        <motion.circle cx="-16" cy={scanY} r="1.2" fill="#f5e3e3" filter="url(#laser-glow)" />
      </motion.g>
    </svg>
  )
}

const PERIMETER = 'M7.2 195.8 L7.2 7.2 L142.8 7.2 L142.8 195.8 Z M75 7.6 L75 195.6'

function GlowLayer({ s }) {
  const seal = useTransform(s, (v) => ease.inOut(progress(v, T.seal)))
  const leak = useTransform(s, (v) => progress(v, T.leakIn) * (1 - progress(v, [T.seal[0], T.seal[1] - 0.008])))
  const sealOpacity = useTransform(s, (v) => (v < T.seal[1] ? 1 : lerp(1, 0.4, progress(v, [T.seal[1], 0.765]))) * (1 - progress(v, [0.78, 0.79])))
  return (
    <svg className="pointer-events-none absolute overflow-visible" style={{ ...box(0, 0, FRAME.w, FRAME.h), transform: `translateZ(${U(0.7)})` }} viewBox={`0 0 ${FRAME.w} ${FRAME.h}`}>
      <defs>
        <filter id="leak-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1" /></filter>
        <filter id="seal-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <motion.g style={{ opacity: leak }}>
        <path d={PERIMETER} fill="none" stroke="#ffb46e" strokeWidth="1.3" filter="url(#leak-glow)" />
        <path d={PERIMETER} fill="none" stroke="#ffe2bf" strokeWidth="0.3" />
        <path d="M12 196.4 L138 196.4" stroke="#ffc58a" strokeWidth="2.2" filter="url(#leak-glow)" />
      </motion.g>
      <motion.path d={PERIMETER} fill="none" stroke="#f5e3e3" strokeWidth="0.5" strokeLinecap="round" filter="url(#seal-glow)" style={{ pathLength: seal, opacity: sealOpacity }} />
    </svg>
  )
}

function Glass({ s, sec, at }) {
  const sweep = useTransform(s, (v) => `translateX(${lerp(-140, 260, ease.inOut(progress(v, T.glassSweep)))}%) skewX(-18deg)`)
  return (
    <Part s={s} range={at} from={{ z: 70, rx: 12, opacity: 0 }} easing={ease.out} fade={0.4} style={box(sec.x - 0.5, sec.y - 0.5, sec.w + 1, sec.h + 1)}>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 30% 72%, rgba(170,150,96,0.35), transparent 70%),
            radial-gradient(ellipse 50% 35% at 75% 30%, rgba(96,116,80,0.4), transparent 70%),
            linear-gradient(165deg, #121a14 0%, #2a382b 32%, #5a5639 58%, #161f17 100%)`,
          boxShadow: `inset 0 0 0 ${U(0.4)} rgba(255,255,255,0.12), inset 0 0 ${U(4)} rgba(0,0,0,0.5)`,
        }}
      >
        <motion.div className="absolute inset-y-[-10%] w-1/3" style={{ transform: sweep, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)' }} />
      </div>
    </Part>
  )
}

const PITCH = 13.5
const THICK = 8.6

/** One glazed section filled with diagonal walnut slats that slide in along their own length. */
function SlatSection({ s, sec, theta, corner, mirror, start, span }) {
  const rad = (theta * Math.PI) / 180
  const n = [-Math.sin(rad), Math.cos(rad)]
  const cx = sec.w / 2
  const cy = sec.h / 2
  const rel = [corner[0] - sec.x - cx, corner[1] - sec.y - cy]
  const d0 = rel[0] * n[0] + rel[1] * n[1] + PITCH / 2
  const reach = (sec.w + sec.h) / (2 * Math.SQRT2) + THICK
  const offsets = []
  for (let m = -14; m <= 14; m++) {
    const o = d0 + m * PITCH
    if (Math.abs(o) <= reach) offsets.push(o)
  }
  const L = sec.w + sec.h + 8
  return (
    <div
      className="absolute overflow-hidden"
      style={{ ...box(sec.x, sec.y, sec.w, sec.h), transform: `translateZ(${U(0.3)})${mirror ? ' scaleX(-1)' : ''}` }}
    >
      {offsets.map((o, i) => {
        const a = start + (i / Math.max(1, offsets.length - 1)) * span
        return (
          <Slat
            key={o}
            s={s}
            at={[a, a + 0.032]}
            style={{ ...box(cx + n[0] * o - L / 2, cy + n[1] * o - THICK / 2, L, THICK) }}
            theta={theta}
            len={L}
            tone={i % 3}
          />
        )
      })}
    </div>
  )
}

function Slat({ s, at, style, theta, len, tone }) {
  const transform = useTransform(s, (v) => `rotate(${theta}deg) translateX(${U(-len * (1 - ease.out(progress(v, at))))})`)
  const opacity = useTransform(s, (v) => (v < at[0] ? 0 : 1))
  return (
    <motion.div
      className="absolute"
      style={{
        ...style,
        transform,
        opacity,
        background: walnut(0, tone),
        boxShadow: `${BEVEL}, 0 ${U(0.7)} ${U(1.4)} rgba(0,0,0,0.55)`,
      }}
    />
  )
}

function Leaf({ s, side }) {
  const left = side === 'left'
  const W = LEAF.w
  const swing = useTransform(s, (v) => {
    const t = progress(v, T.swing)
    const deg = t < 0.16 ? lerp(0, 7, ease.out(t / 0.16)) : lerp(7, 100, ease.inOut((t - 0.16) / 0.84))
    // both leaves swing out toward the viewer
    return `rotateY(${left ? -deg : deg}deg)`
  })
  const fadeOut = useTransform(s, (v) => 1 - progress(v, T.slabOut))
  const plateX = left ? PLATE.x : W - PLATE.x - PLATE.w
  const pcx = plateX + PLATE.w / 2
  const thumb = useTransform(s, (v) => `rotate(${90 * ease.inOut(progress(v, T.thumbTurn))}deg)`)
  const lever = useTransform(s, (v) => {
    const down = ease.inOut(progress(v, T.leverPress))
    const up = ease.out(progress(v, [0.84, 0.87]))
    return `rotate(${(left ? -30 : 30) * down * (1 - up)}deg)`
  })
  const bolt = useTransform(s, (v) => ease.back(progress(v, T.boltsOut)) * (1 - ease.inOut(progress(v, T.boltsIn))))
  const boltTop = useTransform(bolt, (b) => `translateY(${U(-6.5 * b)})`)
  const boltBottom = useTransform(bolt, (b) => `translateY(${U(6.5 * b)})`)
  const boltGlow = useTransform(s, (v) => (v < T.boltsOut[1] ? 0 : 1 - progress(v, [T.boltsOut[1], T.boltsOut[1] + 0.02])))

  const outerX = left ? 0 : W - STILE
  const meetX = left ? W - STILE : 0
  const stileFrom = (i) => ({ y: 210, z: 30, opacity: 0, rz: i ? 3 : -3 })
  const railFrom = { x: left ? -90 : 90, z: 25, opacity: 0 }
  const order = left ? 0 : 0.006
  const screws = SCREWS.filter((k) => k.leaf === side)

  return (
    <div className="absolute" style={{ ...P3D, ...box(left ? LEAF.leftX : LEAF.rightX, LEAF.y, W, LEAF.h) }}>
      <motion.div
        className="absolute inset-0"
        style={{ ...P3D, transform: swing, transformOrigin: left ? 'left center' : 'right center', opacity: fadeOut }}
      >
        {/* glass */}
        <Glass s={s} sec={SECTIONS.upper} at={T.glass[left ? 0 : 1]} />
        <Glass s={s} sec={SECTIONS.lower} at={T.glass[left ? 2 : 3]} />

        {/* slats (the right leaf mirrors the left, so the pattern chevrons into the middle) */}
        <SlatSection s={s} sec={SECTIONS.upper} theta={45} corner={[W - STILE, RAIL.mid[0]]} mirror={!left} start={T.slats[0] + order} span={0.06} />
        <SlatSection s={s} sec={SECTIONS.lower} theta={-45} corner={[W - STILE, RAIL.mid[1]]} mirror={!left} start={T.slats[0] + 0.012 + order} span={0.045} />

        {/* stiles & rails */}
        {[outerX, meetX].map((x, i) => (
          <Part key={x} s={s} range={T.stiles[i]} from={stileFrom(i)} style={{ ...box(x, 0, STILE, LEAF.h), transform: `translateZ(${U(0.6)})` }}>
            <div className="absolute inset-0" style={{ background: walnut(90, i === 0 ? 0 : 2), boxShadow: `${BEVEL}, 0 ${U(0.6)} ${U(2)} rgba(0,0,0,0.5)` }} />
          </Part>
        ))}
        {[RAIL.top, RAIL.mid, RAIL.bottom].map(([y0, y1], i) => (
          <Part key={y0} s={s} range={T.rails[i]} from={railFrom} style={box(STILE, y0, W - 2 * STILE, y1 - y0)}>
            <div
              className="absolute inset-0"
              style={{
                transform: `translateZ(${U(0.6)})`,
                background:
                  i === 2
                    ? `radial-gradient(ellipse 18% 30% at ${left ? 32 : 68}% 55%, rgba(40,20,8,0.28) 0 30%, transparent 32% 46%, rgba(40,20,8,0.22) 48% 52%, transparent 54%), radial-gradient(ellipse 14% 24% at ${left ? 66 : 34}% 50%, rgba(40,20,8,0.22) 0 28%, transparent 30% 48%, rgba(40,20,8,0.18) 50% 54%, transparent 56%), ${walnut(0, 2)}`
                    : walnut(0, 0),
                boxShadow: `${BEVEL}, 0 ${U(0.6)} ${U(1.6)} rgba(0,0,0,0.5)`,
              }}
            />
          </Part>
        ))}

        {/* multipoint flush bolts (inactive leaf) */}
        {left && (
          <>
            {[[-0.5, boltTop], [LEAF.h - 6.5, boltBottom]].map(([y, tf]) => (
              <motion.div key={y} className="absolute" style={{ ...box(pcx - 1.2, y, 2.4, 7), transform: tf }}>
                <div className="absolute inset-0 rounded-[1px]" style={{ transform: `translateZ(${U(0.65)})`, background: 'linear-gradient(90deg, #8d8785, #f4f2ee 45%, #726e6d)' }} />
                <motion.div className="absolute -inset-[60%] rounded-full" style={{ opacity: boltGlow, background: 'radial-gradient(circle, rgba(255,214,160,0.9), transparent 65%)' }} />
              </motion.div>
            ))}
          </>
        )}

        {/* mortise lockset */}
        <Part s={s} range={T.plates} from={{ z: 55, y: -10, opacity: 0 }} easing={ease.out} style={box(plateX, PLATE.y, PLATE.w, PLATE.h)}>
          <div className="absolute inset-0 rounded-[2px]" style={{ transform: `translateZ(${U(0.85)})`, background: BLACK_V, boxShadow: `0 ${U(0.6)} ${U(1.5)} rgba(0,0,0,0.7), inset 0 0 0 ${U(0.2)} rgba(255,255,255,0.08)` }}>
            <div className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ top: U(4.5), width: U(2.2), height: U(2.2), background: 'radial-gradient(circle at 35% 30%, #777, #222 60%, #000)' }}>
              <motion.span className="absolute left-1/2 top-1/2 -ml-[10%] -mt-[34%] h-[68%] w-[20%] rounded-full bg-stone-300/70" style={{ transform: thumb }} />
            </div>
          </div>
        </Part>
        <Part s={s} range={T.levers} from={{ z: 80, rz: left ? 80 : -80, opacity: 0 }} style={box(pcx - 1.6, LEVER_Y - 1.6, 3.2, 3.2)}>
          <div className="absolute inset-0 rounded-full" style={{ transform: `translateZ(${U(1.6)})`, background: 'radial-gradient(circle at 35% 30%, #666, #1a1a1a 55%, #000)', boxShadow: '0 1px 3px rgba(0,0,0,0.7)' }} />
          <motion.div
            className="absolute"
            style={{
              ...box(left ? -13.4 : 1.6, 0.55, 13.4, 2.1),
              transformOrigin: left ? `calc(100% + ${U(0.0)}) 50%` : `0 50%`,
              transform: lever,
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="absolute inset-0" style={{ transform: `translateZ(${U(3)})`, borderRadius: U(0.5), background: BLACK, boxShadow: `0 ${U(1.2)} ${U(1.6)} rgba(0,0,0,0.65)` }} />
          </motion.div>
        </Part>
        {screws.map((k) => <Screw key={k.id} s={s} x={left ? k.x : W - k.x} y={k.y} r={k.r} at={k.at} dark={k.dark} />)}
      </motion.div>
    </div>
  )
}

function Floor({ s }) {
  const floorOpacity = useTransform(s, (v) => 1 - progress(v, [0.79, 0.84]))
  const spill = useTransform(s, (v) => progress(v, T.spill) * (1 - progress(v, T.spillOut)))
  return (
    <>
      <motion.div
        className="pointer-events-none absolute"
        style={{
          ...box(-130, FRAME.h, 410, 150),
          transformOrigin: 'top center',
          transform: 'rotateX(90deg)',
          opacity: floorOpacity,
          backgroundImage: 'linear-gradient(rgba(244,242,238,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(244,242,238,0.09) 1px, transparent 1px)',
          backgroundSize: `${U(10)} ${U(10)}`,
          WebkitMaskImage: 'radial-gradient(ellipse 45% 70% at 50% 0%, #000 0%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 45% 70% at 50% 0%, #000 0%, transparent 100%)',
        }}
      />
      <motion.div
        className="pointer-events-none absolute"
        style={{
          ...box(-20, FRAME.h, 190, 110),
          transformOrigin: 'top center',
          transform: 'rotateX(90deg)',
          opacity: spill,
          clipPath: 'polygon(14.2% 0, 85.8% 0, 100% 100%, 0 100%)',
          background: 'linear-gradient(180deg, rgba(255,214,165,0.9) 0%, rgba(255,180,120,0.35) 45%, transparent 100%)',
        }}
      />
    </>
  )
}

export default function DoorScene({ s, camera, unit }) {
  const frameScrews = SCREWS.filter((k) => !k.leaf)
  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ ...P3D, '--u': `${unit}px`, width: U(FRAME.w), height: U(FRAME.h), transformOrigin: '0 0', transform: camera }}
    >
      <Floor s={s} />
      <SurveyLayer s={s} />

      {/* sill */}
      <Part s={s} range={T.sill} from={{ y: 60, z: 70, opacity: 0 }} style={box(-3, 195.8, 156, 5.4)}>
        <div className="absolute inset-0 rounded-[1px]" style={{ background: 'linear-gradient(180deg, #e4e0da 0%, #8d8785 35%, #4a4038 100%)', boxShadow: '0 4px 10px rgba(0,0,0,0.6)' }} />
      </Part>

      {/* jambs */}
      <Part s={s} range={T.jambL} from={{ x: -130, z: 60, rz: -8, opacity: 0 }} style={box(0, 7, 7, 189)}>
        <div className="absolute inset-0" style={{ background: walnut(90, 0), boxShadow: `${BEVEL}, 0 6px 18px rgba(0,0,0,0.45)` }} />
        <JambFace height={189} />
      </Part>
      <Part s={s} range={T.jambR} from={{ x: 130, z: 60, rz: 8, opacity: 0 }} style={box(143, 7, 7, 189)}>
        <div className="absolute inset-0" style={{ background: walnut(90, 2), boxShadow: `${BEVEL}, 0 6px 18px rgba(0,0,0,0.45)` }} />
        <JambFace height={189} atLeft />
      </Part>

      {/* head */}
      <Part s={s} range={T.head} from={{ y: -130, z: 40, rx: -35, opacity: 0 }} style={box(-1, 0, 152, 7.2)}>
        <div className="absolute inset-0" style={{ background: walnut(0, 0), boxShadow: `${BEVEL}, 0 6px 18px rgba(0,0,0,0.45)` }} />
      </Part>

      {HINGES.flatMap((y, i) => [
        <Hinge key={`l${y}`} s={s} y={y} side="left" at={[T.hinges[0] + i * 0.006, T.hinges[1] + i * 0.006 - 0.012]} />,
        <Hinge key={`r${y}`} s={s} y={y} side="right" at={[T.hinges[0] + i * 0.006 + 0.003, T.hinges[1] + i * 0.006 - 0.009]} />,
      ])}
      {frameScrews.map((k) => <Screw key={k.id} s={s} x={k.x} y={k.y} r={k.r} at={k.at} dark={k.dark} />)}

      <Leaf s={s} side="left" />
      <Leaf s={s} side="right" />
      <GlowLayer s={s} />
    </motion.div>
  )
}
