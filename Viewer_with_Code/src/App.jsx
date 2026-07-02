import { useEffect, useState } from 'react'
import {
  formatDate,
  formatTimeRange,
  getMeetingById,
  getStatusBadge,
  getUserById,
  getUserName,
} from './utils/data.js'

const documentCategoryOrder = ['Agenda', 'Reference', 'Law', 'Presentation', 'Supporting']
const meetingAccessCode = 'Q2S-2026-001'

const meetingOneExtraDocuments = [
  {
    id: 'm1-reference-brief',
    name: 'ឯកសារយោងស្តីពីផែនការកែទម្រង់ឌីជីថល.pdf',
    size: 386000,
    category: 'Reference',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'Reviewed',
    uploadedAt: '2026-06-28',
  },
  {
    id: 'm1-reference-budget',
    name: 'របាយការណ៍សង្ខេបថវិកាគម្រោង.pdf',
    size: 244000,
    category: 'Reference',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'Approved',
    uploadedAt: '2026-06-29',
  },
  {
    id: 'm1-reference-risk',
    name: 'តារាងហានិភ័យនៃការអនុវត្តគម្រោង.pdf',
    size: 164000,
    category: 'Reference',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'Draft',
    uploadedAt: '2026-06-30',
  },
  {
    id: 'm1-support-minutes',
    name: 'កំណត់ហេតុកិច្ចប្រជុំលើកមុន.pdf',
    size: 212000,
    category: 'Supporting',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'Reviewed',
    uploadedAt: '2026-06-26',
  },
  {
    id: 'm1-support-action-log',
    name: 'បញ្ជីសកម្មភាពត្រូវអនុវត្ត.pdf',
    size: 128000,
    category: 'Supporting',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'Approved',
    uploadedAt: '2026-06-27',
  },
  {
    id: 'm1-support-research',
    name: 'សេចក្តីសង្ខេបការសិក្សាស្រាវជ្រាវ.pdf',
    size: 512000,
    category: 'Supporting',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'Reviewed',
    uploadedAt: '2026-06-28',
  },
  {
    id: 'm1-support-board',
    name: 'ឯកសារគាំទ្រសម្រាប់ការសម្រេចចិត្ត.pdf',
    size: 98000,
    category: 'Supporting',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'Pending',
    uploadedAt: '2026-06-30',
  },
]

const draftProgressSteps = [
  {
    id: 1,
    title: 'ពិនិត្យឯកសារ',
    description: 'មើលឯកសារ មតិយោបល់ និងកំណត់ចំណាំ',
    status: 'completed',
  },
  {
    id: 2,
    title: 'ប្រមូលមតិ',
    description: 'បូកសរុបមតិយោបល់ពីអ្នកចូលរួម',
    status: 'completed',
  },
  {
    id: 3,
    title: 'កែសម្រួល',
    description: 'កែសម្រួលខ្លឹមសារតាមសំណើ',
    status: 'pending',
  },
  {
    id: 4,
    title: 'ពិនិត្យចុងក្រោយ',
    description: 'ផ្ទៀងផ្ទាត់មុនដាក់ជូនថ្នាក់ដឹកនាំ',
    status: 'pending',
  },
  {
    id: 5,
    title: 'អនុម័ត',
    description: 'បញ្ចប់សេចក្តីព្រាងសម្រាប់ប្រើប្រាស់',
    status: 'final',
  },
]

const draftStatusHistory = [
  { status: 'សម្របសម្រួល', versions: 2, dates: ['2026-06-24', '2026-06-25'] },
  { status: 'បច្ចេកទេស', versions: 3, dates: ['2026-06-26', '2026-06-27', '2026-06-28'] },
  { status: 'អន្តរក្រសួង', versions: 1, dates: ['2026-06-29'] },
  { status: 'ពេញអង្គគណៈរដ្ឋមន្ត្រី', versions: 1, dates: ['2026-06-30'] },
  { status: 'អនុម័ត', versions: 1, dates: ['2026-07-01'] },
]

const khmerMonthNames = [
  'មករា',
  'កុម្ភៈ',
  'មីនា',
  'មេសា',
  'ឧសភា',
  'មិថុនា',
  'កក្កដា',
  'សីហា',
  'កញ្ញា',
  'តុលា',
  'វិច្ឆិកា',
  'ធ្នូ',
]
const khmerWeekdayShortNames = ['អា', 'ច', 'អ', 'ពុ', 'ព្រ', 'សុ', 'ស']

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

function getKhmerParticipant(user) {
  const map = {
    u1: { name: 'លោក ជេម វីលសុន', avatar: 'ជវ', position: 'អ្នកគ្រប់គ្រងគម្រោង', department: 'ក្រុមហ៊ុន អេកមី' },
    u2: { name: 'កញ្ញា សារ៉ា ចិន', avatar: 'សច', position: 'អ្នកអភិវឌ្ឍន៍ជាន់ខ្ពស់', department: 'ក្រុមហ៊ុន អេកមី' },
    u3: { name: 'បណ្ឌិត ម៉ៃឃើល រ៉ូឌ្រីហ្គេស', avatar: 'មរ', position: 'នាយកបច្ចេកវិទ្យា', department: 'ដំណោះស្រាយបច្ចេកវិទ្យា' },
    u4: { name: 'លោកស្រី អេមីលី ថមសុន', avatar: 'អថ', position: 'នាយកធនធានមនុស្ស', department: 'ក្រុមហ៊ុន អេកមី' },
    u5: { name: 'លោក ដេវីដ គីម', avatar: 'ដគ', position: 'អ្នកវិភាគ', department: 'ហិរញ្ញវត្ថុសកល' },
    u6: { name: 'កញ្ញា លីសា ផាក', avatar: 'លផ', position: 'អ្នករចនា UX', department: 'ក្រុមហ៊ុន អេកមី' },
    u7: { name: 'លោក រ៉ូបឺត អេនឌឺសុន', avatar: 'រា', position: 'វិស្វករ', department: 'ដំណោះស្រាយបច្ចេកវិទ្យា' },
    u8: { name: 'កញ្ញា ជេនីហ្វឺ ម៉ាទីណេស', avatar: 'ជម', position: 'ប្រធានទីផ្សារ', department: 'ក្រុមហ៊ុន អេកមី' },
  }
  return map[user?.id] || {}
}

function getDisplayUserName(user) {
  return getKhmerParticipant(user).name || getUserName(user)
}

function getDisplayMeetingTitle(meeting) {
  const titles = {
    m1: 'ការពិនិត្យការផ្លាស់ប្តូរឌីជីថល ត្រីមាសទី៤ ឆ្នាំ២០២៦',
  }
  return titles[meeting.id] || meeting.title
}

function getDisplayVenue(meeting) {
  const venues = {
    'Executive Boardroom': 'បន្ទប់ប្រជុំប្រតិបត្តិ',
    'Innovation Lab': 'មន្ទីរច្នៃប្រឌិត',
    'Conference Room C': 'បន្ទប់ប្រជុំ C',
    'Training Hall': 'សាលាបណ្តុះបណ្តាល',
    'Grand Conference Hall': 'សាលសន្និសីទធំ',
  }
  return venues[meeting.venue] || meeting.venue
}

function getDisplayAgendaItem(item) {
  const items = {
    a1: { title: 'មតិស្វាគមន៍', description: 'ស្វាគមន៍ និងគោលបំណង' },
    a2: { title: 'ពិនិត្យលទ្ធផលត្រីមាសទី១', description: 'ពិនិត្យ KPI និងសូចនាករត្រីមាសទី១' },
    a3: { title: 'វិភាគទីផ្សារ', description: 'បច្ចុប្បន្នភាពអំពីការប្រកួតប្រជែង' },
    a4: { title: 'សម្រាកអាហារថ្ងៃត្រង់', description: 'អាហារថ្ងៃត្រង់ និងបង្កើនទំនាក់ទំនង' },
    a5: { title: 'ការងារត្រូវធ្វើ និងជំហានបន្ទាប់', description: 'កំណត់ការងារត្រូវធ្វើ និងអ្នកទទួលខុសត្រូវ' },
  }
  return items[item.id] || { title: item.title, description: item.description }
}

