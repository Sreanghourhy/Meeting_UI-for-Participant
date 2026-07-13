import { useState } from 'react'
import { formatDate, formatTimeRange, getMeetings, getUserById, getUserName } from '../utils/data.js'

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

const khmerWeekdayShortNames = ['អាទិត្យ', 'ចន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍']

function goTo(path) {
  window.location.hash = path
}

function toKhmerNumeral(value) {
  const digits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']
  return String(value).replace(/\d/g, (digit) => digits[Number(digit)])
}

function toISODate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getCalendarMonthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function getMonthLabel(date) {
  return `${khmerMonthNames[date.getMonth()]} ${toKhmerNumeral(date.getFullYear())}`
}

function getCalendarMeetings() {
  return getMeetings()
    .slice()
    .sort((left, right) => `${left.date} ${left.startTime}`.localeCompare(`${right.date} ${right.startTime}`))
}

function getDisplayMeetingTitle(meeting) {
  const titles = {
    m1: 'ការពិនិត្យការផ្លាស់ប្តូរឌីជីថល ត្រីមាសទី៤ ឆ្នាំ២០២៦',
    m2: 'កិច្ចប្រជុំផែនការគម្រោងឌីជីថល',
    m3: 'កិច្ចប្រជុំគណៈកម្មការត្រួតពិនិត្យ',
  }
  return titles[meeting.id] || meeting.title
}

function getCalendarPreviewTitle(meeting) {
  const titles = {
    m1: 'Q4 Digital Transformation Review',
    m2: 'Product Sprint Planning',
    m3: 'Board Committee Review',
  }
  return titles[meeting.id] || meeting.title
}

function CalendarPanelList({ title, meetings, selectedMeetingId, onSelectMeeting }) {
  return (
    <div className={title ? 'calendar-panel-section' : 'calendar-panel-inline'}>
      {title ? (
        <div className="calendar-panel-section-header">
          <h2>{title}</h2>
          <span>{meetings.length}</span>
        </div>
      ) : null}
      <div className="calendar-panel-list">
        {meetings.length ? meetings.map((item) => (
          <button
            key={item.id}
            className={`calendar-panel-list-item ${selectedMeetingId === item.id ? 'active' : ''}`}
            type="button"
            onClick={() => onSelectMeeting(item.id)}
          >
            <span>{formatDate(item.date)}</span>
            <strong>{getCalendarPreviewTitle(item)}</strong>
            <em>{formatTimeRange(item.startTime, item.endTime)}</em>
          </button>
        )) : <div className="empty-state compact">មិនមានកិច្ចប្រជុំក្នុងបញ្ជីនេះទេ។</div>}
      </div>
    </div>
  )
}

