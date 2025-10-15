import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log('🛡️ Middleware:', pathname)

  // Rutas públicas - permitir acceso
  if (pathname === '/' || pathname === '/login') {
    console.log('✅ Ruta pública, permitiendo acceso')
    return NextResponse.next()
  }

  // Obtener token de la cookie
  const token = request.cookies.get('auth-token')?.value
  console.log('🍪 Token en cookie:', token)

  // Si no hay token, redirigir al login
  if (!token) {
    console.log('❌ Sin token, redirigiendo a login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verificar token simple
  if (token === 'admin-token-123') {
    console.log('✅ Token admin válido')
    if (pathname.startsWith('/admin') || pathname.startsWith('/n8n-dashboard')) {
      return NextResponse.next()
    } else {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  if (token === 'cliente-token-123') {
    console.log('✅ Token cliente válido')
    if (pathname.startsWith('/cliente') || pathname.startsWith('/clientes/') || pathname.startsWith('/n8n-dashboard')) {
      return NextResponse.next()
    } else {
      // Redirigir al dashboard del cliente por defecto
      return NextResponse.redirect(new URL('/clientes/techcorp/dashboard', request.url))
    }
  }

  console.log('❌ Token inválido, redirigiendo a login')
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}