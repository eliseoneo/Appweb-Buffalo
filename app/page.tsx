import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Buffalo AI Dashboard
        </h1>
        <p className="text-gray-600 mb-8">
          Sistema de gestión multi-tenant
        </p>
        
        <Link 
          href="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 inline-block"
        >
          Iniciar Sesión
        </Link>
      </div>
    </div>
  )
}