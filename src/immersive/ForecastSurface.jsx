import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PlaneGeometry, DoubleSide } from 'three'
import { Line } from '@react-three/drei'
import { theme, stationZ } from '../theme'
import Annotation from './Annotation'

const Z = stationZ.forecast

// Height field. u = time (x-axis, 0..1), w = scenario (z-axis, -1..1).
// A steep exponential ramp, scenarios that fan apart over time, and a
// seasonal swell whose amplitude grows with the horizon — a dramatic but
// still plausible forecast response surface.
function height(u, w = 0) {
  const growth = Math.pow(u, 1.55) * 3.8 // exponential ramp
  const scenario = u * w * 1.4 // scenarios diverge further out
  const swell = Math.sin(u * Math.PI * 5 + w * 1.6) * (0.26 + u * 0.75)
  const ridge = Math.sin(w * Math.PI * 1.4) * 0.42 * u // rolling cross-ridges
  return growth + scenario + swell + ridge
}

function crest(u, spread = 0) {
  const x = -8 + u * 16
  return [x, height(u) + spread + 0.08, 0]
}

// Sample the forecast ridge line: solid history up to the "now" cut,
// then a sharply diverging base / upside / downside fan.
function buildFan() {
  const cut = 0.58
  const history = []
  const base = []
  const up = []
  const down = []
  for (let i = 0; i <= 80; i++) {
    const u = i / 80
    if (u <= cut) history.push(crest(u))
    if (u >= cut) {
      const s = (u - cut) / (1 - cut)
      base.push(crest(u))
      up.push(crest(u, s * s * 2.0))
      down.push(crest(u, -s * s * 1.6))
    }
  }
  return { history, base, up, down }
}

export default function ForecastSurface() {
  const geo = useMemo(() => {
    const depth = 12
    const g = new PlaneGeometry(16, depth, 56, 44)
    g.rotateX(-Math.PI / 2)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const u = (x + 8) / 16 // time 0..1
      const w = z / (depth / 2) // scenario -1..1
      pos.setY(i, height(u, w))
    }
    g.computeVertexNormals()
    return g
  }, [])

  const fan = useMemo(buildFan, [])
  // The "now" cut — where measured history ends and the forecast fans out.
  // This is the one point the redline is allowed to mark.
  const cutPoint = fan.base[0]
  const group = useRef(null)

  // Very slow breathing rotation — enough to read as a live surface,
  // restrained enough to stay analytical.
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.12) * 0.06
    }
  })

  return (
    <group position={[0, 0.7, Z]}>
      <group ref={group}>
        {/* Faint paper underlay so the surface reads as a solid sheet */}
        <mesh geometry={geo}>
          <meshStandardMaterial
            color={theme.sheet}
            transparent
            opacity={0.4}
            roughness={1}
            metalness={0}
            side={DoubleSide}
          />
        </mesh>
        {/* Wireframe mesh drawn in ink — the "surface" reading */}
        <mesh geometry={geo}>
          <meshBasicMaterial
            color={theme.ink}
            wireframe
            transparent
            opacity={0.22}
          />
        </mesh>

        {/* Forecast fan plotted over the crest: ink history, slate forecast */}
        <Line points={fan.history} color={theme.ink} lineWidth={2.4} />
        <Line
          points={fan.base}
          color={theme.slate}
          lineWidth={2.4}
          dashed
          dashSize={0.35}
          gapSize={0.2}
        />
        <Line points={fan.up} color={theme.slate} lineWidth={1} transparent opacity={0.45} />
        <Line points={fan.down} color={theme.slate} lineWidth={1} transparent opacity={0.45} />

        {/* The redline: marks the "now" cut where forecast begins */}
        <Line
          points={[
            [cutPoint[0], cutPoint[1] - 1.1, 0],
            [cutPoint[0], cutPoint[1] + 1.1, 0],
          ]}
          color={theme.redline}
          lineWidth={1.4}
        />
        <mesh position={cutPoint}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial color={theme.redline} toneMapped={false} />
        </mesh>
      </group>

      <Annotation position={[-6.6, 5.2, 0]} className="anno--section" near={22} far={30}>
        <span className="eyebrow">Forecasting</span>
        <h2 className="anno__title">Curves you can defend</h2>
        <p className="anno__text">
          ARIMA/SARIMA and scenario models — history, base case and an
          upside/downside band, read as one surface. The redline marks where
          fact ends and forecast begins.
        </p>
      </Annotation>
    </group>
  )
}
