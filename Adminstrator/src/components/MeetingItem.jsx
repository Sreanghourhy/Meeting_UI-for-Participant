import { Link } from 'react-router-dom';
import { formatDateTime } from '../utils/helpers.js';

function MeetingItem({ meeting }) {
  return (
    <Link to={`/meeting/${meeting.id}`} className="meeting-card">
      <div className="meeting-card-header">
        <span className="meeting-card-kicker">កិច្ចប្រជុំ</span>
        <span className="meeting-open-action">បើកមើល</span>
      </div>

      <div className="meeting-card-body">
        <h3 className="meeting-name">{meeting.name}</h3>
        <p className="meeting-location">{meeting.location}</p>
      </div>

      <div className="meeting-card-meta">
        <span>{formatDateTime(meeting.time)}</span>
        <span>អ្នកចូលរួម {meeting.participants.length} នាក់</span>
      </div>
    </Link>
  );
}

export default MeetingItem;
