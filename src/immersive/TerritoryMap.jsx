import { useMemo } from 'react'
import { Edges, Line } from '@react-three/drei'
import { Color, MathUtils } from 'three'
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

// A 3D territory as an architectural massing model: paper-white extrusions
// with fine ink edges. Opportunity is read by HEIGHT (the way a scale model
// sits on a drafting table); only the hottest cluster picks up a faint
// redline wash, so the eye still lands on where the opportunity concentrates.
function buildTiles() {
  const paper = new Color(theme.sheet)
  const hot = new Color(theme.redlineSoft)
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
      // Redline wash reserved for the hot cluster only.
      const wash = MathUtils.smoothstep(value, 0.55, 1) * 0.72
      const color = paper.clone().lerp(hot, wash)
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
        <meshBasicMaterial color={theme.sheet} transparent opacity={0.55} />
      </mesh>
      <Line points={BORDER} color={theme.slate} lineWidth={1} transparent opacity={0.7} />

      {/* Individual extrusions (not instanced) so each carries its own ink
          edge — the line that makes it read as a paper model. 88 simple,
          shadow-free boxes stays light on integrated GPUs. */}
      {tiles.map((t, i) => (
        <mesh key={i} position={[t.x, t.h / 2, t.z]} scale={[1, t.h, 1]}>
          <boxGeometry args={[0.82, 1, 0.82]} />
          <meshStandardMaterial color={t.color} roughness={0.92} metalness={0} />
          <Edges threshold={15} color={theme.inkSoft} />
        </mesh>
      ))}

      <Annotation position={[-6.4, 4.8, 3]} className="anno--section" station={3}>
        <span className="eyebrow">Specialization · Pharma</span>
        <h2 className="anno__title">Where I proved it</h2>
        <p className="anno__text">
          Two years aligning ~$25B of pharma portfolio across the field force —
          workload and opportunity weighed tile by tile, at IQVIA scale,
          US · EU · APAC.
        </p>
      </Annotation>
    </group>
  )
}
