import { useMemo, useState } from 'react';
import MeetingItem from './MeetingItem.jsx';
import { useMeetings } from '../hooks/useMeetings.js';
import { sortMeetingsByTime } from '../utils/helpers.js';

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

  const totalParticipants = meetings.reduce((total, meeting) => total + meeting.participants.length, 0);

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">ទិដ្ឋភាពទូទៅ</p>
          <h2>បញ្ជីកិច្ចប្រជុំ</h2>
          <p className="subtle-text">ស្វែងរកកិច្ចប្រជុំ និងពិនិត្យអ្នកចូលរួមបានរហ័ស។</p>
        </div>
        <div className="summary-group">
          <span className="summary-pill">កិច្ចប្រជុំ {meetings.length}</span>
          <span className="summary-pill">អ្នកចូលរួម {totalParticipants}</span>
        </div>
      </div>

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
        <div className="meeting-card-grid">
          {filteredMeetings.map((meeting) => (
            <MeetingItem key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}
    </section>
  );
}

export default MeetingList;
