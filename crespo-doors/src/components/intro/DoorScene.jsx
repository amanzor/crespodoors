import { motion, useTransform } from 'framer-motion'
import { T, SCREWS, HINGE_YS, ease, progress, clamp01, lerp } from './timeline'

// All geometry is expressed in frame units; --u is set on the scene root.
const U = (n) => `calc(var(--u) * ${n})`
const box = (x, y, w, h) => ({ left: U(x), top: U(y), width: U(w), height: U(h) })
const P3D = { transformStyle: 'preserve-3d' }

const xf = ({ x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, scale = 1 }, k) =>
  `translate3d(${U(x * k)}, ${U(y * k)}, ${U(z * k)}) rotateX(${rx * k}deg) rotateY(${ry * k}deg) rotateZ(${rz * k}deg) scale(${1 + (scale - 1) * k})`

const STEEL = 'linear-gradient(90deg, #6f6a66 0%, #d9d5cf 38%, #f4f2ee 50%, #aaa5a0 66%, #5f5a56 100%)'
const TRIM = 'linear-gradient(90deg, #d6cfc4 0%, #efebe4 45%, #e2dcd2 100%)'

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
function Screw({ s, x, y, r = 1.25, at }) {
  const [a, b] = at
  const head = useTransform(s, (v) => {
    const t = progress(v, at)
    const appr = ease.out(clamp01(t / 0.35))
    const drive = ease.out(clamp01((t - 0.35) / 0.65))
    const z = t < 0.35 ? lerp(34, 5, appr) : lerp(5, 0, drive)
    return `translateZ(${U(z)}) rotate(${appr * 50 + drive * 1080}deg)`
  })
  const opacity = useTransform(s, (v) => clamp01((v - a) / ((b - a) * 0.12)))
  const shadow = useTransform(s, (v) => {
    const t = progress(v, at)
    const z = t < 0.35 ? lerp(34, 5, ease.out(t / 0.35)) : lerp(5, 0, ease.out((t - 0.35) / 0.65))
    return `translate(${U(z * 0.14)}, ${U(z * 0.22)}) scale(${1 + z / 30})`
  })
  const shadowOpacity = useTransform(opacity, (o) => o * 0.55)
  const holeOpacity = useTransform(s, (v) => clamp01((v - (a - 0.02)) / 0.01) * 0.85)
  const flashT = useTransform(s, (v) => progress(v, [b - 0.001, b + 0.016]))
  const flashScale = useTransform(flashT, (t) => 1 + t * 2.2)
  const flashOpacity = useTransform(flashT, (t) => (t <= 0 || t >= 1 ? 0 : 1 - t))

  const d = r * 2
  return (
    <div className="absolute" style={{ ...P3D, ...box(x - r, y - r, d, d), transform: `translateZ(${U(0.08)})` }}>
      <motion.div className="absolute inset-[18%] rounded-full bg-black" style={{ opacity: holeOpacity }} />
      <motion.div
        className="absolute inset-0 rounded-full bg-black/80 blur-[1.5px]"
        style={{ transform: shadow, opacity: shadowOpacity }}
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          transform: head,
          opacity,
          background: 'radial-gradient(circle at 34% 30%, #ffffff 0%, #d9d5cf 30%, #8d8785 72%, #4a4038 100%)',
          boxShadow: '0 0 0 0.5px rgba(0,0,0,0.45)',
        }}
      >
        <span className="absolute left-1/2 top-[20%] h-[60%] w-[16%] -translate-x-1/2 rounded-[1px] bg-stone-800" />
        <span className="absolute top-1/2 left-[20%] w-[60%] h-[16%] -translate-y-1/2 rounded-[1px] bg-stone-800" />
      </motion.div>
      <motion.div
        className="absolute inset-0 rounded-full border border-maroon-300"
        style={{ scale: flashScale, opacity: flashOpacity, boxShadow: '0 0 6px rgba(213,148,150,0.9)' }}
      />
    </div>
  )
}

function Hinge({ s, y, range }) {
  return (
    <Part s={s} range={range} from={{ x: -26, z: 30, rz: -25, opacity: 0 }} style={box(4.6, y - 7.5, 4.8, 15)}>
      <div className="absolute rounded-[2px]" style={{ ...box(0, 0, 3.4, 15), transform: `translateZ(${U(0.03)})`, background: STEEL, boxShadow: '0 1px 2px rgba(0,0,0,0.5)' }} />
      {/* knuckle */}
      <div
        className="absolute rounded-full"
        style={{
          ...box(2.6, -0.4, 2.2, 15.8),
          transform: `translateZ(${U(0.9)})`,
          background: 'linear-gradient(90deg, #4a4540 0%, #cfcac4 35%, #ffffff 48%, #9a958f 70%, #3d3935 100%)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.55)',
        }}
      >
        {[0.2, 0.4, 0.6, 0.8].map((f) => (
          <span key={f} className="absolute inset-x-0 h-px bg-black/40" style={{ top: `${f * 100}%` }} />
        ))}
      </div>
    </Part>
  )
}

