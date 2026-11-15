import { useEffect } from 'react'

function Modal({ title, eyebrow, onClose, children, size = 'normal' }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.classList.add('modal-open')
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('modal-open')
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`modal-card modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="닫기">
          ×
        </button>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id="modal-title">{title}</h2>
        {children}
      </section>
    </div>
  )
}

export default Modal
