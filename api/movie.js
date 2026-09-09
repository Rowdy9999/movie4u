const TMDB_KEY = '5a6e0b386f2594eaef66408b19e50657'

export default async function handler(req, res) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'Movie ID is required' })
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}`
    )

    if (!tmdbRes.ok) {
      return res.status(404).json({ error: 'Movie not found' })
    }

    const m = await tmdbRes.json()

    const movie = {
      id: m.id,
      title: m.title,
      original_title: m.original_title,
      overview: m.overview,
      poster_path: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
      backdrop_path: m.backdrop_path ? `https://image.tmdb.org/t/p/w780${m.backdrop_path}` : null,
      release_date: m.release_date,
      vote_average: m.vote_average,
      vote_count: m.vote_count,
      genre_ids: (m.genres || []).map(g => g.id),
      runtime: m.runtime,
      status: m.status
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    return res.status(200).json(movie)
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch movie', details: err.message })
  }
}
