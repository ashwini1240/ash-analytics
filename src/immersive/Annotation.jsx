import { useRef } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

const tmp = new Vector3()
const dir = new Vector3()

// A styled panel anchored to a point in 3D space. It stays crisp and
// screen-legible (billboarded, not perspective-warped) — the way an
// annotation sits on top of a chart — and fades with distance so only the
// station you're near is emphasized. Anything behind the camera (a station
// you've already flown past) is culled so it can't linger or mirror.
export default function Annotation({
  position,
  children,
  className = '',
  interactive = false,
  near = 18,
  far = 30,
}) {
  const ref = useRef(null)

  useFrame(({ camera }) => {
    const el = ref.current
    if (!el) return
    // Vector from camera to the anchor, and how far it sits *in front* of us.
    tmp.set(...position).sub(camera.position)
    camera.getWorldDirection(dir)
    const forward = tmp.dot(dir)
    const d = tmp.length()

    let o = 1
    if (forward < 1) o = 0 // behind the camera (or right on top of it)
    else if (d > far) o = 0
    else if (d > near) o = 1 - (d - near) / (far - near)
    o = Math.max(0, Math.min(1, o))
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
