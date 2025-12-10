import { render } from 'preact'
import styles from './index.css?inline'
import App from './app.tsx'

export type TourWidgetConfig = {
  tourId: string
  showTourButton?: boolean
  add3d?: boolean
  backgroundColor?: string
  textColor?: string
  primaryColor?: string
}

export async function init(config: TourWidgetConfig) {
  try {
    if (!config.tourId) {
      console.warn('[Embed Tour] `tourId` is required in the config.')
      return
    }

    const container = document.createElement('div')
    container.id = `embed-tour-container-${config.tourId}`
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

    render(<App tourId={config.tourId} config={config} />, mountPoint)
  } catch (e) {
    console.warn('[embed-tour] init error', e)
  }
}
