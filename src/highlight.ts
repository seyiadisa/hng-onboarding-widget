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

export function highlightElement(target: HTMLElement, opts: { message?: string } = {}) {
  clearHighlight()
  createOverlay()

  const rect = target.getBoundingClientRect()

  const prevZ = target.style.zIndex
  target.setAttribute('data-embed-tour-prev-z', prevZ || '')
  target.style.zIndex = '999999'

  const ring = document.createElement('div')
  ring.id = 'embed-tour-highlight-ring'
  ring.style.position = 'fixed'
  ring.style.top = `${rect.top - 8}px`
  ring.style.left = `${rect.left - 8}px`
  ring.style.width = `${rect.width + 16}px`
  ring.style.height = `${rect.height + 16}px`
  ring.style.borderRadius = '8px'
  ring.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.95), 0 10px 30px rgba(0,0,0,0.5)'
  ring.style.transition = 'all 200ms ease'
  ring.style.zIndex = '999999'
  ring.style.pointerEvents = 'auto'
  document.body.appendChild(ring)

  if (opts.message) {
    const tip = document.createElement('div')
    tip.id = 'embed-tour-tooltip'
    tip.innerText = opts.message
    tip.style.position = 'fixed'
    tip.style.top = `${rect.bottom + 12}px`
    tip.style.left = `${rect.left}px`
    tip.style.zIndex = '1000000'
    tip.style.maxWidth = '320px'
    tip.style.padding = '10px 12px'
    tip.style.borderRadius = '8px'
    tip.style.background = 'white'
    tip.style.color = '#111827'
    tip.style.boxShadow = '0 6px 30px rgba(2,6,23,0.2)'
    document.body.appendChild(tip)
  }

  function update() {
    const r = target.getBoundingClientRect()
    ring.style.top = `${r.top - 8}px`
    ring.style.left = `${r.left - 8}px`
    ring.style.width = `${r.width + 16}px`
    ring.style.height = `${r.height + 16}px`
    const tipEl = document.getElementById('embed-tour-tooltip')
    if (tipEl) tipEl.style.top = `${r.bottom + 12}px`
  }

  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)

  ring.addEventListener('click', () => clearHighlight())
}

export function clearHighlight() {
  const overlay = document.getElementById('embed-tour-overlay')
  overlay?.remove()
  const ring = document.getElementById('embed-tour-highlight-ring')
  ring?.remove()
  const tip = document.getElementById('embed-tour-tooltip')
  tip?.remove()

  document.querySelectorAll('[data-embed-tour-prev-z]').forEach((el) => {
    const prev = (el as HTMLElement).getAttribute('data-embed-tour-prev-z') || ''
    ;(el as HTMLElement).style.zIndex = prev
    ;(el as HTMLElement).removeAttribute('data-embed-tour-prev-z')
  })
}
