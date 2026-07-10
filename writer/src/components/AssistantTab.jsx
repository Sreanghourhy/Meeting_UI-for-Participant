import { useEffect, useState } from 'react'

const MAX_INLINE_AUDIO_BYTES = 14 * 1024 * 1024
const GEMINI_MODEL = 'gemini-2.5-pro'

const logTranscription = (step, details = {}) => {
  console.log(`[Writer Gemini Transcription] ${step}`, details)
}

const maskApiKey = (key) => {
  if (!key) return 'missing'
  if (key.length <= 12) return 'too-short'
  return `${key.slice(0, 6)}...${key.slice(-4)}`
}

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = String(reader.result || '')
      resolve(result.includes(',') ? result.split(',')[1] : result)
    }

    reader.onerror = () => reject(new Error('មិនអាចអានឯកសារសំឡេងបានទេ។'))
    reader.readAsDataURL(file)
  })
}

const getGeminiMimeType = (file) => {
  if (file.type) return file.type
  if (file.name.toLowerCase().endsWith('.mp3')) return 'audio/mp3'
  if (file.name.toLowerCase().endsWith('.m4a')) return 'audio/mp4'
  if (file.name.toLowerCase().endsWith('.wav')) return 'audio/wav'
  if (file.name.toLowerCase().endsWith('.ogg')) return 'audio/ogg'
  return 'audio/mp3'
}

