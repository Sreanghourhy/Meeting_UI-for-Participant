import { formatDateTime } from '../utils/helpers.js';

function getInvitationNumber(meeting, index) {
  const meetingCode = meeting.id
    .split('-')
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return `ល.${meetingCode}-${String(index + 1).padStart(3, '0')}`;
}

function InvitationFormModal({ meeting, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="invitation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invitation-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">លិខិតអញ្ជើញ</p>
            <h2 id="invitation-title">{meeting.name}</h2>
          </div>
          <button className="icon-button" type="button" aria-label="បិទលិខិតអញ្ជើញ" onClick={onClose}>
            x
          </button>
        </div>

        <div className="invitation-summary">
          <span>{formatDateTime(meeting.time)}</span>
          <span>{meeting.location}</span>
          <span>លិខិត {meeting.participants.length}</span>
        </div>

        <div className="invitation-form-list">
          {meeting.participants.map((participant, index) => (
            <article className="khmer-invitation-form" key={participant.id}>
              <header className="invitation-official-header">
                <h3>ព្រះរាជាណាចក្រកម្ពុជា</h3>
                <p>ជាតិ សាសនា ព្រះមហាក្សត្រ</p>
              </header>

              <div className="invitation-number-block">
                <strong>ទីស្ដីការគណៈរដ្ឋមន្រ្តី</strong>
                <span>លេខ: {getInvitationNumber(meeting, index)}</span>
              </div>

              <div className="invitation-person-block">
                <h4>សូមអញ្ជើញ - គោរពជូន</h4>
                <div className="dotted-field">
                  <span>{participant.khmerName}</span>
                  <small>ឈ្មោះ</small>
                </div>
                <div className="dotted-field">
                  <span>{participant.position}</span>
                  <small>តួនាទី</small>
                </div>
                <div className="dotted-field">
                  <span>{participant.code}</span>
                  <small>លេខកូដ</small>
                </div>
              </div>

              <footer className="invitation-footer">
                <div>
                  <p>ស្គេន QR ដើម្បីចូលរួមដោយសុវត្ថិភាព</p>
                  <div className="qr-placeholder" aria-label={`កូដ QR សម្រាប់ ${participant.khmerName}`} />
                  <a href="https://svgtopng.com/">https://svgtopng.com/</a>
                </div>
              </footer>
            </article>
          ))}
        </div>

        <div className="modal-footer">
          <button className="button button-primary" type="button" onClick={onClose}>
            បិទ
          </button>
        </div>
      </section>
    </div>
  );
}

export default InvitationFormModal;
