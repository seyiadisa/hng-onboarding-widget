import { useEffect, useState } from 'preact/hooks'
import { supabase } from './supabase'

type Props = { tourId: string }
type TourStep = {
  title: string
  description: string
  target_selector?: string
}

export default function App({ tourId }: Props) {
  const [tourSteps, setTourSteps] = useState<TourStep[]>([])
  // const [currentStep, setCurrentStep] = useState(0);

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

  function handleNext() {}

  function handlePrev() {}

  return (
    <div className="tw-root" aria-hidden={false}>
      {/* <button
        aria-label="Open tour"
        className="tw-btn-launcher tw-animate__animated tw-animate__fadeIn"
        onClick={() => {
          setOpen((s) => !s)
        }}
      >
        Tour
      </button> */}

      {tourSteps && (
        <div
          className="tw-modal tw-animate__animated tw-animate__zoomIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="tw-modal-content text-black">
            <h3 className="tw-modal-title">Welcome</h3>
            <div className="tw-modal-body">
              This is a tour modal — use the dashboard to configure full tours.
            </div>
            <div className="tw-modal-actions">
              <button onClick={handleNext} className="tw-btn">
                Close
              </button>
              <button onClick={handlePrev} className="tw-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
