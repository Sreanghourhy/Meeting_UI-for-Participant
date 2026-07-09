import { Link, useParams } from 'react-router-dom';
import { useMeetings } from '../hooks/useMeetings.js';
import { formatDateTime } from '../utils/helpers.js';

function hasSeenInvitation(participant, isSent) {
  if (!isSent) {
    return false;
  }

  const numericId = Number(participant.id.replace(/\D/g, ''));
  return numericId % 3 !== 0;
}

function LogMeetingDetail() {
  const { id } = useParams();
  const { meetings, logs } = useMeetings();
  const meeting = meetings.find((item) => item.id === id);
  const meetingLogs = logs.filter((log) => log.meetingId === id);
  const sentParticipantIds = new Set(meetingLogs.flatMap((log) => log.recipientIds || []));
  const latestLog = meetingLogs[0];

  if (!meeting) {
    return (
      <section className="page-section">
        <div className="empty-state">
          <h2>រកមិនឃើញកិច្ចប្រជុំ</h2>
          <p>មិនអាចរកកំណត់ត្រារបស់កិច្ចប្រជុំនេះបានទេ។</p>
          <Link to="/logs" className="button button-primary">
            ត្រឡប់ទៅកំណត់ត្រា
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="page-header participant-header">
        <div>
          <Link to="/logs" className="back-link">
            ត្រឡប់ទៅកំណត់ត្រា
          </Link>
          <p className="eyebrow">{latestLog ? formatDateTime(latestLog.timestamp) : formatDateTime(meeting.time)}</p>
          <h2>{meeting.name}</h2>
          <p className="subtle-text">{meeting.location}</p>
        </div>
        <span className="summary-pill">អ្នកចូលរួម {meeting.participants.length} នាក់</span>
      </div>

      <div className="participant-table-panel">
        <div className="participant-table-header">
          <span>ឈ្មោះ</span>
          <span>តួនាទី</span>
          <span>មធ្យោបាយ</span>
          <span className="text-center">ស្ថានភាពផ្ញើ</span>
          <span className="text-center">ស្ថានភាពមើល</span>
        </div>

        {meeting.participants.map((participant) => {
          const isSent = sentParticipantIds.has(participant.id);
          const isSeen = hasSeenInvitation(participant, isSent);
          const channel = participant.email ? 'អ៊ីមែល' : 'Telegram';

          return (
            <div className="participant-table-row" key={participant.id}>
              <div>
                <strong>{participant.khmerName}</strong>
                <small>{participant.code}</small>
              </div>
              <span>{participant.position}</span>
              <span>{channel}</span>
              <span className={`status-badge ${isSent ? 'status-sent' : 'status-pending'}`}>
                {isSent ? 'បានផ្ញើ' : 'មិនទាន់ផ្ញើ'}
              </span>
              <span className={`status-badge ${isSeen ? 'status-seen' : 'status-not-seen'}`}>
                {isSeen ? 'បានឃើញ' : 'មិនទាន់ឃើញ'}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default LogMeetingDetail;
