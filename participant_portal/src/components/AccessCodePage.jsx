import { useState } from 'react'
import { isValidPortalCode } from '../data/access.js'

export default function AccessCodePage({ onSuccess }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()

    if (isValidPortalCode(code)) {
      setError('')
      onSuccess(code.trim().toUpperCase())
      return
    }

    setError('លេខកូដមិនត្រឹមត្រូវ។ សូមព្យាយាមម្តងទៀត។')
  }

  return (
    <main className="access-page">
      <section className="access-card card">
        <div className="page-eyebrow">ការចូលប្រើសេវាអ្នកចូលរួម</div>
        <h1 className="access-title">បញ្ចូលលេខកូដប្រជុំ</h1>
        <p className="access-copy">
          សូមបញ្ចូលលេខកូដ ដើម្បីបើកផ្ទាំងសេវាកម្មសម្រាប់អ្នកចូលរួមកិច្ចប្រជុំ។
        </p>
        <form onSubmit={submit} className="access-form">
          <div className="form-group">
            <label className="form-label" htmlFor="meeting-code">លេខកូដប្រជុំ</label>
            <input
              id="meeting-code"
              className="form-input access-input"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="បញ្ចូលលេខកូដ"
              autoComplete="off"
              autoFocus
            />
          </div>
          {error ? <div className="access-error">{error}</div> : null}
          <button className="btn btn-primary access-button" type="submit">បញ្ជាក់</button>
        </form>
      </section>
    </main>
  )
}
