import { useState } from 'react'
import { isValidAccessCode } from '../data/passcodes.js'

export default function AccessCodePage({ onSuccess }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()

    if (isValidAccessCode(code)) {
      setError('')
      onSuccess(code.trim().toUpperCase())
      return
    }

    setError('លេខកូដមិនត្រឹមត្រូវ។ សូមពិនិត្យ ហើយព្យាយាមម្តងទៀត។')
  }

  return (
    <main className="access-page">
      <section className="access-card card">
        <div className="access-mark">OCM</div>
        <p className="page-eyebrow">ប្រព័ន្ធចុះវត្តមាន</p>
        <h1>បញ្ចូលលេខកូដចុះវត្តមាន</h1>
        <p className="access-copy">
          សូមបញ្ចូលលេខកូដរបស់អ្នក ដើម្បីបើកបញ្ជីអ្នកចូលរួម និងចុះវត្តមានសម្រាប់កិច្ចប្រជុំ។
        </p>

        <form className="access-form" onSubmit={submit}>
          <label htmlFor="access-code">លេខកូដចុះវត្តមាន</label>
          <input
            id="access-code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="បញ្ចូលលេខកូដ"
            autoComplete="off"
            autoFocus
          />
          {error ? <div className="access-error">{error}</div> : null}
          <button type="submit">ចូលទៅចុះវត្តមាន</button>
        </form>
      </section>
    </main>
  )
}
