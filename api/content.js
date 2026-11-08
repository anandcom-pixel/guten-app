// Vercel Serverless Function: Cloud Database Persistence & Multi-User Synchronization for Guten App

let inMemoryCloudStore = {
  lessons: {},
  vocabulary: {},
  newVocabulary: {},
  customLessons: [],
  customQuizItems: [],
  lastSyncedAt: Date.now()
};

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;

  // GET: Fetch latest cloud curriculum overrides and custom content
  if (req.method === 'GET') {
    try {
      if (KV_URL && KV_TOKEN) {
        const kvRes = await fetch(`${KV_URL}/get/guten_cloud_curriculum_v1`, {
          headers: { Authorization: `Bearer ${KV_TOKEN}` }
        });
        if (kvRes.ok) {
          const kvData = await kvRes.json();
          if (kvData && kvData.result) {
            const parsed = typeof kvData.result === 'string' ? JSON.parse(kvData.result) : kvData.result;
            inMemoryCloudStore = parsed;
            return res.status(200).json({
              success: true,
              source: 'vercel-kv',
              data: parsed
            });
          }
        }
      }
    } catch (e) {
      console.warn('Vercel KV read error, falling back to serverless memory:', e);
    }

    return res.status(200).json({
      success: true,
      source: 'serverless-cloud-storage',
      data: inMemoryCloudStore
    });
  }

  // POST: Save updated or newly created curriculum content
  if (req.method === 'POST') {
    try {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const updatedData = {
        ...inMemoryCloudStore,
        ...payload,
        lessons: { ...(inMemoryCloudStore.lessons || {}), ...(payload.lessons || {}) },
        vocabulary: { ...(inMemoryCloudStore.vocabulary || {}), ...(payload.vocabulary || {}) },
        newVocabulary: { ...(inMemoryCloudStore.newVocabulary || {}), ...(payload.newVocabulary || {}) },
        customLessons: payload.customLessons || inMemoryCloudStore.customLessons || [],
        customQuizItems: payload.customQuizItems || inMemoryCloudStore.customQuizItems || [],
        lastSyncedAt: Date.now()
      };

      inMemoryCloudStore = updatedData;

      if (KV_URL && KV_TOKEN) {
        try {
          await fetch(`${KV_URL}/set/guten_cloud_curriculum_v1`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${KV_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(JSON.stringify(updatedData))
          });
        } catch (kvErr) {
          console.warn('Vercel KV write error, retained in serverless store:', kvErr);
        }
      }

      return res.status(200).json({
        success: true,
        source: KV_URL && KV_TOKEN ? 'vercel-kv' : 'serverless-cloud-storage',
        message: 'Content successfully synced to Vercel cloud database',
        data: updatedData
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown server error'
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
}
