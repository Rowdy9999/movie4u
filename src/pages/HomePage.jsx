import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import SearchForm from '../components/SearchForm'

const GENRES = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
  53: 'Thriller', 10752: 'War', 37: 'Western'
}

export default function HomePage({ onNavigate }) {
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/trending')
      .then(r => r.json())
      .then(data => {
        if (data.results) setTrending(data.results)
      })
      .catch(() => setError('Failed to load trending movies'))
      .finally(() => setLoading(false))
  }, [])

  function handleSearch(name, year) {
    const q = `${name}${year ? ' ' + year : ''}`.trim()
    onNavigate('search', q)
  }

  return (
    <div>
      <section className="hero">
        <h1>Watch & Download Movies</h1>
        <p>Search for any movie to stream or download</p>
      </section>

      <div className="search-container">
        <SearchForm onSearch={handleSearch} loading={false} />
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <div className="loading-text">Loading trending movies...</div>
        </div>
      )}

      {error && !loading && (
        <div className="empty">
          <div className="empty-icon">⚠️</div>
          <h3>{error}</h3>
        </div>
      )}

      {!loading && trending.length > 0 && (
        <section className="trending-section">
          <div className="section-header">
            <h2>🔥 Trending Now</h2>
          </div>
          <div className="poster-scroll">
            {trending.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                genres={GENRES}
                onWatch={() => onNavigate('watch', movie.id)}
              />
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