const formatConversionTime = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.round((milliseconds || 0) / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes} នាទី ${seconds} វិនាទី`
}

export default function AssistantTab({ meeting, participants, onAddNote }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '')
  const [showKeyInput, setShowKeyInput] = useState(() => !localStorage.getItem('gemini_api_key'))
  const [audioUrl, setAudioUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState('')
  const [selectedParticipantId, setSelectedParticipantId] = useState('')
  const [conversionStartedAt, setConversionStartedAt] = useState(null)
  const [conversionElapsedMs, setConversionElapsedMs] = useState(0)
  const [conversionDurationMs, setConversionDurationMs] = useState(null)

  const activeConversionTimeMs = conversionStartedAt ? conversionElapsedMs : conversionDurationMs

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  useEffect(() => {
    if (!conversionStartedAt) return undefined

    const updateElapsed = () => {
      setConversionElapsedMs(Date.now() - conversionStartedAt)
    }

    updateElapsed()
    const intervalId = window.setInterval(updateElapsed, 1000)
    return () => window.clearInterval(intervalId)
  }, [conversionStartedAt])

  const saveApiKey = (key) => {
    const trimmed = key.trim()
    logTranscription('Saving Gemini API key', {
      hasKey: Boolean(trimmed),
      keyPreview: maskApiKey(trimmed),
    })
    setApiKey(trimmed)
    localStorage.setItem('gemini_api_key', trimmed)
    setShowKeyInput(false)
    setError('')
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (!file) return

    logTranscription('Selected audio file', {
      name: file.name,
      type: file.type || 'unknown',
      sizeBytes: file.size,
      sizeLabel: formatSize(file.size),
    })

    if (file.size > MAX_INLINE_AUDIO_BYTES) {
      logTranscription('Rejected audio file because it is too large for Gemini inline audio', {
        name: file.name,
        sizeBytes: file.size,
        maxBytes: MAX_INLINE_AUDIO_BYTES,
      })
      setError('ទំហំឯកសារធំជាង 14MB។ Gemini frontend-only inline audio ត្រូវការឯកសារតូចជាងនេះ ព្រោះ base64 បន្ថែមទំហំ request។')
      return
    }

    setError('')
    setSelectedFile(file)
    setAudioUrl(URL.createObjectURL(file))
    setTranscript('')
    setConversionStartedAt(null)
    setConversionElapsedMs(0)
    setConversionDurationMs(null)
  }

  const transcribeFileWithProgress = async (file, key, onProgress) => {
    const mimeType = getGeminiMimeType(file)

    logTranscription('Reading audio file for Gemini inline request', {
      fileName: file.name,
      fileType: mimeType,
      fileSize: formatSize(file.size),
    })

    onProgress(10)
    const audioBase64 = await fileToBase64(file)
    onProgress(35)

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(key)}`
    const prompt = 'Transcribe this audio in Khmer as accurately as possible. Break the transcription into very short segments, ensuring each line represents only a few seconds of audio. For each line, strictly use the following format: "[Start Time] to [End Time] | Speaker [A/B/etc.]: [Content]". Return only the formatted transcript.'
    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: audioBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
      },
    }

    logTranscription('Sending Gemini transcription request', {
      endpoint: `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=***`,
      model: GEMINI_MODEL,
      mimeType,
      base64Length: audioBase64.length,
      keyPreview: maskApiKey(key),
    })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    onProgress(85)
    const responseText = await response.text()

    logTranscription('Gemini response received', {
      status: response.status,
      statusText: response.statusText,
      responsePreview: responseText.slice(0, 700),
    })

    let result = null
    try {
      result = JSON.parse(responseText)
    } catch (parseError) {
      logTranscription('Failed to parse Gemini response JSON', {
        message: parseError.message,
        responseText,
      })
      throw new Error('ការវិភាគទិន្នន័យឆ្លើយតបពី Gemini បរាជ័យ។')
    }

    if (!response.ok) {
      logTranscription('Gemini returned an error', {
        status: response.status,
        code: result.error?.code,
        statusName: result.error?.status,
        message: result.error?.message,
      })
      throw new Error(result.error?.message || `Gemini API failed with status ${response.status}`)
    }

    const text = result.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('')
      .trim() || ''

    logTranscription('Gemini transcription succeeded', {
      textLength: text.length,
      textPreview: text.slice(0, 180),
      finishReason: result.candidates?.[0]?.finishReason,
    })

    onProgress(100)
    return text
  }

  const handleTranscribe = async () => {
    logTranscription('Convert button clicked', {
      hasApiKey: Boolean(apiKey),
      keyPreview: maskApiKey(apiKey),
      hasSelectedFile: Boolean(selectedFile),
      fileName: selectedFile?.name || null,
    })

    if (!apiKey) {
      logTranscription('Blocked transcription because API key is missing')
      setError('សូមបញ្ចូល Gemini API Key ជាមុនសិន!')
      setShowKeyInput(true)
      return
    }

    if (!selectedFile) {
      logTranscription('Blocked transcription because audio file is missing')
      setError('សូមជ្រើសរើសឯកសារសំឡេងជាមុនសិន!')
      return
    }

    setError('')
    setTranscript('')
    setConversionElapsedMs(0)
    setConversionDurationMs(null)
    setIsUploading(true)
    setUploadProgress(0)

    const startedAt = Date.now()
    setConversionStartedAt(startedAt)

    try {
      const text = await transcribeFileWithProgress(selectedFile, apiKey, (progress) => {
        setUploadProgress(Math.round(progress))
      })

      setIsUploading(false)
      setIsTranscribing(true)

      if (text.trim()) {
        setTranscript(text)
      } else {
        logTranscription('Gemini response did not include transcript text')
        setError('បម្លែងមិនបានជោគជ័យ ឬមិនមានសំឡេងនិយាយនៅក្នុងឯកសារនេះទេ។')
      }
    } catch (err) {
      console.error('[Writer Gemini Transcription] Error during transcription', err)
      setError(`កំហុសកំឡុងពេលបម្លែង៖ ${err.message}`)
    } finally {
      const durationMs = Date.now() - startedAt
      setConversionElapsedMs(durationMs)
      setConversionDurationMs(durationMs)
      setConversionStartedAt(null)
      logTranscription('Transcription flow finished', {
        durationMs,
        durationLabel: formatConversionTime(durationMs),
      })
      setIsUploading(false)
      setIsProcessing(false)
      setIsTranscribing(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript)
    alert('ចម្លងអត្ថបទជោគជ័យ!')
  }

  const downloadText = () => {
    const element = document.createElement('a')
    const file = new Blob([transcript], { type: 'text/plain;charset=utf-8' })
    element.href = URL.createObjectURL(file)
    element.download = `${meeting.title || 'transcription'}_transcript.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleAppendToParticipantNotes = () => {
    if (!selectedParticipantId) {
      alert('សូមជ្រើសរើសអ្នកចូលរួមម្នាក់ជាមុនសិន!')
      return
    }

    if (!transcript) {
      alert('មិនទាន់មានអត្ថបទបម្លែងទេ។')
      return
    }

    onAddNote(selectedParticipantId, transcript)
    alert('បានបញ្ចូលអត្ថបទទៅក្នុងកំណត់ត្រាអ្នកចូលរួមដោយជោគជ័យ!')
  }

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <section className="assistant-tab-container card">
      <header className="assistant-header">
        <div className="assistant-title-group">
          <h2>ជំនួយការបម្លែងសំឡេងទៅជាអត្ថបទ (AI Transcription Assistant)</h2>
          <p>ផ្ទុកឡើងឯកសារសំឡេង ឬការថត (MP3, WAV, M4A, OGG) រហូតដល់ 14MB។ កម្មវិធីនឹងបម្លែងទៅជាអត្ថបទភាសាខ្មែរដោយភ្ជាប់ Gemini 2.5 Pro ផ្ទាល់ពី Browser។</p>
        </div>
        <button 
          className="btn btn-secondary btn-settings-toggle"
          type="button"
          onClick={() => setShowKeyInput(!showKeyInput)}
        >
          ⚙️ កំណត់ API Key
        </button>
      </header>

      {showKeyInput && (
        <div className="api-config-panel">
          <h3>បញ្ចូល Gemini API Key</h3>
          <p>Frontend-only mode នឹងរក្សាទុក key នៅក្នុង Browser localStorage ហើយ key អាចមើលឃើញតាម DevTools។ ប្រើសម្រាប់ local/internal testing ប៉ុណ្ណោះ។</p>
          <div className="api-input-group">
            <input 
              type="password" 
              placeholder="បញ្ចូល Gemini API Key របស់អ្នក..."
              defaultValue={apiKey}
              id="gemini-api-key-input"
            />
            <button 
              className="btn btn-primary"
              type="button"
              onClick={() => {
                const val = document.getElementById('gemini-api-key-input').value
                saveApiKey(val)
              }}
            >
              រក្សាទុក
            </button>
          </div>
        </div>
      )}

      {error && <div className="error-banner" style={{ whiteSpace: 'pre-line' }}>{error}</div>}

      <div className="assistant-content-grid">
        <div className="assistant-left-pane">
          <div className="audio-card upload-card">
            <h3>📁 ផ្ទុកឡើងឯកសារសំឡេង ឬការថត</h3>
            <div className="upload-dropzone">
              <input 
                type="file" 
                accept="audio/*" 
                onChange={handleFileChange} 
                id="audio-file-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="audio-file-upload" className="upload-label">
                <span>📂 {selectedFile ? `${selectedFile.name} (${formatSize(selectedFile.size)})` : 'ជ្រើសរើសឯកសារសំឡេង ឬអូសមកទីនេះ'}</span>
                <small>គាំទ្រឯកសារ MP3, WAV, M4A, OGG រហូតដល់ 14MB សម្រាប់ frontend-only mode</small>
              </label>
            </div>
          </div>

          {audioUrl && (
            <div className="audio-card player-card">
              <h3>🎧 ស្ដាប់សំឡេង</h3>
              <audio src={audioUrl} controls className="audio-player-element" />
              <button 
                className="btn btn-success btn-transcribe-action"
                type="button"
                disabled={isUploading || isProcessing || isTranscribing}
                onClick={handleTranscribe}
              >
                {isUploading && `កំពុងផ្ទុកឡើងទៅ Gemini... ${uploadProgress}%`}
                {isProcessing && 'កំពុងដំណើរការឯកសារក្នុង AI...'}
                {isTranscribing && 'កំពុងបម្លែងជាអក្សរ...'}
                {!isUploading && !isProcessing && !isTranscribing && '✨ បម្លែងសំឡេងជាអក្សរ'}
              </button>
            </div>
          )}
        </div>

        <div className="assistant-right-pane">
          <div className="audio-card transcript-card">
            <div className="transcript-header">
              <div className="transcript-title-group">
                <h3>📝 អត្ថបទបម្លែងរួច</h3>
                {activeConversionTimeMs !== null ? (
                  <span className="transcript-duration">
                    ចំណាយពេល: {formatConversionTime(activeConversionTimeMs)}
                  </span>
                ) : null}
              </div>
              {transcript && (
                <div className="transcript-actions">
                  <button className="btn btn-secondary btn-sm" type="button" onClick={copyToClipboard}>📋 ចម្លង</button>
                  <button className="btn btn-secondary btn-sm" type="button" onClick={downloadText}>💾 ទាញយក</button>
                </div>
              )}
            </div>
            
            <div className="transcript-body-container">
              {isUploading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>កំពុងផ្ទុកឯកសារសំឡេងទៅ Gemini៖ <strong>{uploadProgress}%</strong></p>
                  <div className="upload-progress-bar">
                    <div style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              ) : isProcessing ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>ផ្ទុកឡើងជោគជ័យ! AI កំពុងដំណើរការ និងវិភាគឯកសារសំឡេង...</p>
                </div>
              ) : isTranscribing ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>AI កំពុងបម្លែងសំឡេងរបស់អ្នកទៅជាភាសាខ្មែរ...</p>
                </div>
              ) : transcript ? (
                <textarea 
                  className="transcript-textarea"
                  value={transcript}
                  onChange={(event) => setTranscript(event.target.value)}
                />
              ) : (
                <div className="empty-transcript-state">
                  មិនទាន់មានអត្ថបទទេ។ សូមជ្រើសរើសឯកសារ រួចចុចបម្លែង។
                </div>
              )}
            </div>

            {transcript && (
              <div className="notes-integration-section">
                <h4>🔗 បញ្ចូលទៅកំណត់ត្រាអ្នកចូលរួម</h4>
                <div className="integration-controls">
                  <select 
                    className="form-select"
                    value={selectedParticipantId}
                    onChange={(event) => setSelectedParticipantId(event.target.value)}
                  >
                    <option value="">-- ជ្រើសរើសអ្នកចូលរួម --</option>
                    {participants.map((participant) => (
                      <option key={participant.id} value={participant.id}>
                        {participant.name} ({participant.role || participant.organization || participant.position || 'សមាជិក'})
                      </option>
                    ))}
                  </select>
                  <button 
                    className="btn btn-primary"
                    type="button"
                    onClick={handleAppendToParticipantNotes}
                  >
                    ➕ បញ្ចូលទៅក្នុងកំណត់ត្រា
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
