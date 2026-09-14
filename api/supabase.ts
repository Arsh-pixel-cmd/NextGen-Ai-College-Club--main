// Vercel Serverless Function Proxy for Supabase API requests
// Handles forwarding requests to the Supabase endpoint securely

interface ServerlessRequest {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  query?: Record<string, string | string[] | undefined>;
  body?: unknown;
}

interface ServerlessResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ServerlessResponse;
  json(body: unknown): void;
  send(body: string): void;
  end(): void;
}

export default async function handler(req: ServerlessRequest, res: ServerlessResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, apikey, authorization, prefer, x-client-info'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    res.status(500).json({ error: 'Supabase URL not configured on server' });
    return;
  }

  try {
    // Determine the target sub-path
    // Matches /api/supabase?path=rest/v1/... or forwarded URL
    let targetPath = '';
    if (req.query && req.query.path) {
      targetPath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
    } else {
      const host = typeof req.headers.host === 'string' ? req.headers.host : 'localhost';
      const url = new URL(req.url || '', `http://${host}`);
      targetPath = url.pathname.replace(/^\/api\/supabase\/?/, '');
    }

    // Build target URL
    const queryString = req.url && req.url.includes('?') ? req.url.split('?')[1] : '';
    // Strip our internal `path=` query parameter if present
    const cleanSearchParams = new URLSearchParams(queryString);
    cleanSearchParams.delete('path');
    const finalQuery = cleanSearchParams.toString();

    const normalizedTarget = targetPath.startsWith('/') ? targetPath.slice(1) : targetPath;
    const destUrl = `${supabaseUrl.replace(/\/$/, '')}/${normalizedTarget}${finalQuery ? `?${finalQuery}` : ''}`;

    // Prepare headers for Supabase
    const headers: Record<string, string> = {
      'apikey': supabaseKey || '',
      'Content-Type': typeof req.headers['content-type'] === 'string' ? req.headers['content-type'] : 'application/json',
    };

    if (typeof req.headers.authorization === 'string') {
      headers['authorization'] = req.headers.authorization;
    } else if (supabaseKey) {
      headers['authorization'] = `Bearer ${supabaseKey}`;
    }

    if (typeof req.headers.prefer === 'string') {
      headers['prefer'] = req.headers.prefer;
    }
    if (typeof req.headers['x-client-info'] === 'string') {
      headers['x-client-info'] = req.headers['x-client-info'];
    }

    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const upstreamResponse = await fetch(destUrl, fetchOptions);
    const contentType = upstreamResponse.headers.get('content-type') || '';
    
    // Forward upstream response status & headers
    res.status(upstreamResponse.status);

    if (contentType.includes('application/json')) {
      const data: unknown = await upstreamResponse.json();
      res.json(data);
    } else {
      const text = await upstreamResponse.text();
      res.send(text);
    }
  } catch (error: unknown) {
    console.error('[Supabase Proxy Error]:', error);
    const message = error instanceof Error ? error.message : 'Upstream connection failure';
    res.status(502).json({
      error: 'Failed to proxy request to Supabase',
      message,
    });
  }
}
