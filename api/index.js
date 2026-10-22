import { getOrders, findOrder, addOrder, addReview, getSummary } from './_db.js';

function parseBody(req) {
  if (typeof req.body === 'object' && req.body !== null) {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      const params = new URLSearchParams(req.body);
      const obj = {};
      for (const [k, v] of params.entries()) {
        obj[k] = v;
      }
      return obj;
    }
  }
  return {};
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Parse path from URL or query
  const rawUrl = req.url || '';
  const urlPath = rawUrl.split('?')[0];

  // 1. Health check
  if (urlPath === '/api/health' || urlPath === '/health') {
    return res.status(200).json({ status: 'ok', service: 'avajet-vercel-serverless' });
  }

  // 2. Summary
  if (urlPath === '/api/summary' || urlPath === '/summary') {
    return res.status(200).json(getSummary());
  }

  // 3. Work Orders
  if (urlPath === '/api/work-orders' || urlPath === '/work-orders') {
    if (req.method === 'GET') {
      return res.status(200).json(getOrders());
    }
    if (req.method === 'POST') {
      const body = parseBody(req);
      if (!body.task || !body.aircraft) {
        return res.status(400).json({ error: 'Aircraft and task are required.' });
      }
      const created = addOrder(body);
      return res.status(201).json(created);
    }
  }

  // 4. Single Work Order or Review (/api/work-orders/:id or /api/work-orders/:id/review)
  const reviewMatch = urlPath.match(/\/work-orders\/([^/]+)\/review/);
  if (reviewMatch) {
    const id = decodeURIComponent(reviewMatch[1]);
    const body = parseBody(req);
    const updated = addReview(id, body);
    if (!updated) {
      return res.status(404).json({ error: 'Work order not found.' });
    }
    return res.status(200).json(updated);
  }

  const singleMatch = urlPath.match(/\/work-orders\/([^/]+)$/);
  if (singleMatch) {
    const id = decodeURIComponent(singleMatch[1]);
    const order = findOrder(id);
    if (!order) {
      return res.status(404).json({ error: 'Work order not found.' });
    }
    return res.status(200).json(order);
  }

  // Default fallback
  return res.status(200).json({
    service: 'AVAJET Aviation ERP API',
    endpoints: ['/api/summary', '/api/work-orders', '/api/health']
  });
}
