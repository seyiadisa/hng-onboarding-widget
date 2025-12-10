import { init, type TourWidgetConfig } from './main'

declare global {
  interface Window {
    TourWidget: {
      init: (config: TourWidgetConfig) => void
    }
  }
}

window.TourWidget = { init }
