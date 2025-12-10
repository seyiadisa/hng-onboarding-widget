import { useEffect, useState } from 'preact/hooks'
import { supabase } from './supabase'
import { clearHighlight, highlightElement } from './highlight'
import { type TourWidgetConfig } from './main'

type Props = { tourId: string; config: TourWidgetConfig }
type TourStep = {
  title: string
  description: string
  target_selector?: string
}

type ModalPosition = {
  top: number
  left: number
}

export default function App({ tourId, config }: Props) {
  const [open, setOpen] = useState(true)
  const [tourSteps, setTourSteps] = useState<TourStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [modalPosition, setModalPosition] = useState<ModalPosition | null>(null)

  useEffect(() => {
    async function getTour() {
      const { data, error } = await supabase.from('steps').select().eq('tour_id', tourId)

      if (error) {
        if (error.code === '22P02') {
          alert('You have entered an invalid tour ID')
        }

        return
      }
      setTourSteps(data)
    }

    getTour()
  }, [])

  useEffect(() => {
    if (!open || tourSteps.length === 0) {
      clearHighlight()
      return
    }

    const step = tourSteps[currentStep]
    if (step?.target_selector) {
      const target = document.querySelector(step.target_selector) as HTMLElement | null
      if (target) {
        highlightElement(target)
        const rect = target.getBoundingClientRect()
        const modalWidth = 320
        const screenPadding = 16

        let left = rect.left
        if (left + modalWidth > window.innerWidth) {
          left = rect.right - modalWidth
        }

        if (left < 0) left = screenPadding

        setModalPosition({ top: rect.bottom + 12, left })
      } else {
        console.warn(`Embed Tour: Target element "${step.target_selector}" not found.`)
        clearHighlight()
        setModalPosition(null)
      }
    } else {
      clearHighlight()
      setModalPosition(null)
    }
    return () => clearHighlight() // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, tourSteps, open])

  function handleNext() {
    if (currentStep === tourSteps.length - 1) {
      setOpen(false)
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  function handlePrev() {
    setCurrentStep(currentStep - 1)
  }

  const modalStyle = modalPosition
    ? { top: `${modalPosition.top}px`, left: `${modalPosition.left}px`, position: 'fixed' }
    : {}

  const customStyles: Record<string, string> = {}
  if (config.backgroundColor) customStyles['--tour-bg-color'] = config.backgroundColor
  if (config.textColor) customStyles['--tour-text-color'] = config.textColor
  if (config.primaryColor) customStyles['--tour-primary-color'] = config.primaryColor

  const modalClasses = `tw-modal ${!modalPosition ? 'tw-modal-centered' : ''} ${
    config.add3d ? 'tw-modal-3d' : ''
  } tw-animate__animated tw-animate__zoomIn`

  return (
    <div className="tw-root" aria-hidden={!open}>
      {tourSteps.length > 0 && open && (
        <>
          {!tourSteps[currentStep].target_selector && (
            <div className="tw-modal-overlay" onClick={() => setOpen(false)}></div>
          )}
          <div
            style={{ ...modalStyle, ...customStyles }}
            className={modalClasses}
            role="dialog"
            aria-modal="true"
          >
            <div
              className={`tw-modal-content ${config.add3d ? 'tw-modal-content-3d' : ''} text-black`}
            >
              <h3 className="tw-modal-title"> {tourSteps[currentStep].title} </h3>
              <div className="tw-modal-body">{tourSteps[currentStep].description}</div>
              <div className="tw-modal-actions">
                {currentStep > 0 && (
                  <button onClick={handlePrev} className="tw-btn tw-btn-outline tw-mr-auto">
                    Previous
                  </button>
                )}
                <button onClick={handleNext} className="tw-btn">
                  {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
