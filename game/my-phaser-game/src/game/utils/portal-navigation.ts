export function getParentOriginFromQuery(defaultOrigin = 'http://localhost:4200'): string {
  const query = new URLSearchParams(window.location.search);
  const parentOrigin = query.get('parentOrigin');

  if (!parentOrigin) {
    return defaultOrigin;
  }

  try {
    const parsed = new URL(parentOrigin);
    return parsed.origin;
  } catch {
    return defaultOrigin;
  }
}

export function returnToWork(): void {
  const origin = getParentOriginFromQuery();
  const targetUrl = `${origin.replace(/\/+$/, '')}/game`;

  if (window.opener && !window.opener.closed) {
    try {
      window.opener.location.href = targetUrl;
      if (typeof window.opener.focus === 'function') {
        window.opener.focus();
      }
      window.close();
      return;
    } catch {
      // Fall through to same-tab redirect when opener is inaccessible.
    }
  }

  window.location.href = targetUrl;
}
