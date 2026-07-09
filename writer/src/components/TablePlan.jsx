import { extraSeatingParticipants, getMeetingParticipants, meetingChair, toKhmerNumeral } from './meetingDisplay.js'

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

function hasNoteValue(note) {
  if (Array.isArray(note)) return note.some((item) => item.trim())
  return Boolean(note?.trim())
}

export default function TablePlan({ meeting, notes = {}, onOpenNote }) {
  const seatedParticipants = [...getMeetingParticipants(meeting), ...extraSeatingParticipants].slice(0, 10)
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
    const noteKey = participant ? `${meeting.id}:${participant.id}` : ''
    const hasNote = Boolean(noteKey && hasNoteValue(notes[noteKey]))
    return (
      <button
        key={`${side}-${number}`}
        className={`seat-card ${side} ${hasNote ? 'has-note' : ''}`}
        type="button"
        onClick={() => {
          if (participant) onOpenNote?.(participant)
        }}
      >
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
    <section className="card inline-participant-preview writer-panel-card">
      <div className="card-header writer-panel-header">
        <span className="card-title">ប្លង់តុ</span>
        <span className="badge badge-neutral">{toKhmerNumeral(seatedParticipants.length + 1)} នាក់</span>
      </div>
      <div className="seating-plan">
        <div className="seating-tip">ប្លង់តុសម្រាប់កិច្ចប្រជុំ - ជួរទី១ និងជួរទី២</div>
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
          <button className={`head-seat-card ${hasNoteValue(notes[`${meeting.id}:${meetingChair.id}`]) ? 'has-note' : ''}`} type="button" onClick={() => onOpenNote?.(meetingChair)}>
            <span className="head-seat-main">
              <SeatIcon occupied />
              <span className="head-label">ប្រធាន</span>
            </span>
            <span className="head-name">{meetingChair.name}</span>
            <span className="head-title">{meetingChair.position}</span>
          </button>
        </div>
      </div>
    </section>
  )
}
