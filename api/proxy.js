const ZEN_BASE = 'https://opencode.ai/zen/v1';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    var path = req.query.path || '';
    var targetUrl = ZEN_BASE + '/' + path;

    var body = '';
    if (req.method !== 'GET') {
      body = await new Promise(function (resolve) {
        var data = '';
        req.on('data', function (chunk) { data += chunk; });
        req.on('end', function () { resolve(data); });
      });
    }

    var fetchOpts = {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (req.headers.authorization) {
      fetchOpts.headers['Authorization'] = req.headers.authorization;
    }
    if (body) fetchOpts.body = body;

    var upstream = await fetch(targetUrl, fetchOpts);
    var upstreamText = await upstream.text();
    var upstreamType = upstream.headers.get('content-type') || 'text/plain';

    res.setHeader('Content-Type', upstreamType);
    res.status(upstream.status).send(upstreamText);
  } catch (err) {
    res.status(502).json({ error: 'Proxy error', message: err.message });
  }
};
