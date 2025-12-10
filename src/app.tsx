import { useState } from 'preact/hooks'

type Props = { tourId: string }

export default function App({ tourId }: Props) {
  const [open, setOpen] = useState(false)
  console.log(tourId)

  function closeModal() {
    setOpen(false)
  }

  return (
    <div className="tw-root" aria-hidden={false}>
      <button
        aria-label="Open tour"
        className="tw-btn-launcher tw-animate__animated tw-animate__fadeIn"
        onClick={() => {
          setOpen((s) => !s)
        }}
      >
        Tour
      </button>

      {open && (
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
              <button onClick={closeModal} className="tw-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
