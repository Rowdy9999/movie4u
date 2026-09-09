let TorrentSearchApi
try {
  TorrentSearchApi = (await import('torrent-search-api')).default
  TorrentSearchApi.enableProvider('1337x')
} catch (e) {
  console.error('Failed to load torrent-search-api:', e)
}

export default async function handler(req, res) {
  const { q } = req.query

  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' })
  }

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (!TorrentSearchApi) {
    return res.status(500).json({ error: 'Torrent search not available' })
  }

  try {
    const torrents = await TorrentSearchApi.search(q, 'Movies', 10)

    const results = torrents.map(t => ({
      title: t.title,
      size: t.size,
      seeds: t.seeds || 0,
      leeches: t.leeches || 0,
      magnet: null,
      url: t.link || t.torrent || '',
      provider: t.provider || '1337x'
    }))

    // Try to get magnet links
    for (let i = 0; i < results.length && i < 5; i++) {
      try {
        if (results[i].url) {
          const magnet = await TorrentSearchApi.getMagnet({ link: results[i].url })
          results[i].magnet = magnet
        }
      } catch (e) {
        // Skip magnet if it fails
      }
    }

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    return res.status(200).json({ results })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to search torrents', details: err.message })
  }
}
