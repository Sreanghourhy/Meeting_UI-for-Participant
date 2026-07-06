import { useState } from 'react'
import { formatDate, formatTimeRange, getMeetingById } from '../utils/data.js'
import DocumentPreview from './DocumentPreview.jsx'
import { getMeetingParticipants } from './Participants.jsx'

const documentCategoryOrder = ['Agenda', 'Reference', 'Law', 'Presentation', 'Supporting']

const meetingOneExtraDocuments = [
  {
    id: 'm1-reference-brief',
    name: 'ឯកសារយោងស្តីពីផែនការកែទម្រង់ឌីជីថល.pdf',
    size: 386000,
    category: 'Reference',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'Reviewed',
    uploadedAt: '2026-06-28',
  },
  {
    id: 'm1-reference-budget',
    name: 'របាយការណ៍សង្ខេបថវិកាគម្រោង.pdf',
    size: 244000,
    category: 'Reference',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'Approved',
    uploadedAt: '2026-06-29',
  },
  {
    id: 'm1-reference-risk',
    name: 'តារាងហានិភ័យនៃការអនុវត្តគម្រោង.pdf',
    size: 164000,
    category: 'Reference',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'Draft',
    uploadedAt: '2026-06-30',
  },
  {
    id: 'm1-support-minutes',
    name: 'កំណត់ហេតុកិច្ចប្រជុំលើកមុន.pdf',
    size: 212000,
    category: 'Supporting',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'Reviewed',
    uploadedAt: '2026-06-26',
  },
  {
    id: 'm1-support-action-log',
    name: 'បញ្ជីសកម្មភាពត្រូវអនុវត្ត.pdf',
    size: 128000,
    category: 'Supporting',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'Approved',
    uploadedAt: '2026-06-27',
  },
  {
    id: 'm1-support-research',
    name: 'សេចក្តីសង្ខេបការសិក្សាស្រាវជ្រាវ.pdf',
    size: 512000,
    category: 'Supporting',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'Reviewed',
    uploadedAt: '2026-06-28',
  },
  {
    id: 'm1-support-board',
    name: 'ឯកសារគាំទ្រសម្រាប់ការសម្រេចចិត្ត.pdf',
    size: 98000,
    category: 'Supporting',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'Pending',
    uploadedAt: '2026-06-30',
  },
]

const meetingDraftDocuments = {
  m2: {
    id: 'm2-draft',
    name: 'សេចក្តីព្រាងផែនការគម្រោងឌីជីថល.pdf',
    type: 'document',
    category: 'Presentation',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    size: 312000,
    pageCount: 2,
    status: 'Draft',
    uploadedAt: '2026-07-01',
  },
  m3: {
    id: 'm3-draft',
    name: 'សេចក្តីព្រាងរបាយការណ៍គណៈកម្មការត្រួតពិនិត្យ.pdf',
    type: 'document',
    category: 'Presentation',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    size: 428000,
    pageCount: 3,
    status: 'Draft',
    uploadedAt: '2026-07-02',
  },
}

function goTo(path) {
  window.location.hash = path
}

function getDisplayMeetingTitle(meeting) {
  const titles = {
    m1: 'ការពិនិត្យការផ្លាស់ប្តូរឌីជីថល ត្រីមាសទី៤ ឆ្នាំ២០២៦',
    m2: 'កិច្ចប្រជុំផែនការគម្រោងឌីជីថល',
    m3: 'កិច្ចប្រជុំគណៈកម្មការត្រួតពិនិត្យ',
  }
  return titles[meeting.id] || meeting.title
}

function getDisplayVenue(meeting) {
  const venues = {
    'Executive Boardroom': 'បន្ទប់ប្រជុំប្រតិបត្តិ',
    'Innovation Lab': 'មន្ទីរច្នៃប្រឌិត',
    'Conference Room C': 'បន្ទប់ប្រជុំ C',
    'Training Hall': 'សាលាបណ្តុះបណ្តាល',
    'Grand Conference Hall': 'សាលសន្និសីទធំ',
  }
  return venues[meeting.venue] || meeting.venue
}

function displayCategory(category) {
  const labels = {
    Agenda: 'របៀបវារៈ',
    Reference: 'ឯកសារយោង',
    Law: 'ឯកសារបទដ្ឋានគតិយុត្ដ',
    Presentation: 'បទបង្ហាញ',
    Supporting: 'ឯកសារគាំទ្រ',
  }
  return labels[category] || category
}

