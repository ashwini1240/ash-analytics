import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, PerformanceMonitor } from '@react-three/drei'
import { Link, useNavigate } from 'react-router-dom'
import { theme } from '../theme'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import Scene from './Scene'
import { STATION_COUNT } from './CameraRig'
import './immersive.css'

const STATIONS = [
  'Intro',
  'Forecasting',
  'Outcomes',
  'Territory',
  'Projects',
  'Contact',
]

// Fixed HUD: station rail + scroll hint. Reads the live scroll offset
// imperatively (no per-frame React state) and lets visitors jump to a
// station by clicking a marker.
function ScrollHud({ scrollState }) {
  const dotsRef = useRef([])
  const hintRef = useRef(null)

  useEffect(() => {
    let raf
    const n = STATION_COUNT - 1
    const tick = () => {
      const off = scrollState.current.offset ?? 0
      const active = Math.round(off * n)
      dotsRef.current.forEach((d, i) => {
        if (d) d.dataset.active = i === active ? 'true' : 'false'
      })
      if (hintRef.current) {
        hintRef.current.style.opacity = off > 0.02 ? '0' : '1'
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [scrollState])

  const goTo = (i) => {
    const el = scrollState.current.el
    if (!el) return
    const target = (i / (STATION_COUNT - 1)) * (el.scrollHeight - el.clientHeight)
    el.scrollTo({ top: target, behavior: 'smooth' })
  }

  return (
    <>
      <nav className="hud-rail" aria-label="Scene sections">
        {STATIONS.map((label, i) => (
          <button
            key={label}
            type="button"
            className="hud-dot"
            ref={(el) => (dotsRef.current[i] = el)}
            data-active="false"
            onClick={() => goTo(i)}
          >
            <span className="hud-dot__mark" aria-hidden="true" />
            <span className="hud-dot__label">{label}</span>
          </button>
        ))}
      </nav>
      <div className="hud-hint" ref={hintRef} aria-hidden="true">
        <span className="mono">Scroll to explore</span>
        <span className="hud-hint__arrow" />
      </div>
    </>
  )
}

export default function ImmersiveExperience({ dimmed = false }) {
  const scrollState = useRef({ offset: 0, el: null })
  const navigate = useNavigate()
  // Device pixel ratio is driven by live performance: start crisp, but drop
  // resolution (not frames) on integrated / low-end GPUs before they stutter.
  const [dpr, setDpr] = useState(1.6)
  // Bound outside the Canvas: router context doesn't cross into r3f.
  const onOpenProject = useCallback(
    (slug) => navigate(`/projects/${slug}`),
    [navigate],
  )

  return (
    <div className={`immersive${dimmed ? ' is-dimmed' : ''}`}>
      <div className="immersive__canvas" aria-hidden="true">
        <Canvas
          camera={{ position: [0, 2.2, 11], fov: 52, near: 0.1, far: 220 }}
          dpr={dpr}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          {/* Bright architect's-paper world. Distance fades into a cool
              blue-grey wash so the far stations keep their depth. */}
          <color attach="background" args={[theme.bg]} />
          <fog attach="fog" args={[theme.haze, 34, 150]} />
          {/* Neutral daylight: enough directional shape to read the paper
              massing model, no colored glow. */}
          <ambientLight intensity={0.85} />
          <directionalLight position={[6, 13, 6]} intensity={0.7} color="#ffffff" />
          <directionalLight position={[-8, 5, -24]} intensity={0.22} color={theme.slateSoft} />
          <PerformanceMonitor
            onDecline={() => setDpr(1)}
            onIncline={() => setDpr(1.75)}
          />
          <ScrollControls pages={7} damping={0.3}>
            <Scene scrollState={scrollState} onOpenProject={onOpenProject} />
          </ScrollControls>
        </Canvas>
      </div>

      <ScrollHud scrollState={scrollState} />

      {/* Screen-reader / keyboard content + skip-link target. The canvas
          itself is aria-hidden, so this carries the real information. */}
      <div id="main" tabIndex={-1} className="visually-hidden immersive-a11y">
        <h1>{profile.name}</h1>
        <p>{profile.role}. {profile.tagline}</p>
        <p>{profile.summary}</p>
        <p>
          This is an interactive 3D presentation. Use the “Reader view” button
          for a plain, fully accessible version.
        </p>
        <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
          Download résumé
        </a>
        <h2>Projects</h2>
        <ul>
          {projects.map((p) => (
            <li key={p.slug}>
              <Link to={`/projects/${p.slug}`}>
                {p.title} — {p.tagline}
              </Link>
            </li>
          ))}
        </ul>
        <h2>Contact</h2>
        <ul>
          {profile.links.map((l) => (
            <li key={l.kind}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
