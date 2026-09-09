import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import SearchResults from './pages/SearchResults'
import WatchPage from './pages/WatchPage'

function getRoute() {
  const hash = window.location.hash.slice(1) || '/'
  if (hash.startsWith('/watch/')) {
    const id = hash.split('/watch/')[1]
    return { page: 'watch', param: id }
  }
  if (hash.startsWith('/search')) {
    const params = new URLSearchParams(hash.split('?')[1] || '')
    return { page: 'search', param: params.get('q') || '' }
  }
  return { page: 'home', param: '' }
}

export default function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    function onHashChange() {
      setRoute(getRoute())
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function navigate(page, param) {
    if (page === 'home') window.location.hash = '/'
    else if (page === 'search') window.location.hash = `/search?q=${encodeURIComponent(param)}`
    else if (page === 'watch') window.location.hash = `/watch/${param}`
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo" onClick={() => navigate('home')} style={{ cursor: 'pointer' }}>
          Movie<span>4u</span>
        </div>
      </header>

      <main className="main">
        {route.page === 'home' && (
          <HomePage onNavigate={navigate} />
        )}
        {route.page === 'search' && route.param && (
          <SearchResults query={route.param} onNavigate={navigate} />
        )}
        {route.page === 'watch' && route.param && (
          <WatchPage movieId={route.param} onNavigate={navigate} />
        )}
      </main>
    </div>
  )
}
