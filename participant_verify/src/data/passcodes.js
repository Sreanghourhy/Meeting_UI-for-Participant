export const accessPasses = [
  { code: 'OCM-2026', participantId: 1 },
  { code: 'MEET-607A', participantId: 2 },
  { code: 'VIP-708', participantId: 3 },
  { code: 'GUEST-001', participantId: 4 },
]

export const accessCodes = accessPasses.map((pass) => pass.code)

export function isValidAccessCode(code) {
  return accessCodes.includes(code.trim().toUpperCase())
}

export function getParticipantIdForCode(code) {
  return accessPasses.find((pass) => pass.code === code.trim().toUpperCase())?.participantId || null
}
