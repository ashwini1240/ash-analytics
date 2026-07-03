import { useMemo } from 'react'
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Vector3, MathUtils } from 'three'

// Camera keyframes — one framing per station. Scroll interpolates between
// them, so the visitor controls pace but never the framing. Order/positions
// mirror stationZ in theme.js.
const KEYS = [
  { pos: [0, 2.2, 11], tgt: [0, 2.0, 0] }, // hero
  { pos: [0, 4.2, -4], tgt: [0, 2.2, -22] }, // forecast
  { pos: [0, 3.2, -30], tgt: [0, 3.5, -46] }, // metrics
  { pos: [0, 6.0, -52], tgt: [0, 0.2, -64] }, // territory (look down)
  { pos: [0, 3.0, -70.5], tgt: [0, 1.4, -88] }, // projects
  { pos: [0, 2.4, -92], tgt: [0, 2.2, -108] }, // contact
]

// Must be rendered inside <ScrollControls>. Reports live scroll offset and
// the scroll element back through `scrollState` for the HUD to consume.
export default function CameraRig({ scrollState }) {
  const scroll = useScroll()
  const v = useMemo(
    () => ({
      p: new Vector3(),
      t: new Vector3(),
      pa: new Vector3(),
      pb: new Vector3(),
      ta: new Vector3(),
      tb: new Vector3(),
    }),
    [],
  )

  useFrame((state) => {
    const off = scroll.offset
    if (scrollState) {
      scrollState.current.offset = off
      scrollState.current.el = scroll.el
    }

    const n = KEYS.length - 1
    const f = MathUtils.clamp(off * n, 0, n)
    const i = Math.min(Math.floor(f), n - 1)
    const local = f - i
    const s = local * local * (3 - 2 * local) // cubic smoothstep, no hold

    v.pa.fromArray(KEYS[i].pos)
    v.pb.fromArray(KEYS[i + 1].pos)
    v.ta.fromArray(KEYS[i].tgt)
    v.tb.fromArray(KEYS[i + 1].tgt)
    v.p.lerpVectors(v.pa, v.pb, s)
    v.t.lerpVectors(v.ta, v.tb, s)

    // Subtle idle drift keeps the scene alive when the visitor pauses.
    const dt = state.clock.elapsedTime
    v.p.x += Math.sin(dt * 0.24) * 0.1
    v.p.y += Math.sin(dt * 0.19) * 0.07

    state.camera.position.copy(v.p)
    state.camera.lookAt(v.t)
  })

  return null
}

export const STATION_COUNT = KEYS.length
