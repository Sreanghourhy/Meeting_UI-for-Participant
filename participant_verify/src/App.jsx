import { useState } from 'react'
import AccessCodePage from './components/AccessCodePage.jsx'
import ParticipantList from './components/ParticipantList.jsx'
import { participants } from './data/participants.js'
import { getParticipantIdForCode } from './data/passcodes.js'

export default function App({
  initialCode = '',
  checkedParticipantIds,
  onCheckedParticipantIdsChange,
}) {
  const [verifiedCode, setVerifiedCode] = useState(initialCode)
  const [localVerifiedParticipantIds, setLocalVerifiedParticipantIds] = useState([])
  const verifiedParticipantIds = checkedParticipantIds || localVerifiedParticipantIds

  function updateVerifiedParticipantIds(updater) {
    if (onCheckedParticipantIdsChange) {
      onCheckedParticipantIdsChange(updater)
      return
    }

    setLocalVerifiedParticipantIds(updater)
  }

  function verifyParticipant(participantId) {
    if (participantId !== getParticipantIdForCode(verifiedCode)) {
      return false
    }

    updateVerifiedParticipantIds((currentIds) => (
      currentIds.includes(participantId) ? currentIds : [...currentIds, participantId]
    ))
    return true
  }

  if (!verifiedCode) {
    return <AccessCodePage onSuccess={setVerifiedCode} />
  }

  return (
    <ParticipantList
      participants={participants}
      verifiedParticipantIds={verifiedParticipantIds}
      onVerifyParticipant={verifyParticipant}
    />
  )
}