function getAgendaProgressStatus(item, index) {
  const explicit = {
    a1: 'complete',
    a2: 'complete',
    a3: 'pending',
    a4: 'not-yet',
    a5: 'not-yet',
  }
  return explicit[item.id] || (index === 0 ? 'pending' : 'not-yet')
}

function AccessCodePage({ onConfirm }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    if (code.trim().toUpperCase() === meetingAccessCode) {
      setError('')
      onConfirm()
      goTo('/meetings/m1')
      return
    }

    setError('លេខកូដមិនត្រឹមត្រូវ។ សូមព្យាយាមម្តងទៀត។')
  }

  return (
    <main className="access-page">
      <section className="access-card card">
        <div className="page-eyebrow">ការចូលមើលកិច្ចប្រជុំ</div>
        <h1 className="access-title">បញ្ចូលលេខកូដប្រជុំ</h1>
        <p className="access-copy">
          សូមបញ្ចូលលេខកូដប្រជុំដើម្បីបើកមើលរបៀបវារៈ ឯកសារ និងប្លង់កៅអី។
        </p>
        <form onSubmit={submit} className="access-form">
          <div className="form-group">
            <label className="form-label" htmlFor="meeting-code">លេខកូដប្រជុំ</label>
            <input
              id="meeting-code"
              className="form-input access-input"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Q2S-2026-001"
              autoFocus
            />
          </div>
          {error ? <div className="access-error">{error}</div> : null}
          <button className="btn btn-primary access-button" type="submit">បញ្ជាក់</button>
        </form>
      </section>
    </main>
  )
}

function AgendaTab({ meeting, activePanel, selectedDocument, onSelectDocument, onShowAgenda, onShowParticipants, onBackToAgenda }) {
  const [isDocumentsCollapsed, setIsDocumentsCollapsed] = useState(false)
  const [documentPanel, setDocumentPanel] = useState(null)
  const [showDraftProgress, setShowDraftProgress] = useState(false)
  const sessionAgenda = (session) => (meeting.agenda || []).filter((item) => item.session === session)
  const draftDocument = meeting.documents?.find((document) => document.category === 'Presentation') || meeting.documents?.[0]
  const isDraftDocument = selectedDocument?.id === draftDocument?.id
  const refreshDocumentLayout = () => {
    window.requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
    window.setTimeout(() => window.dispatchEvent(new Event('resize')), 260)
  }
  const collapseDocumentsSidebar = () => {
    setIsDocumentsCollapsed(true)
    refreshDocumentLayout()
  }

  useEffect(() => {
    setDocumentPanel(null)
    setShowDraftProgress(false)
  }, [activePanel, selectedDocument?.id])

  const panelTabs = (
    <div className="agenda-title-bar">
      <div className="agenda-title-tabs" role="tablist" aria-label="ព័ត៌មានកិច្ចប្រជុំ">
        <button
          className={`tab agenda-title-tab ${activePanel === 'agenda' ? 'active' : ''}`}
          type="button"
          role="tab"
          aria-selected={activePanel === 'agenda'}
          onClick={onShowAgenda}
        >
          របៀបវារៈ
        </button>
        <button
          className={`tab agenda-title-tab ${activePanel === 'participants' ? 'active' : ''}`}
          type="button"
          role="tab"
          aria-selected={activePanel === 'participants'}
          onClick={onShowParticipants}
        >
          ប្លង់កៅអី
        </button>
        <button
          className={`tab agenda-title-tab ${activePanel === 'document' && isDraftDocument && !showDraftProgress ? 'active' : ''}`}
          type="button"
          role="tab"
          aria-selected={activePanel === 'document' && isDraftDocument && !showDraftProgress}
          onClick={() => {
            if (!draftDocument) return

            setShowDraftProgress(false)
            onSelectDocument(draftDocument)
            collapseDocumentsSidebar()
          }}
        >
          សេចក្តីព្រាង
        </button>
        <button
          className={`tab agenda-title-tab draft-note-tab ${activePanel === 'document' && isDraftDocument && showDraftProgress ? 'active' : ''}`}
          type="button"
          role="tab"
          aria-selected={activePanel === 'document' && isDraftDocument && showDraftProgress}
          onClick={() => {
            if (!draftDocument) return

            setShowDraftProgress(true)
            onSelectDocument(draftDocument)
            collapseDocumentsSidebar()
          }}
        >
          កំណត់ត្រាសេចក្តីព្រាង
        </button>
      </div>
      {activePanel === 'document' && selectedDocument && isDraftDocument && !showDraftProgress ? (
        <div className="agenda-document-actions">
          <button
            className={`pdf-action-button ${documentPanel === 'comments' ? 'active' : ''}`}
            type="button"
            onClick={() => {
              setDocumentPanel(documentPanel === 'comments' ? null : 'comments')
              refreshDocumentLayout()
            }}
          >
            មតិយោបល់
          </button>
          <button
            className={`pdf-action-button ${documentPanel === 'note' ? 'active' : ''}`}
            type="button"
            onClick={() => {
              setDocumentPanel(documentPanel === 'note' ? null : 'note')
              refreshDocumentLayout()
            }}
          >
            កំណត់ចំណាំ
          </button>
        </div>
      ) : null}
    </div>
  )

  return (
    <div className={`agenda-layout ${isDocumentsCollapsed ? 'documents-collapsed' : ''}`}>
      <aside className="agenda-sidebar">
        <DocumentsCard
          meeting={meeting}
          selectedDocument={selectedDocument}
          onSelectDocument={onSelectDocument}
          isCollapsed={isDocumentsCollapsed}
          onToggleCollapse={() => {
            setIsDocumentsCollapsed((isCollapsed) => !isCollapsed)
            refreshDocumentLayout()
          }}
        />
      </aside>
      <div className="agenda-main">
        {activePanel === 'document' && selectedDocument ? (
          <InlineDocumentPreview
            meeting={meeting}
            document={selectedDocument}
            headerTabs={isDraftDocument ? panelTabs : null}
            activePanel={isDraftDocument ? documentPanel : null}
            showDraftProgress={isDraftDocument && showDraftProgress}
            onBack={onBackToAgenda}
            onCollapseDocumentsSidebar={collapseDocumentsSidebar}
          />
        ) : null}
        {activePanel === 'participants' ? <InlineParticipantsPreview meeting={meeting} headerTabs={panelTabs} /> : null}
        {activePanel === 'agenda' && <div className="card">
          <div className="card-header">
            {panelTabs}
            <div className="progress-legend" aria-label="ស្ថានភាពរបៀបវារៈ">
              <span><i className="legend-dot complete" />បានបញ្ចប់</span>
              <span><i className="legend-dot pending" />កំពុងរង់ចាំ</span>
              <span><i className="legend-dot not-yet" />មិនទាន់ដល់</span>
            </div>
          </div>
          <div className="card-body agenda-sessions">
            {['morning', 'afternoon'].map((session) => {
              const items = sessionAgenda(session)
              return (
                <section key={session} className="session-block">
                  <div className="session-title">{session === 'morning' ? 'វគ្គព្រឹក' : 'វគ្គរសៀល'}</div>
                  {!items.length ? <div className="empty-state compact">មិនមានធាតុ</div> : (
                    <div className="agenda-table">
                      <div className="agenda-header-row">
                        <span />
                        <span>ម៉ោង</span>
                        <span>ចំណងជើង និងពិពណ៌នា</span>
                      </div>
                      {items.map((item, index) => {
                        const progressStatus = getAgendaProgressStatus(item, index)
                        return (
                        <div key={item.id} className={`agenda-row progress-${progressStatus} ${index === items.length - 1 ? 'last' : ''}`}>
                          <div className="agenda-timeline">
                            <div className="timeline-node" />
                            {index < items.length - 1 ? <div className="timeline-line" /> : null}
                          </div>
                          <div className="agenda-time-col">
                            <div>{item.startTime || item.time}</div>
                            <div className="time-end">{item.endTime || '-'}</div>
                          </div>
                          <div className="agenda-content-col">
                            <div className="agenda-title">{getDisplayAgendaItem(item).title}</div>
                            <div className="agenda-desc">{getDisplayAgendaItem(item).description}</div>
                          </div>
                        </div>
                        )
                      })}
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        </div>}
      </div>
    </div>
  )
}

function DraftProgressTimeline({ selectedStep, onSelectStep }) {
  return (
    <div className="draft-progress">
      <div className="draft-progress-track" aria-hidden="true" />
      {draftProgressSteps.map((step) => (
        <button
          key={step.id}
          className={`draft-step status-${step.status} ${selectedStep === step.id ? 'active' : ''}`}
          type="button"
          onClick={() => onSelectStep(step.id)}
        >
          <span className="draft-step-number">
            {step.status === 'completed' ? '✓' : step.status === 'final' ? '•' : toKhmerNumeral(step.id)}
          </span>
          <span className="draft-step-copy">
            <span className="draft-step-status">
              {step.status === 'completed' ? 'បានបញ្ចប់' : step.status === 'final' ? 'ចុងក្រោយ' : step.id === 3 ? 'កំពុងដំណើរការ' : 'រង់ចាំ'}
            </span>
            <span className="draft-step-title">{step.title}</span>
            <span className="draft-step-desc">{step.description}</span>
          </span>
        </button>
      ))}
    </div>
  )
}

function getDraftStepDocuments(meeting, currentDocument, stepId) {
  const relatedDocuments = getMeetingDocuments(meeting)
  const stepDocuments = {
    1: [currentDocument, ...relatedDocuments],
    2: relatedDocuments.slice(0, 3),
    3: relatedDocuments.slice(3, 4),
  }

  return (stepDocuments[stepId] || []).reduce((items, document) => {
    if (items.some((item) => item.id === document.id)) return items
    return [...items, document]
  }, [])
}

function getDraftHistoryDocuments(currentDocument) {
  let draftVersion = 0

  return draftStatusHistory.flatMap((stage, stageIndex) => (
    Array.from({ length: stage.versions }, (_, versionIndex) => {
      draftVersion += 1

      return {
        ...currentDocument,
        id: `${currentDocument.id}-draft-${stageIndex + 1}-${versionIndex + 1}`,
        name: currentDocument.name,
        uploadedAt: stage.dates[versionIndex],
        draftStatus: stage.status,
        draftVersion,
      }
    })
  ))
}

function getDraftStatusClass(status) {
  const statusIndex = draftStatusHistory.findIndex((stage) => stage.status === status)
  return statusIndex >= 0 ? `status-${statusIndex + 1}` : 'status-default'
}

function toISODate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function DraftDatePicker({ value, onChange }) {
  const selectedDate = value ? new Date(`${value}T00:00:00`) : null
  const initialDate = selectedDate || new Date(`${draftStatusHistory[0].dates[0]}T00:00:00`)
  const [isOpen, setIsOpen] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1))
  const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1)
  const gridStart = new Date(monthStart)
  gridStart.setDate(monthStart.getDate() - monthStart.getDay())
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)
    return date
  })

  const moveMonth = (offset) => {
    setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1))
  }

  return (
    <div className="draft-date-picker">
      <button
        className={`draft-date-trigger ${value ? 'has-value' : ''}`}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
      >
        <span className="draft-date-icon" aria-hidden="true" />
        <span>{value ? formatDraftDocumentDate({ uploadedAt: value }) : 'ជ្រើសកាលបរិច្ឆេទ'}</span>
      </button>
      {isOpen ? (
        <div className="draft-date-popover">
          <div className="draft-calendar-header">
            <button type="button" onClick={() => moveMonth(-1)} aria-label="ខែមុន">‹</button>
            <strong>{khmerMonthNames[visibleMonth.getMonth()]} {toKhmerNumeral(visibleMonth.getFullYear())}</strong>
            <button type="button" onClick={() => moveMonth(1)} aria-label="ខែក្រោយ">›</button>
          </div>
          <div className="draft-calendar-weekdays">
            {khmerWeekdayShortNames.map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="draft-calendar-grid">
            {calendarDays.map((date) => {
              const isoDate = toISODate(date)
              const isCurrentMonth = date.getMonth() === visibleMonth.getMonth()
              const isSelected = value === isoDate

              return (
                <button
                  key={isoDate}
                  className={`${isCurrentMonth ? '' : 'muted'} ${isSelected ? 'selected' : ''}`}
                  type="button"
                  onClick={() => {
                    onChange(isoDate)
                    setIsOpen(false)
                  }}
                >
                  {toKhmerNumeral(date.getDate())}
                </button>
              )
            })}
          </div>
          <button
            className="draft-date-clear"
            type="button"
            onClick={() => {
              onChange('')
              setIsOpen(false)
            }}
          >
            លុបតម្រងកាលបរិច្ឆេទ
          </button>
        </div>
      ) : null}
    </div>
  )
}

