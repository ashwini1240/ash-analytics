import { Link } from 'react-router-dom'
import { profile } from '../data/profile'
import { DownloadIcon } from './icons'

// Persistent top bar shared by both experiences. Always keeps the resume
// and a mode toggle one click away, so no visitor is ever stuck.
export default function TopBar({ mode, onToggleMode, webglSupported }) {
  return (
    <header className="topbar">
      <Link to="/" className="brand" aria-label={`${profile.name}, home`}>
        <span className="brand__name">{profile.name}</span>
        <span className="brand__role">{profile.role}</span>
      </Link>

      <div className="topbar__actions">
        {webglSupported && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onToggleMode}
            aria-pressed={mode === '3d'}
            title={
              mode === '3d'
                ? 'Switch to a plain, fast reading view'
                : 'Switch to the immersive 3D view'
            }
          >
            {mode === '3d' ? 'Reader view' : 'Immersive view'}
          </button>
        )}
        <a
          className="btn btn--primary"
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <DownloadIcon />
          Resume
        </a>
      </div>
    </header>
  )
}
