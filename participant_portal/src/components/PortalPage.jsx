import PortalCard from './PortalCard.jsx'
import { portals } from '../data/portals.js'

export default function PortalPage({ onOpenPortal }) {
  return (
    <main className="portal-page">
      <header className="portal-header">
        <div>
          <p className="page-eyebrow">Participant Portal</p>
          <h1>ផ្ទាំងសេវាកម្មអ្នកចូលរួម</h1>
          <p>ជ្រើសរើសសេវាកម្មដែលអ្នកត្រូវការ សម្រាប់មើលព័ត៌មាន ចុះវត្តមាន ឬរកទីតាំងបន្ទប់ប្រជុំ។</p>
        </div>
      </header>

      <section className="portal-grid" aria-label="សេវាកម្មអ្នកចូលរួម">
        {portals.map((portal) => (
          <PortalCard key={portal.id} portal={portal} onOpen={onOpenPortal} />
        ))}
      </section>
    </main>
  )
}
