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
  const storageKey = `tour-widget-step-${tourId}`
  const finishedKey = `tour-widget-finished-${tourId}`

  const [open, setOpen] = useState(true)
  const [tourSteps, setTourSteps] = useState<TourStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [modalPosition, setModalPosition] = useState<ModalPosition | null>(null)
  const [isFinished, setIsFinished] = useState(localStorage.getItem(finishedKey) === 'true')
  const [contentKey, setContentKey] = useState(0)

  useEffect(() => {
    async function getTour() {
      const { data, error } = await supabase.from('steps').select().eq('tour_id', tourId)

      if (error) {
        if (error.code === '22P02') {
          alert('You have entered an invalid tour ID')
        }

        return
      }

      if (data && data.length > 0) {
        const savedStep = parseInt(localStorage.getItem(storageKey) || '0', 10)
        setCurrentStep(savedStep)
        if (localStorage.getItem(finishedKey) !== 'true') {
          setOpen(true)
        }
      }
      setTourSteps(data)
    }

    getTour()
  }, [tourId, storageKey, finishedKey])

  useEffect(() => {
    if (open) {
      localStorage.setItem(storageKey, String(currentStep))
    }

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
    return () => clearHighlight()
  }, [currentStep, tourSteps, open, storageKey])

  function handleClose() {
    setOpen(false)
    clearHighlight()
  }

  function handleSkip() {
    handleClose()
  }

  function handleNext() {
    if (currentStep === tourSteps.length - 1) {
      localStorage.removeItem(storageKey)
      localStorage.setItem(finishedKey, 'true')
      setIsFinished(true)
      handleClose()
    } else {
      setCurrentStep(currentStep + 1)
      setContentKey((key) => key + 1)
    }
  }

  function handlePrev() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setContentKey((key) => key + 1)
    }
  }

  if (isFinished && !config.showTourButton) {
    return null
  }

  const modalStyle = modalPosition
    ? {
        top: `${modalPosition.top}px`,
        left: `${modalPosition.left}px`,
        position: 'fixed',
        transition: 'top 0.3s ease-in-out, left 0.3s ease-in-out',
      }
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
      {!open && !isFinished && tourSteps.length > 0 && (
        <button className="tw-btn rounded-md" style={customStyles} onClick={() => setOpen(true)}>
          Resume Tour
        </button>
      )}
      {tourSteps.length > 0 && open && !isFinished && (
        <>
          {!document.querySelector(
            tourSteps[currentStep].target_selector || 'tour-widget-null-el',
          ) && <div className="tw-modal-overlay" onClick={handleClose}></div>}
          <div
            style={{ ...modalStyle, ...customStyles }}
            className={modalClasses}
            role="dialog"
            aria-modal="true"
          >
            <div
              key={contentKey}
              className={`tw-modal-content ${
                config.add3d ? 'tw-modal-content-3d' : ''
              } text-black tw-animate__animated tw-animate__contentFade`}
            >
              <div className="flex items-center justify-between">
                <h3 className="tw-modal-title"> {tourSteps[currentStep].title} </h3>
                <button onClick={handleSkip} className="text-sm">
                  Skip
                </button>
              </div>
              <div className="tw-modal-body">{tourSteps[currentStep].description}</div>
              <div className="tw-modal-footer"></div>
              <div className="tw-modal-actions">
                {currentStep > 0 && (
                  <button onClick={handlePrev} className="tw-btn tw-btn-outline">
                    Previous
                  </button>
                )}
                <div className="tw-step-counter">
                  <p>
                    {currentStep + 1} / {tourSteps.length}
                  </p>
                </div>
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
