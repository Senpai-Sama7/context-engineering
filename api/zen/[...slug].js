const ZEN_BASE = 'https://opencode.ai/zen/v1';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    var slug = (req.query.slug || []).join('/');
    var targetUrl = ZEN_BASE + '/' + slug;

    var headers = { 'Content-Type': 'application/json' };
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }

    var body = await new Promise(function (resolve) {
      var data = '';
      req.on('data', function (chunk) { data += chunk; });
      req.on('end', function () { resolve(data); });
    });

    var fetchOpts = { method: req.method, headers: headers };
    if (body && req.method !== 'GET') fetchOpts.body = body;

    var response = await fetch(targetUrl, fetchOpts);
    var responseText = await response.text();

    res.status(response.status).send(responseText);
  } catch (err) {
    res.status(502).json({ error: 'Proxy error', message: err.message });
  }
};
