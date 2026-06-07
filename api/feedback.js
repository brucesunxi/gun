// 跨设备反馈 API (Vercel Serverless Function)
// 使用 GitHub Issues 存储反馈，无需额外数据库配置

const GH_REPO = 'brucesunxi/gun';
const GH_LABEL = 'feedback';

async function ghApi(path, method = 'GET', body = null, retries = 2) {
  const token = process.env.GH_TOKEN;
  if (!token) throw new Error('GH_TOKEN not configured');
  const opts = {
    method,
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'gun-feedback',
      'Accept': 'application/vnd.github.v3+json'
    }
  };
  if (body) opts.body = JSON.stringify(body);

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`https://api.github.com/repos/${GH_REPO}/${path}`, opts);
      const data = await res.json();
      if (!res.ok) {
        const msg = data.message || `HTTP ${res.status}`;
        if (attempt < retries && res.status >= 500) continue;
        throw new Error(`GitHub: ${msg}`);
      }
      return data;
    } catch (e) {
      if (attempt < retries && e.message.includes('fetch')) continue;
      throw e;
    }
  }
}

function parseIssue(issue) {
  try {
    const body = JSON.parse(issue.body);
    return {
      text: body.text || issue.title.replace(/^反馈:/, '').trim(),
      time: body.time || issue.created_at,
      level: body.level || 1,
      score: body.score || 0,
      username: body.username || '匿名',
      issueUrl: issue.html_url
    };
  } catch {
    return {
      text: issue.title.replace(/^反馈:/, '').trim(),
      time: issue.created_at,
      level: 1,
      score: 0,
      username: '匿名',
      issueUrl: issue.html_url
    };
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const ghAvailable = !!process.env.GH_TOKEN;

  try {
    if (req.method === 'GET') {
      if (!ghAvailable) {
        return res.json({ ok: true, data: [], source: 'local' });
      }
      const issues = await ghApi(`issues?labels=${GH_LABEL}&state=all&per_page=100&sort=created&direction=desc`);
      const feedbacks = issues.map(parseIssue);
      res.json({ ok: true, data: feedbacks, source: 'github' });

    } else if (req.method === 'POST') {
      const { text, level, score, username } = req.body || {};
      if (!text || !text.trim()) {
        return res.status(400).json({ ok: false, message: '反馈内容不能为空' });
      }

      const fb = { text: text.trim(), time: new Date().toISOString(), level: level || 1, score: score || 0, username: username || '匿名用户' };

      if (ghAvailable) {
        await ghApi('issues', 'POST', {
          title: `反馈: ${fb.text.slice(0, 50)}${fb.text.length > 50 ? '...' : ''}`,
          body: JSON.stringify(fb, null, 2),
          labels: [GH_LABEL]
        });
      }

      res.json({ ok: true, data: fb, source: ghAvailable ? 'github' : 'local' });

    } else if (req.method === 'DELETE') {
      if (!ghAvailable) {
        return res.json({ ok: true, source: 'local' });
      }
      const issues = await ghApi(`issues?labels=${GH_LABEL}&state=open&per_page=100`);
      for (const issue of issues) {
        await ghApi(`issues/${issue.number}`, 'PATCH', { state: 'closed' });
      }
      res.json({ ok: true, source: 'github', closed: issues.length });

    } else {
      res.status(405).json({ ok: false, message: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Feedback API error:', err.message);
    res.status(200).json({ ok: true, data: [], source: 'local', message: err.message });
  }
};
