import { useEffect, useState } from 'react'
import AccessCodePage from './components/AccessCodePage.jsx'
import CalendarPage from './components/CalendarPage.jsx'
import { DocumentPreviewPage } from './components/Documents.jsx'
import MeetingDetail from './components/MeetingDetail.jsx'
import { ParticipantsPage } from './components/Participants.jsx'

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash || '#/')

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return hash.replace(/^#/, '') || '/'
}

function goTo(path) {
  window.location.hash = path
}

export default function App({ skipAccess = false, detailTitle }) {
  const route = useHashRoute()
  const [authorized, setAuthorized] = useState(skipAccess)
  const docsMatch = route.match(/^\/docs\/([^/]+)\/?([^/]*)/)
  const participantsMatch = route.match(/^\/participants\/([^/]+)/)
  const meetingMatch = route.match(/^\/meetings\/([^/]+)/)
  const calendarMatch = route === '/calendar' || route === '/'

  if (!authorized) {
    return (
      <AccessCodePage
        onConfirm={() => setAuthorized(true)}
        onSuccess={() => goTo('/calendar')}
      />
    )
  }

  if (docsMatch) {
    return <DocumentPreviewPage meetingId={docsMatch[1]} documentId={docsMatch[2]} />
  }

  if (participantsMatch) {
    return <ParticipantsPage meetingId={participantsMatch[1]} />
  }

  if (meetingMatch) {
    return <MeetingDetail meetingId={meetingMatch[1]} detailTitle={detailTitle} />
  }

  if (calendarMatch) {
    return <CalendarPage />
  }

  return <CalendarPage />
}
