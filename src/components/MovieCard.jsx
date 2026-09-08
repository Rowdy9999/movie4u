import { useState } from 'react'

export default function MovieCard({ movie }) {
  const [copied, setCopied] = useState(false)

  const name = movie.name || movie.title || 'Unknown'
  const size = movie.size || ''
  const seeders = movie.seeders || movie.seeds || 0
  const leechers = movie.leechers || movie.leech || 0
  const magnet = movie.magnet || movie.magnetLink || ''
  const id = movie.id || ''

  async function handleCopy() {
    if (!magnet) return
    try {
      await navigator.clipboard.writeText(magnet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = magnet
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
      <div className="movie-info" style={{width: '100%'}}>
        <div className="movie-title">{name}</div>
        <div className="movie-meta">
          {size && <span className="movie-badge">{size}</span>}
          {seeders > 0 && <span className="movie-badge seeds">Seeders: {seeders}</span>}
          {leechers > 0 && <span className="movie-badge leech">Leechers: {leechers}</span>}
        </div>
        <button
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          disabled={!magnet}
        >
          {copied ? '✓ Magnet Copied!' : 'Copy Magnet Link'}
        </button>
      </div>
    </div>
  )
}
