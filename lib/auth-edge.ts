/**
 * Edge Runtime compatible JWT utilities
 * These functions work in Next.js Edge Runtime (middleware) which doesn't support Node.js crypto
 * Note: This does basic payload decoding without signature verification for performance in middleware
 * Full signature verification still happens in API routes using lib/auth.ts
 */

/**
 * Decode JWT token payload without signature verification
 * Suitable for middleware use - API routes should do full verification
 */
export function decodeToken(
  token: string | null | undefined
): { id: number; username: string; tipo_usuario: string; exp?: number } | null {
  // Validate token exists and is a string
  if (!token || typeof token !== 'string') {
    return null
  }

  // Trim whitespace
  const trimmedToken = token.trim()

  // Validate basic JWT format (should have 3 parts separated by dots)
  const parts = trimmedToken.split('.')
  if (parts.length !== 3) {
    return null
  }

  try {
    // Decode payload (second part of JWT)
    const payload = parts[1]
    
    // Base64 URL decode - handle padding
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '='
    }
    
    // Decode using Web API (available in Edge Runtime)
    const decodedPayload = atob(base64)
    
    // Parse JSON
    const parsed = JSON.parse(decodedPayload) as {
      id: number
      username: string
      tipo_usuario: string
      exp?: number
      iat?: number
    }

    // Check expiration
    if (parsed.exp) {
      const currentTime = Math.floor(Date.now() / 1000)
      if (parsed.exp < currentTime) {
        console.error('❌ Token expired')
        return null
      }
    }

    // Validate required fields
    if (!parsed.id || !parsed.username || !parsed.tipo_usuario) {
      return null
    }

    return {
      id: parsed.id,
      username: parsed.username,
      tipo_usuario: parsed.tipo_usuario,
      exp: parsed.exp,
    }
  } catch (error) {
    console.error('❌ Token decode failed:', error)
    return null
  }
}

