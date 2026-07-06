import { useEffect, useRef, useState } from 'react'
import {
  PdfDocumentHighlighter,
  PdfHighlightButton,
  useDocumentHighlights,
} from './PdfDocumentHighlighter.jsx'

function getParticipantReply(participant, message, index) {
  const normalized = message.toLowerCase()
  if (normalized.includes('សង្ខេប') || normalized.includes('summary')) {
    return index === 0
      ? 'ខ្ញុំអាចជួយសង្ខេបចំណុចសំខាន់ៗពីឯកសារនេះបាន។'
      : 'ខ្ញុំយល់ស្រប។ សេចក្តីសង្ខេបគួរតែដាក់តាមលំដាប់ប្រធានបទ។'
  }
  if (normalized.includes('សំណួរ') || normalized.includes('question') || message.includes('?')) {
    return index === 0
      ? 'សំណួរនេះល្អ។ ខ្ញុំគិតថាយើងគួរឆ្លើយវាក្នុងកិច្ចប្រជុំ។'
      : 'ខ្ញុំនឹងពិនិត្យផ្នែកពាក់ព័ន្ធហើយបន្ថែមមតិរបស់ខ្ញុំ។'
  }
  return [
    'ខ្ញុំបានទទួលចំណុចនេះហើយ។',
    'ខ្ញុំយល់ព្រម ហើយនឹងពិនិត្យផ្នែកនេះបន្ថែម។',
    'ចំណុចនេះគួរតែដាក់ក្នុងការពិភាក្សាបន្ទាប់។',
  ][index] || `${participant.name} បានទទួលចំណុចនេះ។`
}

function createStarterComments(participants) {
  return participants.slice(0, 3).map((participant, index) => ({
    id: `participant-seed-${participant.id}`,
    author: participant.name,
    avatar: participant.avatar,
    role: 'participant',
    text: [
      'ខ្ញុំបានមើលឯកសារនេះហើយ។ មានចំណុចណាដែលយើងគួរពិភាក្សាមុនគេ?',
      'ខ្ញុំស្នើឱ្យយើងចាប់ផ្តើមពីផ្នែកសកម្មភាពបន្ទាប់។',
      'ខ្ញុំនឹងកត់ចំណុចដែលត្រូវសម្រេចក្នុងកិច្ចប្រជុំ។',
    ][index],
  }))
}

function DocumentActionBar({ activePanel, isHighlightMode, toolbarStart, onTogglePanel, onToggleHighlightMode }) {
  return (
    <div className="pdf-viewer-top">
      <div className="pdf-toolbar-start">{toolbarStart}</div>
      <span />
      <div className="pdf-actions">
        <button
          className={`pdf-action-button ${activePanel === 'comments' ? 'active' : ''}`}
          type="button"
          onClick={() => onTogglePanel('comments')}
        >
          មតិយោបល់
        </button>
        <button
          className={`pdf-action-button ${activePanel === 'note' ? 'active' : ''}`}
          type="button"
          onClick={() => onTogglePanel('note')}
        >
          កំណត់ចំណាំ
        </button>
        <PdfHighlightButton
          active={isHighlightMode}
          onToggle={onToggleHighlightMode}
        />
      </div>
    </div>
  )
}

