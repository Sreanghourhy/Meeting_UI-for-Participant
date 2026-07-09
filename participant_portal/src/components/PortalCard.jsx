export default function PortalCard({ portal, onOpen }) {
  return (
    <button className={`portal-card card ${portal.tone}`} type="button" onClick={() => onOpen(portal.id)}>
      <span className="portal-icon" aria-hidden="true">
        {portal.icon}
      </span>
      <span className="portal-content">
        <span className="portal-label">{portal.label}</span>
        <strong>{portal.title}</strong>
        <span>{portal.description}</span>
      </span>
      <span className="portal-action">បើក</span>
    </button>
  )
}