function formatDocumentDateTime(document) {
  const dateText = document.uploadedAt ? formatDate(document.uploadedAt) : 'មិនមានកាលបរិច្ឆេទ'
  return `${dateText} · ${document.uploadedTime || '09:00'}`
}

export function formatDraftDocumentDate(document) {
  return document.uploadedAt ? formatDate(document.uploadedAt) : 'មិនមានកាលបរិច្ឆេទ'
}

function getDocumentCategory(document) {
  if (document.category) return document.category

  const name = document.name.toLowerCase()
  if (name.includes('agenda')) return 'Agenda'
  if (name.includes('law') || name.includes('policy') || name.includes('regulation')) return 'Law'
  if (name.includes('presentation') || name.includes('deck') || document.type === 'video') return 'Presentation'
  if (name.includes('minute') || name.includes('support')) return 'Supporting'
  return 'Reference'
}

function normalizeDocument(document, meeting) {
  return {
    ...document,
    category: getDocumentCategory(document),
    meetingId: meeting.meetingCode || meeting.id,
    uploadedAt: document.uploadedAt || meeting.date,
    uploadedTime: document.uploadedTime || meeting.startTime || '09:00',
    status: document.status || 'Available',
  }
}

function isMeetingDocumentVisible(document) {
  return document.id !== 'd1' && document.url !== '/docs/Q2_Strategy_Deck.pdf'
}

export function getMeetingDraftDocument(meeting) {
  const documents = getMeetingDocuments(meeting)
  return documents.find((document) => document.category === 'Presentation') ||
    documents[0] ||
    (meetingDraftDocuments[meeting.id] ? normalizeDocument(meetingDraftDocuments[meeting.id], meeting) : null)
}

export function getMeetingDocuments(meeting) {
  const baseDocuments = (meeting.documents || []).map((document) => normalizeDocument(document, meeting))
  const extraDocuments = meeting.id === 'm1'
    ? meetingOneExtraDocuments.map((document) => normalizeDocument(document, meeting))
    : []
  const draftDocument = meetingDraftDocuments[meeting.id]
    ? [normalizeDocument(meetingDraftDocuments[meeting.id], meeting)]
    : []

  return [...baseDocuments, ...extraDocuments, ...draftDocument].filter(isMeetingDocumentVisible)
}

function groupDocuments(documents) {
  return documentCategoryOrder
    .map((category) => ({
      category,
      documents: documents.filter((document) => document.category === category),
    }))
    .filter((group) => group.documents.length > 0)
}

