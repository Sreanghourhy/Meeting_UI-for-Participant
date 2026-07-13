import { useEffect, useState } from 'react'
import { formatDate, formatTimeRange, getMeetingById, getStatusBadge } from '../utils/data.js'
import { DocumentsCard, getMeetingDraftDocument } from './Documents.jsx'
import InlineDocumentPreview from './InlineDocumentPreview.jsx'
import { InlineParticipantsPreview } from './Participants.jsx'

function goTo(path) {
  window.location.hash = path
}

function getDisplayMeetingTitle(meeting) {
  const titles = {
    m1: 'ការពិនិត្យការផ្លាស់ប្តូរឌីជីថល ត្រីមាសទី៤ ឆ្នាំ២០២៦',
    m2: 'កិច្ចប្រជុំផែនការគម្រោងឌីជីថល',
    m3: 'កិច្ចប្រជុំគណៈកម្មការត្រួតពិនិត្យ',
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

function displayMeetingStatus(status) {
  const labels = {
    scheduled: 'បានកំណត់ពេល',
    completed: 'បានបញ្ចប់',
    pending: 'កំពុងរង់ចាំ',
    cancelled: 'បានលុបចោល',
  }
  return labels[status] || status
}

function MeetingHeaderInfo({ meeting, compact = false }) {
  return (
    <div className={`header-info ${compact ? 'compact-header-info' : 'grid-4'}`}>
      <div className="info-item"><span className="info-label">ប្រភេទកិច្ចប្រជុំ</span><span className="info-value">{meeting.meetingType}</span></div>
      <div className="info-item"><span className="info-label">អ្នកចូលរួម</span><span className="info-value attendee-count-text">{meeting.expectedAttendees}</span></div>
      <div className="info-item"><span className="info-label">លេខកូដកិច្ចប្រជុំ</span><span className="info-value code">{meeting.meetingCode}</span></div>
      <div className="info-item compact-link-item"><span className="info-label">តំណកិច្ចប្រជុំ</span><a href={meeting.meetingLink} target="_blank" rel="noreferrer" className="info-value link">{meeting.meetingLink}</a></div>
    </div>
  )
}

function AgendaTab({ meeting, activePanel, selectedDocument, onSelectDocument, onShowAgenda, onShowParticipants, onBackToAgenda }) {
  const [isDocumentsCollapsed, setIsDocumentsCollapsed] = useState(false)
  const [documentPanel, setDocumentPanel] = useState(null)
  const [showDraftProgress, setShowDraftProgress] = useState(false)
  const [isDraftHistoryPreviewOpen, setIsDraftHistoryPreviewOpen] = useState(false)
  const sessionAgenda = (session) => (meeting.agenda || []).filter((item) => item.session === session)
  const draftDocument = getMeetingDraftDocument(meeting)
  const isDraftDocument = selectedDocument?.id === draftDocument?.id
  const isDocumentsHidden = activePanel === 'agenda' ||
    activePanel === 'participants' ||
    (activePanel === 'document' && isDraftDocument && showDraftProgress && !isDraftHistoryPreviewOpen)
  const isDocumentPanel = activePanel === 'document' && selectedDocument
  const refreshDocumentLayout = () => {
    window.requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
    ;[80, 180, 320].forEach((delay) => {
      window.setTimeout(() => window.dispatchEvent(new Event('resize')), delay)
    })
  }
  const hideDocumentsSidebar = () => {
    setIsDocumentsCollapsed(true)
    refreshDocumentLayout()
  }
  const showDocumentsSidebar = () => {
    setIsDraftHistoryPreviewOpen(true)
    setIsDocumentsCollapsed(false)
    refreshDocumentLayout()
  }
  const hideDraftHistorySidebar = () => {
    setIsDraftHistoryPreviewOpen(false)
    refreshDocumentLayout()
  }

  useEffect(() => {
    setDocumentPanel(null)
    if (activePanel !== 'document') {
      setShowDraftProgress(false)
      setIsDraftHistoryPreviewOpen(false)
    }
  }, [activePanel, selectedDocument?.id])

  const panelTabs = (
    <div className="agenda-title-bar">
      <div className="agenda-title-tabs" role="tablist" aria-label="ព័ត៌មានកិច្ចប្រជុំ">
        <button
          className={`tab agenda-title-tab ${activePanel === 'agenda' ? 'active' : ''}`}
          type="button"
          role="tab"
          aria-selected={activePanel === 'agenda'}
          onClick={() => {
            setShowDraftProgress(false)
            setIsDraftHistoryPreviewOpen(false)
            onShowAgenda()
            hideDocumentsSidebar()
          }}
        >
          របៀបវារៈ
        </button>
        <button
          className={`tab agenda-title-tab ${activePanel === 'participants' ? 'active' : ''}`}
          type="button"
          role="tab"
          aria-selected={activePanel === 'participants'}
          onClick={() => {
            setShowDraftProgress(false)
            setIsDraftHistoryPreviewOpen(false)
            onShowParticipants()
            hideDocumentsSidebar()
          }}
        >
          ប្លង់កៅអី
        </button>
        {draftDocument ? (
          <>
            <button
              className={`tab agenda-title-tab ${activePanel === 'document' && isDraftDocument && !showDraftProgress ? 'active' : ''}`}
              type="button"
              role="tab"
              aria-selected={activePanel === 'document' && isDraftDocument && !showDraftProgress}
              onClick={() => {
                setShowDraftProgress(false)
                setIsDraftHistoryPreviewOpen(false)
                onSelectDocument(draftDocument)
                showDocumentsSidebar()
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
                setShowDraftProgress(true)
                setIsDraftHistoryPreviewOpen(false)
                onSelectDocument(draftDocument)
                hideDraftHistorySidebar()
              }}
            >
              កំណត់ត្រាសេចក្តីព្រាង
            </button>
          </>
        ) : null}
      </div>
    </div>
  )

  return (
    <div className={`agenda-layout ${isDocumentPanel ? 'documents-inline' : isDocumentsHidden ? 'documents-hidden' : isDocumentsCollapsed ? 'documents-collapsed' : ''}`}>
      {!isDocumentPanel ? (
        <aside className="agenda-sidebar">
          <DocumentsCard
            meeting={meeting}
            selectedDocument={selectedDocument}
            onSelectDocument={(document) => {
              setShowDraftProgress(false)
              setIsDraftHistoryPreviewOpen(false)
              onSelectDocument(document)
            }}
            isCollapsed={isDocumentsCollapsed}
            onToggleCollapse={() => {
              setIsDocumentsCollapsed((isCollapsed) => !isCollapsed)
              refreshDocumentLayout()
            }}
          />
        </aside>
      ) : null}
      <div className="agenda-main">
        {activePanel === 'document' && selectedDocument ? (
          <InlineDocumentPreview
            meeting={meeting}
            document={selectedDocument}
            headerTabs={panelTabs}
            activePanel={isDraftDocument ? documentPanel : null}
            showDraftProgress={isDraftDocument && showDraftProgress}
            showDocumentToolbar={isDraftDocument && !showDraftProgress}
            onBack={() => {
              setShowDraftProgress(false)
              setIsDraftHistoryPreviewOpen(false)
              onBackToAgenda()
              hideDocumentsSidebar()
            }}
            onShowDocumentsSidebar={showDocumentsSidebar}
            onHideDocumentsSidebar={hideDraftHistorySidebar}
            onCollapseDocumentsSidebar={hideDocumentsSidebar}
            onToggleDocumentPanel={(panel) => {
              const nextPanel = documentPanel === panel ? null : panel
              setDocumentPanel(nextPanel)
              if (nextPanel) setIsDocumentsCollapsed(true)
              refreshDocumentLayout()
            }}
            documentSidebar={!isDocumentsHidden ? (
              <DocumentsCard
                meeting={meeting}
                selectedDocument={selectedDocument}
                onSelectDocument={(document) => {
                  setShowDraftProgress(false)
                  setIsDraftHistoryPreviewOpen(false)
                  onSelectDocument(document)
                }}
                isCollapsed={isDocumentsCollapsed}
                onToggleCollapse={() => {
                  setIsDocumentsCollapsed((isCollapsed) => !isCollapsed)
                  refreshDocumentLayout()
                }}
              />
            ) : null}
            isDocumentSidebarCollapsed={isDocumentsCollapsed}
          />
        ) : null}
        {activePanel === 'participants' ? <InlineParticipantsPreview meeting={meeting} headerTabs={panelTabs} /> : null}
        {activePanel === 'agenda' && (
          <div className="card">
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
                          const displayItem = getDisplayAgendaItem(item)
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
                                <div className="agenda-title">{displayItem.title}</div>
                                <div className="agenda-desc">{displayItem.description}</div>
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
          </div>
        )}
      </div>
    </div>
  )
}

export default function MeetingDetail({ meetingId, detailTitle, onBackToServices }) {
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

  return (
    <main className="page-content">
      <div className="meeting-detail">
        <div className="detail-header card">
          <div className="card-body">
            {detailTitle || onBackToServices ? (
              <div className="detail-portal-toolbar">
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={onBackToServices || (() => goTo('/calendar'))}
                >
                  {onBackToServices ? 'ត្រឡប់ទៅផ្ទាំងសេវាកម្ម' : 'ត្រឡប់ទៅប្រតិទិន'}
                </button>
                <span>{detailTitle || 'មើលព័ត៌មានកិច្ចប្រជុំ'}</span>
              </div>
            ) : null}
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
            <MeetingHeaderInfo meeting={meeting} />
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
