import { useMemo, useState } from 'react'
import { getMeetingParticipants, toKhmerNumeral } from './meetingDisplay.js'

function hasNoteValue(note) {
  if (Array.isArray(note)) return note.some((item) => item.trim())
  return Boolean(note?.trim())
}

export default function ParticipantList({ meeting, notes = {}, onOpenNote }) {
  const [query, setQuery] = useState('')
  const [appliedQuery, setAppliedQuery] = useState('')
  const participants = useMemo(() => getMeetingParticipants(meeting), [meeting])
  const filteredParticipants = participants.filter((participant) => {
    const normalizedQuery = appliedQuery.trim().toLowerCase()
    return !normalizedQuery ||
      participant.name.toLowerCase().includes(normalizedQuery) ||
      participant.position.toLowerCase().includes(normalizedQuery) ||
      participant.department.toLowerCase().includes(normalizedQuery)
  })

  return (
    <section className="card writer-panel-card">
      <div className="card-header writer-panel-header">
        <span className="card-title">បញ្ជីអ្នកចូលរួម</span>
        <span className="badge badge-neutral">{toKhmerNumeral(filteredParticipants.length)} / {toKhmerNumeral(participants.length)}</span>
      </div>
      <div className="writer-filter-row">
        <label className="writer-search-field">
          <input
            className="search-input"
            type="search"
            placeholder="ស្វែងរកឈ្មោះ មុខតំណែង ឬនាយកដ្ឋាន..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') setAppliedQuery(query)
            }}
          />
        </label>
        <button className="btn btn-primary writer-search-button" type="button" onClick={() => setAppliedQuery(query)}>
          ស្វែងរក
        </button>
        <button
          className="btn btn-secondary writer-search-button"
          type="button"
          disabled={!query && !appliedQuery}
          onClick={() => {
            setQuery('')
            setAppliedQuery('')
          }}
        >
          សម្អាត
        </button>
      </div>
      <div className="participant-table-wrap writer-participant-table">
        <table className="data-table participant-table">
          <thead>
            <tr>
              <th>ឈ្មោះ</th>
              <th>មុខតំណែង</th>
              <th>នាយកដ្ឋាន</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {filteredParticipants.map((participant) => {
              const noteKey = `${meeting.id}:${participant.id}`
              const hasNote = hasNoteValue(notes[noteKey])
              return (
                <tr key={participant.id} className="writer-clickable-row" onClick={() => onOpenNote?.(participant)}>
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
                    <span className={`badge ${hasNote ? 'badge-success' : 'badge-neutral'}`}>
                      {hasNote ? 'មាន note' : 'None'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {!filteredParticipants.length ? <div className="empty-state compact">រកមិនឃើញអ្នកចូលរួម។</div> : null}
      </div>
    </section>
  )
}
