export const portalAccessCodes = [
  'Q2S-2026-001',
  'OCM-2026',
  'MEET-607A',
  'VIP-708',
  'GUEST-001',
]

export function isValidPortalCode(code) {
  return portalAccessCodes.includes(code.trim().toUpperCase())
}
