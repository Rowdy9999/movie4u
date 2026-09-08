import { useState } from 'react'
import SearchForm from './components/SearchForm'
import Results from './components/Results'

const API_KEY = '095446eb10msh8e8c3810cfea46cp12d73bjsn5d422053c1d2'
const API_HOST = 'movie-tv-music-search-and-download.p.rapidapi.com'
const API_BASE = 'https://movie-tv-music-search-and-download.p.rapidapi.com/search/torrent'

export default function App() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [query, setQuery] = useState('')

  async function handleSearch(name, year) {
    if (!name.trim()) return
    setLoading(true)
    setError('')
    setResults([])
    setSearched(true)
    setQuery(`${name}${year ? ' ' + year : ''}`)

    try {
      const params = new URLSearchParams({
        keywords: `${name} ${year}`.trim(),
        quantity: '20'
      })

      const res = await fetch(`${API_BASE}?${params}`, {
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': API_HOST
        }
      })

      const data = await res.json()

      if (data.code === '200' && data.result) {
        setResults(data.result)
        if (data.result.length === 0) {
          setError('No results found. Try a different search.')
        }
      } else {
        setError('No results found. Try a different search.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <header className="header">
        <div className="logo">Movie<span>4u</span></div>
      </header>

      <section className="hero">
        <h1>Find & Download Movies</h1>
        <p>Search for any movie and get torrent links instantly</p>
      </section>

      <div className="search-container">
        <SearchForm onSearch={handleSearch} loading={loading} />
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <div className="loading-text">Searching torrents...</div>
        </div>
      )}

      {error && !loading && (
        <div className="empty">
          <div className="empty-icon">🎬</div>
          <h3>{error}</h3>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <Results results={results} query={query} />
      )}

      {!loading && !error && searched && results.length === 0 && (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <h3>No results found</h3>
          <p>Try searching with different keywords</p>
        </div>
      )}

      {!searched && (
        <div className="empty">
          <div className="empty-icon">🎬</div>
          <h3>Start searching</h3>
          <p>Enter a movie name to find torrent download links</p>
        </div>
      )}

      <footer className="footer">
        Movie4u — Free movie torrent search engine
      </footer>
    </div>
  )
}
