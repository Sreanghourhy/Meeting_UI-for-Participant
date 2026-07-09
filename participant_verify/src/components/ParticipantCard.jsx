export default function ParticipantCard({ participant, isVerified, onOpen }) {
  const fallbackText = participant.name.split(' ').filter(Boolean).pop()?.slice(0, 2) || 'OCM'

  return (
    <article className="participant-card card">
      <button className="participant-photo-button" type="button" onClick={onOpen}>
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
      </button>
      <div className="participant-info">
        <div className="participant-title-row">
          <h2>{participant.name}</h2>
          {isVerified ? <span className="verified-label">បានចុះវត្តមាន</span> : null}
        </div>
        <p>{participant.position}</p>
        <span>{participant.department}</span>
      </div>
    </article>
  )
}
