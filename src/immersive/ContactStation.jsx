import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { profile } from '../data/profile'
import { stationZ, theme } from '../theme'
import Annotation from './Annotation'

const Z = stationZ.contact

// A calm closing motif behind the card — concentric orbital rings that
// bookend the hero globe (the journey opens and closes on a "global" note)
// without repeating it. Kept very faint so the card stays the focus.
function ClosingMotif() {
  const ref = useRef(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.05
  })
  return (
    <group ref={ref} position={[0, 0.3, -2.6]}>
      <mesh>
        <torusGeometry args={[4.2, 0.01, 8, 120]} />
        <meshBasicMaterial color={theme.cyan} transparent opacity={0.14} />
      </mesh>
      <mesh rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[5.6, 0.008, 8, 120]} />
        <meshBasicMaterial color={theme.amber} transparent opacity={0.1} />
      </mesh>
    </group>
  )
}

export default function ContactStation() {
  return (
    <group position={[0, 2.2, Z]}>
      <ClosingMotif />
      <Annotation
        position={[0, 0, 0]}
        className="anno--contact"
        interactive
        near={22}
        far={30}
      >
        <span className="eyebrow">Contact</span>
        <h2 className="anno__title">Let’s build the forecast.</h2>
        <p className="anno__text">
          Open to commercial analytics and forecasting roles — Pune, Hyderabad
          or remote.
        </p>
        <div className="anno__actions">
          <a
            className="btn btn--primary"
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Résumé
          </a>
          {profile.links.map((l) => (
            <a
              key={l.kind}
              className="btn"
              href={l.href}
              target={l.kind === 'email' ? undefined : '_blank'}
              rel="noopener noreferrer"
            >
              {l.label}
            </a>
          ))}
        </div>
      </Annotation>
    </group>
  )
}
