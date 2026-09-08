import { useState } from 'react'

export default function MovieCard({ file }) {
  const [copied, setCopied] = useState(false)

  const fileName = file.file_name || 'Unknown File'
  const fileType = file.file_type || 'N/A'
  const fileSize = file.file_size || 'N/A'
  const fileLink = file.file_link || ''

  async function handleCopy() {
    if (!fileLink) return
    try {
      await navigator.clipboard.writeText(fileLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const ta = document.createElement('textarea')
      ta.value = fileLink
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="movie-card">
      <div className="movie-name">{fileName}</div>
      <div className="movie-meta">
        <span className="movie-badge type">{fileType}</span>
        {fileSize !== 'N/A' && (
          <span className="movie-badge">{fileSize}</span>
        )}
      </div>
      <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
        {copied ? '✓ Copied!' : 'Copy Download Link'}
      </button>
    </div>
  )
}
