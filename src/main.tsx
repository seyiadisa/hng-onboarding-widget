import { render } from 'preact'
import styles from './index.css?inline'
import App from './app.tsx'

export async function initTourFromScript() {
  try {
    const currentScript =
      document.currentScript || Array.from(document.getElementsByTagName('script')).pop()
    const tourId =
      (currentScript && (currentScript as HTMLScriptElement).getAttribute('data-tour-id')) ||
      'demo-tour-1'

    const container = document.createElement('div')
    container.id = `embed-tour-container-${tourId}`
    container.setAttribute('aria-hidden', 'false')

    container.style.position = 'fixed'
    container.style.zIndex = '1000000'
    container.style.bottom = '20px'
    container.style.right = '20px'

    document.body.appendChild(container)

    const shadow = container.attachShadow({ mode: 'open' })

    const styleEl = document.createElement('style')
    styleEl.id = 'embed-tour-styles'
    styleEl.innerHTML = styles
    shadow.appendChild(styleEl)

    const mountPoint = document.createElement('div')
    mountPoint.id = 'embed-tour-mount'
    shadow.appendChild(mountPoint)

    render(<App tourId={tourId} />, mountPoint)
  } catch (e) {
    console.warn('[embed-tour] init error', e)
  }
}
