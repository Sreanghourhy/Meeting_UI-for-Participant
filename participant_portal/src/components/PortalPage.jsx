import { useMemo, useState } from 'react'
import { ArrowRight, Bell, Calendar, Search, Settings } from 'lucide-react'
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
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const filteredPortals = useMemo(() => {
    if (!normalizedQuery) return portals

    return portals.filter((portal) => {
      return [
        portal.label,
        portal.title,
        portal.description,
      ].some((value) => value.toLowerCase().includes(normalizedQuery))
    })
  }, [normalizedQuery])

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

      <label className="portal-search">
        <Search size={24} strokeWidth={2.2} aria-hidden="true" />
        <input
          type="search"
          placeholder="ស្វែងរកមុខងារ..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <div className="portal-sections">
        {portalSections.map((section) => {
          const sectionPortals = filteredPortals.filter((portal) => portal.section === section.id)
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

      {!filteredPortals.length ? (
        <div className="portal-empty card">រកមិនឃើញមុខងារដែលត្រូវនឹងការស្វែងរក។</div>
      ) : null}

      <section className="portal-section portal-info-section" aria-labelledby="information-title">
        <div className="portal-section-header">
          <span className="portal-section-icon" aria-hidden="true">
            <Bell size={22} strokeWidth={2.2} />
          </span>
          <h2 id="information-title">ព័ត៌មាន</h2>
        </div>
        <div className="portal-notice" aria-label="ព័ត៌មានប្រកាស">
          <div className="portal-notice-icon" aria-hidden="true">
            <Bell size={24} strokeWidth={2.2} />
          </div>
          <div className="portal-notice-copy">
            <h2>ព័ត៌មានប្រកាស</h2>
            <p>សូមពិនិត្យព័ត៌មានថ្មីៗ និងសេចក្តីជូនដំណឹងពីប្រព័ន្ធ</p>
          </div>
          <button className="portal-notice-action" type="button">
            មើលទាំងអស់ <ArrowRight size={19} strokeWidth={2.3} />
          </button>
        </div>
      </section>
    </main>
  )
}
