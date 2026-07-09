import { useLocation, useNavigate } from 'react-router-dom';
import { useMeetings } from '../hooks/useMeetings.js';
import MeetingList from './MeetingList.jsx';
import LogBook from './LogBook.jsx';

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { meetings } = useMeetings();

  const activeTab = location.pathname === '/logs' ? 'logs' : 'meetings';

  const totalParticipants = meetings.reduce((total, meeting) => total + meeting.participants.length, 0);

  return (
    <section className="page-section">
      <div className="page-header dashboard-header">
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

      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'meetings' ? 'active' : ''}`}
          type="button"
          onClick={() => navigate('/')}
        >
          កិច្ចប្រជុំ
        </button>
        <button
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          type="button"
          onClick={() => navigate('/logs')}
        >
          កំណត់ត្រាផ្ញើ
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'meetings' ? <MeetingList /> : <LogBook />}
      </div>
    </section>
  );
}

export default Dashboard;
