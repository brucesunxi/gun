// 用户数据 API (Vercel Serverless Function)
// 使用 Vercel KV 跨设备同步用户数据

const KV_KEY = 'users_data';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  const available = !!(url && token);

  async function kvGet() {
    const r = await fetch(`${url}/get/${KV_KEY}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!r.ok) throw new Error(`KV GET ${r.status}`);
    const d = await r.json();
    if (!d.result) return {};
    if (typeof d.result === 'object') return d.result;
    try { return JSON.parse(d.result); } catch(e) { return {}; }
  }

  async function kvSet(val) {
    await fetch(`${url}/set/${KV_KEY}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(val)
    });
  }

  try {
    if (req.method === 'GET') {
      const data = available ? await kvGet() : {};
      return res.json({ ok: true, data, source: available ? 'kv' : 'local' });

    } else if (req.method === 'POST') {
      const { username, userData } = req.body || {};
      if (!username || !userData) {
        return res.status(400).json({ ok: false, message: '参数不完整' });
      }
      if (available) {
        const all = await kvGet();
        all[username] = userData;
        await kvSet(all);
      }
      return res.json({ ok: true, source: available ? 'kv' : 'local' });

    } else {
      return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Users API error:', err.message);
    return res.json({ ok: true, data: {}, source: 'local' });
  }
};
