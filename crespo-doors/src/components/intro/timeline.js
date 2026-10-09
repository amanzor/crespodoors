// Scroll timeline for the door-assembly intro.
// Every value below is a fraction of the intro's total scroll distance (0 → 1).
// Geometry is in "units" (u): the door frame is 100u wide × 220u tall.

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
export const progress = (v, [a, b]) => clamp01((v - a) / (b - a))
export const lerp = (a, b, t) => a + (b - a) * t

export const ease = {
  linear: (t) => t,
  out: (t) => 1 - Math.pow(1 - t, 3),
  in: (t) => t * t * t,
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  // lands with a small overshoot, like a part seating with a "thunk"
  back: (t) => {
    const c1 = 1.5
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  },
}

export const STEPS = [
  { at: 0.0, n: '00', label: 'Survey', title: 'Every great door starts with a measurement.', spec: 'Rough opening 36″ × 96″ · laser-verified on site' },
  { at: 0.08, n: '01', label: 'Frame', title: 'A frame squared to 1/32″.', spec: 'Kiln-dried jambs · #10 structural screws into the stud' },
  { at: 0.22, n: '02', label: 'Hinges', title: 'Hung on ball-bearing hinges.', spec: '3 × 4½″ hinges · 3″ screws, never just the trim' },
  { at: 0.345, n: '03', label: 'Slab', title: 'A solid-core slab, hand-fitted.', spec: '1¾″ solid core · even ⅛″ reveal all the way around' },
  { at: 0.46, n: '04', label: 'Lockset', title: 'Hardware that locks like it means it.', spec: 'Grade 1 deadbolt · reinforced strike plate' },
  { at: 0.585, n: '05', label: 'Seal', title: 'Sealed tight. Not one draft gets through.', spec: 'Compression weatherstrip · U-factor 0.27' },
  { at: 0.68, n: '06', label: 'Welcome', title: 'Now — step inside.', spec: 'Sold · Engineered · Installed · Delivered' },
]

export const stepAt = (v) => {
  let i = 0
  for (let k = 0; k < STEPS.length; k++) if (v >= STEPS[k].at) i = k
  return i
}

// Part landing windows
export const T = {
  survey: [0.0, 0.07],
  surveyOut: [0.12, 0.17],
  jambL: [0.08, 0.135],
  jambR: [0.095, 0.15],
  head: [0.11, 0.165],
  sill: [0.12, 0.165],
  hinges: [[0.222, 0.252], [0.229, 0.259], [0.236, 0.266]],
  slab: [0.36, 0.445],
  leakIn: [0.44, 0.47],
  plate: [0.47, 0.505],
  strike: [0.475, 0.51],
  deadbolt: [0.49, 0.52],
  lever: [0.5, 0.535],
  seal: [0.592, 0.65],
  thumbTurn: [0.684, 0.7],
  leverPress: [0.69, 0.715],
  swing: [0.715, 0.86],
  slabOut: [0.812, 0.852],
  spill: [0.72, 0.8],
  spillOut: [0.86, 0.9],
  video: [0.715, 1.0],
  hudOut: [0.7, 0.76],
  gridOut: [0.76, 0.88],
  hero: [0.915, 0.985],
}

// Screws. `face: 'strike'` screws live on the right jamb's inner face (local coords).
const hingeYs = [72, 132, 192]
export const SCREWS = [
  { id: 'f1', x: 4, y: 62, at: [0.165, 0.185] },
  { id: 'f2', x: 96, y: 62, at: [0.172, 0.192] },
  { id: 'f3', x: 4, y: 206, at: [0.179, 0.199] },
  { id: 'f4', x: 96, y: 206, at: [0.186, 0.206] },
  { id: 'f5', x: 17.5, y: 17.5, at: [0.193, 0.213] },
  { id: 'f6', x: 82.5, y: 17.5, at: [0.2, 0.22] },
  ...hingeYs.flatMap((y, i) => [
    { id: `h${i}a`, x: 6.2, y: y - 4.2, r: 1.05, at: [0.255 + i * 0.023, 0.273 + i * 0.023] },
    { id: `h${i}b`, x: 6.2, y: y + 4.2, r: 1.05, at: [0.2665 + i * 0.023, 0.2845 + i * 0.023] },
  ]),
  { id: 's1', face: 'strike', x: 6, y: 76, r: 0.95, at: [0.535, 0.552] },
  { id: 's2', face: 'strike', x: 6, y: 84, r: 0.95, at: [0.545, 0.562] },
  { id: 'l1', door: true, x: 83, y: 106.6, r: 0.9, at: [0.555, 0.572] },
  { id: 'l2', door: true, x: 83, y: 133.4, r: 0.9, at: [0.565, 0.582] },
]
export const HINGE_YS = hingeYs

// Camera keyframes: [t, focusX, focusY, scale, rotateY, rotateX]
// `END` scale is resolved at runtime so the doorway always overfills the viewport.
export const END = 'END'
export const CAMERA = [
  [0.0, 50, 124, 0.84, -26, 9],
  [0.08, 50, 122, 1.0, -18, 6],
  [0.2, 50, 122, 1.0, -14, 5],
  [0.245, 12, 132, 2.1, -27, 3],
  [0.33, 12, 128, 2.1, -22, 3],
  [0.375, 50, 122, 1.0, -10, 4],
  [0.46, 50, 122, 1.02, -6, 3],
  [0.505, 80, 122, 2.15, 18, 2],
  [0.58, 80, 122, 2.15, 13, 2],
  [0.625, 50, 122, 0.98, 0, 2],
  [0.69, 50, 121, 1.05, 0, 0],
  [0.75, 50, 120, 1.35, 0, 0],
  [0.95, 50, 120, END, 0, 0],
  [1.0, 50, 120, END, 0, 0],
]

export function cameraAt(v, endScale) {
  const k = CAMERA
  if (v <= k[0][0]) return resolve(k[0], endScale)
  for (let i = 0; i < k.length - 1; i++) {
    const a = k[i]
    const b = k[i + 1]
    if (v <= b[0]) {
      const t = ease.inOut((v - a[0]) / (b[0] - a[0]))
      const A = resolve(a, endScale)
      const B = resolve(b, endScale)
      return A.map((x, j) => lerp(x, B[j], t))
    }
  }
  return resolve(k[k.length - 1], endScale)
}

function resolve(frame, endScale) {
  const [, fx, fy, s, ry, rx] = frame
  return [fx, fy, s === END ? endScale : s, ry, rx]
}
