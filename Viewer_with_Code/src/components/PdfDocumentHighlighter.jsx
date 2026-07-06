import { useEffect, useState } from 'react'
import { AreaHighlight, Highlight, PdfHighlighter, PdfLoader } from 'react-pdf-highlighter'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.mjs?url'

function readStoredHighlights(documentId) {
  try {
    return JSON.parse(window.localStorage.getItem(`document-highlights:${documentId}`) || '[]')
  } catch {
    return []
  }
}

function isAreaHighlight(highlight) {
  return Boolean(highlight.content?.image)
}

export function useDocumentHighlights(documentId) {
  const [highlightState, setHighlightState] = useState(() => ({
    documentId,
    highlights: readStoredHighlights(documentId),
  }))

  useEffect(() => {
    setHighlightState({
      documentId,
      highlights: readStoredHighlights(documentId),
    })
  }, [documentId])

  useEffect(() => {
    if (highlightState.documentId !== documentId) return

    window.localStorage.setItem(`document-highlights:${documentId}`, JSON.stringify(highlightState.highlights))
  }, [highlightState, documentId])

  function addHighlight(position, content, hideSelection) {
    const text = content.text?.trim()
    setHighlightState((current) => ({
      ...current,
      highlights: [
        {
          id: `highlight-${Date.now()}`,
          position,
          content,
          comment: {
            text: text || 'Highlighted section',
            emoji: '',
          },
        },
        ...current.highlights,
      ],
    }))
    hideSelection()
  }

  function updateAreaHighlight(highlightId, position, content) {
    setHighlightState((current) => ({
      ...current,
      highlights: current.highlights.map((highlight) => {
        if (highlight.id !== highlightId) return highlight

        return {
          ...highlight,
          position,
          content: content || highlight.content,
        }
      }),
    }))
  }

  function clearHighlights() {
    setHighlightState((current) => ({
      ...current,
      highlights: [],
    }))
  }

  return {
    highlights: highlightState.highlights,
    addHighlight,
    updateAreaHighlight,
    clearHighlights,
  }
}

export function PdfHighlightButton({ active, onToggle }) {
  return (
    <button
      className={`pdf-action-button highlighter-button ${active ? 'active' : ''}`}
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      title="Highlight pen"
    >
      <span className="pen-icon" aria-hidden="true" />
      Highlight
    </button>
  )
}

export function PdfDocumentHighlighter({
  documentUrl,
  highlights,
  isHighlightMode,
  onAddHighlight,
  onUpdateAreaHighlight,
  onClearHighlights,
  onToggleHighlightMode,
  showFloatingAction = false,
}) {
  return (
    <>
      {showFloatingAction ? (
        <div className="pdf-floating-actions">
          <PdfHighlightButton active={isHighlightMode} onToggle={onToggleHighlightMode} />
        </div>
      ) : null}
      <div className={`document-pdf-frame highlighter-frame ${isHighlightMode ? 'pen-active' : ''}`}>
        <PdfLoader
          key={documentUrl}
          url={documentUrl}
          workerSrc={pdfWorkerUrl}
          beforeLoad={<div className="pdf-loader-state">Loading PDF...</div>}
          errorMessage={<div className="pdf-loader-state error">Unable to load this PDF.</div>}
        >
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              pdfScaleValue="page-width"
              highlights={highlights}
              onScrollChange={() => {}}
              scrollRef={() => {}}
              enableAreaSelection={() => isHighlightMode}
              onSelectionFinished={(position, content, hideTipAndSelection) => {
                if (!isHighlightMode) return null

                onAddHighlight(position, content, hideTipAndSelection)
                return null
              }}
              highlightTransform={(highlight, index, setTip, hideTip, viewportToScaled, screenshot, isScrolledTo) => {
                if (isAreaHighlight(highlight)) {
                  return (
                    <AreaHighlight
                      key={highlight.id || index}
                      highlight={highlight}
                      isScrolledTo={isScrolledTo}
                      onChange={(boundingRect) => {
                        const nextPosition = {
                          boundingRect: viewportToScaled(boundingRect),
                          rects: [],
                          pageNumber: boundingRect.pageNumber || highlight.position.pageNumber,
                        }
                        onUpdateAreaHighlight(highlight.id, nextPosition, {
                          image: screenshot(boundingRect),
                        })
                      }}
                    />
                  )
                }

                return (
                  <Highlight
                    key={highlight.id || index}
                    position={highlight.position}
                    comment={highlight.comment}
                    isScrolledTo={isScrolledTo}
                  />
                )
              }}
            />
          )}
        </PdfLoader>
      </div>
      <div className="pdf-highlight-status">
        <span>{highlights.length} pen marks</span>
        {highlights.length ? (
          <button type="button" onClick={onClearHighlights}>Clear</button>
        ) : null}
      </div>
    </>
  )
}
