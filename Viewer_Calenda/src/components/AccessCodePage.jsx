import { useState } from 'react'

const demoOtpCode = '123456'

export default function AccessCodePage({ onConfirm, onSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  function sendOtp(event) {
    event.preventDefault()

    if (!phoneNumber.trim()) {
      setError('សូមបញ្ចូលលេខទូរស័ព្ទសិន។')
      return
    }

    setError('')
    setMessage(`លេខ OTP បានផ្ញើទៅ ${phoneNumber.trim()}។ សម្រាប់ demo សូមប្រើ ${demoOtpCode}`)
    setIsCodeSent(true)
  }

  function submit(event) {
    event.preventDefault()
    if (otp.trim() === demoOtpCode) {
      setError('')
      onConfirm()
      onSuccess()
      return
    }

    setError('លេខ OTP មិនត្រឹមត្រូវ។ សូមព្យាយាមម្តងទៀត។')
  }

  return (
    <main className="access-page">
      <section className="access-card card">
        <div className="page-eyebrow">ការចូលមើលប្រតិទិនកិច្ចប្រជុំ</div>
        <h1 className="access-title">ចូលតាមលេខទូរស័ព្ទ និង OTP</h1>
        <p className="access-copy">
          បញ្ចូលលេខទូរស័ព្ទ បញ្ជាក់ OTP ហើយទៅកាន់ទំព័រកាលវិភាគកិច្ចប្រជុំ។
        </p>
        <form onSubmit={submit} className="access-form">
          <div className="form-group">
            <label className="form-label" htmlFor="phone-number">លេខទូរស័ព្ទ</label>
            <input
              id="phone-number"
              className="form-input access-input"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="+855 12 345 678"
              autoFocus
            />
          </div>
          <button className="btn btn-secondary access-button" type="button" onClick={sendOtp}>
            ផ្ញើ OTP
          </button>
          {isCodeSent ? (
            <>
              <div className="form-group">
                <label className="form-label" htmlFor="otp-code">OTP</label>
                <input
                  id="otp-code"
                  className="form-input access-input"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  placeholder="123456"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="one-time-code"
                  autoFocus
                  required
                />
              </div>
              <button className="btn btn-primary access-button" type="submit">
                បញ្ជាក់ និងបន្ត
              </button>
            </>
          ) : null}
          {message ? <div className="access-message">{message}</div> : null}
          {error ? <div className="access-error">{error}</div> : null}
        </form>
      </section>
    </main>
  )
}
