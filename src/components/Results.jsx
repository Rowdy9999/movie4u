import MovieCard from './MovieCard'

export default function Results({ results, query }) {
  return (
    <section className="results">
      <div className="results-header">
        <div className="results-title">Results for "{query}"</div>
        <div className="results-count">{results.length} movies found</div>
      </div>
      <div className="results-grid">
        {results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}
