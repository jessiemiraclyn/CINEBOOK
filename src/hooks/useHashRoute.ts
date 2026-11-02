import { useEffect, useState } from 'react';

export interface RouteState {
  path: string;
  segments: string[];
  params: URLSearchParams;
}

function readRoute(): RouteState {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [pathPart, query = ''] = raw.split('?');
  const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
  return {
    path,
    segments: path.split('/').filter(Boolean).map((segment) => decodeURIComponent(segment)),
    params: new URLSearchParams(query),
  };
}

export function useHashRoute(): RouteState {
  const [route, setRoute] = useState<RouteState>(readRoute);

  useEffect(() => {
    const handleChange = () => {
      setRoute(readRoute());
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', handleChange);
    return () => window.removeEventListener('hashchange', handleChange);
  }, []);

  return route;
}

export function navigate(to: string): void {
  window.location.hash = to;
}
