import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMeetings } from '../hooks/useMeetings.js';
import { sortMeetingsByTime, formatDateTime } from '../utils/helpers.js';

function MeetingList() {
  const { meetings } = useMeetings();
  const [searchTerm, setSearchTerm] = useState('');
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredMeetings = useMemo(() => {
    return sortMeetingsByTime(meetings).filter((meeting) => {
      const searchableText = `${meeting.name} ${meeting.location}`.toLowerCase();
      return normalizedSearch === '' || searchableText.includes(normalizedSearch);
    });
  }, [meetings, normalizedSearch]);

  return (
    <>
      <div className="meeting-toolbar">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="ស្វែងរកកិច្ចប្រជុំ ឬទីតាំង"
            aria-label="ស្វែងរកកិច្ចប្រជុំ"
          />
        </label>

        <span className="meeting-toolbar-count">បង្ហាញ {filteredMeetings.length}</span>
      </div>

      {filteredMeetings.length === 0 ? (
        <div className="empty-state">
          <h3>រកមិនឃើញកិច្ចប្រជុំ</h3>
          <p>សូមសាកល្បងផ្លាស់ប្តូរពាក្យស្វែងរក។</p>
        </div>
      ) : (
        <div className="meeting-table-panel">
          <div className="meeting-table-header">
            <span>កិច្ចប្រជុំ</span>
            <span>ទីតាំង</span>
            <span>កាលបរិច្ឆេទ & ម៉ោង</span>
            <span>អ្នកចូលរួម</span>
            <span style={{ textAlign: 'right' }}>សកម្មភាព</span>
          </div>
          {filteredMeetings.map((meeting) => (
            <Link
              to={`/meeting/${meeting.id}`}
              key={meeting.id}
              className="meeting-table-row"
            >
              <strong className="table-cell-title">{meeting.name}</strong>
              <span className="subtle-text">{meeting.location}</span>
              <span>{formatDateTime(meeting.time)}</span>
              <span>{meeting.participants.length} នាក់</span>
              <span className="table-cell-action">បើកមើល</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default MeetingList;
