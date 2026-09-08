export default async function handler(req, res) {
  const { q, page = 0 } = req.query

  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' })
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const body = new URLSearchParams({
      query: q,
      category: 'video',
      verified: '',
      page: String(page),
      orderBy: 'seeders',
      sortBy: 'desc'
    })

    const apiRes = await fetch('https://thepiratebayvolodimir-kudriachenkov1.p.rapidapi.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-rapidapi-host': 'ThePirateBayvolodimir-kudriachenkoV1.p.rapidapi.com',
        'x-rapidapi-key': '095446eb10msh8e8c3810cfea46cp12d73bjsn5d422053c1d2'
      },
      body: body.toString()
    })

    if (!apiRes.ok) {
      const errText = await apiRes.text()
      return res.status(502).json({ error: 'PirateBay API error', details: errText })
    }

    const data = await apiRes.json()

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch from PirateBay', details: err.message })
  }
}