function CalendarMeetingPreview({ meeting, meetings, onSelectMeeting }) {
  const todayIso = toISODate(new Date())
  const [activeTimeline, setActiveTimeline] = useState('upcoming')
  const upcomingMeetings = meetings.filter((item) => item.date >= todayIso)
  const previousMeetings = meetings.filter((item) => item.date < todayIso).slice().reverse()
  const visibleMeetings = activeTimeline === 'upcoming' ? upcomingMeetings : previousMeetings
  const attendees = meeting ? meeting.attendeeIds.map((userId) => getUserById(userId)).filter(Boolean) : []

  return (
    <aside className="calendar-side-panel">
      {meeting ? (
        <article className="calendar-preview-card">
          <div className="calendar-preview-heading">
            <h2>{getDisplayMeetingTitle(meeting)}</h2>
          </div>

          <div className="calendar-preview-meta">
            <span>{formatDate(meeting.date)}</span>
            <span>{formatTimeRange(meeting.startTime, meeting.endTime)}</span>
            <span>{meeting.venue}</span>
          </div>

          <div className="calendar-preview-attendees">
            <span className="calendar-preview-label">អ្នកចូលរួម</span>
            <div className="calendar-attendee-list">
              {attendees.slice(0, 3).map((attendee) => (
                <div key={attendee.id} className="calendar-attendee-row">
                  <span className="calendar-attendee-avatar">{attendee.avatar}</span>
                  <span>{getUserName(attendee)}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-primary calendar-view-detail" type="button" onClick={() => goTo(`/meetings/${meeting.id}`)}>
            មើលព័ត៌មានលម្អិត
          </button>
        </article>
      ) : (
        <div className="calendar-preview-card empty-state compact">ជ្រើសរើសកាលបរិច្ឆេទកិច្ចប្រជុំ ដើម្បីមើលព័ត៌មានលម្អិត។</div>
      )}

      <section className="calendar-panel-section">
        <div className="calendar-timeline-tabs" role="tablist" aria-label="Meeting timeline">
          <button
            className={`calendar-timeline-tab ${activeTimeline === 'upcoming' ? 'active' : ''}`}
            type="button"
            role="tab"
            aria-selected={activeTimeline === 'upcoming'}
            onClick={() => setActiveTimeline('upcoming')}
          >
            ខាងមុខ
          </button>
          <button
            className={`calendar-timeline-tab ${activeTimeline === 'previous' ? 'active' : ''}`}
            type="button"
            role="tab"
            aria-selected={activeTimeline === 'previous'}
            onClick={() => setActiveTimeline('previous')}
          >
            កន្លងទៅ
          </button>
        </div>
        <CalendarPanelList
          meetings={visibleMeetings}
          selectedMeetingId={meeting?.id}
          onSelectMeeting={onSelectMeeting}
        />
      </section>
    </aside>
  )
}

export default function CalendarPage() {
  const meetings = getCalendarMeetings()
  const today = new Date()
  const [viewMode, setViewMode] = useState('month')
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedMeetingId, setSelectedMeetingId] = useState(() => meetings.find((meeting) => meeting.date === toISODate(today))?.id || meetings[0]?.id)
  const selectedMeeting = meetings.find((meeting) => meeting.id === selectedMeetingId) || meetings[0]

  const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1)
  const gridStart = new Date(monthStart)
  gridStart.setDate(monthStart.getDate() - monthStart.getDay())
  const monthDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)
    return date
  })

  const meetingsByDate = meetings.reduce((groups, meeting) => {
    if (!groups[meeting.date]) groups[meeting.date] = []
    groups[meeting.date].push(meeting)
    return groups
  }, {})

  const meetingsByMonth = meetings.reduce((groups, meeting) => {
    const key = meeting.date.slice(0, 7)
    if (!groups[key]) groups[key] = []
    groups[key].push(meeting)
    return groups
  }, {})

  const yearMonths = Array.from({ length: 12 }, (_, index) => new Date(today.getFullYear(), index, 1))

  return (
    <main className="page-content calendar-page-content">
      {viewMode === 'month' ? (
        <div className="calendar-month-layout">
          <section className="card calendar-shell">
            <div className="card-header calendar-toolbar">
              <div className="calendar-toolbar-title-block">
                <h1>{getMonthLabel(visibleMonth)}</h1>
                <span>{toKhmerNumeral(meetings.length)} កិច្ចប្រជុំ</span>
              </div>
              <div className="calendar-toolbar-center">
                <div className="calendar-mode-switch">
                  <button type="button" className={`btn btn-sm ${viewMode === 'month' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('month')}>ខែ</button>
                  <button type="button" className={`btn btn-sm ${viewMode === 'year' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('year')}>ឆ្នាំ</button>
                </div>
              </div>
              <div className="calendar-toolbar-side calendar-toolbar-side-right">
                <button className="btn btn-secondary btn-sm" type="button" onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button>
                <button
                  className="btn btn-secondary btn-sm calendar-today-button"
                  type="button"
                  onClick={() => {
                    setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1))
                    const todayMeeting = meetings.find((item) => item.date === toISODate(today))
                    if (todayMeeting) setSelectedMeetingId(todayMeeting.id)
                  }}
                >
                  ថ្ងៃនេះ
                </button>
                <button className="btn btn-secondary btn-sm" type="button" onClick={() => setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button>
              </div>
            </div>
            <div className="calendar-weekdays">
              {khmerWeekdayShortNames.map((day) => <span key={day}>{day}</span>)}
            </div>
            <div className="calendar-grid">
              {monthDays.map((date) => {
                const isoDate = toISODate(date)
                const dayMeetings = meetingsByDate[isoDate] || []
                const isCurrentMonth = date.getMonth() === visibleMonth.getMonth()
                const isToday = isoDate === toISODate(today)
                const isSelected = dayMeetings.some((meeting) => meeting.id === selectedMeeting?.id)

                return (
                  <div
                    key={isoDate}
                    className={`calendar-day ${isCurrentMonth ? '' : 'muted'} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayMeetings.length ? 'has-meetings' : ''}`}
                    role={dayMeetings.length ? 'button' : undefined}
                    tabIndex={dayMeetings.length ? 0 : undefined}
                    onClick={() => {
                      if (dayMeetings[0]) setSelectedMeetingId(dayMeetings[0].id)
                    }}
                    onKeyDown={(event) => {
                      if ((event.key === 'Enter' || event.key === ' ') && dayMeetings[0]) {
                        event.preventDefault()
                        setSelectedMeetingId(dayMeetings[0].id)
                      }
                    }}
                  >
                    <div className="calendar-day-top">
                      <span className="calendar-date-number">{toKhmerNumeral(date.getDate())}</span>
                    </div>
                    {dayMeetings.length ? (
                      <div className="calendar-event-dots" aria-hidden="true">
                        {dayMeetings.slice(0, 3).map((meeting) => <span key={meeting.id} />)}
                      </div>
                    ) : null}
                    <div className="calendar-meeting-stack">
                      {dayMeetings.slice(0, 1).map((meeting) => (
                        <button
                          key={meeting.id}
                          className={`calendar-meeting-card ${selectedMeeting?.id === meeting.id ? 'active' : ''}`}
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            setSelectedMeetingId(meeting.id)
                          }}
                        >
                          <strong>{getCalendarPreviewTitle(meeting)}</strong>
                          <span>{formatTimeRange(meeting.startTime, meeting.endTime)}</span>
                        </button>
                      ))}
                      {dayMeetings.length > 1 ? <span className="calendar-more-count">+{dayMeetings.length - 1}</span> : null}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
          <CalendarMeetingPreview meeting={selectedMeeting} meetings={meetings} onSelectMeeting={setSelectedMeetingId} />
        </div>
      ) : (
        <section className="card calendar-shell">
          <div className="card-header calendar-toolbar calendar-year-toolbar">
            <div className="calendar-toolbar-center">
              <h1>{toKhmerNumeral(today.getFullYear())}</h1>
              <span>{toKhmerNumeral(meetings.length)} កិច្ចប្រជុំ</span>
            </div>
            <div className="calendar-mode-switch">
              <button type="button" className={`btn btn-sm ${viewMode === 'month' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('month')}>ខែ</button>
              <button type="button" className={`btn btn-sm ${viewMode === 'year' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewMode('year')}>ឆ្នាំ</button>
            </div>
          </div>
          <div className="card-body">
            <div className="calendar-year-view">
              {yearMonths.map((monthDate) => {
                const key = getCalendarMonthKey(monthDate)
                const monthMeetings = meetingsByMonth[key] || []

                return (
                  <article key={key} className="card calendar-month-card">
                    <div className="card-header calendar-month-card-header">
                      <span className="card-title">{getMonthLabel(monthDate)}</span>
                      <span className="badge badge-neutral">{toKhmerNumeral(monthMeetings.length)} កិច្ចប្រជុំ</span>
                    </div>
                    <div className="card-body calendar-month-card-body">
                      {monthMeetings.length ? monthMeetings.map((meeting) => (
                        <button key={meeting.id} className="calendar-month-meeting" type="button" onClick={() => goTo(`/meetings/${meeting.id}`)}>
                          <div>
                            <strong>{getDisplayMeetingTitle(meeting)}</strong>
                            <span>{formatDate(meeting.date)}</span>
                          </div>
                          <span>{formatTimeRange(meeting.startTime, meeting.endTime)}</span>
                        </button>
                      )) : <div className="empty-state compact">មិនមានកិច្ចប្រជុំក្នុងខែនេះទេ។</div>}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
