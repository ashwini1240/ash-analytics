import { Suspense, lazy } from 'react'
import { Routes, Route, useMatch } from 'react-router-dom'
import { useRenderMode } from './hooks/useRenderMode'
import TopBar from './components/TopBar'
import FallbackExperience from './fallback/FallbackExperience'
import ProjectOverlay from './components/ProjectOverlay'

// The 3D bundle (three + r3f + drei) is only loaded when actually needed.
const ImmersiveExperience = lazy(
  () => import('./immersive/ImmersiveExperience'),
)

export default function App() {
  const { mode, toggle, webglSupported } = useRenderMode()
  const overlayOpen = Boolean(useMatch('/projects/:slug'))

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <TopBar
        mode={mode}
        onToggleMode={toggle}
        webglSupported={webglSupported}
      />

      {mode === '3d' ? (
        <Suspense fallback={<FallbackExperience dimmed={overlayOpen} quiet />}>
          <ImmersiveExperience dimmed={overlayOpen} />
        </Suspense>
      ) : (
        <FallbackExperience dimmed={overlayOpen} />
      )}

      <Routes>
        <Route path="/projects/:slug" element={<ProjectOverlay />} />
        <Route path="*" element={null} />
      </Routes>
    </>
  )
}
