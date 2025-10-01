import clientesConfig from '../config/clientes.json';
import { ClienteConfig, MODULOS_DISPONIBLES } from '../types/cliente';

export function getClientConfig(clienteId: string): ClienteConfig | undefined {
  return clientesConfig.find(cliente => cliente.id === clienteId);
}

export function getAllClientes(): ClienteConfig[] {
  return clientesConfig;
}

export function getModulosActivos(clienteId: string) {
  const cliente = getClientConfig(clienteId);
  if (!cliente) return [];
  
  return cliente.modulos
    .map(moduloId => MODULOS_DISPONIBLES[moduloId])
    .filter(Boolean);
}

export function getGruposNavegacion(clienteId: string) {
  const cliente = getClientConfig(clienteId);
  if (!cliente || !cliente.grupos) {
    // Fallback: crear un grupo único con todos los módulos
    const modulos = getModulosActivos(clienteId);
    return { "Navegación": modulos };
  }
  
  const grupos: Record<string, any[]> = {};
  
  Object.entries(cliente.grupos).forEach(([grupoNombre, moduloIds]) => {
    grupos[grupoNombre] = moduloIds
      .map(moduloId => MODULOS_DISPONIBLES[moduloId])
      .filter(Boolean)
      .map(modulo => ({
        name: getSpecialModuleName(modulo.nombre),
        href: `/clientes/${clienteId}${modulo.ruta}`,
        icon: modulo.icono
      }));
  });
  
  return grupos;
}

function getSpecialModuleName(originalName: string): string {
  const nameMap: Record<string, string> = {
    'Dashboard': 'Dashboard',
    'Prueba del Sistema': 'Prueba',
    'Buscador': 'Buscar',
    'Base de Conocimiento': 'Knowledge',
    'Campañas': 'Campañas',
    'Texto/Chat': 'Texto/Chat',
    'Automatizaciones': 'Automatizaciones',
    'Incidencias': 'Incidencias',
    'Knowledge': 'Knowledge',
    'Prueba': 'Prueba',
    'Buscar': 'Buscar'
  };
  
  return nameMap[originalName] || originalName;
}

export function generateCSSVariables(cliente: ClienteConfig): string {
  return `
    :root {
      --primary: ${cliente.color};
      --primary-50: ${cliente.color}20;
      --primary-100: ${cliente.color}40;
      --primary-500: ${cliente.color};
      --primary-600: ${cliente.color}dd;
      --primary-700: ${cliente.color}bb;
      --primary-900: ${cliente.color}99;
    }
    
    [data-theme="${cliente.id}"] {
      --primary: ${cliente.color};
      --primary-50: ${cliente.color}20;
      --primary-100: ${cliente.color}40;
      --primary-500: ${cliente.color};
      --primary-600: ${cliente.color}dd;
      --primary-700: ${cliente.color}bb;
      --primary-900: ${cliente.color}99;
    }
  `;
}