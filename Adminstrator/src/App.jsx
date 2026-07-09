import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useMeetings } from './hooks/useMeetings.js';
import Dashboard from './components/Dashboard.jsx';
import ParticipantList from './components/ParticipantList.jsx';
import LogMeetingDetail from './components/LogMeetingDetail.jsx';

function RouteListener() {
  const location = useLocation();
  const navigate = useNavigate();
  const { meetings } = useMeetings();

  useEffect(() => {
    const backBtn = document.getElementById('portal-back-btn');
    const titleSpan = document.getElementById('portal-title');

    if (!backBtn || !titleSpan) return;

    const originalText = 'ត្រឡប់ទៅផ្ទាំងសេវាកម្ម';
    const originalTitle = 'រដ្ឋបាលការអញ្ជើញ';

    const meetingMatch = location.pathname.match(/^\/meeting\/([^/]+)/);
    const logMatch = location.pathname.match(/^\/logs\/meeting\/([^/]+)/);

    if (meetingMatch) {
      const meetingId = meetingMatch[1];
      const meeting = meetings.find((m) => m.id === meetingId);
      backBtn.textContent = 'ត្រឡប់ទៅកិច្ចប្រជុំ';
      titleSpan.textContent = meeting ? meeting.name : 'កិច្ចប្រជុំ';

      const handleGoBack = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate('/');
      };
      backBtn.onclick = handleGoBack;
    } else if (logMatch) {
      const meetingId = logMatch[1];
      const meeting = meetings.find((m) => m.id === meetingId);
      backBtn.textContent = 'ត្រឡប់ទៅកំណត់ត្រា';
      titleSpan.textContent = meeting ? meeting.name : 'កំណត់ត្រាផ្ញើ';

      const handleGoBack = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate('/logs');
      };
      backBtn.onclick = handleGoBack;
    } else {
      backBtn.textContent = originalText;
      titleSpan.textContent = originalTitle;
      backBtn.onclick = null;
    }

    return () => {
      if (backBtn) {
        backBtn.textContent = originalText;
        backBtn.onclick = null;
      }
      if (titleSpan) {
        titleSpan.textContent = originalTitle;
      }
    };
  }, [location, meetings, navigate]);

  return null;
}

function App() {
  return (
    <div className="app-shell">
      <RouteListener />
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/logs" element={<Dashboard />} />
          <Route path="/meeting/:id" element={<ParticipantList />} />
          <Route path="/logs/meeting/:id" element={<LogMeetingDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