/** Inner face of a jamb (gives the frame real depth when the camera orbits). */
function JambFace({ height, children }) {
  return (
    <div
      className="absolute top-0"
      style={{
        ...P3D,
        left: '100%',
        width: U(14),
        height: U(height),
        transformOrigin: 'left center',
        transform: 'rotateY(90deg)',
        background: 'linear-gradient(90deg, #c9c1b5 0%, #a39a8e 70%, #7d756b 100%)',
      }}
    >
      {children}
    </div>
  )
}

function SurveyLayer({ s }) {
  const draw = useTransform(s, (v) => ease.inOut(progress(v, T.survey)))
  const outline = useTransform(s, (v) => 1 - progress(v, T.surveyOut))
  const dims = useTransform(s, (v) => (v < 0.02 ? progress(v, [0, 0.02]) : lerp(1, 0.35, progress(v, [0.12, 0.2])) * (1 - progress(v, T.hudOut))))
  const scanY = useTransform(s, (v) => lerp(222, -4, ease.inOut(progress(v, [0.005, 0.075]))))
  const scanOpacity = useTransform(s, (v) => (v < 0.075 ? 1 : 1 - progress(v, [0.075, 0.09])))

  return (
    <svg
      className="pointer-events-none absolute overflow-visible"
      style={{ ...box(-22, -32, 154, 284) }}
      viewBox="-22 -32 154 284"
    >
      <defs>
        <filter id="laser-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <motion.path
        d="M0 220 L0 50 A50 50 0 0 1 100 50 L100 220"
        fill="none"
        stroke="#b85d5f"
        strokeWidth="0.5"
        filter="url(#laser-glow)"
        style={{ pathLength: draw, opacity: outline }}
      />
      <motion.g style={{ opacity: dims }} fill="#8d8785" stroke="#726e6d" strokeWidth="0.3" fontFamily="IBM Plex Mono, monospace">
        <line x1="0" y1="-14" x2="100" y2="-14" />
        <line x1="0" y1="-18" x2="0" y2="-10" />
        <line x1="100" y1="-18" x2="100" y2="-10" />
        <text x="50" y="-17" textAnchor="middle" fontSize="4.2" stroke="none" letterSpacing="0.6">36″ R.O.</text>
        <line x1="114" y1="0" x2="114" y2="220" />
        <line x1="110" y1="0" x2="118" y2="0" />
        <line x1="110" y1="220" x2="118" y2="220" />
        <text x="118.5" y="110" fontSize="4.2" stroke="none" letterSpacing="0.6" transform="rotate(90 118.5 110)" textAnchor="middle">96″ R.O.</text>
        {[[0, 220], [100, 220], [0, 50], [100, 50], [50, 0]].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`} stroke="#b85d5f" strokeWidth="0.35">
            <line x1={cx - 3} y1={cy} x2={cx + 3} y2={cy} />
            <line x1={cx} y1={cy - 3} x2={cx} y2={cy + 3} />
          </g>
        ))}
      </motion.g>
      <motion.g style={{ opacity: scanOpacity }}>
        <motion.line x1="-16" x2="116" y1={scanY} y2={scanY} stroke="#d59496" strokeWidth="0.45" filter="url(#laser-glow)" />
        <motion.circle cx="-16" cy={scanY} r="1.2" fill="#f5e3e3" filter="url(#laser-glow)" />
      </motion.g>
    </svg>
  )
}

const PERIMETER = 'M8.2 213.8 L8.2 50 A41.8 41.8 0 0 1 91.8 50 L91.8 213.8 Z'

function GlowLayer({ s }) {
  const seal = useTransform(s, (v) => ease.inOut(progress(v, T.seal)))
  const leak = useTransform(s, (v) => progress(v, T.leakIn) * (1 - progress(v, [T.seal[0], T.seal[1] - 0.01])))
  const sealOpacity = useTransform(s, (v) => (v < T.seal[1] ? 1 : lerp(1, 0.45, progress(v, [T.seal[1], 0.68]))) * (1 - progress(v, [0.7, 0.72])))
  return (
    <svg
      className="pointer-events-none absolute overflow-visible"
      style={{ ...box(0, 0, 100, 220), transform: `translateZ(${U(0.35)})` }}
      viewBox="0 0 100 220"
    >
      <defs>
        <filter id="leak-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1" />
        </filter>
        <filter id="seal-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <motion.g style={{ opacity: leak }}>
        <path d={PERIMETER} fill="none" stroke="#ffb46e" strokeWidth="1.3" filter="url(#leak-glow)" />
        <path d={PERIMETER} fill="none" stroke="#ffe2bf" strokeWidth="0.35" />
        <path d="M14 214.5 L86 214.5" stroke="#ffc58a" strokeWidth="2.2" filter="url(#leak-glow)" />
      </motion.g>
      <motion.path
        d={PERIMETER}
        fill="none"
        stroke="#e8c2c3"
        strokeWidth="0.55"
        strokeLinecap="round"
        filter="url(#seal-glow)"
        style={{ pathLength: seal, opacity: sealOpacity }}
      />
    </svg>
  )
}

function Slab({ s }) {
  const swing = useTransform(s, (v) => {
    const t = progress(v, T.swing)
    // a small "crack" first, then the full swing
    // swings out toward the viewer (outswing doors show their hinges, like ours)
    const deg = t < 0.18 ? lerp(0, -9, ease.out(t / 0.18)) : lerp(-9, -108, ease.inOut((t - 0.18) / 0.82))
    return `rotateY(${deg}deg)`
  })
  const slabOpacity = useTransform(s, (v) => 1 - progress(v, T.slabOut))
  const glassGlow = useTransform(s, (v) => lerp(0.15, 0.75, progress(v, T.leakIn)))
  const thumb = useTransform(s, (v) => `rotate(${90 * ease.inOut(progress(v, T.thumbTurn))}deg)`)
  const lever = useTransform(s, (v) => {
    const down = ease.inOut(progress(v, T.leverPress))
    const up = ease.out(progress(v, [0.78, 0.82]))
    return `rotate(${-34 * down * (1 - up)}deg)`
  })
  const W = 83.2
  const H = 205.2
  const archR = `${U(41.6)} ${U(41.6)} 0 0`
  const local = (x, y) => [x - 8.4, y - 8.4]
  const [l1x, l1y] = local(83, 106.6)
  const [l2x, l2y] = local(83, 133.4)

  return (
    <Part
      s={s}
      range={T.slab}
      from={{ x: 30, y: -6, z: 240, ry: -55, rx: 8, opacity: 0 }}
      easing={ease.out}
      fade={0.25}
      style={box(8.4, 8.4, W, H)}
    >
      <motion.div className="absolute inset-0" style={{ ...P3D, transform: swing, transformOrigin: 'left center', opacity: slabOpacity }}>
        {/* back face */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: archR,
            transform: `translateZ(${U(-4)}) rotateY(180deg)`,
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(180deg, #6e1e21, #3f1213)',
            boxShadow: `inset 0 0 0 ${U(1.2)} rgba(0,0,0,0.25)`,
          }}
        />
        {/* latch edge */}
        <div
          className="absolute top-[20%] h-[80%]"
          style={{
            left: '100%',
            width: U(4),
            transformOrigin: 'left center',
            transform: 'rotateY(90deg)',
            background: 'linear-gradient(90deg, #521619, #2c0c0d)',
          }}
        />
        {/* front face */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            borderRadius: archR,
            backfaceVisibility: 'hidden',
            background: `repeating-linear-gradient(91deg, rgba(255,255,255,0.028) 0 ${U(0.35)}, transparent ${U(0.35)} ${U(1.9)}),
              repeating-linear-gradient(89deg, rgba(0,0,0,0.05) 0 ${U(0.5)}, transparent ${U(0.5)} ${U(3.1)}),
              linear-gradient(180deg, #933236 0%, #6e1e21 50%, #4a1416 100%)`,
            boxShadow: `inset 0 0 0 ${U(0.6)} rgba(0,0,0,0.3), inset ${U(1.5)} 0 ${U(3)} rgba(255,255,255,0.06)`,
          }}
        >
          {/* arched glass lite */}
          <div
            className="absolute overflow-hidden"
            style={{
              ...box(15.6, 10, 52, 54),
              borderRadius: `${U(26)} ${U(26)} ${U(1)} ${U(1)}`,
              background: 'linear-gradient(180deg, #2a1d17 0%, #17130f 100%)',
              boxShadow: `0 0 0 ${U(1.4)} #3f1213, 0 0 0 ${U(1.9)} rgba(255,255,255,0.08), inset 0 ${U(1)} ${U(3)} rgba(0,0,0,0.8)`,
            }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                opacity: glassGlow,
                background: 'radial-gradient(ellipse at 50% 85%, rgba(255,214,160,0.95) 0%, rgba(255,170,100,0.55) 40%, rgba(120,60,30,0.2) 75%, transparent 100%)',
              }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.14) 42%, transparent 52%)' }} />
            <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 bg-maroon-900" style={{ width: U(1.1) }} />
            <span className="absolute inset-x-0 bg-maroon-900" style={{ top: '58%', height: U(1.1) }} />
          </div>
          {/* raised panels */}
          {[[72, 60], [140, 56]].map(([py, ph]) => (
            <div
              key={py}
              className="absolute"
              style={{
                ...box(15.6, py, 52, ph),
                borderRadius: U(0.8),
                background: 'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0.1))',
                boxShadow: `inset 0 0 0 ${U(0.5)} rgba(0,0,0,0.22), inset ${U(0.9)} ${U(0.9)} ${U(1.2)} rgba(255,255,255,0.09), inset ${U(-0.9)} ${U(-0.9)} ${U(1.4)} rgba(0,0,0,0.35)`,
              }}
            >
              <div className="absolute rounded-[2px]" style={{ inset: U(4), boxShadow: `inset 0 0 0 ${U(0.35)} rgba(0,0,0,0.25), 0 0 0 ${U(0.35)} rgba(255,255,255,0.05)` }} />
            </div>
          ))}
        </div>

        {/* hardware */}
        <Part s={s} range={T.plate} from={{ z: 40, opacity: 0 }} easing={ease.out} style={box(71.6, 96.6, 6, 30)}>
          <div className="absolute inset-0" style={{ transform: `translateZ(${U(0.4)})`, borderRadius: U(3), background: STEEL, boxShadow: '0 2px 4px rgba(0,0,0,0.6)', backfaceVisibility: 'hidden' }} />
        </Part>
        <Part s={s} range={T.deadbolt} from={{ z: 60, rz: -120, opacity: 0 }} style={box(71.6, 100.6, 6, 6)}>
          <div className="absolute inset-0 rounded-full" style={{ transform: `translateZ(${U(1.2)})`, background: 'radial-gradient(circle at 35% 30%, #fff, #c8c3bd 40%, #6f6a66 100%)', boxShadow: '0 1px 3px rgba(0,0,0,0.6)', backfaceVisibility: 'hidden' }}>
            <motion.span className="absolute left-1/2 top-1/2 -ml-[6%] -mt-[22%] h-[44%] w-[12%] rounded-full bg-stone-900" style={{ transform: thumb }} />
          </div>
        </Part>
        <Part s={s} range={T.lever} from={{ z: 90, x: 6, rz: 70, opacity: 0 }} style={box(71.4, 116.4, 6.4, 6.4)}>
          <div className="absolute inset-0 rounded-full" style={{ transform: `translateZ(${U(1.2)})`, background: 'radial-gradient(circle at 35% 30%, #fff, #c8c3bd 40%, #6f6a66 100%)', boxShadow: '0 1px 3px rgba(0,0,0,0.6)', backfaceVisibility: 'hidden' }} />
          <motion.div
            className="absolute"
            style={{
              ...box(-10.2, 2.05, 14.2, 2.3),
              transformOrigin: `calc(100% - ${U(1.15)}) 50%`,
              transform: lever,
              transformStyle: 'preserve-3d',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `translateZ(${U(2.6)})`,
                borderRadius: U(1.2),
                background: 'linear-gradient(180deg, #ffffff 0%, #cfcac4 35%, #8d8785 75%, #5f5a56 100%)',
                boxShadow: '0 3px 5px rgba(0,0,0,0.55)',
                backfaceVisibility: 'hidden',
              }}
            />
          </motion.div>
        </Part>
        <Screw s={s} x={l1x} y={l1y} r={0.9} at={SCREWS.find((k) => k.id === 'l1').at} />
        <Screw s={s} x={l2x} y={l2y} r={0.9} at={SCREWS.find((k) => k.id === 'l2').at} />
      </motion.div>
    </Part>
  )
}

