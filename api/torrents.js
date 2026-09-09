const APIBAY_URL = 'https://apibay.org/q.php'
const APIBAY_INFO_URL = 'https://apibay.org/t.php'

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

  try {
    const searchRes = await fetch(`${APIBAY_URL}?q=${encodeURIComponent(q)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://apibay.org/',
        'Accept': 'application/json'
      }
    })

    if (!searchRes.ok) {
      return res.status(502).json({ error: 'Failed to fetch from apibay', status: searchRes.status })
    }

    const data = await searchRes.json()

    if (!Array.isArray(data)) {
      return res.status(200).json({ results: [] })
    }

    const movieCategories = new Set(['207', '209', '211', '212', '213'])

    const results = data
      .filter(t => t.id !== '0' && movieCategories.has(t.category))
      .sort((a, b) => parseInt(b.seeders) - parseInt(a.seeders))
      .slice(0, 15)
      .map(t => {
        const name = t.name || ''
        const infoHash = t.info_hash || ''
        const sizeBytes = parseInt(t.size) || 0
        const size = formatSize(sizeBytes)
        const seeds = parseInt(t.seeders) || 0
        const leeches = parseInt(t.leechers) || 0

        const magnet = `magnet:?xt=urn:btih:${infoHash}&dn=${encodeURIComponent(name)}`
        const torrentUrl = `https://apibay.org/t.php?id=${t.id}`

        return {
          title: name,
          size,
          seeds,
          leeches,
          magnet,
          url: torrentUrl,
          provider: 'apibay'
        }
      })

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')
    return res.status(200).json({ results })
  } catch (err) {
    return res.status(500).json({ error: 'Failed to search torrents', details: err.message })
  }
}

function formatSize(bytes) {
  if (!bytes || bytes === 0) return 'Unknown'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i = 0
  let size = bytes
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024
    i++
  }
  return `${size.toFixed(2)} ${units[i]}`
}
