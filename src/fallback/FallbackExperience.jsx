import { Link } from 'react-router-dom'
import { profile } from '../data/profile'
import { metrics } from '../data/metrics'
import { experience, education } from '../data/experience'
import { skillGroups } from '../data/skills'
import { projects } from '../data/projects'
import { LinkIcon, ArrowUpRightIcon, DownloadIcon } from '../components/icons'
import './fallback.css'

// Accessible, fast 2D layout. Served on mobile / no-WebGL / reduced-motion,
// while the immersive 3D bundle loads, or whenever the visitor prefers it.
// Renders the exact same data as the 3D scene.
export default function FallbackExperience({ dimmed = false, quiet = false }) {
  return (
    <main
      id="main"
      tabIndex={-1}
      className={`page${dimmed ? ' is-dimmed' : ''}`}
      aria-busy={quiet || undefined}
    >
      {quiet && (
        <div className="loading-strip" role="status">
          <span className="loading-strip__bar" />
          <span className="visually-hidden">Loading immersive view…</span>
        </div>
      )}

      {/* Hero */}
      <section className="section hero">
        <p className="eyebrow">Commercial Analytics · Pharma</p>
        <h1 className="hero__name">{profile.name}</h1>
        <p className="hero__tagline">{profile.tagline}</p>
        <p className="hero__location mono">
          {profile.location} &nbsp;·&nbsp; {profile.availability}
        </p>
        <p className="hero__summary">{profile.summary}</p>
        <div className="hero__actions">
          <a
            className="btn btn--primary"
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <DownloadIcon />
            Download résumé
          </a>
          <a className="btn" href="#contact">
            Get in touch
          </a>
        </div>
      </section>

      {/* Metrics */}
      <section className="section" aria-label="Selected outcomes">
        <div className="metric-grid">
          {metrics.map((m) => (
            <div className={`metric-card accent-${m.accent}`} key={m.label}>
              <span className="metric-value">{m.value}</span>
              <span className="metric-card__label">{m.label}</span>
              <span className="metric-card__detail">{m.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Focus areas */}
      <section className="section">
        <h2 className="section__title">
          <span className="section__index">01</span> Focus
        </h2>
        <div className="skill-grid">
          {skillGroups.map((g) => (
            <div className="skill-card" key={g.group}>
              <h3 className="skill-card__title">{g.group}</h3>
              <div className="chip-row">
                {g.items.map((i) => (
                  <span className="chip" key={i}>
                    {i}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="section">
        <h2 className="section__title">
          <span className="section__index">02</span> Experience
        </h2>
        <div className="exp-list">
          {experience.map((job) => (
            <article className="exp" key={job.company + job.role}>
              <div className="exp__head">
                <div>
                  <h3 className="exp__role">{job.role}</h3>
                  <p className="exp__company">{job.company}</p>
                </div>
                <p className="exp__period mono">
                  {job.start} — {job.end}
                </p>
              </div>
              <p className="exp__summary">{job.summary}</p>
              <ul className="exp__highlights">
                {job.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              {job.award && (
                <p className="exp__award">
                  <span className="chip chip--amber">Award</span> {job.award}
                </p>
              )}
            </article>
          ))}
        </div>
        <div className="edu">
          {education.map((e) => (
            <p key={e.institution} className="edu__row">
              <span className="edu__inst">{e.institution}</span>
              <span className="edu__cred mono">{e.credential}</span>
            </p>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="section">
        <h2 className="section__title">
          <span className="section__index">03</span> Projects
        </h2>
        <div className="project-grid">
          {projects.map((p) => (
            <Link
              to={`/projects/${p.slug}`}
              className={`project-card accent-${p.accent}`}
              key={p.slug}
            >
              <div className="project-card__top">
                <span className="eyebrow">{p.domain}</span>
                <ArrowUpRightIcon className="project-card__arrow" />
              </div>
              <h3 className="project-card__title">{p.title}</h3>
              <p className="project-card__tagline">{p.tagline}</p>
              <p className="project-card__summary">{p.summary}</p>
              <div className="chip-row">
                {p.methods.map((m) => (
                  <span className={`chip chip--${p.accent}`} key={m}>
                    {m}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="section contact" id="contact">
        <h2 className="section__title">
          <span className="section__index">04</span> Contact
        </h2>
        <p className="contact__lede">
          Open to commercial analytics and forecasting roles — Pune, Hyderabad
          or remote. The fastest way to reach me:
        </p>
        <div className="contact__links">
          {profile.links.map((l) => (
            <a
              key={l.kind}
              className="contact__link"
              href={l.href}
              target={l.kind === 'email' ? undefined : '_blank'}
              rel="noopener noreferrer"
            >
              <LinkIcon kind={l.kind} className="contact__link-icon" />
              <span className="contact__link-label">{l.label}</span>
              <span className="contact__link-value mono">{l.short}</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span className="mono">
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span className="mono footer__built">
          Built with React · Three.js
        </span>
      </footer>
    </main>
  )
}
