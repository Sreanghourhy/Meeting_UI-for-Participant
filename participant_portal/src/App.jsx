import { Suspense, lazy, useState } from 'react'
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

function EmbeddedPortal({
  activePortal,
  accessCode,
  checkedParticipantIds,
  onBack,
  onCheckedParticipantIdsChange,
}) {
  const titles = {
    'meeting-viewer': 'មើលព័ត៌មានកិច្ចប្រជុំ',
    attendance: 'ចុះវត្តមានអ្នកចូលរួម',
    guide: 'មគ្គុទេសក៍ទីតាំង',
  }

  return (
    <div className="embedded-portal">
      <div className="embedded-toolbar">
        <button className="btn btn-secondary" type="button" onClick={onBack}>ត្រឡប់ទៅផ្ទាំងសេវាកម្ម</button>
        <span>{titles[activePortal]}</span>
      </div>
      <Suspense fallback={<div className="embedded-loading card">កំពុងបើក...</div>}>
        {activePortal === 'meeting-viewer' ? <ViewerApp skipAccess /> : null}
        {activePortal === 'attendance' ? (
          <ParticipantVerifyApp
            initialCode={accessCode}
            checkedParticipantIds={checkedParticipantIds}
            onCheckedParticipantIdsChange={onCheckedParticipantIdsChange}
          />
        ) : null}
        {activePortal === 'guide' ? <GuideParticipantApp /> : null}
      </Suspense>
    </div>
  )
}

export default function App() {
  const [hasAccess, setHasAccess] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [activePortal, setActivePortal] = useState('')
  const [checkedParticipantIds, setCheckedParticipantIds] = useState([])

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

  return <PortalPage onOpenPortal={setActivePortal} />
}
