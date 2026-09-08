export default async function handler(req, res) {
  const { q, limit = 20 } = req.query

  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' })
  }

  try {
    const params = new URLSearchParams({
      query_term: q,
      limit: String(limit),
      quality: 'all',
      sort_by: 'date_added',
      order_by: 'desc'
    })

    const ytsRes = await fetch(`https://yts.mx/api/v2/list_movies.json?${params}`)

    if (!ytsRes.ok) {
      return res.status(502).json({ error: 'YTS API error' })
    }

    const data = await ytsRes.json()

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')

    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch from YTS' })
  }
}