export function DocumentsCard({ meeting, selectedDocument, onSelectDocument, isCollapsed, onToggleCollapse }) {
  const [categoryFilter, setCategoryFilter] = useState('')
  const documents = getMeetingDocuments(meeting)
  const categories = documentCategoryOrder.filter((category) => documents.some((doc) => doc.category === category))
  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = !categoryFilter || doc.category === categoryFilter

    return matchesCategory
  })

  if (isCollapsed) {
    return (
      <div className="card document-sidebar-compact">
        <button
          className="document-sidebar-compact-header"
          type="button"
          onClick={onToggleCollapse}
          aria-label="បើកឯកសារបទដ្ឋានគតិយុត្ដ"
        >
          ឯកសារ
        </button>
        <div className="document-icon-list">
          {documents.map((doc) => (
            <button
              key={doc.id}
              className={`document-icon-only icon-${doc.category.toLowerCase()} ${selectedDocument?.id === doc.id ? 'selected' : ''}`}
              type="button"
              onClick={() => onSelectDocument(doc)}
              aria-label={doc.name}
              title={doc.name}
            >
              <span className="file-glyph" aria-hidden="true" />
              <span className="document-icon-tooltip" role="tooltip">{doc.name}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card sidebar-card">
      <div className="card-header">
        <span className="card-title document-card-title">
          <span className="file-glyph" aria-hidden="true" />
          ឯកសារបទដ្ឋានគតិយុត្ដ
        </span>
        <button
          className="sidebar-toggle-button"
          type="button"
          onClick={onToggleCollapse}
          aria-label="បិទឯកសារបទដ្ឋានគតិយុត្ដ"
        >
          <span className="sidebar-toggle-icon" aria-hidden="true" />
        </button>
      </div>
      <div className="participant-filters document-card-filters">
        <select className="form-select participant-position-filter" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
          <option value="">ប្រភេទទាំងអស់</option>
          {categories.map((category) => (
            <option key={category} value={category}>{displayCategory(category)}</option>
          ))}
        </select>
      </div>
      <div className="card-body document-groups document-card-scroll">
        <section className="document-group">
          <div className="document-list">
            {filteredDocuments.map((doc) => (
              <button
                key={doc.id}
                className={`document-row category-${doc.category.toLowerCase()} ${selectedDocument?.id === doc.id ? 'selected' : ''}`}
                type="button"
                onClick={() => onSelectDocument(doc)}
              >
                <span className="document-icon" aria-hidden="true">
                  <span className="file-glyph" />
                </span>
                <span className="document-row-copy">
                  <span className="document-name">{doc.name}</span>
                  <span className="document-date-time">{formatDocumentDateTime(doc)}</span>
                  <span className={`document-meta meta-${doc.category.toLowerCase()}`}>{displayCategory(doc.category)}</span>
                </span>
                <span className="document-eye" aria-hidden="true">មើល</span>
              </button>
            ))}
          </div>
        </section>
        {!filteredDocuments.length ? <div className="empty-state compact">រកមិនឃើញឯកសារតាមការស្វែងរក ឬតម្រងនេះទេ។</div> : null}
      </div>
    </div>
  )
}

export function DocumentPreviewPage({ meetingId, documentId }) {
  const meeting = getMeetingById(meetingId)

  if (!meeting) {
    return (
      <main className="page-content">
        <button className="btn btn-secondary back-button" type="button" onClick={() => goTo('/')}>ត្រឡប់ក្រោយ</button>
        <div className="empty-state">រកមិនឃើញកិច្ចប្រជុំ</div>
      </main>
    )
  }

  const documents = getMeetingDocuments(meeting)
  const groupedDocuments = groupDocuments(documents)
  const selectedDocument = documents.find((document) => document.id === documentId) || documents[0]

  return (
    <main className="page-content">
      <button className="btn btn-secondary back-button" type="button" onClick={() => goTo(`/meetings/${meeting.id}`)}>ត្រឡប់ទៅកិច្ចប្រជុំ</button>
      <div className="docs-page-header">
        <div>
          <h1 className="page-title">{getDisplayMeetingTitle(meeting)}</h1>
          <p className="page-subtitle">
            {formatDate(meeting.date)} / {formatTimeRange(meeting.startTime, meeting.endTime)} / {getDisplayVenue(meeting)}
          </p>
          <p className="docs-meeting-code">#{meeting.meetingCode || meeting.id}</p>
        </div>
        <span className="badge badge-neutral">
          ឯកសារ {documents.length}
        </span>
      </div>

      <div className="docs-page-grid">
        <section className="card">
          <div className="card-header">
            <span className="card-title">ឯកសារដែលបានបញ្ចូល</span>
          </div>
          <div className="card-body document-groups">
            {groupedDocuments.map((group) => (
              <section key={group.category} className="document-group">
                <div className="document-group-heading">
                  <span>{displayCategory(group.category)}</span>
                  <span className="badge badge-neutral">{group.documents.length}</span>
                </div>
                <div className="document-list">
                  {group.documents.map((doc) => {
                    const selected = selectedDocument?.id === doc.id
                    return (
                      <button
                        key={doc.id}
                        className={`document-row category-${doc.category.toLowerCase()} ${selected ? 'selected' : ''}`}
                        type="button"
                        onClick={() => goTo(`/docs/${meeting.id}/${doc.id}`)}
                      >
                        <span className="document-icon" aria-hidden="true">
                          <span className="file-glyph" />
                        </span>
                        <span className="document-row-copy">
                          <span className="document-name">{doc.name}</span>
                          <span className="document-date-time">{formatDocumentDateTime(doc)}</span>
                          <span className={`document-meta meta-${doc.category.toLowerCase()}`}>{displayCategory(doc.category)}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            ))}
            {!groupedDocuments.length ? <div className="empty-state compact">មិនមានឯកសារសម្រាប់កិច្ចប្រជុំនេះ។</div> : null}
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <span className="card-title document-card-title">
              <span className="file-glyph" aria-hidden="true" />
              {selectedDocument?.name || 'ឯកសារ'}
            </span>
          </div>
          <div className="card-body">
            {selectedDocument ? (
              <DocumentPreview document={selectedDocument} participants={getMeetingParticipants(meeting)} />
            ) : (
              <div className="empty-state compact">មិនមានឯកសារសម្រាប់កិច្ចប្រជុំនេះ។</div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
