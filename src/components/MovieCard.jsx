export default function MovieCard({ movie, genres, onWatch }) {
  const title = movie.title || 'Unknown'
  const year = movie.release_date ? movie.release_date.split('-')[0] : ''
  const rating = movie.vote_average || 0
  const poster = movie.poster_path || ''

  return (
    <div className="movie-card" onClick={onWatch}>
      {poster ? (
        <img src={poster} alt={title} className="movie-poster" loading="lazy" />
      ) : (
        <div className="movie-poster-placeholder">🎬</div>
      )}
      <div className="movie-info">
        <div className="movie-title">{title}</div>
        <div className="movie-meta">
          {rating > 0 && <span className="movie-badge rating">⭐ {rating.toFixed(1)}</span>}
          {year && <span className="movie-badge year">{year}</span>}
        </div>
        <button className="watch-btn" onClick={(e) => { e.stopPropagation(); onWatch() }}>
          ▶ Watch
        </button>
      </div>
    </div>
  )
}
