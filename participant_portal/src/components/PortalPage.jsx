import { Calendar, Settings } from 'lucide-react'
import PortalCard from './PortalCard.jsx'
import { portalSections, portals } from '../data/portals.js'

const sectionIcons = {
  calendar: Calendar,
  settings: Settings,
}

function OcmBuildingIllustration() {
  return (
    <img
      className="portal-hero-building"
      src="/assets/ocm-building-hero.png"
      alt=""
      aria-hidden="true"
    />
  )
}

export default function PortalPage({ onOpenPortal }) {
  return (
    <main className="portal-page">
      <header className="portal-header">
        <div className="portal-hero-copy">
          <div className="portal-hero-label">
            <img className="portal-hero-logo" src="/assets/ocm-logo.svg" alt="" aria-hidden="true" />
            <div>
              <p className="page-eyebrow">ទីស្ដីការគណៈរដ្ឋមន្ត្រី</p>
              <p className="portal-hero-subtitle">Office of the Council of Ministers</p>
            </div>
          </div>
          <h1>ប្រព័ន្ធគ្រប់គ្រងកិច្ចប្រជុំ</h1>
          <div className="portal-hero-divider" aria-hidden="true">
            <span />
            <strong>✦</strong>
            <span />
          </div>
        </div>
        <div className="portal-hero-art">
          <OcmBuildingIllustration />
        </div>
      </header>

      <div className="portal-sections">
        {portalSections.map((section) => {
          const sectionPortals = portals.filter((portal) => portal.section === section.id)
          if (!sectionPortals.length) return null
          const Icon = sectionIcons[section.icon] || Calendar

          return (
            <section className="portal-section" key={section.id} aria-labelledby={`${section.id}-title`}>
              <div className="portal-section-header">
                <span className="portal-section-icon" aria-hidden="true">
                  <Icon size={22} strokeWidth={2.2} />
                </span>
                <h2 id={`${section.id}-title`}>{section.title}</h2>
              </div>
              <div className="portal-grid">
                {sectionPortals.map((portal) => (
                  <PortalCard key={portal.id} portal={portal} onOpen={onOpenPortal} />
                ))}
              </div>
            </section>
          )
        })}
      </div>

    </main>
  )
}
