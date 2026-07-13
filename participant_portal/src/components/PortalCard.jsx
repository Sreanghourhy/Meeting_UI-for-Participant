import { ArrowRight, BookOpen, Calendar, PenSquare, QrCode, ShieldCheck, UserCog } from 'lucide-react'

const portalIcons = {
  qrCode: QrCode,
  calendar: Calendar,
  shieldCheck: ShieldCheck,
  penSquare: PenSquare,
  userCog: UserCog,
  bookOpen: BookOpen,
}

export default function PortalCard({ portal, onOpen }) {
  const Icon = portalIcons[portal.icon] || QrCode

  return (
    <button className="portal-card card" type="button" onClick={() => onOpen(portal.id)}>
      <span className="portal-card-heading">
        <span className="portal-icon" aria-hidden="true">
          <Icon size={28} strokeWidth={2.2} />
        </span>
        <strong>{portal.title}</strong>
      </span>
      <span className="portal-content">
        <span>{portal.description}</span>
      </span>
      <span className="portal-action">
        បើក <ArrowRight size={19} strokeWidth={2.3} />
      </span>
    </button>
  )
}
