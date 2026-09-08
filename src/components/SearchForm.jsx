import { useState } from 'react'

export default function SearchForm({ onSearch, loading }) {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSearch(name, year)
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder="Enter movie name..."
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />
        <input
          type="text"
          className="year-input"
          placeholder="Year"
          value={year}
          onChange={e => setYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
          maxLength={4}
        />
      </div>
      <button type="submit" className="search-btn" disabled={loading || !name.trim()}>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}
