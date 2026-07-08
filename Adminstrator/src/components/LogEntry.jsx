import { Link } from 'react-router-dom';
import { formatDateTime, getStatusLabel } from '../utils/helpers.js';

function LogEntry({ log }) {
  return (
    <Link to={`/logs/meeting/${log.meetingId}`} className="log-entry">
      <div>
        <p className="log-title">{log.meetingName}</p>
        <p className="subtle-text">{formatDateTime(log.timestamp)}</p>
      </div>
      <div className="log-meta">
        {log.channel && <span>{log.channel}</span>}
        <span>អ្នកទទួល {log.recipientsCount} នាក់</span>
        <span className="status-badge status-sent">{getStatusLabel(log.status)}</span>
      </div>
    </Link>
  );
}

export default LogEntry;
