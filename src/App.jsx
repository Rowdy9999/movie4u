import { useState } from 'react'
import SearchForm from './components/SearchForm'
import Results from './components/Results'

const API_KEY = '388f6aeb7emsh39b7c961a6b384dp16c43ejsnc7055ae371dd'
const API_HOST = 'filepursuit.p.rapidapi.com'
const API_BASE = 'https://filepursuit.p.rapidapi.com/'

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
        q: `${name} ${year}`.trim(),
        type: 'video'
      })

      const res = await fetch(`${API_BASE}?${params}`, {
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': API_HOST
        }
      })

      const data = await res.json()

      if (data.status === 'success' && data.files_found) {
        setResults(data.files_found)
        if (data.files_found.length === 0) {
          setError('No files found. Try a different search.')
        }
      } else {
        setError('No files found. Try a different search.')
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
        <p>Search for any movie and get download links instantly</p>
      </section>

      <div className="search-container">
        <SearchForm onSearch={handleSearch} loading={loading} />
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <div className="loading-text">Searching for files...</div>
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
          <p>Enter a movie name to find download links</p>
        </div>
      )}

      <footer className="footer">
        Movie4u — Free movie file search engine
      </footer>
    </div>
  )
}