function DraftStepDocuments({ currentDocument, onSelectDocument, onCollapseDocumentsSidebar }) {
  const [statusFilter, setStatusFilter] = useState('')
  const documents = getDraftHistoryDocuments(currentDocument)
  const statusCounts = draftStatusHistory.reduce((counts, stage) => ({
    ...counts,
    [stage.status]: documents.filter((document) => document.draftStatus === stage.status).length,
  }), {})
  const filteredDocuments = documents.filter((document) => {
    const matchesStatus = !statusFilter || document.draftStatus === statusFilter

    return matchesStatus
  })

  return (
    <div className="draft-document-workspace">
      <aside className="draft-document-list-panel">
        <div className="draft-status-filter" aria-label="តម្រងតាមស្ថានភាព">
          <button
            className={`draft-status-chip all ${statusFilter ? '' : 'active'}`}
            type="button"
            onClick={() => setStatusFilter('')}
          >
            <span>ទាំងអស់</span>
            <strong>{toKhmerNumeral(documents.length)}</strong>
          </button>
          {draftStatusHistory.map((stage) => (
            <button
              key={stage.status}
              className={`draft-status-chip ${getDraftStatusClass(stage.status)} ${statusFilter === stage.status ? 'active' : ''}`}
              type="button"
              onClick={() => setStatusFilter((currentStatus) => (currentStatus === stage.status ? '' : stage.status))}
            >
              <span>{stage.status}</span>
              <strong>{toKhmerNumeral(statusCounts[stage.status] || 0)}</strong>
            </button>
          ))}
        </div>
        <div className="draft-document-list-heading">
          <span>ឯកសារ</span>
          <span>កាលបរិច្ឆេទ</span>
          <span>ស្ថានភាព</span>
          <span>កំណែ</span>
        </div>
        <div className="document-list draft-document-list">
          {filteredDocuments.map((document) => (
            <button
              key={document.id}
              className="document-row draft-document-row"
              type="button"
              onClick={() => {
                onSelectDocument(document)
                onCollapseDocumentsSidebar?.()
              }}
            >
              <span className="document-row-copy">
                <span className="document-name">{document.name}</span>
              </span>
              <span className="document-date-time">{formatDraftDocumentDate(document)}</span>
              <span className={`draft-document-status ${getDraftStatusClass(document.draftStatus)}`}>{document.draftStatus}</span>
              <span className="draft-document-version">លើកទី{toKhmerNumeral(document.draftVersion)}</span>
            </button>
          ))}
        </div>
        {!filteredDocuments.length ? <div className="empty-state compact">រកមិនឃើញឯកសារតាមការស្វែងរក ឬតម្រងនេះទេ។</div> : null}
      </aside>
    </div>
  )
}

