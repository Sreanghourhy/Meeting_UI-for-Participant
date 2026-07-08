import { NavLink, Route, Routes } from 'react-router-dom';
import MeetingList from './components/MeetingList.jsx';
import ParticipantList from './components/ParticipantList.jsx';
import LogBook from './components/LogBook.jsx';
import LogMeetingDetail from './components/LogMeetingDetail.jsx';

function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <p className="eyebrow">រដ្ឋបាល OCM</p>
          <h1>ការអញ្ជើញចូលរួមប្រជុំ</h1>
        </div>
        <nav className="main-nav" aria-label="របាររុករកសំខាន់">
          <NavLink to="/" end>
            កិច្ចប្រជុំ
          </NavLink>
          <NavLink to="/logs">
            កំណត់ត្រាផ្ញើ
          </NavLink>
        </nav>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<MeetingList />} />
          <Route path="/meeting/:id" element={<ParticipantList />} />
          <Route path="/logs" element={<LogBook />} />
          <Route path="/logs/meeting/:id" element={<LogMeetingDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
