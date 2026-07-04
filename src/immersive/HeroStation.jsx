import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { profile } from '../data/profile'
import { theme } from '../theme'
import Annotation from './Annotation'

// A slow wireframe globe behind the name — a restrained nod to the global
// (US · EU · APAC) scope, not a decorative gimmick. Tilted orbital rings
// give it structure and bookend the contact station's closing rings.
function Globe() {
  const ref = useRef(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.06
  })
  return (
    <group ref={ref} position={[0, 2, -5]}>
      <mesh>
        <icosahedronGeometry args={[3.4, 2]} />
        <meshBasicMaterial color={theme.ink} wireframe transparent opacity={0.12} />
      </mesh>
      {/* equatorial + two tilted great-circle rings, drawn in ink + one redline */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.1, 0.008, 8, 120]} />
        <meshBasicMaterial color={theme.redline} transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 2, Math.PI / 3, 0]}>
        <torusGeometry args={[4.1, 0.007, 8, 120]} />
        <meshBasicMaterial color={theme.slate} transparent opacity={0.45} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0, Math.PI / 5]}>
        <torusGeometry args={[4.1, 0.007, 8, 120]} />
        <meshBasicMaterial color={theme.slate} transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

export default function HeroStation() {
  return (
    <group>
      <Globe />
      <Annotation position={[0, 2.1, 0]} className="anno--hero" near={20} far={28}>
        <span className="eyebrow">Data · Modeling · Decision support</span>
        <h1 className="anno__name">{profile.name}</h1>
        <p className="anno__tagline">{profile.tagline}</p>
        <p className="anno__meta mono">
          {profile.location} · {profile.availability}
        </p>
      </Annotation>
    </group>
  )
}