function InlineDocumentPreview({ meeting, document, headerTabs, activePanel, showDraftProgress = false, onBack, onCollapseDocumentsSidebar }) {
  const [selectedDraftStep, setSelectedDraftStep] = useState(1)
  const [draftPreviewDocument, setDraftPreviewDocument] = useState(null)

  useEffect(() => {
    setDraftPreviewDocument(null)
  }, [showDraftProgress, selectedDraftStep, document.id])

  return (
    <section className="card inline-document-preview">
      <div className="card-header">
        {headerTabs || (
          <>
            <span className="card-title document-card-title">
              <span className="file-glyph" aria-hidden="true" />
              {document.name}
            </span>
            <div className="document-header-actions">
              <button className="btn btn-sm btn-secondary back-to-agenda-button" type="button" onClick={onBack}>ត្រឡប់ទៅរបៀបវារៈ</button>
            </div>
          </>
        )}
      </div>
      <div className="card-body">
        {showDraftProgress ? (
          draftPreviewDocument ? (
            <div className="draft-drilldown">
              <DocumentPreview
                meeting={meeting}
                document={draftPreviewDocument}
                readOnlyComments
                toolbarStart={(
                  <button className="btn btn-sm btn-secondary back-to-document-list-button" type="button" onClick={() => setDraftPreviewDocument(null)}>
                    ត្រឡប់ទៅឯកសារ
                  </button>
                )}
              />
            </div>
          ) : (
            <DraftStepDocuments
              currentDocument={document}
              onSelectDocument={setDraftPreviewDocument}
              onCollapseDocumentsSidebar={onCollapseDocumentsSidebar}
            />
          )
        ) : (
          <DocumentPreview
            meeting={meeting}
            document={document}
            activePanel={activePanel}
          />
        )}
      </div>
    </section>
  )
}

function DocumentPreview({ meeting, document, activePanel: externalActivePanel, readOnlyComments = false, toolbarStart = null }) {
  const [localActivePanel, setLocalActivePanel] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])
  const [noteText, setNoteText] = useState('')
  const participants = meeting ? getMeetingParticipants(meeting) : []
  const activePanel = externalActivePanel !== undefined ? externalActivePanel : localActivePanel

  useEffect(() => {
    const savedComments = window.localStorage.getItem(`document-comments:${document.id}`)
    const savedNote = window.localStorage.getItem(`document-note:${document.id}`)
    const starterParticipants = participants.slice(0, 3)
    setComments(savedComments ? JSON.parse(savedComments) : [
      ...starterParticipants.map((participant, index) => ({
        id: `participant-seed-${participant.id}`,
        author: participant.name,
        avatar: participant.avatar,
        role: 'participant',
        text: [
          'ខ្ញុំបានមើលឯកសារនេះហើយ។ មានចំណុចណាដែលយើងគួរពិភាក្សាមុនគេ?',
          'ខ្ញុំស្នើឱ្យយើងចាប់ផ្តើមពីផ្នែកសកម្មភាពបន្ទាប់។',
          'ខ្ញុំនឹងកត់ចំណុចដែលត្រូវសម្រេចក្នុងកិច្ចប្រជុំ។',
        ][index],
      })),
    ])
    setNoteText(savedNote || '')
    setLocalActivePanel(null)
    setCommentText('')
  }, [document.id, document.name, meeting?.id])

  useEffect(() => {
    if (comments.length) {
      window.localStorage.setItem(`document-comments:${document.id}`, JSON.stringify(comments))
    }
  }, [comments, document.id])

  useEffect(() => {
    window.localStorage.setItem(`document-note:${document.id}`, noteText)
  }, [noteText, document.id])

  useEffect(() => {
    window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'))
    })
  }, [activePanel])

  function handleCommentSubmit(event) {
    event.preventDefault()
    const trimmed = commentText.trim()
    if (!trimmed) return

    setComments((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        author: 'អ្នក',
        avatar: 'អ',
        role: 'user',
        text: trimmed,
      },
    ])
    setCommentText('')

    const replyParticipants = participants.slice(0, Math.min(3, participants.length))
    replyParticipants.forEach((participant, index) => {
      window.setTimeout(() => {
        setComments((current) => [
          ...current,
          {
            id: `reply-${participant.id}-${Date.now()}`,
            author: participant.name,
            avatar: participant.avatar,
            role: 'participant',
            text: getParticipantReply(participant, trimmed, index),
          },
        ])
      }, 500 + index * 650)
    })
  }

  function getParticipantReply(participant, message, index) {
    const normalized = message.toLowerCase()
    if (normalized.includes('សង្ខេប') || normalized.includes('summary')) {
      return index === 0
        ? 'ខ្ញុំអាចជួយសង្ខេបចំណុចសំខាន់ៗពីឯកសារនេះបាន។'
        : 'ខ្ញុំយល់ស្រប។ សេចក្តីសង្ខេបគួរតែដាក់តាមលំដាប់ប្រធានបទ។'
    }
    if (normalized.includes('សំណួរ') || normalized.includes('question') || message.includes('?')) {
      return index === 0
        ? 'សំណួរនេះល្អ។ ខ្ញុំគិតថាយើងគួរឆ្លើយវាក្នុងកិច្ចប្រជុំ។'
        : 'ខ្ញុំនឹងពិនិត្យផ្នែកពាក់ព័ន្ធហើយបន្ថែមមតិរបស់ខ្ញុំ។'
    }
    return [
      'ខ្ញុំបានទទួលចំណុចនេះហើយ។',
      'ខ្ញុំយល់ព្រម ហើយនឹងពិនិត្យផ្នែកនេះបន្ថែម។',
      'ចំណុចនេះគួរតែដាក់ក្នុងការពិភាក្សាបន្ទាប់។',
    ][index] || `${participant.name} បានទទួលចំណុចនេះ។`
  }

  return (
    <div className="document-preview">
      {document.url ? (
        <div className="pdf-workspace">
          {externalActivePanel === undefined ? (
            <div className="pdf-viewer-top">
              <div className="pdf-toolbar-start">{toolbarStart}</div>
              <span />
              <div className="pdf-actions">
                <button
                  className={`pdf-action-button ${activePanel === 'comments' ? 'active' : ''}`}
                  type="button"
                  onClick={() => setLocalActivePanel(activePanel === 'comments' ? null : 'comments')}
                >
                  មតិយោបល់
                </button>
                <button
                  className={`pdf-action-button ${activePanel === 'note' ? 'active' : ''}`}
                  type="button"
                  onClick={() => setLocalActivePanel(activePanel === 'note' ? null : 'note')}
                >
                  កំណត់ចំណាំ
                </button>
              </div>
            </div>
          ) : null}
          <div className={`pdf-content-grid ${activePanel ? 'with-panel' : ''}`}>
            <div className="pdf-frame-wrap">
              <iframe
                key={document.url}
                className="document-pdf-frame"
                src={`${document.url}#toolbar=0&navpanes=0&view=FitH&zoom=page-width`}
                title={displayCategory(document.category)}
              />
            </div>
            {activePanel === 'comments' ? (
              <section className="document-side-panel chat-panel">
                <div className="chat-topic-header">
                  <div className="chat-topic-icon">#</div>
                  <div className="chat-topic-copy">
                    <div className="document-panel-eyebrow">Topic chat</div>
                    <h3>{document.name}</h3>
                    <span>{participants.length} អ្នកចូលរួមក្នុងកិច្ចប្រជុំនេះ</span>
                  </div>
                </div>
                <div className="comment-thread">
                  {comments.map((comment) => (
                    <div key={comment.id} className={`comment-bubble ${comment.role}`}>
                      <div className="comment-author">
                        <span className="comment-avatar">{comment.avatar || 'អ'}</span>
                        {comment.author}
                      </div>
                      <p>{comment.text}</p>
                    </div>
                  ))}
                </div>
                {readOnlyComments ? (
                  <div className="comment-history-note">មើលបានតែប្រវត្តិមតិយោបល់ប៉ុណ្ណោះ</div>
                ) : (
                  <form className="comment-form" onSubmit={handleCommentSubmit}>
                    <div className="chat-composer">
                      <input
                        className="form-input"
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        placeholder="Message this topic..."
                      />
                      <button className="chat-send-button" type="submit" aria-label="ផ្ញើ">➤</button>
                    </div>
                  </form>
                )}
              </section>
            ) : null}
            {activePanel === 'note' ? (
              <section className="document-side-panel">
                <div className="document-panel-header">
                  <div>
                    <div className="document-panel-eyebrow">កំណត់ចំណាំ</div>
                    <h3>{document.name}</h3>
                  </div>
                </div>
                <textarea
                  className="document-note-input"
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                  placeholder="សរសេរកំណត់ចំណាំសម្រាប់ឯកសារនេះ..."
                />
              </section>
            ) : null}
          </div>
        </div>
      ) : (
        <>
          <div className="document-preview-summary">
            <div className="document-preview-title">
              <span className="document-preview-icon"><span className="file-glyph" /></span>
              <h2>{document.name}</h2>
            </div>
          </div>
          <div className="document-preview-canvas">
            <span className="document-preview-large-icon"><span className="file-glyph" /></span>
            <div className="document-preview-name">{document.name}</div>
          </div>
        </>
      )}
    </div>
  )
}

