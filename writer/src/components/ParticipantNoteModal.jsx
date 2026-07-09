import { useEffect, useState } from 'react'

function getNoteItems(note) {
  if (Array.isArray(note)) return note.filter((item) => item.trim())
  return note?.trim() ? [note] : []
}

export default function ParticipantNoteModal({ participant, note, mode = 'text', onChangeNote, onAddNote, onClose }) {
  const [draftNote, setDraftNote] = useState('')

  useEffect(() => {
    setDraftNote('')
  }, [participant?.id, mode])

  if (!participant) return null
  const noteItems = getNoteItems(note)
  const isListMode = mode === 'list'
  const saveDraft = () => {
    const nextNote = draftNote.trim()
    if (!isListMode || !nextNote) return
    onAddNote(nextNote)
    setDraftNote('')
  }
  const saveDraftAndClose = () => {
    saveDraft()
    onClose()
  }

  return (
    <div className="writer-note-overlay" role="presentation" onClick={saveDraftAndClose}>
      <section
        className="writer-note-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="writer-note-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="writer-note-header">
          <div className="participant-name-cell">
            <div className="avatar avatar-sm">{participant.avatar}</div>
            <div>
              <h2 id="writer-note-title">{participant.name}</h2>
              <p>{participant.position || '-'}</p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" type="button" onClick={saveDraftAndClose}>បិទ</button>
        </div>
        {isListMode ? (
          <>
            <div className="writer-note-list-block">
              <span>Note list</span>
              {noteItems.length ? (
                <ul className="writer-note-list">
                  {noteItems.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
                </ul>
              ) : (
                <div className="empty-state compact">None</div>
              )}
            </div>
            <label className="writer-note-field">
              <span>បន្ថែម note ថ្មី</span>
              <textarea
                className="form-input writer-note-textarea writer-note-textarea-small"
                value={draftNote}
                placeholder="សរសេរ note ថ្មី..."
                onChange={(event) => setDraftNote(event.target.value)}
              />
            </label>
          </>
        ) : (
          <label className="writer-note-field">
            <span>កំណត់ត្រាសម្រាប់អ្នកចូលរួមនេះ</span>
            <textarea
              className="form-input writer-note-textarea"
              value={Array.isArray(note) ? note.join('\n') : note}
              placeholder="សរសេរកំណត់ត្រា សុន្ទរកថា ឬចំណាំសំខាន់ៗ..."
              onChange={(event) => onChangeNote(event.target.value)}
            />
          </label>
        )}
      </section>
    </div>
  )
}
