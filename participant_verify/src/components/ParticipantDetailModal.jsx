import { useEffect, useState } from 'react'

export default function ParticipantDetailModal({ participant, isVerified, onClose, onVerify }) {
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!participant) {
      setMessage('')
      return
    }

    setMessage(isVerified ? 'បានបញ្ជាក់អ្នកចូលរួមដោយជោគជ័យ។' : '')
  }, [participant?.id, isVerified])

  if (!participant) {
    return null
  }

  function verify() {
    if (onVerify(participant.id)) {
      setMessage('បានបញ្ជាក់អ្នកចូលរួមដោយជោគជ័យ។')
      return
    }

    setMessage('អ្នកចូលរួមនេះមិនត្រូវនឹងលេខកូដដែលបានប្រើចូលប្រើទេ។')
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="participant-modal card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="participant-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="បិទ">
          ×
        </button>
        <div className="modal-profile">
          <img src={participant.photo} alt={participant.name} />
          {isVerified ? <span className="modal-tick" aria-label="បានចុះវត្តមាន">✓</span> : null}
        </div>
        <div className="modal-content">
          <p className="page-eyebrow">ព័ត៌មានចុះវត្តមាន</p>
          <h2 id="participant-detail-title">{participant.name}</h2>
          <dl className="detail-list">
            <div>
              <dt>តួនាទី</dt>
              <dd>{participant.position}</dd>
            </div>
            <div>
              <dt>អង្គភាព</dt>
              <dd>{participant.department}</dd>
            </div>
          </dl>
          {message ? (
            <p className={message.includes('ជោគជ័យ') ? 'verify-message success' : 'verify-message error'}>
              {message}
            </p>
          ) : null}
          <button className="verify-button" type="button" onClick={verify} disabled={isVerified}>
            {isVerified ? 'បានចុះវត្តមាន' : 'ចុះវត្តមាន'}
          </button>
        </div>
      </section>
    </div>
  )
}
