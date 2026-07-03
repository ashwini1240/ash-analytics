import { useCallback, useEffect, useState } from 'react'

// Decides whether to serve the immersive 3D experience or the accessible
// 2D fallback. Auto-detects capability, but the visitor can always override
// via the header toggle (choice persisted for the session).

function detectWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

function isSmallOrCoarse() {
  if (typeof window === 'undefined') return false
  const small = window.matchMedia('(max-width: 820px)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches
  return small || coarse
}

function defaultMode() {
  if (!detectWebGL()) return '2d'
  if (prefersReducedMotion()) return '2d'
  if (isSmallOrCoarse()) return '2d'
  return '3d'
}

const STORAGE_KEY = 'portfolio.viewMode'

export function useRenderMode() {
  const [mode, setMode] = useState('2d') // safe SSR-ish default; corrected on mount
  const [webglOk, setWebglOk] = useState(true)

  useEffect(() => {
    const ok = detectWebGL()
    setWebglOk(ok)
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored === '2d' || (stored === '3d' && ok)) {
      setMode(stored)
    } else {
      setMode(defaultMode())
    }
  }, [])

  const setModePersisted = useCallback(
    (next) => {
      if (next === '3d' && !webglOk) return
      setMode(next)
      try {
        sessionStorage.setItem(STORAGE_KEY, next)
      } catch {
        /* ignore storage failures */
      }
    },
    [webglOk],
  )

  const toggle = useCallback(() => {
    setModePersisted(mode === '3d' ? '2d' : '3d')
  }, [mode, setModePersisted])

  return { mode, setMode: setModePersisted, toggle, webglSupported: webglOk }
}
