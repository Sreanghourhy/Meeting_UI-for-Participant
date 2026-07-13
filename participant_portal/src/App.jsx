import { Suspense, lazy, useEffect, useState } from 'react'
import { MemoryRouter } from 'react-router-dom'
import AccessCodePage from './components/AccessCodePage.jsx'
import PortalPage from './components/PortalPage.jsx'

const ViewerApp = lazy(() => Promise.all([
  import('react-pdf-highlighter/dist/style.css'),
  import('../../Viewer_with_Code/src/styles.css'),
  import('../../Viewer_with_Code/src/App.jsx'),
]).then((modules) => ({ default: modules[2].default })))

const ParticipantVerifyApp = lazy(() => Promise.all([
  import('../../participant_verify/src/styles.css'),
  import('../../participant_verify/src/App.jsx'),
]).then((modules) => ({ default: modules[1].default })))

const GuideParticipantApp = lazy(() => Promise.all([
  import('../../guide_particepant/src/styles.css'),
  import('../../guide_particepant/src/App.jsx'),
]).then((modules) => ({ default: modules[1].default })))

const ViewerCalendarApp = lazy(() => Promise.all([
  import('react-pdf-highlighter/dist/style.css'),
  import('../../Viewer_Calenda/src/styles.css'),
  import('../../Viewer_Calenda/src/App.jsx'),
]).then((modules) => ({ default: modules[2].default })))

const WriterApp = lazy(() => Promise.all([
  import('../../writer/src/styles.css'),
  import('../../writer/src/App.jsx'),
]).then((modules) => ({ default: modules[1].default })))

const AdministratorApp = lazy(() => Promise.all([
  import('../../Adminstrator/src/styles.css'),
  import('../../Adminstrator/src/context/AppContext.jsx'),
  import('../../Adminstrator/src/App.jsx'),
]).then((modules) => {
  const { AppProvider } = modules[1]
  const AdminApp = modules[2].default

  return {
    default: function EmbeddedAdministratorApp() {
      return (
        <MemoryRouter>
          <AppProvider>
            <AdminApp />
          </AppProvider>
        </MemoryRouter>
      )
    },
  }
}))

function EmbeddedPortal({
  activePortal,
  accessCode,
  checkedParticipantIds,
  onBack,
  onCheckedParticipantIdsChange,
}) {
  const [hashRoute, setHashRoute] = useState(window.location.hash.replace(/^#/, '') || '/')
  const [guideState, setGuideState] = useState({ step: 'rooms' })
  const [guideBackFn, setGuideBackFn] = useState(null)

  const titles = {
    'meeting-viewer': 'មើលព័ត៌មានកិច្ចប្រជុំ',
    'viewer-calendar': 'ប្រតិទិនកិច្ចប្រជុំ',
    writer: 'កន្លែងរៀបចំអ្នកចូលរួម',
    administrator: 'រដ្ឋបាលការអញ្ជើញ',
    attendance: 'ចុះវត្តមានអ្នកចូលរួម',
    guide: 'មគ្គុទេសក៍ទីតាំង',
  }
  const isCalendarMeetingDetail = activePortal === 'viewer-calendar' && /^\/meetings\/[^/]+/.test(hashRoute)

  useEffect(() => {
    const onHashChange = () => setHashRoute(window.location.hash.replace(/^#/, '') || '/')
    onHashChange()
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const isCalendarLanding = activePortal === 'viewer-calendar' && !isCalendarMeetingDetail
  const usesNativeDetailToolbar = activePortal === 'meeting-viewer' || isCalendarMeetingDetail

  function renderPortalControls(className = 'embedded-toolbar') {
    return (
      <div className={className}>
        {activePortal === 'guide' && guideState.step === 'doors' ? (
          <button className="btn btn-secondary" type="button" onClick={() => guideBackFn && guideBackFn()}>
            ត្រឡប់ក្រោយ
          </button>
        ) : activePortal === 'guide' && guideState.step === 'details' ? (
          <button className="btn btn-secondary" type="button" onClick={() => guideBackFn && guideBackFn()}>
            ត្រឡប់ក្រោយ ជ្រើសរើសទ្វារ
          </button>
        ) : (
          <>
            <button id="portal-back-btn" className="btn btn-secondary" type="button" onClick={onBack}>
              ត្រឡប់ទៅផ្ទាំងសេវាកម្ម
            </button>
            <span id="portal-title">{titles[activePortal]}</span>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="embedded-portal">
      {isCalendarLanding ? renderPortalControls() : null}
      <Suspense fallback={<div className="embedded-loading card">កំពុងបើក...</div>}>
        {!usesNativeDetailToolbar && !isCalendarLanding
          ? renderPortalControls('embedded-toolbar embedded-toolbar-integrated')
          : null}
        {activePortal === 'meeting-viewer' ? (
          <ViewerApp
            skipAccess
            onBackToServices={onBack}
            portalTitle={titles['meeting-viewer']}
          />
        ) : null}
        {activePortal === 'viewer-calendar' ? (
          <ViewerCalendarApp
            skipAccess
            detailTitle="មើលព័ត៌មានកិច្ចប្រជុំ"
          />
        ) : null}
        {activePortal === 'writer' ? <WriterApp /> : null}
        {activePortal === 'administrator' ? <AdministratorApp /> : null}
        {activePortal === 'attendance' ? (
          <ParticipantVerifyApp
            initialCode={accessCode}
            checkedParticipantIds={checkedParticipantIds}
            onCheckedParticipantIdsChange={onCheckedParticipantIdsChange}
          />
        ) : null}
        {activePortal === 'guide' ? (
          <GuideParticipantApp
            onStepChange={(step, backFn) => {
              setGuideState({ step })
              setGuideBackFn(() => backFn)
            }}
          />
        ) : null}
      </Suspense>
    </div>
  )
}

export default function App() {
  const [hasAccess, setHasAccess] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [activePortal, setActivePortal] = useState('')
  const [checkedParticipantIds, setCheckedParticipantIds] = useState([])

  function openPortal(portalId) {
    if (portalId === 'viewer-calendar') {
      window.location.hash = '/calendar'
    }
    setActivePortal(portalId)
  }

  if (!hasAccess) {
    return <AccessCodePage onSuccess={(code) => {
      setAccessCode(code)
      setHasAccess(true)
    }} />
  }

  if (activePortal) {
    return (
      <EmbeddedPortal
        activePortal={activePortal}
        accessCode={accessCode}
        checkedParticipantIds={checkedParticipantIds}
        onCheckedParticipantIdsChange={setCheckedParticipantIds}
        onBack={() => setActivePortal('')}
      />
    )
  }

  return <PortalPage onOpenPortal={openPortal} />
}
