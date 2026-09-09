import { useState, useEffect } from 'react'

export default function SearchResults({ query, onNavigate }) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const GENRES = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
    80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
    14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
    9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
    53: 'Thriller', 10752: 'War', 37: 'Western'
  }

  useEffect(() => {
    setLoading(true)
    setError('')
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then(r => r.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          setResults(data.results)
        } else {
          setError('No results found')
        }
      })
      .catch(() => setError('Search failed'))
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div>
      <section className="search-results-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>← Back</button>
        <h2>Results for "{query}"</h2>
        {!loading && <span className="results-count">{results.length} found</span>}
      </section>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <div className="loading-text">Searching...</div>
        </div>
      )}

      {error && !loading && (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <h3>{error}</h3>
        </div>
      )}

      {!loading && results.length > 0 && (
        <section className="results">
          <div className="results-grid">
            {results.map(movie => (
              <div key={movie.id} className="movie-card" onClick={() => onNavigate('watch', movie.id)}>
                {movie.poster_path && (
                  <img src={movie.poster_path} alt={movie.title} className="movie-poster" loading="lazy" />
                )}
                {!movie.poster_path && (
                  <div className="movie-poster-placeholder">🎬</div>
                )}
                <div className="movie-info">
                  <div className="movie-title">{movie.title}</div>
                  <div className="movie-meta">
                    {movie.vote_average > 0 && (
                      <span className="movie-badge rating">⭐ {movie.vote_average.toFixed(1)}</span>
                    )}
                    {movie.release_date && (
                      <span className="movie-badge year">{movie.release_date.split('-')[0]}</span>
                    )}
                  </div>
                  <div className="movie-actions">
                    <button className="watch-btn" onClick={(e) => { e.stopPropagation(); onNavigate('watch', movie.id) }}>
                      ▶ Watch
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="footer">
        Movie4u — Stream & download movies for free
      </footer>
    </div>
  )
}
