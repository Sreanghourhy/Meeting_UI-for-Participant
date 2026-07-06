import { useState } from 'react'
import { formatDate, getMeetingById, getUserById, getUserName } from '../utils/data.js'

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

export function getDisplayUserName(user) {
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

function getParticipantJoinCount(meetingId, userId, index) {
  const explicitCounts = {
    m1: { u1: 5, u2: 4, u3: 5, u4: 3, u6: 4 },
    m2: { u2: 3, u6: 2, u7: 3 },
    m3: { u1: 6, u3: 5, u4: 6, u5: 2 },
  }

  return explicitCounts[meetingId]?.[userId] || Math.max(1, 4 - (index % 3))
}

export function getMeetingParticipants(meeting) {
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

export function AttendeesCard({ meeting, onShowParticipants }) {
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

export function InlineParticipantsPreview({ meeting, onBack, headerTabs }) {
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

export function ParticipantsPage({ meetingId }) {
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