function Floor({ s }) {
  const floorOpacity = useTransform(s, (v) => 1 - progress(v, [0.72, 0.78]))
  const spill = useTransform(s, (v) => progress(v, T.spill) * (1 - progress(v, T.spillOut)))
  return (
    <>
      <motion.div
        className="pointer-events-none absolute"
        style={{
          ...box(-150, 220, 400, 150),
          transformOrigin: 'top center',
          transform: 'rotateX(90deg)',
          opacity: floorOpacity,
          backgroundImage: `linear-gradient(rgba(244,242,238,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(244,242,238,0.09) 1px, transparent 1px)`,
          backgroundSize: `${U(10)} ${U(10)}`,
          backgroundPosition: `${U(0)} 0`,
          WebkitMaskImage: 'radial-gradient(ellipse 45% 70% at 50% 0%, #000 0%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 45% 70% at 50% 0%, #000 0%, transparent 100%)',
        }}
      />
      <motion.div
        className="pointer-events-none absolute"
        style={{
          ...box(-30, 220, 160, 110),
          transformOrigin: 'top center',
          transform: 'rotateX(90deg)',
          opacity: spill,
          clipPath: 'polygon(23.75% 0, 76.25% 0, 100% 100%, 0 100%)',
          background: 'linear-gradient(180deg, rgba(255,214,165,0.9) 0%, rgba(255,180,120,0.35) 45%, transparent 100%)',
        }}
      />
    </>
  )
}

