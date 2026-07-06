import { useState } from 'react'

export default function AccessCodePage({ expectedCode, onConfirm, onSuccess }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    if (code.trim().toUpperCase() === expectedCode) {
      setError('')
      onConfirm()
      onSuccess()
      return
    }

    setError('លេខកូដមិនត្រឹមត្រូវ។ សូមព្យាយាមម្តងទៀត។')
  }

  return (
    <main className="access-page">
      <section className="access-card card">
        <div className="page-eyebrow">ការចូលមើលកិច្ចប្រជុំ</div>
        <h1 className="access-title">បញ្ចូលលេខកូដប្រជុំ</h1>
        <p className="access-copy">
          សូមបញ្ចូលលេខកូដប្រជុំដើម្បីបើកមើលរបៀបវារៈ ឯកសារ និងប្លង់កៅអី។
        </p>
        <form onSubmit={submit} className="access-form">
          <div className="form-group">
            <label className="form-label" htmlFor="meeting-code">លេខកូដប្រជុំ</label>
            <input
              id="meeting-code"
              className="form-input access-input"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder={expectedCode}
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
