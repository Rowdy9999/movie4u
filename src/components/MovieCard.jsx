import { useState } from 'react'

export default function MovieCard({ file }) {
  const [copied, setCopied] = useState(false)

  const title = file.title || 'Unknown'
  const size = file.size || 'N/A'
  const rate = file.rate || '0'
  const torrentLink = file.torrent || ''

  async function handleCopy() {
    if (!torrentLink) return
    try {
      await navigator.clipboard.writeText(torrentLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = torrentLink
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
      <div className="movie-name">{title}</div>
      <div className="movie-meta">
        <span className="movie-badge type">{size}</span>
        {rate > 0 && (
          <span className="movie-badge">⭐ {rate}/10</span>
        )}
      </div>
      <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
        {copied ? '✓ Copied!' : 'Copy Torrent Link'}
      </button>
    </div>
  )
}
