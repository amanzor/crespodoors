// Scroll timeline for the door-assembly intro.
// Every value below is a fraction of the intro's total scroll distance (0 → 1).
// Geometry is in "units" (u): the double-door frame is 150u wide × 201u tall.

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

// ── Geometry ────────────────────────────────────────────────────────────────
export const FRAME = { w: 150, h: 201 }
// clear opening inside the frame
export const OPENING = { x0: 7, y0: 7, x1: 143, y1: 196 }
// door leaves (scene coords)
export const LEAF = { w: 67.5, h: 188.4, y: 7.3, leftX: 7.3, rightX: 75.2 }
// leaf-local layout
export const STILE = 9
export const RAIL = { top: [0, 9], mid: [103, 109], bottom: [162, 188.4] }
export const SECTIONS = {
  upper: { x: STILE, y: 9, w: LEAF.w - 2 * STILE, h: 94 },
  lower: { x: STILE, y: 109, w: LEAF.w - 2 * STILE, h: 53 },
}
// hardware on the meeting stile (leaf-local, left leaf; mirrored for the right)
export const PLATE = { x: 60.75, y: 95, w: 4.5, h: 23 }
export const LEVER_Y = 111

export const END_FOCUS = [75, 101.5]

export const STEPS = [
  { at: 0.0, n: '00', label: 'Survey', title: 'Every great entrance starts with a measurement.', spec: 'Rough opening 72″ × 96″ · double door, laser-verified on site' },
  { at: 0.07, n: '01', label: 'Frame', title: 'A solid walnut frame, squared to 1/32″.', spec: 'Kiln-dried jambs · #10 structural screws into the stud' },
  { at: 0.2, n: '02', label: 'Stiles & rails', title: 'Hand-joined stiles and rails, hung on steel hinges.', spec: 'Mortise-and-tenon joinery · 6 ball-bearing hinges' },
  { at: 0.35, n: '03', label: 'Glass', title: 'Insulated low-E glass, set in place.', spec: 'Dual-pane · argon-filled · tempered for safety' },
  { at: 0.445, n: '04', label: 'Slats', title: 'Solid walnut slats, cut on the diagonal.', spec: '45° chevron pattern · book-matched grain' },
  { at: 0.565, n: '05', label: 'Hardware', title: 'Engineered hardware, built to be touched every day.', spec: 'Mortise locksets · matte-black levers · Grade 1 rated' },
  { at: 0.695, n: '06', label: 'Lock & seal', title: 'Locked at three points. Sealed all the way around.', spec: 'Multipoint lock · compression weatherstrip · U-factor 0.27' },
  { at: 0.76, n: '07', label: 'Welcome', title: 'Now — step inside.', spec: 'Sold · Engineered · Installed · Delivered' },
]
export const LAST_STEP = STEPS[STEPS.length - 1].n

export const stepAt = (v) => {
  let i = 0
  for (let k = 0; k < STEPS.length; k++) if (v >= STEPS[k].at) i = k
  return i
}

// ── Part landing windows ────────────────────────────────────────────────────
export const T = {
  survey: [0.0, 0.065],
  surveyOut: [0.11, 0.16],
  jambL: [0.07, 0.12],
  jambR: [0.08, 0.13],
  head: [0.095, 0.145],
  sill: [0.105, 0.145],
  stiles: [[0.2, 0.235], [0.207, 0.242]],
  rails: [[0.222, 0.255], [0.229, 0.262], [0.236, 0.269]],
  hinges: [0.262, 0.29],
  glass: [[0.36, 0.4], [0.368, 0.408], [0.376, 0.416], [0.384, 0.424]],
  glassSweep: [0.405, 0.47],
  slats: [0.452, 0.555],
  leakIn: [0.47, 0.5],
  plates: [0.574, 0.6],
  levers: [0.624, 0.655],
  seal: [0.7, 0.745],
  boltsOut: [0.735, 0.755],
  thumbTurn: [0.758, 0.77],
  leverPress: [0.765, 0.785],
  boltsIn: [0.77, 0.785],
  swing: [0.785, 0.9],
  slabOut: [0.855, 0.89],
  spill: [0.79, 0.85],
  spillOut: [0.9, 0.93],
  video: [0.785, 1.0],
  hudOut: [0.8, 0.86],
  gridOut: [0.82, 0.92],
  hero: [0.935, 0.99],
}

