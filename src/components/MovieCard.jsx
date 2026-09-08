import { useState } from 'react'

export default function MovieCard({ movie }) {
  const [copied, setCopied] = useState(null)
  const [showAll, setShowAll] = useState(false)

  const title = movie.title || 'Unknown'
  const year = movie.year || ''
  const rating = movie.rating || 0
  const genres = (movie.genres || []).slice(0, 2).join(', ')
  const poster = movie.medium_cover_image || movie.small_cover_image || ''
  const torrents = movie.torrents || []

  function getBestTorrent() {
    const preferred = ['1080p', '720p', '2160p', '4K']
    for (const q of preferred) {
      const t = torrents.find(t => t.quality === q)
      if (t) return t
    }
    return torrents[0] || null
  }

  async function handleCopy(torrent, quality) {
    if (!torrent || !torrent.url) return
    try {
      await navigator.clipboard.writeText(torrent.url)
      setCopied(quality)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = torrent.url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(quality)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  const best = getBestTorrent()

  return (
    <div className="movie-card">
      {poster && (
        <img src={poster} alt={title} className="movie-poster" loading="lazy" />
      )}
      <div className="movie-info">
        <div className="movie-title">{title} ({year})</div>
        <div className="movie-meta">
          {rating > 0 && <span className="movie-badge">⭐ {rating}/10</span>}
          {genres && <span className="movie-badge type">{genres}</span>}
        </div>

        {!showAll && best && (
          <button
            className={`copy-btn ${copied === best.quality ? 'copied' : ''}`}
            onClick={() => handleCopy(best, best.quality)}
          >
            {copied === best.quality
              ? '✓ Copied!'
              : `Copy ${best.quality} Magnet`}
          </button>
        )}

        {!showAll && torrents.length > 1 && (
          <button className="copy-btn" style={{marginTop: 6}} onClick={() => setShowAll(true)}>
            Show All Qualities ({torrents.length})
          </button>
        )}

        {showAll && torrents.map((t, i) => (
          <button
            key={i}
            className={`copy-btn ${copied === t.quality ? 'copied' : ''}`}
            style={{marginTop: i > 0 ? 6 : 0}}
            onClick={() => handleCopy(t, t.quality)}
          >
            {copied === t.quality
              ? '✓ Copied!'
              : `${t.quality} — ${t.size} — Copy Magnet`}
          </button>
        ))}
      </div>
    </div>
  )
}