function toKhmerNumeral(value) {
  const digits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']
  return String(value).replace(/\d/g, (digit) => digits[Number(digit)])
}

function SeatIcon({ occupied }) {
  return (
    <span className={`seat-icon ${occupied ? 'occupied' : ''}`} aria-hidden="true">
      <span className="seat-icon-back" />
      <span className="seat-icon-cushion" />
      <span className="seat-icon-arm left" />
      <span className="seat-icon-arm right" />
      <span className="seat-icon-leg left" />
      <span className="seat-icon-leg right" />
    </span>
  )
}

const extraSeatingParticipants = [
  { id: 'seat-extra-1', name: 'ឯកឧត្តម ហ៊ីង ថូរ៉ាក់ស៊ី', avatar: 'ថស', position: 'រដ្ឋលេខាធិការប្រចាំការ' },
  { id: 'seat-extra-2', name: 'ឯកឧត្តម ឆាយ រៀន', avatar: 'ឆរ', position: 'រដ្ឋលេខាធិការ' },
  { id: 'seat-extra-3', name: 'ឯកឧត្តម អេង ទូច', avatar: 'អទ', position: 'រដ្ឋលេខាធិការ' },
  { id: 'seat-extra-4', name: 'ឯកឧត្តមបណ្ឌិត ស៊ា ម៉ៅ', avatar: 'សម', position: 'រដ្ឋលេខាធិការ' },
  { id: 'seat-extra-5', name: 'ឯកឧត្តម លី ច័ន្ទតុលា', avatar: 'លច', position: 'រដ្ឋលេខាធិការ' },
  { id: 'seat-extra-6', name: 'ឯកឧត្តម អ៊ឹង សេរីវិសុទ្ធ', avatar: 'អស', position: 'រដ្ឋលេខាធិការ' },
  { id: 'seat-extra-7', name: 'ឯកឧត្តម លីវ សុវណ្ណ', avatar: 'លស', position: 'អនុរដ្ឋលេខាធិការ' },
  { id: 'seat-extra-8', name: 'ឯកឧត្តម ឃីម រស្មីដា', avatar: 'ឃរ', position: 'អនុរដ្ឋលេខាធិការ' },
  { id: 'seat-extra-9', name: 'ឯកឧត្តម ហែម ក្រាញ់តូនី', avatar: 'ហក', position: 'អនុរដ្ឋលេខាធិការ' },
  { id: 'seat-extra-10', name: 'ឯកឧត្តម កែវ សត្ថា', avatar: 'កស', position: 'អនុរដ្ឋលេខាធិការ' },
  { id: 'seat-extra-11', name: 'ឯកឧត្តម សេង ទៀង', avatar: 'សទ', position: 'អគ្គនាយក' },
  { id: 'seat-extra-12', name: 'ឯកឧត្តម ម៉ិន ប៉ុនធាត', avatar: 'មប', position: 'អគ្គនាយក' },
  { id: 'seat-extra-13', name: 'ឯកឧត្តមបណ្ឌិត អេង កុកថាយ', avatar: 'អក', position: 'អគ្គនាយក' },
  { id: 'seat-extra-14', name: 'ឯកឧត្តម ឡេង សេង', avatar: 'ឡស', position: 'អគ្គនាយករង' },
  { id: 'seat-extra-15', name: 'ឯកឧត្តម យ៉ង ណាត', avatar: 'យណ', position: 'អគ្គនាយករង' },
  { id: 'seat-extra-16', name: 'ឯកឧត្តម គួច វៃចង្ស៊ិន', avatar: 'គវ', position: 'អគ្គនាយករង' },
  { id: 'seat-extra-17', name: 'ឯកឧត្តម ហង្ស ជឿន', avatar: 'ហជ', position: 'ប្រធាននាយកដ្ឋាន' },
  { id: 'seat-extra-18', name: 'ឯកឧត្តមបណ្ឌិត ហួត ពុំ', avatar: 'ហព', position: 'ប្រធាននាយកដ្ឋាន' },
  { id: 'seat-extra-19', name: 'ឯកឧត្តម ណិត សុធា', avatar: 'ណស', position: 'ប្រធាននាយកដ្ឋាន' },
  { id: 'seat-extra-20', name: 'ឯកឧត្តម ថោង សំអាត', avatar: 'ថស', position: 'ប្រធាននាយកដ្ឋាន' },
  { id: 'seat-extra-21', name: 'ឯកឧត្តម ហ៊ុយ វណ្ណៈ', avatar: 'ហវ', position: 'ប្រធានការិយាល័យ' },
  { id: 'seat-extra-22', name: 'ឯកឧត្តម សេត មហាំម៉ាត់ស៊ីស', avatar: 'សម', position: 'ប្រធានការិយាល័យ' },
  { id: 'seat-extra-23', name: 'ឯកឧត្តម ហ៊ឹន បញ្ញាវឌ្ឍន៏', avatar: 'ហប', position: 'ប្រធានការិយាល័យ' },
  { id: 'seat-extra-24', name: 'ឯកឧត្តម ណុប សាមុត', avatar: 'ណស', position: 'ប្រធានការិយាល័យ' },
  { id: 'seat-extra-25', name: 'ឯកឧត្តម វណ្ណាមុន្នី អានន្ទដាយ៉ាត', avatar: 'វអ', position: 'ទីប្រឹក្សា' },
  { id: 'seat-extra-26', name: 'ឯកឧត្តម មែប ផល្លា', avatar: 'មផ', position: 'ទីប្រឹក្សា' },
  { id: 'seat-extra-27', name: 'ឯកឧត្តម នៅ ប៊ោនធន', avatar: 'នប', position: 'ទីប្រឹក្សា' },
  { id: 'seat-extra-28', name: 'ឯកឧត្តម ឈាង វណ្ណារិទ្ធ', avatar: 'ឈវ', position: 'ទីប្រឹក្សា' },
]

