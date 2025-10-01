export interface ClienteConfig {
  id: string;
  nombre: string;
  logo: string;
  color: string;
  idioma: string;
  modulos: string[];
  grupos?: Record<string, string[]>;
}

export interface ModuloConfig {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  ruta: string;
}

export const MODULOS_DISPONIBLES: Record<string, ModuloConfig> = {
  dashboard: {
    id: 'dashboard',
    nombre: 'Dashboard',
    icono: 'Home',
    descripcion: 'Panel principal con KPIs y estadísticas',
    ruta: '/dashboard'
  },
  'dashboard-llamadas': {
    id: 'dashboard-llamadas',
    nombre: 'Dashboard',
    icono: 'Home',
    descripcion: 'Dashboard de Agentes de Llamadas',
    ruta: '/llamadas'
  },
  'dashboard-texto': {
    id: 'dashboard-texto',
    nombre: 'Dashboard',
    icono: 'Home',
    descripcion: 'Dashboard de Agentes de Texto/Chat',
    ruta: '/texto'
  },
  'dashboard-automatizaciones': {
    id: 'dashboard-automatizaciones',
    nombre: 'Dashboard',
    icono: 'Home',
    descripcion: 'Dashboard de Automatizaciones Internas',
    ruta: '/automatizaciones'
  },
  llamadas: {
    id: 'llamadas',
    nombre: 'Llamadas',
    icono: 'Phone',
    descripcion: 'Agentes de llamadas y campañas',
    ruta: '/llamadas'
  },
  texto: {
    id: 'texto',
    nombre: 'Texto/Chat',
    icono: 'MessageSquare',
    descripcion: 'Agentes de texto y chatbots',
    ruta: '/texto'
  },
  automatizaciones: {
    id: 'automatizaciones',
    nombre: 'Automatizaciones',
    icono: 'Bot',
    descripcion: 'Flujos de trabajo automáticos',
    ruta: '/automatizaciones'
  },
  incidencias: {
    id: 'incidencias',
    nombre: 'Incidencias',
    icono: 'AlertTriangle',
    descripcion: 'Gestión de incidencias y tickets',
    ruta: '/incidencias'
  },
  campanas: {
    id: 'campanas',
    nombre: 'Campañas',
    icono: 'Target',
    descripcion: 'Gestión de campañas de marketing',
    ruta: '/campanas'
  },
  knowledge: {
    id: 'knowledge',
    nombre: 'Knowledge',
    icono: 'BookOpen',
    descripcion: 'Base de conocimiento y documentación',
    ruta: '/knowledge'
  },
  prueba: {
    id: 'prueba',
    nombre: 'Prueba',
    icono: 'TestTube',
    descripcion: 'Formulario de prueba y testing',
    ruta: '/llamadas/prueba'
  },
  buscar: {
    id: 'buscar',
    nombre: 'Buscar',
    icono: 'Search',
    descripcion: 'Búsqueda de datos y registros',
    ruta: '/buscar'
  }
};
