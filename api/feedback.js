// 跨设备反馈 API (Vercel Serverless Function)
// 使用 Vercel Blob 存储 feedback.json，无需数据库

const { put, list } = require('@vercel/blob');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  const available = !!blobToken;

  try {
    if (req.method === 'GET') {
      let data = [];
      if (available) {
        try {
          const { blobs } = await list({ prefix: 'feedback.json', token: blobToken });
          if (blobs.length > 0) {
            const resp = await fetch(blobs[0].url);
            data = await resp.json();
            if (!Array.isArray(data)) data = [];
          }
        } catch (e) { /* 文件尚不存在 */ }
      }
      return res.json({ ok: true, data, source: available ? 'blob' : 'local' });

    } else if (req.method === 'POST') {
      const { text, level, score, username } = req.body || {};
      if (!text || !text.trim()) {
        return res.status(400).json({ ok: false, message: '反馈内容不能为空' });
      }

      const fb = { text: text.trim(), time: new Date().toISOString(), level: level || 1, score: score || 0, username: username || '匿名用户' };

      if (available) {
        let all = [];
        try {
          const { blobs } = await list({ prefix: 'feedback.json', token: blobToken });
          if (blobs.length > 0) {
            const resp = await fetch(blobs[0].url);
            all = await resp.json();
            if (!Array.isArray(all)) all = [];
          }
        } catch (e) { /* 首次写入 */ }
        all.push(fb);
        await put('feedback.json', JSON.stringify(all), {
          access: 'public',
          contentType: 'application/json',
          addRandomSuffix: false,
          token: blobToken
        });
      }

      return res.json({ ok: true, data: fb, source: available ? 'blob' : 'local' });

    } else if (req.method === 'DELETE') {
      if (available) {
        try {
          const { blobs } = await list({ prefix: 'feedback.json', token: blobToken });
          for (const b of blobs) {
            await fetch(b.url, { method: 'DELETE', headers: { Authorization: `Bearer ${blobToken}` } });
          }
        } catch (e) { /* ignore */ }
      }
      return res.json({ ok: true, source: available ? 'blob' : 'local' });

    } else {
      return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Feedback API error:', err.message);
    return res.json({ ok: true, data: [], source: 'local', message: err.message });
  }
};
