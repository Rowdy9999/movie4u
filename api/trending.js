const TMDB_KEY = '5a6e0b386f2594eaef66408b19e50657'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_KEY}`
    )

    if (!tmdbRes.ok) {
      return res.status(502).json({ error: 'TMDB API error' })
    }

    const data = await tmdbRes.json()

    const movies = (data.results || []).map(m => ({
      id: m.id,
      title: m.title,
      original_title: m.original_title,
      overview: m.overview,
      poster_path: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
      backdrop_path: m.backdrop_path ? `https://image.tmdb.org/t/p/w780${m.backdrop_path}` : null,
      release_date: m.release_date,
      vote_average: m.vote_average,
      vote_count: m.vote_count,
      genre_ids: m.genre_ids
    }))

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    return res.status(200).json({ results: movies })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch trending', details: err.message })
  }
}