function CommentPanel({ comments, participants, commentText, readOnly, onTextChange, onSubmit }) {
  return (
    <section className="document-side-panel chat-panel">
      <div className="chat-topic-header">
        <div className="chat-topic-icon">#</div>
        <div className="chat-topic-copy">
          <div className="document-panel-eyebrow">Topic chat</div>
          <h3>{comments.documentName}</h3>
          <span>{participants.length} អ្នកចូលរួមក្នុងកិច្ចប្រជុំនេះ</span>
        </div>
      </div>
      <div className="comment-thread">
        {comments.items.map((comment) => (
          <div key={comment.id} className={`comment-bubble ${comment.role}`}>
            <div className="comment-author">
              <span className="comment-avatar">{comment.avatar || 'អ'}</span>
              {comment.author}
            </div>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>
      {readOnly ? (
        <div className="comment-history-note">មើលបានតែប្រវត្តិមតិយោបល់ប៉ុណ្ណោះ</div>
      ) : (
        <form className="comment-form" onSubmit={onSubmit}>
          <div className="chat-composer">
            <input
              className="form-input"
              value={commentText}
              onChange={(event) => onTextChange(event.target.value)}
              placeholder="Message this topic..."
            />
            <button className="chat-send-button" type="submit" aria-label="ផ្ញើ">➤</button>
          </div>
        </form>
      )}
    </section>
  )
}

function NotePanel({ documentName, noteText, onNoteChange }) {
  return (
    <section className="document-side-panel">
      <div className="document-panel-header">
        <div>
          <div className="document-panel-eyebrow">កំណត់ចំណាំ</div>
          <h3>{documentName}</h3>
        </div>
      </div>
      <textarea
        className="document-note-input"
        value={noteText}
        onChange={(event) => onNoteChange(event.target.value)}
        placeholder="សរសេរកំណត់ចំណាំសម្រាប់ឯកសារនេះ..."
      />
    </section>
  )
}

function EmptyDocumentPreview({ document }) {
  return (
    <>
      <div className="document-preview-summary">
        <div className="document-preview-title">
          <span className="document-preview-icon"><span className="file-glyph" /></span>
          <h2>{document.name}</h2>
        </div>
      </div>
      <div className="document-preview-canvas">
        <span className="document-preview-large-icon"><span className="file-glyph" /></span>
        <div className="document-preview-name">{document.name}</div>
      </div>
    </>
  )
}

export default function DocumentPreview({
  document,
  participants = [],
  activePanel: externalActivePanel,
  onTogglePanel,
  onPanelOpen,
  showToolbar = true,
  readOnlyComments = false,
  toolbarStart = null,
}) {
  const [localActivePanel, setLocalActivePanel] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])
  const [noteText, setNoteText] = useState('')
  const [isHighlightMode, setIsHighlightMode] = useState(false)
  const pdfFrameRef = useRef(null)
  const {
    highlights,
    addHighlight,
    updateAreaHighlight,
    clearHighlights,
  } = useDocumentHighlights(document.id)
  const activePanel = externalActivePanel !== undefined ? externalActivePanel : localActivePanel

  useEffect(() => {
    const savedComments = window.localStorage.getItem(`document-comments:${document.id}`)
    const savedNote = window.localStorage.getItem(`document-note:${document.id}`)
    setComments(savedComments ? JSON.parse(savedComments) : createStarterComments(participants))
    setNoteText(savedNote || '')
    setIsHighlightMode(false)
    setLocalActivePanel(null)
    setCommentText('')
  }, [document.id, document.name])

  useEffect(() => {
    if (comments.length) {
      window.localStorage.setItem(`document-comments:${document.id}`, JSON.stringify(comments))
    }
  }, [comments, document.id])

  useEffect(() => {
    window.localStorage.setItem(`document-note:${document.id}`, noteText)
  }, [noteText, document.id])

  useEffect(() => {
    window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'))
    })
  }, [activePanel])

  useEffect(() => {
    const frame = pdfFrameRef.current
    if (!frame || typeof ResizeObserver === 'undefined') return undefined

    let animationFrame = 0
    const observer = new ResizeObserver(() => {
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'))
      })
    })

    observer.observe(frame)
    return () => {
      window.cancelAnimationFrame(animationFrame)
      observer.disconnect()
    }
  }, [document.id])

  function handleTogglePanel(panel) {
    const nextPanel = activePanel === panel ? null : panel
    if (externalActivePanel !== undefined && onTogglePanel) {
      onTogglePanel(panel)
      return
    }

    setLocalActivePanel(nextPanel)
    if (nextPanel) onPanelOpen?.(nextPanel)
  }

  function handleCommentSubmit(event) {
    event.preventDefault()
    const trimmed = commentText.trim()
    if (!trimmed) return

    setComments((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        author: 'អ្នក',
        avatar: 'អ',
        role: 'user',
        text: trimmed,
      },
    ])
    setCommentText('')

    participants.slice(0, Math.min(3, participants.length)).forEach((participant, index) => {
      window.setTimeout(() => {
        setComments((current) => [
          ...current,
          {
            id: `reply-${participant.id}-${Date.now()}`,
            author: participant.name,
            avatar: participant.avatar,
            role: 'participant',
            text: getParticipantReply(participant, trimmed, index),
          },
        ])
      }, 500 + index * 650)
    })
  }

  if (!document.url) {
    return (
      <div className="document-preview">
        <EmptyDocumentPreview document={document} />
      </div>
    )
  }

  return (
    <div className="document-preview">
      <div className="pdf-workspace">
        {showToolbar ? (
          <DocumentActionBar
            activePanel={activePanel}
            isHighlightMode={isHighlightMode}
            toolbarStart={toolbarStart}
            onTogglePanel={handleTogglePanel}
            onToggleHighlightMode={() => setIsHighlightMode((enabled) => !enabled)}
          />
        ) : null}
        <div className={`pdf-content-grid ${activePanel ? 'with-panel' : ''}`}>
          <div className="pdf-frame-wrap" ref={pdfFrameRef}>
            <PdfDocumentHighlighter
              documentUrl={document.url}
              highlights={highlights}
              isHighlightMode={isHighlightMode}
              onAddHighlight={addHighlight}
              onUpdateAreaHighlight={updateAreaHighlight}
              onClearHighlights={clearHighlights}
              onToggleHighlightMode={() => setIsHighlightMode((enabled) => !enabled)}
            />
          </div>
          {activePanel === 'comments' ? (
            <CommentPanel
              comments={{ documentName: document.name, items: comments }}
              participants={participants}
              commentText={commentText}
              readOnly={readOnlyComments}
              onTextChange={setCommentText}
              onSubmit={handleCommentSubmit}
            />
          ) : null}
          {activePanel === 'note' ? (
            <NotePanel
              documentName={document.name}
              noteText={noteText}
              onNoteChange={setNoteText}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
