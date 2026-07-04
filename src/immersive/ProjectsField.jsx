import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { projects } from '../data/projects'
import { stationZ, theme } from '../theme'
import Annotation from './Annotation'

const Z = stationZ.projects

function ProjectMarker({ color }) {
  const ref = useRef(null)
  useFrame(({ clock }, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.6) * 0.2
    }
  })
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.62, 0]} />
      <meshBasicMaterial color={color} wireframe toneMapped={false} />
    </mesh>
  )
}

// Projects are objects in the environment; each is a node you can open.
// Adding an entry to data/projects.js drops a new node in automatically.
// `onOpenProject` is a bound navigate() supplied from outside the Canvas —
// React Router context does not cross the r3f reconciler boundary, so we
// can't use <Link> / router hooks in here.
export default function ProjectsField({ onOpenProject }) {
  const spread = 4.2
  // Lay the nodes out centered, treating the trailing "More soon" ghost as
  // one extra slot — so the whole cluster stays balanced for any count.
  const slots = projects.length + 1
  const centerOffset = (slots - 1) / 2
  const xAt = (i) => (i - centerOffset) * spread

  return (
    <group position={[0, 2.4, Z]}>
      {projects.map((p, i) => {
        const x = xAt(i)
        const accent = p.accent === 'redline' ? theme.redline : theme.slate
        return (
          <group key={p.slug} position={[x, 0, 0]}>
            <ProjectMarker color={accent} />
            <Annotation
              position={[0, -1.5, 0]}
              className={`anno--project anno--${p.accent}`}
              interactive
              near={22}
              far={32}
            >
              <a
                className="anno-card"
                href={`/projects/${p.slug}`}
                onClick={(e) => {
                  e.preventDefault()
                  onOpenProject?.(p.slug)
                }}
              >
                <span className="eyebrow">{p.domain}</span>
                <span className="anno-card__title">{p.title}</span>
                <span className="anno-card__tagline">{p.tagline}</span>
                <span className="anno-card__cta">View detail →</span>
              </a>
            </Annotation>
          </group>
        )
      })}

      {/* Ghost node signalling the collection grows over time. */}
      <group position={[xAt(projects.length), 0, -0.5]}>
        <mesh>
          <octahedronGeometry args={[0.42, 0]} />
          <meshBasicMaterial
            color={theme.slateSoft}
            wireframe
            transparent
            opacity={0.5}
            toneMapped={false}
          />
        </mesh>
        <Annotation position={[0, -1.3, 0]} className="anno--ghost" near={20} far={28}>
          <span className="anno-card__title anno-card__title--muted">More soon</span>
        </Annotation>
      </group>

      <Annotation position={[0, 3.4, 0]} className="anno--section" near={22} far={32}>
        <span className="eyebrow">Projects</span>
        <h2 className="anno__title">Work you can open</h2>
      </Annotation>
    </group>
  )
}
