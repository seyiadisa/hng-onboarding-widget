export function createOverlay() {
  let overlay = document.getElementById('embed-tour-overlay') as HTMLDivElement | null
  if (!overlay) {
    overlay = document.createElement('div')
    overlay.id = 'embed-tour-overlay'
    overlay.style.position = 'fixed'
    overlay.style.top = '0'
    overlay.style.left = '0'
    overlay.style.width = '100vw'
    overlay.style.height = '100vh'
    overlay.style.background = 'rgba(0,0,0,0.5)'
    overlay.style.zIndex = '999998'
    overlay.style.pointerEvents = 'none'
    document.body.appendChild(overlay)
  }
  return overlay
}

export function highlightElement(target: HTMLElement) {
  clearHighlight()
  createOverlay()

  const rect = target.getBoundingClientRect()

  const prevZ = target.style.zIndex
  target.setAttribute('data-embed-tour-prev-z', prevZ || '')
  target.style.zIndex = '999999'

  const ring = document.createElement('div')
  ring.id = 'embed-tour-highlight-ring'
  ring.style.position = 'fixed'
  ring.style.top = `${rect.top - 4}px`
  ring.style.left = `${rect.left - 4}px`
  ring.style.width = `${rect.width + 8}px`
  ring.style.height = `${rect.height + 8}px`
  ring.style.borderRadius = '4px'
  ring.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.95), 0 10px 30px rgba(0,0,0,0.5)'
  ring.style.transition = 'all 200ms ease'
  ring.style.zIndex = '999999'
  ring.style.pointerEvents = 'auto'
  document.body.appendChild(ring)
}

export function clearHighlight() {
  const overlay = document.getElementById('embed-tour-overlay')
  overlay?.remove()
  const ring = document.getElementById('embed-tour-highlight-ring')
  ring?.remove()

  document.querySelectorAll('[data-embed-tour-prev-z]').forEach((el) => {
    const prev = (el as HTMLElement).getAttribute('data-embed-tour-prev-z') || ''
    ;(el as HTMLElement).style.zIndex = prev
  })
}
