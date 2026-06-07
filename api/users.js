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
      const { action, username, userData, banDays, banUntil } = req.body || {};

      if (!username) {
        return res.status(400).json({ ok: false, message: '用户名不能为空' });
      }

      // 删除用户
      if (action === 'delete') {
        if (available) {
          const all = await kvGet();
          delete all[username];
          await kvSet(all);
        }
        return res.json({ ok: true, action: 'delete', username, source: available ? 'kv' : 'local' });
      }

      // 封禁用户
      if (action === 'ban') {
        const banExpiry = banUntil || (banDays ? Date.now() + banDays * 24 * 60 * 60 * 1000 : null);
        if (available) {
          const all = await kvGet();
          // 如果不存在则创建基本数据
          if (!all[username]) {
            all[username] = { username: username, totalScore: 0, highScore: 0, gamesPlayed: 0, gamesWon: 0, unlockedLevel: 1, currentLevel: 1, rank: 'bronze', rankScore: 0 };
          }
          all[username].banned = true;
          all[username].banExpiry = banExpiry;
          await kvSet(all);
        }
        return res.json({ ok: true, action: 'ban', username, banExpiry, source: available ? 'kv' : 'local' });
      }

      // 解封用户
      if (action === 'unban') {
        if (available) {
          const all = await kvGet();
          if (all[username]) {
            all[username].banned = false;
            all[username].banExpiry = null;
            await kvSet(all);
          }
        }
        return res.json({ ok: true, action: 'unban', username, source: available ? 'kv' : 'local' });
      }

      // 保存用户数据
      if (!userData) {
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
