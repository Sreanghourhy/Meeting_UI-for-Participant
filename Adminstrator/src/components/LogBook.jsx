import LogEntry from './LogEntry.jsx';
import { useMeetings } from '../hooks/useMeetings.js';

function LogBook() {
  const { logs } = useMeetings();
  const meetingLogs = logs.filter((log) => log.meetingId);

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">ប្រវត្តិសកម្មភាព</p>
          <h2>កំណត់ត្រាផ្ញើ</h2>
        </div>
      </div>

      {meetingLogs.length === 0 ? (
        <div className="empty-state">
          <h3>មិនទាន់មានលិខិតអញ្ជើញបានផ្ញើ</h3>
          <p>ផ្ញើលិខិតអញ្ជើញពីទំព័រកិច្ចប្រជុំ ហើយវានឹងបង្ហាញនៅទីនេះ។</p>
        </div>
      ) : (
        <div className="log-list">
          {meetingLogs.map((log) => (
            <LogEntry key={log.id} log={log} />
          ))}
        </div>
      )}
    </section>
  );
}

export default LogBook;
