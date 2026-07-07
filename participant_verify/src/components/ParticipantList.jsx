import { useState } from 'react'
import ParticipantCard from './ParticipantCard.jsx'
import ParticipantDetailModal from './ParticipantDetailModal.jsx'

export default function ParticipantList({
  participants,
  verifiedParticipantIds,
  onVerifyParticipant,
}) {
  const [selectedParticipant, setSelectedParticipant] = useState(null)

  return (
    <main className="participant-page">
      <header className="participant-header">
        <div>
          <p className="page-eyebrow">ប្រព័ន្ធចុះវត្តមានកិច្ចប្រជុំ</p>
          <h1>បញ្ជីអ្នកចូលរួម</h1>
          <p>ជ្រើសរើសរូបភាពរបស់អ្នក ដើម្បីមើលព័ត៌មានលម្អិត និងចុះវត្តមាន។</p>
        </div>
      </header>

      <section className="participant-grid" aria-label="បញ្ជីអ្នកចូលរួម">
        {participants.map((participant) => (
          <ParticipantCard
            key={participant.id}
            participant={participant}
            isVerified={verifiedParticipantIds.includes(participant.id)}
            onOpen={() => setSelectedParticipant(participant)}
          />
        ))}
      </section>

      <ParticipantDetailModal
        participant={selectedParticipant}
        isVerified={selectedParticipant ? verifiedParticipantIds.includes(selectedParticipant.id) : false}
        onClose={() => setSelectedParticipant(null)}
        onVerify={onVerifyParticipant}
      />
    </main>
  )
}
