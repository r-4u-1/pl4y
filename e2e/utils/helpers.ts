/** Small, generic helpers shared across tests and page objects. */

export const uniqueId = (prefix = 'e2e') =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const uniqueEmail = (prefix = 'e2e') => `${uniqueId(prefix)}@example.test`;

export const isEnv = (env: 'ft' | 'st') => process.env.TEST_ENV === env;

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var ${name} (export it before running the tests)`);
  return value;
}

export const formatDate = (d: Date) => d.toISOString().slice(0, 10);
