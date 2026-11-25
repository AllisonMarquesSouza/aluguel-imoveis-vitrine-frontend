import { useState } from 'react'

export default function PublicImage({ src, alt = '', className = '', fallbackClassName = '', fallback, loading = 'lazy' }) {
  const [unavailable, setUnavailable] = useState(false)
  if (!src || unavailable) return <span className={fallbackClassName} role={alt ? 'img' : undefined} aria-label={alt || undefined}>{fallback}</span>
  return <img className={className} src={src} alt={alt} loading={loading} onError={() => setUnavailable(true)} />
}
