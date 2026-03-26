const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, '') ?? ''

export function getApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return rawApiBaseUrl ? `${rawApiBaseUrl}${normalizedPath}` : normalizedPath
}
