import { useMemo } from 'react'
import { Instances, Instance, Line } from '@react-three/drei'
import { Color } from 'three'
import { stationZ, theme } from '../theme'
import Annotation from './Annotation'

const Z = stationZ.territory
const COLS = 11
const ROWS = 8
const GAP = 1.12

// Bounded footprint of the tile field — frames the boxes as one map.
const PLATE_W = COLS * GAP + 1.4
const PLATE_D = ROWS * GAP + 1.4
const HW = PLATE_W / 2
const HD = PLATE_D / 2
const BORDER = [
  [-HW, 0.05, -HD],
  [HW, 0.05, -HD],
  [HW, 0.05, HD],
  [-HW, 0.05, HD],
  [-HW, 0.05, -HD],
]

// A 3D territory heat-field: a grid of extruded tiles whose height and
// color encode intensity — the way an aligned sales geography looks when
// you stack opportunity on top of it.
function buildTiles() {
  const low = new Color(theme.cyanDim)
  const high = new Color(theme.amber)
  const tiles = []
  const cx = (COLS - 1) / 2
  const cz = (ROWS - 1) / 2
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      const x = (c - cx) * GAP
      const z = (r - cz) * GAP
      // Two opportunity "hot spots" plus a gentle base gradient.
      const d1 = Math.hypot(c - 3, r - 5)
      const d2 = Math.hypot(c - 8, r - 2)
      const v =
        Math.max(0, 1 - d1 / 5) * 0.8 +
        Math.max(0, 1 - d2 / 4) * 0.7 +
        (c / COLS) * 0.15
      const value = Math.min(1, v)
      const color = low.clone().lerp(high, value)
      tiles.push({
        x,
        z,
        h: 0.25 + value * 3.1,
        color: `#${color.getHexString()}`,
      })
    }
  }
  return tiles
}

export default function TerritoryMap() {
  const tiles = useMemo(buildTiles, [])

  return (
    <group position={[0, 0, Z]}>
      {/* Footprint plate + border so the field reads as a bounded map */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[PLATE_W, PLATE_D]} />
        <meshBasicMaterial color="#08111f" transparent opacity={0.5} />
      </mesh>
      <Line points={BORDER} color={theme.cyanDim} lineWidth={1} transparent opacity={0.6} />

      <Instances limit={COLS * ROWS} castShadow={false}>
        <boxGeometry args={[0.82, 1, 0.82]} />
        <meshStandardMaterial
          roughness={0.45}
          metalness={0.1}
          emissive={theme.cyanDim}
          emissiveIntensity={0.18}
          toneMapped={false}
        />
        {tiles.map((t, i) => (
          <Instance
            key={i}
            position={[t.x, t.h / 2, t.z]}
            scale={[1, t.h, 1]}
            color={t.color}
          />
        ))}
      </Instances>

      <Annotation position={[-6.4, 4.8, 3]} className="anno--section" near={22} far={30}>
        <span className="eyebrow">Territory design</span>
        <h2 className="anno__title">Geography, balanced</h2>
        <p className="anno__text">
          Aligning ~$25B of portfolio across the field force — workload and
          opportunity weighed tile by tile, US · EU · APAC.
        </p>
      </Annotation>
    </group>
  )
}
