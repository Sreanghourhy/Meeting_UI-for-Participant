import { useEffect, useState } from 'react'
import DocumentPreview from './DocumentPreview.jsx'
import { formatDraftDocumentDate } from './Documents.jsx'
import { getMeetingParticipants } from './Participants.jsx'

const draftStatusHistory = [
  { status: 'សម្របសម្រួល', versions: 2, dates: ['2026-06-24', '2026-06-25'] },
  { status: 'បច្ចេកទេស', versions: 3, dates: ['2026-06-26', '2026-06-27', '2026-06-28'] },
  { status: 'អន្តរក្រសួង', versions: 1, dates: ['2026-06-29'] },
  { status: 'ពេញអង្គគណៈរដ្ឋមន្ត្រី', versions: 1, dates: ['2026-06-30'] },
  { status: 'អនុម័ត', versions: 1, dates: ['2026-07-01'] },
]

function toKhmerNumeral(value) {
  const digits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩']
  return String(value).replace(/\d/g, (digit) => digits[Number(digit)])
}

function getDraftHistoryDocuments(currentDocument) {
  let draftVersion = 0

  const documents = draftStatusHistory.flatMap((stage, stageIndex) => (
    Array.from({ length: stage.versions }, (_, versionIndex) => {
      draftVersion += 1

      return {
        ...currentDocument,
        id: `${currentDocument.id}-draft-${stageIndex + 1}-${versionIndex + 1}`,
        name: currentDocument.name,
        uploadedAt: stage.dates[versionIndex],
        draftStatus: stage.status,
        draftVersion,
      }
    })
  ))

  return documents.reverse()
}

function getDraftStatusClass(status) {
  const statusIndex = draftStatusHistory.findIndex((stage) => stage.status === status)
  return statusIndex >= 0 ? `status-${statusIndex + 1}` : 'status-default'
}

function DraftStepDocuments({ currentDocument, onSelectDocument, onShowDocumentsSidebar }) {
  const [statusFilter, setStatusFilter] = useState('')
  const documents = getDraftHistoryDocuments(currentDocument)
  const statusCounts = draftStatusHistory.reduce((counts, stage) => ({
    ...counts,
    [stage.status]: documents.filter((document) => document.draftStatus === stage.status).length,
  }), {})
  const filteredDocuments = documents.filter((document) => {
    const matchesStatus = !statusFilter || document.draftStatus === statusFilter

    return matchesStatus
  })

  return (
    <div className="draft-document-workspace">
      <aside className="draft-document-list-panel">
        <div className="draft-status-filter" aria-label="តម្រងតាមស្ថានភាព">
          <button
            className={`draft-status-chip all ${statusFilter ? '' : 'active'}`}
            type="button"
            onClick={() => setStatusFilter('')}
          >
            <span>ទាំងអស់</span>
            <strong>{toKhmerNumeral(documents.length)}</strong>
          </button>
          {draftStatusHistory.map((stage) => (
            <button
              key={stage.status}
              className={`draft-status-chip ${getDraftStatusClass(stage.status)} ${statusFilter === stage.status ? 'active' : ''}`}
              type="button"
              onClick={() => setStatusFilter((currentStatus) => (currentStatus === stage.status ? '' : stage.status))}
            >
              <span>{stage.status}</span>
              <strong>{toKhmerNumeral(statusCounts[stage.status] || 0)}</strong>
            </button>
          ))}
        </div>
        <div className="draft-document-list-heading">
          <span>ឯកសារ</span>
          <span>កាលបរិច្ឆេទ</span>
          <span>ស្ថានភាព</span>
          <span>កំណែ</span>
        </div>
        <div className="document-list draft-document-list">
          {filteredDocuments.map((document) => (
            <button
              key={document.id}
              className="document-row draft-document-row"
              type="button"
              onClick={() => {
                onSelectDocument(document)
                onShowDocumentsSidebar?.()
              }}
            >
              <span className="document-row-copy">
                <span className="document-name">{document.name}</span>
              </span>
              <span className="document-date-time">{formatDraftDocumentDate(document)}</span>
              <span className={`draft-document-status ${getDraftStatusClass(document.draftStatus)}`}>{document.draftStatus}</span>
              <span className="draft-document-version">លើកទី{toKhmerNumeral(document.draftVersion)}</span>
            </button>
          ))}
        </div>
        {!filteredDocuments.length ? <div className="empty-state compact">រកមិនឃើញឯកសារតាមការស្វែងរក ឬតម្រងនេះទេ។</div> : null}
      </aside>
    </div>
  )
}

export default function InlineDocumentPreview({
  meeting,
  document,
  headerTabs,
  activePanel,
  showDraftProgress = false,
  showDocumentToolbar = false,
  onBack,
  onShowDocumentsSidebar,
  onHideDocumentsSidebar,
  onToggleDocumentPanel,
  documentSidebar,
  isDocumentSidebarCollapsed = false,
}) {
  const [draftPreviewDocument, setDraftPreviewDocument] = useState(null)

  useEffect(() => {
    setDraftPreviewDocument(null)
  }, [showDraftProgress, document.id])

  return (
    <section className="card inline-document-preview">
      <div className="card-header">
        {headerTabs || (
          <>
            <span className="card-title document-card-title">
              <span className="file-glyph" aria-hidden="true" />
              {document.name}
            </span>
            <div className="document-header-actions">
              <button className="btn btn-sm btn-secondary back-to-agenda-button" type="button" onClick={onBack}>ត្រឡប់ទៅរបៀបវារៈ</button>
            </div>
          </>
        )}
      </div>
      <div className="card-body">
        <div className={`inline-document-layout ${documentSidebar ? 'with-sidebar' : ''} ${isDocumentSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          {documentSidebar ? <aside className="inline-document-sidebar">{documentSidebar}</aside> : null}
          <div className="inline-document-content">
            {showDraftProgress ? (
              draftPreviewDocument ? (
                <div className="draft-drilldown">
                  <DocumentPreview
                    document={draftPreviewDocument}
                    participants={getMeetingParticipants(meeting)}
                    readOnlyComments
                    toolbarStart={(
                      <button
                        className="btn btn-sm btn-secondary back-to-document-list-button"
                        type="button"
                        onClick={() => {
                          setDraftPreviewDocument(null)
                          onHideDocumentsSidebar?.()
                        }}
                      >
                        ត្រឡប់ទៅឯកសារ
                      </button>
                    )}
                  />
                </div>
              ) : (
                <DraftStepDocuments
                  currentDocument={document}
                  onSelectDocument={setDraftPreviewDocument}
                  onShowDocumentsSidebar={onShowDocumentsSidebar}
                />
              )
            ) : (
              <DocumentPreview
                document={document}
                participants={getMeetingParticipants(meeting)}
                activePanel={activePanel}
                onTogglePanel={onToggleDocumentPanel}
                showToolbar={showDocumentToolbar}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
