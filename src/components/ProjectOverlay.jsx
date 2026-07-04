import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProject } from '../data/projects'
import { ArrowLeftIcon, ArrowUpRightIcon } from './icons'
import './project-overlay.css'

// Route-driven detail panel. Renders over whichever experience is active
// (the 3D scene stays mounted and dimmed behind it). Data-file driven, so
// every project gets a working /projects/<slug> page for free.
export default function ProjectOverlay() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const project = getProject(slug)
  const closeRef = useRef(null)

  const close = () => navigate('/', { replace: false })

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const accent = project?.accent === 'redline' ? 'redline' : 'slate'

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="overlay-title"
    >
      <button
        type="button"
        className="overlay__scrim"
        aria-label="Close project detail"
        onClick={close}
      />
      <article className={`overlay__panel accent-${accent}`}>
        <button
          type="button"
          className="btn btn--ghost overlay__back"
          onClick={close}
          ref={closeRef}
        >
          <ArrowLeftIcon />
          Back
        </button>

        {!project ? (
          <div className="overlay__body">
            <h1 id="overlay-title">Project not found</h1>
            <p className="overlay__lede">
              There’s no project with the id “{slug}”. It may have been
              renamed.
            </p>
          </div>
        ) : (
          <div className="overlay__body">
            <div className="overlay__meta eyebrow">
              <span>{project.domain}</span>
              <span aria-hidden="true">·</span>
              <span>{project.year}</span>
              <span aria-hidden="true">·</span>
              <span>{project.status}</span>
            </div>

            <h1 id="overlay-title">{project.title}</h1>
            <p className="overlay__tagline">{project.tagline}</p>
            <p className="overlay__lede">{project.summary}</p>

            {project.metrics?.length > 0 && (
              <div className="overlay__metrics">
                {project.metrics.map((m) => (
                  <div className="overlay__metric" key={m.label}>
                    <span className="metric-value">{m.value}</span>
                    <span className="overlay__metric-label">{m.label}</span>
                  </div>
                ))}
              </div>
            )}

            {project.highlights?.length > 0 && (
              <section className="overlay__section">
                <h2 className="overlay__h2">Overview</h2>
                <ul className="overlay__list">
                  {project.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </section>
            )}

            <div className="overlay__facets">
              {project.methods?.length > 0 && (
                <section className="overlay__section">
                  <h2 className="overlay__h2">Methods</h2>
                  <div className="chip-row">
                    {project.methods.map((m) => (
                      <span className={`chip chip--${accent}`} key={m}>
                        {m}
                      </span>
                    ))}
                  </div>
                </section>
              )}
              {project.stack?.length > 0 && (
                <section className="overlay__section">
                  <h2 className="overlay__h2">Stack</h2>
                  <div className="chip-row">
                    {project.stack.map((s) => (
                      <span className="chip" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {project.links?.length > 0 && (
              <div className="overlay__links">
                {project.links.map((l) => (
                  <a
                    key={l.href}
                    className="btn"
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label}
                    <ArrowUpRightIcon />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </article>
    </div>
  )
}
