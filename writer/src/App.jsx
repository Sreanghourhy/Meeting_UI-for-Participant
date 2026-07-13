import { useMemo, useState, useEffect } from 'react'
import MeetingList from './components/MeetingList.jsx'
import ParticipantNoteModal from './components/ParticipantNoteModal.jsx'
import ParticipantList from './components/ParticipantList.jsx'
import TablePlan from './components/TablePlan.jsx'
import AssistantTab from './components/AssistantTab.jsx'
import { getMeetings, getStatusBadge } from './utils/data.js'
import { getMeetingParticipants, getStatusLabel, toKhmerNumeral } from './components/meetingDisplay.js'

function sortMeetings(meetings) {
  return meetings
    .slice()
    .sort((left, right) => `${right.date} ${right.startTime}`.localeCompare(`${left.date} ${left.startTime}`))
}

export default function App({ onMeetingSelectChange, onBackToServices, portalTitle }) {
  const meetings = useMemo(() => sortMeetings(getMeetings()), [])
  const [selectedMeetingId, setSelectedMeetingId] = useState(null)
  const [activeTab, setActiveTab] = useState('participants')
  const [participantNotes, setParticipantNotes] = useState({})
  const [noteTarget, setNoteTarget] = useState(null)
  const selectedMeeting = meetings.find((meeting) => meeting.id === selectedMeetingId)
  const participants = selectedMeeting ? getMeetingParticipants(selectedMeeting) : []
  const noteKey = noteTarget?.participant && selectedMeeting ? `${selectedMeeting.id}:${noteTarget.participant.id}` : ''

  const appendParticipantNote = (participantId, value) => {
    if (!selectedMeeting || !participantId || !value?.trim()) return

    const targetKey = `${selectedMeeting.id}:${participantId}`
    setParticipantNotes((current) => {
      const existing = current[targetKey]
      const existingItems = Array.isArray(existing) ? existing : existing?.trim() ? [existing] : []
      return { ...current, [targetKey]: [...existingItems, value] }
    })
  }

  useEffect(() => {
    if (onMeetingSelectChange) {
      onMeetingSelectChange(Boolean(selectedMeetingId))
    }
  }, [selectedMeetingId, onMeetingSelectChange])

  if (!meetings.length) {
    return (
      <main className="page-content">
        <div className="empty-state">មិនមានកិច្ចប្រជុំទេ។</div>
      </main>
    )
  }

  return (
    <main className="page-content writer-page">
      {!selectedMeeting ? (
        <MeetingList
          meetings={meetings}
          selectedMeetingId={selectedMeetingId}
          variant="grid"
          onBackToServices={onBackToServices}
          portalTitle={portalTitle}
          onSelectMeeting={(meetingId) => {
            setSelectedMeetingId(meetingId)
            setActiveTab('participants')
          }}
        />
      ) : (
        <div className="writer-detail-layout">
          <section className="writer-main writer-main-full">
            <article className="card writer-detail-card">
              {onBackToServices ? (
                <div className="writer-portal-toolbar">
                  <button className="btn btn-secondary" type="button" onClick={onBackToServices}>
                    ត្រឡប់ទៅផ្ទាំងសេវាកម្ម
                  </button>
                  <span>{portalTitle}</span>
                </div>
              ) : null}
              <div className="writer-detail-header">
                <div>
                  <span className={`badge ${getStatusBadge(selectedMeeting.status)}`}>{getStatusLabel(selectedMeeting.status)}</span>
                  <h2>{selectedMeeting.title}</h2>
                </div>
                <div className="writer-code-pill">#{selectedMeeting.meetingCode}</div>
              </div>

              <div className="writer-summary-grid compact-header-info">
                <div className="info-item">
                  <span className="info-label">ប្រភេទ</span>
                  <strong className="info-value">{selectedMeeting.meetingType || selectedMeeting.category || '-'}</strong>
                </div>
                <div className="info-item">
                  <span className="info-label">អ្នកចូលរួម</span>
                  <strong className="info-value attendee-count-text">{toKhmerNumeral(participants.length)} នាក់</strong>
                </div>
                <div className="info-item">
                  <span className="info-label">កម្រិត</span>
                  <strong className="info-value">{selectedMeeting.level || '-'}</strong>
                </div>
                <div className="info-item">
                  <span className="info-label">ទម្រង់</span>
                  <strong className="info-value">{selectedMeeting.meetingMode || '-'}</strong>
                </div>
              </div>
            </article>

            <div className="writer-tabs" role="tablist" aria-label="ព័ត៌មានកិច្ចប្រជុំ">
              <button
                className={`writer-tab ${activeTab === 'participants' ? 'active' : ''}`}
                type="button"
                role="tab"
                aria-selected={activeTab === 'participants'}
                onClick={() => setActiveTab('participants')}
              >
                បញ្ជីអ្នកចូលរួម
              </button>
              <button
                className={`writer-tab ${activeTab === 'table' ? 'active' : ''}`}
                type="button"
                role="tab"
                aria-selected={activeTab === 'table'}
                onClick={() => setActiveTab('table')}
              >
                ប្លង់តុ
              </button>
              <button
                className={`writer-tab ${activeTab === 'assistant' ? 'active' : ''}`}
                type="button"
                role="tab"
                aria-selected={activeTab === 'assistant'}
                onClick={() => setActiveTab('assistant')}
              >
                ជំនួយការ AI
              </button>
            </div>

            {activeTab === 'participants' ? (
              <ParticipantList
                meeting={selectedMeeting}
                notes={participantNotes}
                onOpenNote={(participant) => setNoteTarget({ participant, mode: 'text' })}
              />
            ) : activeTab === 'table' ? (
              <TablePlan
                meeting={selectedMeeting}
                notes={participantNotes}
                onOpenNote={(participant) => setNoteTarget({ participant, mode: 'list' })}
              />
            ) : (
              <AssistantTab
                meeting={selectedMeeting}
                participants={participants}
                onAddNote={appendParticipantNote}
              />
            )}
          </section>
        </div>
      )}
      <ParticipantNoteModal
        participant={noteTarget?.participant}
        mode={noteTarget?.mode}
        note={noteKey ? participantNotes[noteKey] || '' : ''}
        onChangeNote={(value) => {
          if (!noteKey) return
          setParticipantNotes((current) => ({ ...current, [noteKey]: value }))
        }}
        onAddNote={(value) => {
          if (!noteKey) return
          setParticipantNotes((current) => {
            const existing = current[noteKey]
            const existingItems = Array.isArray(existing) ? existing : existing?.trim() ? [existing] : []
            return { ...current, [noteKey]: [...existingItems, value] }
          })
        }}
        onClose={() => setNoteTarget(null)}
      />
    </main>
  )
}