export default function DoorScene({ s, camera, unit }) {
  const strike = SCREWS.filter((k) => k.face === 'strike')
  const frameScrews = SCREWS.filter((k) => !k.face && !k.door)
  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ ...P3D, '--u': `${unit}px`, width: U(100), height: U(220), transformOrigin: '0 0', transform: camera }}
    >
      <Floor s={s} />
      <SurveyLayer s={s} />

      {/* sill */}
      <Part s={s} range={T.sill} from={{ y: 60, z: 70, opacity: 0 }} style={box(-3, 213.5, 106, 6.5)}>
        <div className="absolute inset-0 rounded-[2px]" style={{ background: 'linear-gradient(180deg, #f4f2ee 0%, #b1adaa 30%, #726e6d 100%)', boxShadow: '0 4px 10px rgba(0,0,0,0.6)' }} />
      </Part>

      {/* side jambs */}
      <Part s={s} range={T.jambL} from={{ x: -120, z: 60, rz: -8, opacity: 0 }} style={box(0, 50, 8, 164)}>
        <div className="absolute inset-0" style={{ background: TRIM, boxShadow: `inset ${U(-0.6)} 0 0 rgba(0,0,0,0.12), 0 6px 18px rgba(0,0,0,0.45)` }} />
        <JambFace height={164} />
      </Part>
      <Part s={s} range={T.jambR} from={{ x: 120, z: 60, rz: 8, opacity: 0 }} style={box(92, 50, 8, 164)}>
        <div className="absolute inset-0" style={{ background: TRIM, boxShadow: `inset ${U(0.6)} 0 0 rgba(0,0,0,0.12), 0 6px 18px rgba(0,0,0,0.45)` }} />
        <div className="absolute top-0" style={{ ...P3D, left: 0, width: U(14), height: U(164), transformOrigin: 'left center', transform: 'rotateY(90deg)', background: 'linear-gradient(90deg, #c9c1b5 0%, #a39a8e 70%, #7d756b 100%)' }}>
          <Part s={s} range={T.strike} from={{ z: 30, opacity: 0 }} style={box(3, 73, 6, 14)}>
            <div className="absolute inset-0 rounded-[2px]" style={{ background: STEEL, boxShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              <span className="absolute left-1/2 top-1/2 h-[36%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-[1px] bg-stone-900" />
            </div>
          </Part>
          {strike.map((k) => <Screw key={k.id} s={s} x={k.x} y={k.y} r={k.r} at={k.at} />)}
        </div>
      </Part>

      {/* arched head */}
      <Part s={s} range={T.head} from={{ y: -140, z: 40, rx: -35, opacity: 0 }} style={box(0, 0, 100, 50.5)}>
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute rounded-full"
            style={{
              ...box(0, 0, 100, 100),
              border: `${U(8)} solid #e6e1d8`,
              boxShadow: `inset 0 0 0 ${U(0.6)} rgba(0,0,0,0.12), inset 0 ${U(2)} ${U(4)} rgba(0,0,0,0.25)`,
              background: 'transparent',
            }}
          />
          {/* keystone */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 0, width: U(7), height: U(9), background: '#d6cfc4', clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }} />
        </div>
      </Part>

      {HINGE_YS.map((y, i) => <Hinge key={y} s={s} y={y} range={T.hinges[i]} />)}
      {frameScrews.map((k) => <Screw key={k.id} s={s} x={k.x} y={k.y} r={k.r} at={k.at} />)}

      <Slab s={s} />
      <GlowLayer s={s} />
    </motion.div>
  )
}
