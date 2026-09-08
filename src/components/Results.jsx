import MovieCard from './MovieCard'

export default function Results({ results, query }) {
  return (
    <section className="results">
      <div className="results-header">
        <div className="results-title">Results for "{query}"</div>
        <div className="results-count">{results.length} files found</div>
      </div>
      <div className="results-grid">
        {results.map((file, i) => (
          <MovieCard key={i} file={file} />
        ))}
      </div>
    </section>
  )
}