const meetingChair = {
  id: 'chair-vong-vissoth',
  name: 'ឯកឧត្តម វង្ស វិស្សុត',
  avatar: 'វវ',
  position: 'ឧបនាយករដ្ឋមន្ត្រីប្រចាំការ',
}

function InlineParticipantsPreview({ meeting, onBack, headerTabs }) {
  const headParticipant = meetingChair
  const seatedParticipants = [...getMeetingParticipants(meeting), ...extraSeatingParticipants]
    .filter((participant) => participant.id !== headParticipant.id)
    .slice(0, 9)
  const participants = [headParticipant, ...seatedParticipants]
  const seatCount = Math.max(5, Math.ceil(seatedParticipants.length / 2))
  const leftSeats = Array.from({ length: seatCount }, (_, index) => ({
    number: index + 1,
    participant: seatedParticipants[index * 2] || null,
  })).reverse()
  const rightSeats = Array.from({ length: seatCount }, (_, index) => ({
    number: index + 1,
    participant: seatedParticipants[index * 2 + 1] || null,
  })).reverse()

  function renderSeat({ number, participant }, side) {
    return (
      <button key={`${side}-${number}`} className={`seat-card ${side}`} type="button">
        <span className="seat-number">{toKhmerNumeral(number)}</span>
        <SeatIcon occupied={Boolean(participant)} />
        <span className="seat-copy">
          {participant ? (
            <>
              <span className="seat-name">{participant.name}</span>
              <span className="seat-title">{participant.position}</span>
            </>
          ) : (
            <span className="seat-empty">កៅអីទំនេរ</span>
          )}
        </span>
      </button>
    )
  }

  return (
    <section className="card inline-participant-preview">
      <div className="card-header">
        {headerTabs || <span className="card-title">ប្លង់កៅអី</span>}
        <div className="participant-header-actions">
          <span className="badge badge-neutral">{toKhmerNumeral(participants.length)} នាក់</span>
          {onBack ? <button className="btn btn-sm btn-secondary" type="button" onClick={onBack}>ត្រឡប់ទៅរបៀបវារៈ</button> : null}
        </div>
      </div>
      <div className="seating-plan">
        <div className="seating-tip">ប្លង់កៅអីសម្រាប់កិច្ចប្រជុំ - ជួរទី១ និងជួរទី២</div>
        <div className="seat-row-labels">
          <span>ជួរទី១</span>
          <span />
          <span>ជួរទី២</span>
        </div>
        <div className="seat-grid">
          <div className="seat-column left">{leftSeats.map((seat) => renderSeat(seat, 'left'))}</div>
          <div className="meeting-table" aria-hidden="true">
            <span className="table-trim" />
          </div>
          <div className="seat-column right">{rightSeats.map((seat) => renderSeat(seat, 'right'))}</div>
        </div>
        <div className="head-seat-wrap">
          <span className="head-connector" />
          <button className="head-seat-card" type="button">
            <span className="head-seat-main">
              <SeatIcon occupied={Boolean(headParticipant)} />
              <span className="head-label">ប្រធាន</span>
            </span>
            <span className="head-name">{headParticipant?.name || 'កៅអីទំនេរ'}</span>
            <span className="head-title">{headParticipant?.position || ''}</span>
          </button>
        </div>
      </div>
    </section>
  )
}

function displayCategory(category) {
  const labels = {
    Agenda: 'របៀបវារៈ',
    Reference: 'ឯកសារយោង',
    Law: 'ឯកសារបទដ្ឋានគតិយុត្ដ',
    Presentation: 'បទបង្ហាញ',
    Supporting: 'ឯកសារគាំទ្រ',
  }
  return labels[category] || category
}

function formatDocumentSize(size) {
  if (typeof size === 'number') return `${(size / 1024).toFixed(1)} KB`
  return size || '-'
}

function formatDocumentDateTime(document) {
  const dateText = document.uploadedAt ? formatDate(document.uploadedAt) : 'មិនមានកាលបរិច្ឆេទ'
  return `${dateText} · ${document.uploadedTime || '09:00'}`
}

function formatDraftDocumentDate(document) {
  return document.uploadedAt ? formatDate(document.uploadedAt) : 'មិនមានកាលបរិច្ឆេទ'
}

function getDocumentCategory(document) {
  if (document.category) return document.category

  const name = document.name.toLowerCase()
  if (name.includes('agenda')) return 'Agenda'
  if (name.includes('law') || name.includes('policy') || name.includes('regulation')) return 'Law'
  if (name.includes('presentation') || name.includes('deck') || document.type === 'video') return 'Presentation'
  if (name.includes('minute') || name.includes('support')) return 'Supporting'
  return 'Reference'
}

function normalizeDocument(document, meeting) {
  return {
    ...document,
    category: getDocumentCategory(document),
    meetingId: meeting.meetingCode || meeting.id,
    uploadedAt: document.uploadedAt || meeting.date,
    uploadedTime: document.uploadedTime || meeting.startTime || '09:00',
    status: document.status || 'Available',
  }
}

function isMeetingDocumentVisible(document) {
  return document.id !== 'd1' && document.url !== '/docs/Q2_Strategy_Deck.pdf'
}

function displayDocumentStatus(status) {
  const labels = {
    Reviewed: 'បានពិនិត្យ',
    Approved: 'បានអនុម័ត',
    Draft: 'ព្រាង',
    Pending: 'កំពុងរង់ចាំ',
    Available: 'មានស្រាប់',
  }
  return labels[status] || status
}

function displayMeetingStatus(status) {
  const labels = {
    scheduled: 'បានកំណត់ពេល',
    completed: 'បានបញ្ចប់',
    pending: 'កំពុងរង់ចាំ',
    cancelled: 'បានលុបចោល',
  }
  return labels[status] || status
}

function getMeetingDocuments(meeting) {
  const baseDocuments = (meeting.documents || []).map((document) => normalizeDocument(document, meeting))
  const extraDocuments = meeting.id === 'm1'
    ? meetingOneExtraDocuments.map((document) => normalizeDocument(document, meeting))
    : []

  return [...baseDocuments, ...extraDocuments].filter(isMeetingDocumentVisible)
}

function groupDocuments(documents) {
  return documentCategoryOrder
    .map((category) => ({
      category,
      documents: documents.filter((document) => document.category === category),
    }))
    .filter((group) => group.documents.length > 0)
}

