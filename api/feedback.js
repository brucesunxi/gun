// 跨设备反馈 API (Vercel Serverless Function)
// 使用 Vercel KV 存储，用户连接 KV 后自动生效

const KV_KEY = 'feedback_data';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
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
    return d.result || [];
  }

  async function kvSet(val) {
    await fetch(`${url}/set/${KV_KEY}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(JSON.stringify(val))
    });
  }

  try {
    if (req.method === 'GET') {
      const data = available ? await kvGet() : [];
      return res.json({ ok: true, data, source: available ? 'kv' : 'local' });

    } else if (req.method === 'POST') {
      const { text, level, score, username } = req.body || {};
      if (!text || !text.trim()) {
        return res.status(400).json({ ok: false, message: '反馈内容不能为空' });
      }
      const fb = { text: text.trim(), time: new Date().toISOString(), level: level || 1, score: score || 0, username: username || '匿名用户' };
      if (available) {
        const all = await kvGet();
        all.push(fb);
        await kvSet(all);
      }
      return res.json({ ok: true, data: fb, source: available ? 'kv' : 'local' });

    } else if (req.method === 'DELETE') {
      if (available) await kvSet([]);
      return res.json({ ok: true, source: available ? 'kv' : 'local' });

    } else {
      return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }
  } catch (err) {
    console.error('KV error:', err.message);
    return res.json({ ok: true, data: [], source: 'local', message: err.message });
  }
};
