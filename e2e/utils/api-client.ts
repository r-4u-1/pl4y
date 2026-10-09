import { env } from '../config/env';

async function request<T>(method: 'GET' | 'POST', path: string, body?: unknown) {
  const res = await fetch(new URL(path, env.apiBaseURL), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(env.apiToken && { Authorization: `Bearer ${env.apiToken}` }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await res.text();
  let data: any = text;
  try { data = JSON.parse(text); } catch {}

  return { status: res.status, ok: res.ok, body: data as T };
}

export const api = {
  get: <T = any>(path: string, params: Record<string, string | number | boolean> = {}) =>
    request<T>('GET', `${path}?${new URLSearchParams(params as Record<string, string>)}`),
  post: <T = any>(path: string, body: unknown) => request<T>('POST', path, body),
};

export type ApiClient = typeof api;
