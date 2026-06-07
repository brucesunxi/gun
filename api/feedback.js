// 跨设备反馈 API (Vercel Serverless Function)
// 需要 Vercel KV 数据库支持，否则降级为 localStorage-only（单设备）

const KV_KEY = 'battle_shooter_feedback';

async function kvGet(url, token) {
  const res = await fetch(`${url}/get/${KV_KEY}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`KV GET failed: ${res.status}`);
  const data = await res.json();
  return data.result || [];
}

async function kvSet(url, token, value) {
  const res = await fetch(`${url}/set/${KV_KEY}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(JSON.stringify(value))
  });
  if (!res.ok) throw new Error(`KV SET failed: ${res.status}`);
}

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;
  const kvAvailable = !!(kvUrl && kvToken);

  try {
    if (req.method === 'GET') {
      // 获取所有反馈
      if (!kvAvailable) {
        return res.status(200).json({ ok: true, data: [], source: 'local', message: 'KV 未配置，无法获取跨设备数据' });
      }
      const feedbacks = await kvGet(kvUrl, kvToken);
      res.status(200).json({ ok: true, data: feedbacks, source: 'kv' });

    } else if (req.method === 'POST') {
      // 提交新反馈
      const { text, level, score, username } = req.body || {};
      if (!text || !text.trim()) {
        return res.status(400).json({ ok: false, message: '反馈内容不能为空' });
      }

      const feedback = {
        text: text.trim(),
        time: new Date().toISOString(),
        level: level || 1,
        score: score || 0,
        username: username || '匿名用户'
      };

      if (kvAvailable) {
        const feedbacks = await kvGet(kvUrl, kvToken);
        feedbacks.push(feedback);
        await kvSet(kvUrl, kvToken, feedbacks);
      }

      res.status(200).json({
        ok: true,
        data: feedback,
        source: kvAvailable ? 'kv' : 'local'
      });

    } else if (req.method === 'DELETE') {
      // 清空反馈（管理员操作）
      if (!kvAvailable) {
        return res.status(200).json({ ok: true, source: 'local' });
      }
      await kvSet(kvUrl, kvToken, []);
      res.status(200).json({ ok: true, source: 'kv' });

    } else {
      res.status(405).json({ ok: false, message: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Feedback API error:', err);
    res.status(500).json({ ok: false, message: err.message });
  }
};
