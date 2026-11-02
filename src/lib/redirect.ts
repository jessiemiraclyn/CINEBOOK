export function getSafeNextPath(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/';
  return value;
}

export function buildAuthHref(path: '/login' | '/signup', next: string): string {
  return next === '/' ? `#${path}` : `#${path}?next=${encodeURIComponent(next)}`;
}
