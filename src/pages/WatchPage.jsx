import { useState, useEffect } from 'react'

export default function WatchPage({ movieId, onNavigate }) {
  const [movie, setMovie] = useState(null)
  const [torrents, setTorrents] = useState([])
  const [loading, setLoading] = useState(true)
  const [torrentLoading, setTorrentLoading] = useState(false)
  const [error, setError] = useState('')
  const [copiedIdx, setCopiedIdx] = useState(null)

  const GENRES = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
    80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
    14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
    9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
    53: 'Thriller', 10752: 'War', 37: 'Western'
  }

  useEffect(() => {
    setLoading(true)
    fetch(`/api/movie/${movieId}`)
      .then(r => r.json())
      .then(data => {
        if (data && data.id) {
          setMovie(data)
        }
      })
      .catch(() => setError('Failed to load movie'))
      .finally(() => setLoading(false))
  }, [movieId])

  function loadTorrents() {
    if (!movie) return
    setTorrentLoading(true)
    const year = movie.release_date ? movie.release_date.split('-')[0] : ''
    const q = `${movie.title} ${year}`.trim()
    fetch(`/api/torrents?q=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(data => {
        if (data.results) setTorrents(data.results)
      })
      .catch(() => {})
      .finally(() => setTorrentLoading(false))
  }

  async function copyMagnet(magnet, idx) {
    if (!magnet) return
    try {
      await navigator.clipboard.writeText(magnet)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = magnet
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  if (loading) {
    return (
      <div className="loading" style={{ paddingTop: 100 }}>
        <div className="spinner"></div>
        <div className="loading-text">Loading movie...</div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="empty">
        <div className="empty-icon">❌</div>
        <h3>{error || 'Movie not found'}</h3>
        <button className="back-btn" onClick={() => onNavigate('home')}>← Go Home</button>
      </div>
    )
  }

  const year = movie.release_date ? movie.release_date.split('-')[0] : ''
  const genres = (movie.genre_ids || []).slice(0, 3).map(g => GENRES[g]).filter(Boolean).join(', ')

  return (
    <div className="watch-page">
      <div className="watch-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>← Home</button>
        <h1>{movie.title} {year && <span className="year">({year})</span>}</h1>
      </div>

      <div className="player-container">
        <iframe
          src={`https://moviesapi.to/movie/${movieId}`}
          className="player-iframe"
          frameBorder="0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title={movie.title}
        />
      </div>

      <div className="movie-details">
        <div className="details-meta">
          {movie.vote_average > 0 && (
            <span className="movie-badge rating">⭐ {movie.vote_average.toFixed(1)}</span>
          )}
          {year && <span className="movie-badge year">{year}</span>}
          {genres && <span className="movie-badge genre">{genres}</span>}
        </div>
        {movie.overview && (
          <p className="movie-overview">{movie.overview}</p>
        )}
      </div>

      <div className="torrent-section">
        <div className="torrent-header">
          <h2>📥 Download</h2>
          {!torrents.length && !torrentLoading && (
            <button className="load-torrents-btn" onClick={loadTorrents}>
              Search Torrents
            </button>
          )}
        </div>

        {torrentLoading && (
          <div className="loading" style={{ padding: 24 }}>
            <div className="spinner" style={{ width: 30, height: 30 }}></div>
            <div className="loading-text">Searching torrents...</div>
          </div>
        )}

        {torrents.length > 0 && (
          <div className="torrent-list">
            {torrents.map((t, i) => (
              <div key={i} className="torrent-item">
                <div className="torrent-info">
                  <div className="torrent-title">{t.title}</div>
                  <div className="torrent-meta">
                    {t.size && <span className="movie-badge size">{t.size}</span>}
                    {t.seeds > 0 && <span className="movie-badge seeds">↑ {t.seeds}</span>}
                    {t.leeches > 0 && <span className="movie-badge leech">↓ {t.leeches}</span>}
                  </div>
                </div>
                <button
                  className={`copy-magnet-btn ${copiedIdx === i ? 'copied' : ''}`}
                  onClick={() => copyMagnet(t.magnet, i)}
                  disabled={!t.magnet}
                >
                  {copiedIdx === i ? '✓ Copied!' : 'Copy Magnet'}
                </button>
              </div>
            ))}
          </div>
        )}

        {!torrentLoading && torrents.length === 0 && !error && (
          <p className="torrent-empty">Click "Search Torrents" to find download links</p>
        )}
      </div>

      <footer className="footer">
        Movie4u — Stream & download movies for free
      </footer>
    </div>
  )
}
