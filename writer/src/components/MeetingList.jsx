import { useMemo, useState } from 'react'
import { formatDate, formatTimeRange, getStatusBadge } from '../utils/data.js'
import { getDisplayVenue, getMeetingParticipants, getStatusLabel, toKhmerNumeral } from './meetingDisplay.js'

export default function MeetingList({ meetings, selectedMeetingId, onSelectMeeting, variant = 'sidebar' }) {
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [placeFilter, setPlaceFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const places = useMemo(() => {
    return [...new Set(meetings.map((meeting) => getDisplayVenue(meeting)))].sort((left, right) => left.localeCompare(right))
  }, [meetings])
  const filteredMeetings = meetings.filter((meeting) => {
    const participants = getMeetingParticipants(meeting)
    const place = getDisplayVenue(meeting)
    const query = appliedSearch.trim().toLowerCase()
    const matchesSearch = !query ||
      meeting.title.toLowerCase().includes(query) ||
      meeting.meetingCode?.toLowerCase().includes(query) ||
      place.toLowerCase().includes(query) ||
      participants.some((participant) => participant.name.toLowerCase().includes(query))
    const matchesPlace = !placeFilter || place === placeFilter
    const matchesDate = !dateFilter || meeting.date === dateFilter

    return matchesSearch && matchesPlace && matchesDate
  })
  const hasFilters = Boolean(search || appliedSearch || placeFilter || dateFilter)

  return (
    <section className={`writer-meeting-section writer-meeting-section-${variant}`}>
      <div className="writer-sidebar-header" style={{ alignItems: 'flex-end' }}>
        <div>
          <span className="writer-kicker" style={{ display: 'block', fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>WRITER WORKSPACE</span>
          <span style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>គ្រប់គ្រងកិច្ចប្រជុំ និងប្លង់តុ</span>
        </div>
        <strong>{toKhmerNumeral(filteredMeetings.length)}</strong>
      </div>

      <div className="writer-meeting-filters">
        <label className="writer-filter-field">
          <input
            className="search-input"
            type="search"
            placeholder="ស្វែងរកកិច្ចប្រជុំ លេខកូដ ឬអ្នកចូលរួម..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') setAppliedSearch(search)
            }}
          />
        </label>
        <label className="writer-filter-field">
          <span>ទីកន្លែង</span>
          <select className="form-select" value={placeFilter} onChange={(event) => setPlaceFilter(event.target.value)}>
            <option value="">ទីកន្លែងទាំងអស់</option>
            {places.map((place) => <option key={place} value={place}>{place}</option>)}
          </select>
        </label>
        <label className="writer-filter-field">
          <span>កាលបរិច្ឆេទ</span>
          <input className="form-input" type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />
        </label>
        <button className="btn btn-primary writer-filter-action" type="button" onClick={() => setAppliedSearch(search)}>
          ស្វែងរក
        </button>
        <button
          className="btn btn-secondary writer-filter-action"
          type="button"
          disabled={!hasFilters}
          onClick={() => {
            setSearch('')
            setAppliedSearch('')
            setPlaceFilter('')
            setDateFilter('')
          }}
        >
          សម្អាត
        </button>
      </div>

      <div className="writer-meeting-table-wrap">
        <table className="data-table writer-meeting-table">
          <thead>
            <tr>
              <th>ចំណងជើងកិច្ចប្រជុំ</th>
              <th>កាលបរិច្ឆេទ</th>
              <th>ម៉ោង</th>
              <th>ទីកន្លែង</th>
              <th>អ្នកចូលរួម</th>
              <th>ស្ថានភាព</th>
            </tr>
          </thead>
          <tbody>
            {filteredMeetings.map((meeting) => {
              const participants = getMeetingParticipants(meeting)
              return (
                <tr
                  key={meeting.id}
                  className={selectedMeetingId === meeting.id ? 'active' : ''}
                  tabIndex={0}
                  onClick={() => onSelectMeeting(meeting.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSelectMeeting(meeting.id)
                    }
                  }}
                >
                  <td>
                    <button className="writer-meeting-title-button" type="button" onClick={() => onSelectMeeting(meeting.id)}>
                      {meeting.title}
                    </button>
                    <div className="muted-small">#{meeting.meetingCode}</div>
                  </td>
                  <td>{formatDate(meeting.date)}</td>
                  <td>{formatTimeRange(meeting.startTime, meeting.endTime)}</td>
                  <td>{getDisplayVenue(meeting)}</td>
                  <td>{toKhmerNumeral(participants.length)} នាក់</td>
                  <td><span className={`badge ${getStatusBadge(meeting.status)}`}>{getStatusLabel(meeting.status)}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {!filteredMeetings.length ? <div className="empty-state compact">រកមិនឃើញកិច្ចប្រជុំតាម filter នេះទេ។</div> : null}
      </div>
    </section>
  )
}
