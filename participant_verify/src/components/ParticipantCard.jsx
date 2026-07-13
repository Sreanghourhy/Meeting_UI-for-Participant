export default function ParticipantCard({ participant, isVerified, onAttend }) {
  const fallbackText = participant.name.split(' ').filter(Boolean).pop()?.slice(0, 2) || 'OCM'

  return (
    <article className="participant-card card participant-attendance-card">
      <div className="participant-photo-button">
        <span className="participant-photo-fallback" aria-hidden="true" hidden>{fallbackText}</span>
        <img
          src={participant.photo}
          alt={participant.name}
          onError={(event) => {
            event.currentTarget.previousElementSibling.hidden = false
            event.currentTarget.hidden = true
          }}
        />
        {isVerified ? <span className="verified-tick" aria-label="បានចុះវត្តមាន">✓</span> : null}
      </div>
      <div className="participant-info">
        <div className="participant-title-row">
          <h2>{participant.name}</h2>
          <span className={`attendance-status ${isVerified ? 'verified' : 'pending'}`}>
            {isVerified ? 'បានចុះវត្តមាន' : 'មិនទាន់ចុះវត្តមាន'}
          </span>
        </div>
        <p className="participant-position">{participant.position}</p>
        <span className="participant-department">{participant.department}</span>
        <button className="participant-attend-button" type="button" onClick={onAttend} disabled={isVerified}>
          {isVerified ? 'បានចុះវត្តមាន' : 'ចុះវត្តមាន'}
        </button>
      </div>
    </article>
  )
}
