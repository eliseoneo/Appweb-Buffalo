# 🦬 Buffalo AI Dashboard

Sistema de gestión multi-tenant para Buffalo AI que permite gestionar múltiples clientes de forma centralizada.

## 🚀 Características

- **Multi-tenant**: Cada cliente tiene su propio espacio personalizado
- **Panel de Administración**: Gestión completa de clientes y funcionalidades
- **Panel de Cliente**: Interfaz personalizada según funcionalidades habilitadas
- **Aplicaciones Generadas**: Creación automática de aplicaciones personalizadas
- **Métricas en Tiempo Real**: Dashboard con estadísticas y reportes
- **Autenticación Segura**: Sistema JWT con roles (admin/cliente)
- **Responsive Design**: Funciona perfectamente en móviles y escritorio

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT con bcrypt
- **Iconos**: Lucide React

## 📋 Prerrequisitos

- Node.js 18+
- PostgreSQL 12+
- npm o yarn

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd buffalo-ai-dashboard
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env.local`:

```env
DATABASE_URL="postgresql://buffalo_user:buffalo_password_2024@localhost:5432/buffalo_dashboard?schema=public"
JWT_SECRET="buffalo-ai-dashboard-2024-secret-key-change-in-production"
ADMIN_USERNAME="tu_usuario_admin"
ADMIN_PASSWORD="tu_contraseña_segura"
ADMIN_COMPANY="Tu Empresa"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4. Configurar base de datos

```bash
# Crear usuario, base de datos y poblar con datos
npm run db:setup
```

### 5. Ejecutar la aplicación

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm run build
npm start
```

## 🔑 Credenciales de Prueba

- **Admin**: `admin` / `admin123`
- **Cliente Startup**: `startup_demo` / `admin123`
- **Cliente Empresa**: `empresa_demo` / `admin123`

## 📁 Estructura del Proyecto

```
buffalo-ai-dashboard/
├── app/                    # Next.js App Router
│   ├── admin/             # Panel de administración
│   ├── api/               # API Routes
│   ├── login/             # Página de login
│   └── [cliente]/         # Rutas dinámicas de clientes
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configuración
├── types/                 # Tipos TypeScript
├── database/              # Scripts de base de datos
└── middleware.ts          # Middleware de autenticación
```

## 🎯 Funcionalidades

### Para Administradores
- ✅ Dashboard con estadísticas generales
- ✅ Gestión de clientes (crear, editar, eliminar)
- ✅ Control de funcionalidades por cliente
- ✅ Generación de aplicaciones personalizadas
- ✅ Métricas y reportes globales
- ✅ Configuración del sistema

### Para Clientes
- ✅ Dashboard personalizado
- ✅ Acceso a aplicaciones habilitadas
- ✅ Métricas propias
- ✅ Configuración personal

## 🔧 Scripts Disponibles

```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar en modo producción
npm run lint         # Ejecutar linter
npm run db:setup     # Configurar base de datos
npm run db:reset     # Resetear base de datos
```

## 🌐 URLs de la Aplicación

- **Inicio**: `http://localhost:3000`
- **Login**: `http://localhost:3000/login`
- **Admin**: `http://localhost:3000/admin`
- **Cliente**: `http://localhost:3000/[username]`

## 📊 Base de Datos

El sistema utiliza PostgreSQL con las siguientes tablas principales:

- `usuarios` - Usuarios del sistema (admins y clientes)
- `clientes` - Información específica de cada cliente
- `funcionalidades` - Funcionalidades disponibles
- `cliente_funcionalidades` - Permisos por cliente
- `aplicaciones` - Aplicaciones generadas
- `metricas` - Métricas y estadísticas
- `logs_auditoria` - Logs de auditoría

## 🔒 Seguridad

- Autenticación JWT con cookies httpOnly
- Contraseñas hasheadas con bcrypt
- Middleware de protección de rutas
- Validación de permisos por rol
- Logs de auditoría de todas las acciones

## 🎨 Diseño

- **Colores**: Verde Buffalo (#00C896) como color principal
- **Tipografía**: Inter (Google Fonts)
- **Componentes**: Tailwind CSS con componentes personalizados
- **Responsive**: Mobile-first design
- **Iconos**: Lucide React

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Configurar base de datos PostgreSQL
4. Desplegar

### Otras plataformas

- Netlify
- Railway
- Heroku
- AWS

## 📝 Desarrollo

### Agregar nueva funcionalidad

1. Crear componente en `components/`
2. Agregar tipos en `types/index.ts`
3. Crear API route en `app/api/`
4. Actualizar base de datos si es necesario

### Agregar nuevo cliente

1. Usar el panel de administración
2. O usar la función `sp_crear_cliente` en la base de datos

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico, contacta a [soporte@buffalo-ai.com](mailto:soporte@buffalo-ai.com)

---

**Buffalo AI** - Sistema de gestión multi-tenant
