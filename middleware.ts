import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeToken } from './lib/auth-edge'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log('🛡️ Middleware:', pathname)

  // Rutas públicas - permitir acceso
  if (pathname === '/' || pathname === '/login') {
    console.log('✅ Ruta pública, permitiendo acceso')
    return NextResponse.next()
  }

  // API routes - let them handle their own authentication
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Obtener token de la cookie
  const token = request.cookies.get('auth-token')?.value

  // Si no hay token o está vacío, redirigir al login
  if (!token || token.trim().length === 0) {
    console.log('❌ Sin token, redirigiendo a login')
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth-token')
    return response
  }

  // Decode JWT token (basic validation for middleware)
  // Full signature verification happens in API routes
  const decoded = decodeToken(token)
  
  if (!decoded) {
    console.log('❌ Token inválido o expirado, redirigiendo a login')
    // Clear invalid token
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('auth-token')
    return response
  }

  // Route based on user type
  if (decoded.tipo_usuario === 'admin') {
    console.log('✅ Usuario admin autenticado:', decoded.username)
    if (pathname.startsWith('/admin') || pathname.startsWith('/n8n-dashboard')) {
      return NextResponse.next()
    } else {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  if (decoded.tipo_usuario === 'cliente') {
    console.log('✅ Usuario cliente autenticado:', decoded.username)
    if (pathname.startsWith('/cliente') || pathname.startsWith('/clientes/') || pathname.startsWith('/n8n-dashboard')) {
      return NextResponse.next()
    } else {
      // Redirigir al dashboard del cliente por defecto
      // TODO: Get cliente_id from token or database for better routing
      return NextResponse.redirect(new URL('/clientes/techcorp/dashboard', request.url))
    }
  }

  console.log('❌ Tipo de usuario no válido, redirigiendo a login')
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}