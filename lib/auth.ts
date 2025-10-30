import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'buffalo-ai-dashboard-2024-secret-key-change-in-production'
const JWT_EXPIRES_IN = '24h'

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: { id: number; username: string; tipo_usuario: string }): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      tipo_usuario: user.tipo_usuario,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string | null | undefined): { id: number; username: string; tipo_usuario: string } | null {
  // Validate token exists and is a string
  if (!token || typeof token !== 'string') {
    console.error('❌ Token verification failed: Token is empty or invalid type')
    return null
  }

  // Trim whitespace
  const trimmedToken = token.trim()

  // Validate basic JWT format (should have 3 parts separated by dots)
  const parts = trimmedToken.split('.')
  if (parts.length !== 3) {
    console.error('❌ Token verification failed: Invalid JWT format (expected 3 parts separated by dots)')
    return null
  }

  try {
    const decoded = jwt.verify(trimmedToken, JWT_SECRET) as {
      id: number
      username: string
      tipo_usuario: string
    }
    return decoded
  } catch (error) {
    // Only log if it's not a JsonWebTokenError (which we already handle)
    if (error instanceof jwt.JsonWebTokenError) {
      console.error('❌ Token verification failed: JWT Error -', error.message)
    } else {
      console.error('❌ Token verification failed:', error)
    }
    return null
  }
}

