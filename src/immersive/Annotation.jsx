import { useRef } from 'react'
import { Html, useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { STATION_COUNT } from './CameraRig'

// Fade window measured in "station-index" space (0..STATION_COUNT-1), driven
// by scroll rather than raw camera distance. A panel is fully visible while
// its own station is the active one, then cross-fades out *before* the next
// station's panel fades in — so adjacent stations never pile up on the bright
// paper. FULL: within this of the active index → solid. GONE: beyond this →
// hidden. The narrow band between them is a crisp hand-off.
const FULL = 0.26
const GONE = 0.52

// A styled panel anchored to a point in 3D space. It stays crisp and
// screen-legible (billboarded, not perspective-warped) — the way an
// annotation sits on top of a chart — and is shown only for its own station.
export default function Annotation({
  position,
  children,
  className = '',
  interactive = false,
  station = 0,
}) {
  const ref = useRef(null)
  const scroll = useScroll()

  useFrame(() => {
    const el = ref.current
    if (!el) return
    const active = scroll.offset * (STATION_COUNT - 1)
    const d = Math.abs(active - station)

    let o = 1
    if (d > GONE) o = 0
    else if (d > FULL) o = 1 - (d - FULL) / (GONE - FULL)

    el.style.opacity = o.toFixed(3)
    el.style.pointerEvents = interactive && o > 0.65 ? 'auto' : 'none'
  })

  return (
    <Html position={position} center zIndexRange={[40, 0]} prepend>
      <div ref={ref} className={`anno ${className}`}>
        {children}
      </div>
    </Html>
  )
}
