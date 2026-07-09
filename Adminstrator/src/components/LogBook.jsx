import { Link } from 'react-router-dom';
import { useMeetings } from '../hooks/useMeetings.js';
import { formatDateTime, getStatusLabel } from '../utils/helpers.js';

function LogBook() {
  const { logs } = useMeetings();
  const meetingLogs = logs.filter((log) => log.meetingId);

  return (
    <>
      {meetingLogs.length === 0 ? (
        <div className="empty-state">
          <h3>មិនទាន់មានលិខិតអញ្ជើញបានផ្ញើ</h3>
          <p>ផ្ញើលិខិតអញ្ជើញពីទំព័រកិច្ចប្រជុំ ហើយវានឹងបង្ហាញនៅទីនេះ។</p>
        </div>
      ) : (
        <div className="log-table-panel">
          <div className="log-table-header">
            <span>កិច្ចប្រជុំ</span>
            <span>កាលបរិច្ឆេទផ្ញើ</span>
            <span>ឆានែល</span>
            <span>ចំនួនអ្នកទទួល</span>
            <span className="text-center">ស្ថានភាព</span>
            <span style={{ textAlign: 'right' }}>សកម្មភាព</span>
          </div>
          {meetingLogs.map((log) => (
            <Link
              to={`/logs/meeting/${log.meetingId}`}
              key={log.id}
              className="log-table-row"
            >
              <strong className="table-cell-title">{log.meetingName}</strong>
              <span className="subtle-text">{formatDateTime(log.timestamp)}</span>
              <span>{log.channel || '-'}</span>
              <span>{log.recipientsCount} នាក់</span>
              <div className="text-center">
                <span className="status-badge status-sent">{getStatusLabel(log.status)}</span>
              </div>
              <span className="table-cell-action">បើកមើល</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default LogBook;
