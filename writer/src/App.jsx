import { useMemo, useState, useEffect } from 'react'
import MeetingList from './components/MeetingList.jsx'
import ParticipantNoteModal from './components/ParticipantNoteModal.jsx'
import ParticipantList from './components/ParticipantList.jsx'
import TablePlan from './components/TablePlan.jsx'
import { formatDate, formatTimeRange, getMeetings, getStatusBadge } from './utils/data.js'
import { getDisplayVenue, getMeetingParticipants, getStatusLabel, toKhmerNumeral } from './components/meetingDisplay.js'

function sortMeetings(meetings) {
  return meetings
    .slice()
    .sort((left, right) => `${right.date} ${right.startTime}`.localeCompare(`${left.date} ${left.startTime}`))
}

export default function App({ onMeetingSelectChange }) {
  const meetings = useMemo(() => sortMeetings(getMeetings()), [])
  const [selectedMeetingId, setSelectedMeetingId] = useState(null)
  const [activeTab, setActiveTab] = useState('participants')
  const [participantNotes, setParticipantNotes] = useState({})
  const [noteTarget, setNoteTarget] = useState(null)
  const selectedMeeting = meetings.find((meeting) => meeting.id === selectedMeetingId)
  const participants = selectedMeeting ? getMeetingParticipants(selectedMeeting) : []
  const noteKey = noteTarget?.participant && selectedMeeting ? `${selectedMeeting.id}:${noteTarget.participant.id}` : ''

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
          onSelectMeeting={(meetingId) => {
            setSelectedMeetingId(meetingId)
            setActiveTab('participants')
          }}
        />
      ) : (
        <div className="writer-detail-layout">
          <section className="writer-main writer-main-full">
            <button className="btn btn-secondary writer-back-button" type="button" onClick={() => setSelectedMeetingId(null)}>
              ត្រឡប់ទៅ WRITER WORKSPACE
            </button>

            <article className="card writer-detail-card">
              <div className="writer-detail-header">
                <div>
                  <span className={`badge ${getStatusBadge(selectedMeeting.status)}`}>{getStatusLabel(selectedMeeting.status)}</span>
                  <h2>{selectedMeeting.title}</h2>
                  <p>{formatDate(selectedMeeting.date)} • {formatTimeRange(selectedMeeting.startTime, selectedMeeting.endTime)} • {getDisplayVenue(selectedMeeting)}</p>
                </div>
                <div className="writer-code-pill">#{selectedMeeting.meetingCode}</div>
              </div>

              <div className="writer-summary-grid">
                <div>
                  <span>ប្រភេទ</span>
                  <strong>{selectedMeeting.meetingType || selectedMeeting.category || '-'}</strong>
                </div>
                <div>
                  <span>អ្នកចូលរួម</span>
                  <strong>{toKhmerNumeral(participants.length)} នាក់</strong>
                </div>
                <div>
                  <span>កម្រិត</span>
                  <strong>{selectedMeeting.level || '-'}</strong>
                </div>
                <div>
                  <span>ទម្រង់</span>
                  <strong>{selectedMeeting.meetingMode || '-'}</strong>
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
            </div>

            {activeTab === 'participants' ? (
              <ParticipantList
                meeting={selectedMeeting}
                notes={participantNotes}
                onOpenNote={(participant) => setNoteTarget({ participant, mode: 'text' })}
              />
            ) : (
              <TablePlan
                meeting={selectedMeeting}
                notes={participantNotes}
                onOpenNote={(participant) => setNoteTarget({ participant, mode: 'list' })}
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
