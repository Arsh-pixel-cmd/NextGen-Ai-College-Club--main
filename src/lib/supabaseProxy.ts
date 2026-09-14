/**
 * Client helper for dispatching requests through the backend Supabase proxy
 * (/api/supabase) to protect upstream URLs and handle server-side token passing.
 */

const PROXY_BASE = '/api/supabase';

interface ProxyRequestOptions extends RequestInit {
  authToken?: string;
  prefer?: string;
}

/**
 * Dispatches an HTTP request through the local or serverless /api/supabase proxy.
 *
 * @param path The Supabase endpoint path (e.g. "rest/v1/blog_posts?select=*")
 * @param options Standard RequestInit options plus optional authToken & prefer headers
 */
export async function proxyFetch<T = unknown>(
  path: string,
  options: ProxyRequestOptions = {}
): Promise<{ data: T | null; error: Error | null; status: number }> {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const targetUrl = `${PROXY_BASE}/${cleanPath}`;

  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.method && options.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }

  if (options.authToken) {
    headers.set('Authorization', `Bearer ${options.authToken}`);
  }

  if (options.prefer) {
    headers.set('Prefer', options.prefer);
  }

  try {
    const response = await fetch(targetUrl, {
      ...options,
      headers,
    });

    const status = response.status;
    const contentType = response.headers.get('content-type') || '';

    if (!response.ok) {
      let errorMessage = `Proxy request failed with status ${status}`;
      try {
        const errJson = await response.json();
        errorMessage = errJson.message || errJson.error || errorMessage;
      } catch {
        const text = await response.text();
        if (text) errorMessage = text;
      }
      return { data: null, error: new Error(errorMessage), status };
    }

    if (contentType.includes('application/json')) {
      const data = (await response.json()) as T;
      return { data, error: null, status };
    }

    const textData = (await response.text()) as unknown as T;
    return { data: textData, error: null, status };
  } catch (err: unknown) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error(String(err)),
      status: 0,
    };
  }
}

/**
 * Helper to query a table through the proxy
 */
export async function proxyQuery<T = unknown>(table: string, queryParams: string = 'select=*') {
  return proxyFetch<T>(`rest/v1/${table}?${queryParams}`);
}