// ── Screws ──────────────────────────────────────────────────────────────────
// `leaf` screws live on a door leaf (leaf-local coords) so they swing with it.
const HINGE_YS = [38, 101.5, 165]
export const HINGES = HINGE_YS
export const SCREWS = [
  { id: 'f1', x: 3.5, y: 22, at: [0.15, 0.17] },
  { id: 'f2', x: 146.5, y: 22, at: [0.157, 0.177] },
  { id: 'f3', x: 3.5, y: 182, at: [0.164, 0.184] },
  { id: 'f4', x: 146.5, y: 182, at: [0.171, 0.191] },
  { id: 'f5', x: 40, y: 3.5, at: [0.178, 0.198] },
  { id: 'f6', x: 110, y: 3.5, at: [0.185, 0.205] },
  ...HINGE_YS.flatMap((y, i) => {
    const a = 0.29 + i * 0.017
    return [
      { id: `hl${i}a`, x: 5.2, y: y - 4.2, r: 0.95, dark: true, at: [a, a + 0.016] },
      { id: `hr${i}a`, x: 144.8, y: y - 4.2, r: 0.95, dark: true, at: [a + 0.002, a + 0.018] },
      { id: `hl${i}b`, x: 5.2, y: y + 4.2, r: 0.95, dark: true, at: [a + 0.007, a + 0.023] },
      { id: `hr${i}b`, x: 144.8, y: y + 4.2, r: 0.95, dark: true, at: [a + 0.009, a + 0.025] },
    ]
  }),
  { id: 'pl1', leaf: 'left', x: PLATE.x + PLATE.w / 2, y: PLATE.y + 2, r: 0.85, dark: true, at: [0.6, 0.617] },
  { id: 'pr1', leaf: 'right', x: PLATE.x + PLATE.w / 2, y: PLATE.y + 2, r: 0.85, dark: true, at: [0.606, 0.623] },
  { id: 'pl2', leaf: 'left', x: PLATE.x + PLATE.w / 2, y: PLATE.y + PLATE.h - 2, r: 0.85, dark: true, at: [0.614, 0.631] },
  { id: 'pr2', leaf: 'right', x: PLATE.x + PLATE.w / 2, y: PLATE.y + PLATE.h - 2, r: 0.85, dark: true, at: [0.62, 0.637] },
]

// ── Camera keyframes: [t, focusX, focusY, scale, rotateY, rotateX] ──────────
// `END` scale is resolved at runtime so the doorway always overfills the viewport.
export const END = 'END'
export const CAMERA = [
  [0.0, 75, 106, 0.84, -24, 9],
  [0.07, 75, 104, 1.0, -16, 6],
  [0.2, 75, 104, 1.0, -12, 5],
  [0.29, 24, 100, 1.85, -26, 3],
  [0.345, 24, 100, 1.85, -22, 3],
  [0.39, 75, 104, 1.02, 14, 4],
  [0.45, 75, 104, 1.0, 9, 3],
  [0.5, 75, 104, 1.06, -6, 3],
  [0.56, 75, 104, 1.0, -4, 2],
  [0.6, 75, 114, 2.4, 9, 1],
  [0.69, 75, 114, 2.4, 4, 1],
  [0.73, 75, 103, 0.98, 0, 1],
  [0.77, 75, 102, 1.04, 0, 0],
  [0.82, 75, 101.5, 1.3, 0, 0],
  [0.965, 75, 101.5, END, 0, 0],
  [1.0, 75, 101.5, END, 0, 0],
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
