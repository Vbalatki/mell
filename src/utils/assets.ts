/**
 * Resolves an asset path to work in all environments:
 * - Local dev (localhost:3000)
 * - AI Studio preview
 * - GitHub Pages (e.g. /Mellstroy-Calendar/)
 * - Custom domain deployments
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const cleanBase = base.endsWith('/') ? base : `${base}/`;

  return `${cleanBase}${cleanPath}`;
}
