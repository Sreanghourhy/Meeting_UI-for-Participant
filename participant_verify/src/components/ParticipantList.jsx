import { useState } from 'react'
import ParticipantCard from './ParticipantCard.jsx'

export default function ParticipantList({
  participants,
  verifiedParticipantIds,
  onVerifyParticipant,
}) {
  const [viewMode, setViewMode] = useState('card')
  const [message, setMessage] = useState(null)

  function attend(participant) {
    if (verifiedParticipantIds.includes(participant.id)) {
      setMessage({ type: 'success', text: `${participant.name} បានចុះវត្តមានរួចហើយ។` })
      return
    }

    if (onVerifyParticipant(participant.id)) {
      setMessage({ type: 'success', text: `${participant.name} បានចុះវត្តមានដោយជោគជ័យ។` })
      return
    }

    setMessage({ type: 'error', text: 'គណនីដែលបានចូល មិនត្រូវនឹងអ្នកចូលរួមដែលបានជ្រើសរើសទេ។' })
  }

  return (
    <main className="participant-page">
      <header className="participant-header">
        <div>
          <p className="page-eyebrow">ប្រព័ន្ធចុះវត្តមានកិច្ចប្រជុំ</p>
          <h1>បញ្ជីអ្នកចូលរួម</h1>
          <p>ជ្រើសរើសរូបភាពរបស់អ្នក ដើម្បីមើលព័ត៌មានលម្អិត និងចុះវត្តមាន។</p>
        </div>
      </header>

      <div className="participant-list-tools">
        <div className="participant-view-toggle" aria-label="ជ្រើសរើសទម្រង់បង្ហាញ">
          <button type="button" className={viewMode === 'table' ? 'active' : ''} onClick={() => setViewMode('table')}>☷ បញ្ជីតារាង</button>
          <button type="button" className={viewMode === 'card' ? 'active' : ''} onClick={() => setViewMode('card')}>▦ កាត</button>
        </div>
        <p className="attendance-help">ចុចលើឈ្មោះរបស់អ្នក ដើម្បីចុះវត្តមាន</p>
      </div>

      {message ? <div className={`attendance-feedback ${message.type}`} role="status">{message.text}</div> : null}

      {viewMode === 'card' ? (
        <section className="participant-grid" aria-label="បញ្ជីអ្នកចូលរួម">
          {participants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              isVerified={verifiedParticipantIds.includes(participant.id)}
              onAttend={() => attend(participant)}
            />
          ))}
        </section>
      ) : (
        <div className="participant-table-wrap">
          <table className="participant-table">
            <thead><tr><th>អ្នកចូលរួម</th><th>តួនាទី</th><th>អង្គភាព</th><th>ស្ថានភាព</th><th>សកម្មភាព</th></tr></thead>
            <tbody>
              {participants.map((participant) => {
                const isVerified = verifiedParticipantIds.includes(participant.id)
                return (
                  <tr key={participant.id}>
                    <td><span className="table-person"><img src={participant.photo} alt="" /><strong>{participant.name}</strong></span></td>
                    <td>{participant.position}</td>
                    <td>{participant.department}</td>
                    <td><span className={`attendance-status ${isVerified ? 'verified' : 'pending'}`}>{isVerified ? 'បានចុះវត្តមាន' : 'មិនទាន់ចុះវត្តមាន'}</span></td>
                    <td><button className="table-attend-button" type="button" onClick={() => attend(participant)} disabled={isVerified}>{isVerified ? 'បានចុះរួច' : 'ចុះវត្តមាន'}</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
