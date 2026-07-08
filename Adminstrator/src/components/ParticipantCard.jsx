import { getInitials } from '../utils/helpers.js';

function ParticipantCard({ participant }) {
  return (
    <article className="participant-card">
      <div className="avatar" aria-hidden="true">
        {getInitials(participant.khmerName)}
      </div>
      <div className="participant-details">
        <h3>{participant.khmerName}</h3>
        <p className="position">{participant.position}</p>
        <dl>
          <div>
            <dt>អង្គភាព</dt>
            <dd>{participant.department}</dd>
          </div>
          <div>
            <dt>លេខកូដ</dt>
            <dd>{participant.code}</dd>
          </div>
          <div>
            <dt>ទូរស័ព្ទ</dt>
            <dd>{participant.phone}</dd>
          </div>
          <div>
            <dt>អ៊ីមែល</dt>
            <dd>{participant.email || 'មិនមានអ៊ីមែល'}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

export default ParticipantCard;