function DocumentsCard({ meeting, selectedDocument, onSelectDocument, isCollapsed, onToggleCollapse }) {
  const [categoryFilter, setCategoryFilter] = useState('')
  const documents = getMeetingDocuments(meeting)
  const categories = documentCategoryOrder.filter((category) => documents.some((doc) => doc.category === category))
  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = !categoryFilter || doc.category === categoryFilter

    return matchesCategory
  })

  if (isCollapsed) {
    return (
      <div className="card document-sidebar-compact">
        <button
          className="document-sidebar-compact-header"
          type="button"
          onClick={onToggleCollapse}
          aria-label="បើកឯកសារបទដ្ឋានគតិយុត្ដ"
        >
          ឯកសារ
        </button>
        <div className="document-icon-list">
              {documents.map((doc) => (
            <button
              key={doc.id}
              className={`document-icon-only icon-${doc.category.toLowerCase()} ${selectedDocument?.id === doc.id ? 'selected' : ''}`}
              type="button"
              onClick={() => onSelectDocument(doc)}
              aria-label={doc.name}
              title={doc.name}
            >
              <span className="file-glyph" aria-hidden="true" />
              <span className="document-icon-tooltip" role="tooltip">{doc.name}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card sidebar-card">
      <div className="card-header">
        <span className="card-title document-card-title">
          <span className="file-glyph" aria-hidden="true" />
          ឯកសារបទដ្ឋានគតិយុត្ដ
        </span>
        <button
          className="sidebar-toggle-button"
          type="button"
          onClick={onToggleCollapse}
          aria-label="បិទឯកសារបទដ្ឋានគតិយុត្ដ"
        >
          <span className="sidebar-toggle-icon" aria-hidden="true" />
        </button>
      </div>
      <div className="participant-filters document-card-filters">
        <select className="form-select participant-position-filter" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
          <option value="">ប្រភេទទាំងអស់</option>
          {categories.map((category) => (
            <option key={category} value={category}>{displayCategory(category)}</option>
          ))}
        </select>
      </div>
      <div className="card-body document-groups document-card-scroll">
        <section className="document-group">
          <div className="document-list">
              {filteredDocuments.map((doc) => (
                <button
                  key={doc.id}
                  className={`document-row category-${doc.category.toLowerCase()} ${selectedDocument?.id === doc.id ? 'selected' : ''}`}
                  type="button"
                  onClick={() => onSelectDocument(doc)}
                >
                  <span className="document-icon" aria-hidden="true">
                    <span className="file-glyph" />
                  </span>
                  <span className="document-row-copy">
                    <span className="document-name">{doc.name}</span>
                    <span className="document-date-time">{formatDocumentDateTime(doc)}</span>
                    <span className={`document-meta meta-${doc.category.toLowerCase()}`}>{displayCategory(doc.category)}</span>
                  </span>
                  <span className="document-eye" aria-hidden="true">មើល</span>
                </button>
              ))}
            </div>
        </section>
        {!filteredDocuments.length ? <div className="empty-state compact">រកមិនឃើញឯកសារតាមការស្វែងរក ឬតម្រងនេះទេ។</div> : null}
      </div>
    </div>
  )
}

function DocumentPreviewPage({ meetingId, documentId }) {
  const meeting = getMeetingById(meetingId)

  if (!meeting) {
    return (
      <main className="page-content">
        <button className="btn btn-secondary back-button" type="button" onClick={() => goTo('/')}>ត្រឡប់ក្រោយ</button>
        <div className="empty-state">រកមិនឃើញកិច្ចប្រជុំ</div>
      </main>
    )
  }

  const documents = getMeetingDocuments(meeting)
  const groupedDocuments = groupDocuments(documents)
  const selectedDocument = documents.find((document) => document.id === documentId) || documents[0]

  return (
    <main className="page-content">
      <button className="btn btn-secondary back-button" type="button" onClick={() => goTo(`/meetings/${meeting.id}`)}>ត្រឡប់ទៅកិច្ចប្រជុំ</button>
      <div className="docs-page-header">
        <div>
          <h1 className="page-title">{getDisplayMeetingTitle(meeting)}</h1>
          <p className="page-subtitle">
            {formatDate(meeting.date)} / {formatTimeRange(meeting.startTime, meeting.endTime)} / {getDisplayVenue(meeting)}
          </p>
          <p className="docs-meeting-code">#{meeting.meetingCode || meeting.id}</p>
        </div>
        <span className="badge badge-neutral">
          ឯកសារ {documents.length}
        </span>
      </div>

      <div className="docs-page-grid">
        <section className="card">
          <div className="card-header">
            <span className="card-title">ឯកសារដែលបានបញ្ចូល</span>
          </div>
          <div className="card-body document-groups">
            {groupedDocuments.map((group) => (
              <section key={group.category} className="document-group">
                <div className="document-group-heading">
                  <span>{displayCategory(group.category)}</span>
                  <span className="badge badge-neutral">{group.documents.length}</span>
                </div>
                <div className="document-list">
                  {group.documents.map((doc) => {
                    const selected = selectedDocument?.id === doc.id
                    return (
                      <button
                        key={doc.id}
                        className={`document-row category-${doc.category.toLowerCase()} ${selected ? 'selected' : ''}`}
                        type="button"
                        onClick={() => goTo(`/docs/${meeting.id}/${doc.id}`)}
                      >
                        <span className="document-icon" aria-hidden="true">
                          <span className="file-glyph" />
                        </span>
                        <span className="document-row-copy">
                          <span className="document-name">{doc.name}</span>
                          <span className="document-date-time">{formatDocumentDateTime(doc)}</span>
                          <span className={`document-meta meta-${doc.category.toLowerCase()}`}>{displayCategory(doc.category)}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            ))}
            {!groupedDocuments.length ? <div className="empty-state compact">មិនមានឯកសារសម្រាប់កិច្ចប្រជុំនេះ។</div> : null}
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <span className="card-title document-card-title">
              <span className="file-glyph" aria-hidden="true" />
              {selectedDocument?.name || 'ឯកសារ'}
            </span>
          </div>
          <div className="card-body">
            {selectedDocument ? (
              <DocumentPreview meeting={meeting} document={selectedDocument} />
            ) : (
              <div className="empty-state compact">មិនមានឯកសារសម្រាប់កិច្ចប្រជុំនេះ។</div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

function AttendeesCard({ meeting, onShowParticipants }) {
  const participants = getMeetingParticipants(meeting)
  const visibleParticipants = participants.slice(0, 5)

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title participant-card-title">ប្លង់កៅអី</span>
        <div className="participant-header-actions">
          <span className="badge badge-neutral">{participants.length}</span>
          <button className="btn btn-sm btn-secondary" type="button" onClick={onShowParticipants}>មើល</button>
        </div>
      </div>
      <div className="card-body participant-list-compact">
        {visibleParticipants.map((participant) => (
          <div key={participant.id} className="attendee-item">
            <div className="avatar avatar-sm">{participant.avatar}</div>
            <span>{participant.name}</span>
          </div>
        ))}
        {participants.length > visibleParticipants.length ? (
          <button className="participant-more" type="button" onClick={onShowParticipants}>
            +{participants.length - visibleParticipants.length} នាក់ទៀត
          </button>
        ) : null}
      </div>
    </div>
  )
}

function getParticipantJoinCount(meetingId, userId, index) {
  const explicitCounts = {
    m1: { u1: 5, u2: 4, u3: 5, u4: 3, u6: 4 },
    m2: { u2: 3, u6: 2, u7: 3 },
    m3: { u1: 6, u3: 5, u4: 6, u5: 2 },
  }

  return explicitCounts[meetingId]?.[userId] || Math.max(1, 4 - (index % 3))
}

function getMeetingParticipants(meeting) {
  return meeting.attendeeIds.map((userId, index) => {
    const user = getUserById(userId)
    const khmer = getKhmerParticipant(user)
    return {
      id: userId,
      name: khmer.name || getUserName(user),
      avatar: khmer.avatar || user?.avatar || '--',
      position: khmer.position || user?.position || '-',
      department: khmer.department || user?.organization || '-',
      joinedCount: getParticipantJoinCount(meeting.id, userId, index),
      email: user?.email || '-',
    }
  })
}

function ParticipantsPage({ meetingId }) {
  const meeting = getMeetingById(meetingId)
  const [search, setSearch] = useState('')
  const [positionFilter, setPositionFilter] = useState('')

  if (!meeting) {
    return (
      <main className="page-content">
        <button className="btn btn-secondary back-button" type="button" onClick={() => goTo('/')}>ត្រឡប់ក្រោយ</button>
        <div className="empty-state">រកមិនឃើញកិច្ចប្រជុំ</div>
      </main>
    )
  }

  const participants = getMeetingParticipants(meeting)
  const positions = [...new Set(participants.map((participant) => participant.position))]
  const filteredParticipants = participants.filter((participant) => {
    const query = search.trim().toLowerCase()
    const matchesSearch = !query ||
      participant.name.toLowerCase().includes(query) ||
      participant.department.toLowerCase().includes(query) ||
      participant.email.toLowerCase().includes(query)
    const matchesPosition = !positionFilter || participant.position === positionFilter

    return matchesSearch && matchesPosition
  })

  return (
    <main className="page-content">
      <button className="btn btn-secondary back-button" type="button" onClick={() => goTo(`/meetings/${meeting.id}`)}>ត្រឡប់ទៅកិច្ចប្រជុំ</button>
      <div className="docs-page-header">
        <div>
          <h1 className="page-title">ប្លង់កៅអី</h1>
          <p className="page-subtitle">
            {getDisplayMeetingTitle(meeting)} / {formatDate(meeting.date)} / {getDisplayVenue(meeting)}
          </p>
          <p className="docs-meeting-code">#{meeting.meetingCode || meeting.id}</p>
        </div>
        <span className="badge badge-neutral">
          អ្នកចូលរួម {participants.length} នាក់
        </span>
      </div>

      <section className="card">
        <div className="card-header">
          <span className="card-title">អ្នកចូលរួមទាំងអស់</span>
          <span className="badge badge-neutral">
            {filteredParticipants.length}/{participants.length}
          </span>
        </div>
        <div className="participant-filters">
          <input
            type="text"
            className="search-input participant-search"
            placeholder="ស្វែងរកអ្នកចូលរួម..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select className="form-select participant-position-filter" value={positionFilter} onChange={(event) => setPositionFilter(event.target.value)}>
            <option value="">មុខ​ដំណែងទាំងអស់</option>
            {positions.map((position) => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
        </div>
        <div className="participant-table-wrap">
          <table className="data-table participant-table">
            <thead>
              <tr>
                <th>ឈ្មោះ</th>
                <th>មុខ​ដំណែង</th>
                <th>ឈ្មោះនាយកដ្ឋាន</th>
                <th>ចូលរួម</th>
              </tr>
            </thead>
            <tbody>
              {filteredParticipants.map((participant) => (
                <tr key={participant.id}>
                  <td>
                    <div className="participant-name-cell">
                      <div className="avatar avatar-sm">{participant.avatar}</div>
                      <div>
                        <div className="table-title">{participant.name}</div>
                        <div className="muted-small">{participant.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{participant.position}</td>
                  <td>{participant.department}</td>
                  <td>
                    <span className="badge badge-info">
                      {participant.joinedCount} ដង
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredParticipants.length ? <div className="empty-state compact">រកមិនឃើញអ្នកចូលរួមតាមការស្វែងរក ឬតម្រងនេះទេ។</div> : null}
        </div>
      </section>
    </main>
  )
}

function MeetingDetail({ meetingId }) {
  const meeting = getMeetingById(meetingId)
  const [activePanel, setActivePanel] = useState('agenda')
  const [selectedDocument, setSelectedDocument] = useState(null)

  useEffect(() => {
    setActivePanel('agenda')
    setSelectedDocument(null)
  }, [meetingId])

  if (!meeting) {
    return (
      <main className="page-content">
        <button className="btn btn-secondary back-button" type="button" onClick={() => goTo('/')}>ត្រឡប់ក្រោយ</button>
        <div className="empty-state">រកមិនឃើញកិច្ចប្រជុំ</div>
      </main>
    )
  }

  const coordinator = getUserById(meeting.coordinatorId)
  const isCompactHeader = activePanel !== 'agenda'

  return (
    <main className="page-content">
      <div className="meeting-detail">
        <div className={`detail-header card ${isCompactHeader ? 'compact-detail-header' : ''}`}>
          <div className="card-body">
            <div className="header-top">
              <div>
                <div className="page-eyebrow">ព័ត៌មានលម្អិតកិច្ចប្រជុំ</div>
                <h1 className="page-title detail-title">{getDisplayMeetingTitle(meeting)}</h1>
                <div className="header-meta">
                  <span className={`badge ${getStatusBadge(meeting.status)}`}>{displayMeetingStatus(meeting.status)}</span>
                  <span>{formatDate(meeting.date)}</span>
                  <span>{formatTimeRange(meeting.startTime, meeting.endTime)}</span>
                  <span>{getDisplayVenue(meeting)}</span>
                </div>
              </div>
            </div>
            {isCompactHeader ? (
              <div className="header-info compact-header-info">
                <div className="info-item"><span className="info-label">ប្រភេទកិច្ចប្រជុំ</span><span className="info-value">{meeting.meetingType}</span></div>
                <div className="info-item"><span className="info-label">ស្ថានភាព</span><span className="info-value">{displayMeetingStatus(meeting.status)}</span></div>
                <div className="info-item"><span className="info-label">លេខកូដកិច្ចប្រជុំ</span><span className="info-value code">{meeting.meetingCode}</span></div>
                <div className="info-item compact-link-item"><span className="info-label">តំណកិច្ចប្រជុំ</span><a href={meeting.meetingLink} target="_blank" rel="noreferrer" className="info-value link">{meeting.meetingLink}</a></div>
              </div>
            ) : (
              <div className="header-info grid-4">
                <div className="info-item"><span className="info-label">ប្រភេទកិច្ចប្រជុំ</span><span className="info-value">{meeting.meetingType}</span></div>
                <div className="info-item"><span className="info-label">ស្ថានភាព</span><span className="info-value">{displayMeetingStatus(meeting.status)}</span></div>
                <div className="info-item"><span className="info-label">របៀបប្រជុំ</span><span className="info-value">{meeting.meetingMode}</span></div>
                <div className="info-item"><span className="info-label">កម្រិត</span><span className="info-value">{meeting.level}</span></div>
                <div className="info-item"><span className="info-label">អ្នកចូលរួម</span><span className="info-value">{meeting.expectedAttendees}</span></div>
                <div className="info-item"><span className="info-label">ភ្ញៀវកិត្តិយស</span><span className="info-value">{meeting.vip}</span></div>
                <div className="info-item"><span className="info-label">អ្នកសម្របសម្រួល</span><span className="info-value">{getDisplayUserName(coordinator)}</span></div>
                <div className="info-item"><span className="info-label">តំណកិច្ចប្រជុំ</span><a href={meeting.meetingLink} target="_blank" rel="noreferrer" className="info-value link">{meeting.meetingLink}</a></div>
                <div className="info-item"><span className="info-label">លេខកូដកិច្ចប្រជុំ</span><span className="info-value code">{meeting.meetingCode}</span></div>
              </div>
            )}
          </div>
        </div>

        <AgendaTab
          meeting={meeting}
          activePanel={activePanel}
          selectedDocument={selectedDocument}
          onSelectDocument={(document) => {
            setSelectedDocument(document)
            setActivePanel('document')
          }}
          onShowAgenda={() => {
            setSelectedDocument(null)
            setActivePanel('agenda')
          }}
          onShowParticipants={() => {
            setSelectedDocument(null)
            setActivePanel('participants')
          }}
          onBackToAgenda={() => {
            setSelectedDocument(null)
            setActivePanel('agenda')
          }}
        />
      </div>
    </main>
  )
}

export default function App() {
  const route = useHashRoute()
  const [authorized, setAuthorized] = useState(false)
  const docsMatch = route.match(/^\/docs\/([^/]+)\/?([^/]*)/)
  const participantsMatch = route.match(/^\/participants\/([^/]+)/)
  const meetingMatch = route.match(/^\/meetings\/([^/]+)/)

  if (!authorized) {
    return <AccessCodePage onConfirm={() => setAuthorized(true)} />
  }

  if (docsMatch) {
    return <DocumentPreviewPage meetingId={docsMatch[1]} documentId={docsMatch[2]} />
  }

  if (participantsMatch) {
    return <ParticipantsPage meetingId={participantsMatch[1]} />
  }

  if (meetingMatch) {
    return <MeetingDetail meetingId={meetingMatch[1]} />
  }

  return <MeetingDetail meetingId="m1" />
}
