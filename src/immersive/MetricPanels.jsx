import { Line } from '@react-three/drei'
import { metrics } from '../data/metrics'
import { stationZ, theme } from '../theme'
import Annotation from './Annotation'

const Z = stationZ.metrics

// Anchor points for the four outcome panels: a balanced quad — two upper,
// two lower, symmetric across center — with a "stem" dropping to the grid
// (a lollipop reading) so each number is visibly planted in the environment.
const spots = [
  [-6.2, 4.4, 0], //   $1B  upper-left
  [-2.4, 2.3, 0.4], //  <5%  lower-left
  [2.4, 4.4, 0.4], // ~$25B  upper-right
  [6.2, 2.3, 0], //    70%  lower-right
]

export default function MetricPanels() {
  return (
    <group position={[0, 0, Z]}>
      {metrics.map((m, i) => {
        const [x, y, z] = spots[i]
        const accent = m.accent === 'redline' ? theme.redline : theme.slate
        return (
          <group key={m.label}>
            <Line
              points={[
                [x, 0.02, z],
                [x, y - 0.4, z],
              ]}
              color={theme.ink}
              lineWidth={1}
              transparent
              opacity={0.3}
            />
            <mesh position={[x, y - 0.4, z]}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshBasicMaterial color={accent} toneMapped={false} />
            </mesh>
            <Annotation
              position={[x, y, z]}
              className={`anno--metric anno--${m.accent}`}
              station={2}
            >
              <span className="metric-value">{m.value}</span>
              <span className="anno__metric-label">{m.label}</span>
              <span className="anno__metric-detail">{m.detail}</span>
            </Annotation>
          </group>
        )
      })}

      <Annotation position={[0, 6.7, 0]} className="anno--section" station={2}>
        <span className="eyebrow">Outcomes</span>
        <h2 className="anno__title">Measured, not asserted</h2>
      </Annotation>
    </group>
  )
}
