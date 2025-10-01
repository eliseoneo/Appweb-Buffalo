'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ClienteConfig } from '@/types/cliente'
import { getClientConfig } from '@/lib/cliente-utils'
import ClientHeader from '@/components/ClientHeader'
import FilterDropdowns from '@/components/FilterDropdowns'
import { useTranslation } from '@/lib/translations'
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts'

export default function TextoPage() {
  const { clienteId } = useParams()
  const [cliente, setCliente] = useState<ClienteConfig | null>(null)
  
  // Estados para filtros
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedCampaign, setSelectedCampaign] = useState('')
  const [selectedDateRange, setSelectedDateRange] = useState('Hoy')

  // Hook de traducción
  const { t } = useTranslation(selectedLanguage)

  useEffect(() => {
    const clienteData = getClientConfig(clienteId as string)
    if (clienteData) {
      setCliente(clienteData)
    }
  }, [clienteId])

  // Datos de KPIs
  const kpisData = {
    mensajesEnviados: 1548,
    mensajesRecibidos: 892,
    tiempoRespuesta: '2:15',
    conversacionesActivas: 24,
    satisfaccionPromedio: 4.7,
    resolucionPrimario: 78
  }

  // Datos para gráfico de líneas - Mensajes por día
  const mensajesData = [
    { dia: 'Lun', enviados: 245, recibidos: 189 },
    { dia: 'Mar', enviados: 298, recibidos: 167 },
    { dia: 'Mié', enviados: 201, recibidos: 223 },
    { dia: 'Jue', enviados: 287, recibidos: 156 },
    { dia: 'Vie', enviados: 334, recibidos: 201 },
    { dia: 'Sáb', enviados: 183, recibidos: 134 },
    { dia: 'Dom', enviados: 156, recibidos: 98 }
  ]

  // Datos para gráfico de pastel - Estados de conversación
  const estadosData = [
    { name: 'Resueltas', value: 65, color: '#22c55e' },
    { name: 'En Progreso', value: 25, color: '#f59e0b' },
    { name: 'Pendientes', value: 10, color: '#ef4444' }
  ]

  // Datos para gráfico de área - Tiempo de respuesta por hora
  const tiempoRespuestaData = [
    { hora: '09:00', promedio: 89, objetivo: 120 },
    { hora: '10:00', promedio: 112, objetivo: 120 },
    { hora: '11:00', promedio: 134, objetivo: 120 },
    { hora: '12:00', promedio: 156, objetivo: 120 },
    { hora: '13:00', promedio: 201, objetivo: 120 },
    { hora: '14:00', promedio: 87, objetivo: 120 },
    { hora: '15:00', promedio: 93, objetivo: 120 },
    { hora: '16:00', promedio: 108, objetivo: 120 },
    { hora: '17:00', promedio: 145, objetivo: 120 }
  ]

  // Datos para gráfico de barras - Mensajes por canal
  const canalesData = [
    { canal: 'WhatsApp', mensajes: 456 },
    { canal: 'Telegram', mensajes: 298 },
    { canal: 'Web Chat', mensajes: 234 },
    { canal: 'Facebook', mensajes: 123 },
    { canal: 'Instagram', mensajes: 89 },
    { canal: 'Email', mensajes: 67 }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ClientHeader 
        cliente={cliente} 
        title="Dashboard"
        subtitle="Agentes de Texto/Chat"
      />
      
      {/* Filtros debajo del header */}
      <div className="bg-gray-50 py-4">
        <div className="flex justify-center px-8">
          <FilterDropdowns
            selectedLanguage={selectedLanguage}
            selectedCampaign={selectedCampaign}
            selectedDateRange={selectedDateRange}
            onLanguageChange={setSelectedLanguage}
            onCampaignChange={setSelectedCampaign}
            onDateRangeChange={setSelectedDateRange}
            onClear={() => {
              setSelectedLanguage('all')
              setSelectedCampaign('')
              setSelectedDateRange('Hoy')
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8 space-y-8">
        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Mensajes Enviados */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-1.5 leading-tight">Mensajes Enviados</h3>
            <div className="text-2xl font-bold text-cyan-400 mb-2 leading-none">{kpisData.mensajesEnviados.toLocaleString()}</div>
            <p className="text-xs text-gray-500 leading-tight">Total del período</p>
          </div>

          {/* Mensajes Recibidos */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-1.5 leading-tight">Mensajes Recibidos</h3>
            <div className="text-2xl font-bold text-cyan-400 mb-2 leading-none">{kpisData.mensajesRecibidos.toLocaleString()}</div>
            <p className="text-xs text-gray-500 leading-tight">Consultas recibidas</p>
          </div>

          {/* Tiempo de Respuesta */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-1.5 leading-tight">Tiempo Respuesta</h3>
            <div className="text-2xl font-bold text-cyan-400 mb-2 leading-none">{kpisData.tiempoRespuesta}</div>
            <p className="text-xs text-gray-500 leading-tight">Promedio minutos</p>
          </div>

          {/* Conversaciones Activas */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-1.5 leading-tight">Conversaciones Activas</h3>
            <div className="text-2xl font-bold text-cyan-400 mb-2 leading-none">{kpisData.conversacionesActivas}</div>
            <p className="text-xs text-gray-500 leading-tight">En tiempo real</p>
          </div>

          {/* Satisfacción Promedio */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-1.5 leading-tight">Satisfacción</h3>
            <div className="text-2xl font-bold text-cyan-400 mb-2 leading-none">{kpisData.satisfaccionPromedio}/5</div>
            <p className="text-xs text-gray-500 leading-tight">Puntuación media</p>
          </div>

          {/* Resolución en Primer Contacto */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 text-center hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-1.5 leading-tight">Resolución 1er</h3>
            <div className="text-2xl font-bold text-cyan-400 mb-2 leading-none">{kpisData.resolucionPrimario}%</div>
            <p className="text-xs text-gray-500 leading-tight">Primer contacto</p>
          </div>
        </div>

        {/* ESTRUCTURA IDÉNTICA AL EJEMPLO HTML */}
        
        {/* Primera fila de gráficos - Estructura exacta del ejemplo HTML */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
          {/* Gráfico de Líneas - Resultados de Entrevistas */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-6">Resultados de entrevista por día</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { fecha: '19/09/2025', quiere: 0, noContacta: 4, noQuiere: 6 },
                { fecha: '20/09/2025', quiere: 9, noContacta: 15, noQuiere: 8 },
                { fecha: '21/09/2025', quiere: 0, noContacta: 1, noQuiere: 6 },
                { fecha: '22/09/2025', quiere: 0, noContacta: 0, noQuiere: 1 }
              ]}>
                <XAxis dataKey="fecha" />
                <YAxis domain={[0, 16]} />
                <Tooltip />
                <Line type="monotone" dataKey="quiere" stroke="#00bcd4" strokeWidth={2} name="Quiere entrevista" />
                <Line type="monotone" dataKey="noContacta" stroke="#ff9800" strokeWidth={2} name="No se puede contactar" />
                <Line type="monotone" dataKey="noQuiere" stroke="#d0465d" strokeWidth={2} name="No quiere entrevista" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Donut - Resultados */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-6">Resultados de entrevista</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Quiere entrevista', value: 21.2, color: '#00bcd4' },
                    { name: 'No quiere entrevista', value: 40.4, color: '#d0465d' },
                    { name: 'No se puede contactar', value: 38.5, color: '#ff9800' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  labelLine={false}
                  label={({ value }) => `${value}%`}
                >
                  {[
                    { name: 'Quiere entrevista', value: 21.2, color: '#00bcd4' },
                    { name: 'No quiere entrevista', value: 40.4, color: '#d0465d' },
                    { name: 'No se puede contactar', value: 38.5, color: '#ff9800' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tarjetas KPI Coloreadas - Como en el ejemplo HTML */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Ahorro actual */}
          <div className="p-4 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #0CC0DF, #0CC0DF)' }}>
            <div className="text-center">
              <div className="text-sm font-medium mb-2">Ahorro actual</div>
              <div className="text-2xl font-bold mb-2">€2,450</div>
              <div className="text-xs opacity-90">Media de costes que hubieras tenido con un sistema tradicional</div>
            </div>
          </div>

          {/* Ahorro acumulado */}
          <div className="p-4 rounded-xl bg-white border border-gray-200">
            <div className="text-center">
              <div className="text-sm font-medium mb-2 text-cyan-400">Ahorro acumulado</div>
              <div className="text-2xl font-bold mb-2 text-cyan-400">€14,850</div>
              <div className="text-xs text-gray-500">Ahorro acumulado desde el inicio del servicio</div>
            </div>
          </div>

          {/* Equivalencia operadores */}
          <div className="p-4 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #d0465d, #d0465d)' }}>
            <div className="text-center">
              <div className="text-sm font-medium mb-2">Equivalencia operadores</div>
              <div className="text-2xl font-bold mb-2">3.2</div>
              <div className="text-xs opacity-90">Mide el nº de operadores que hubieras necesitado</div>
            </div>
          </div>

          {/* Hora top */}
          <div className="p-4 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #3173bd, #3173bd)' }}>
            <div className="text-center">
              <div className="text-sm font-medium mb-2">Hora top</div>
              <div className="text-2xl font-bold mb-2">19:00</div>
              <div className="text-xs opacity-90">La hora con más éxito de llamadas contestadas</div>
            </div>
          </div>

          {/* Día Top */}
          <div className="p-4 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #0CC0DF, #0CC0DF)' }}>
            <div className="text-center">
              <div className="text-sm font-medium mb-2">Día Top</div>
              <div className="text-2xl font-bold mb-2">Martes</div>
              <div className="text-xs opacity-90">El día con más éxito de llamadas contestadas</div>
            </div>
          </div>

          {/* Entrevistas conseguidas */}
          <div className="p-4 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #3b3961, #3b3961)' }}>
            <div className="text-center">
              <div className="text-sm font-medium mb-2">Entrevistas conseguidas</div>
              <div className="text-2xl font-bold mb-2">9</div>
              <div className="text-xs opacity-90">El número de entrevistas que hemos concertado</div>
            </div>
          </div>
        </div>

        {/* Segunda fila - 2 gráficos 50% cada uno */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Número de llamadas por día */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-6">Número de llamadas por día</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mensajesData}>
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="enviados" stroke="#00bcd4" strokeWidth={2} name="Llamadas" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Duración media por día */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-6">Duración media por día (s)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mensajesData}>
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="recibidos" stroke="#ff9800" strokeWidth={2} name="Duración" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tercera fila - 1fr 2fr */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
          {/* Gráfico de Radar - Sentimiento del usuario */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-6">Sentimiento del usuario</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={[
                { aspecto: 'Positivo', A: 80, fullMark: 100 },
                { aspecto: 'Neutral', A: 40, fullMark: 100 },
                { aspecto: 'Negativo', A: 30, fullMark: 100 }
              ]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="aspecto" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                <Radar name="Sentimiento" dataKey="A" stroke="#00bcd4" fill="#00bcd4" fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Barras - Motivos de desconexión */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-6">Motivos de desconexión</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { motivo: 'Usuario cuelga', cantidad: 25 },
                { motivo: 'Agente cuelga', cantidad: 11 },
                { motivo: 'No hay respuesta', cantidad: 15 },
                { motivo: 'Ocupado', cantidad: 1 },
                { motivo: 'Tiempo máximo', cantidad: 0 }
              ]}>
                <XAxis dataKey="motivo" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 25]} />
                <Tooltip />
                <Bar dataKey="cantidad">
                  {[
                    { motivo: 'Usuario cuelga', cantidad: 25 },
                    { motivo: 'Agente cuelga', cantidad: 11 },
                    { motivo: 'No hay respuesta', cantidad: 15 },
                    { motivo: 'Ocupado', cantidad: 1 },
                    { motivo: 'Tiempo máximo', cantidad: 0 }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      index === 0 ? '#4a5568' : 
                      index === 1 ? '#ff9800' : 
                      index === 2 ? '#00bcd4' : 
                      index === 3 ? '#3182ce' : '#4299e1'
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cuarta fila - 3 gráficos iguales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Gráfico de Barras Horizontal - Antigüedad laboral */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-6">Antigüedad laboral</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { categoria: '< 1 año', cantidad: 0 },
                { categoria: '1-3 años', cantidad: 0.8 },
                { categoria: '3-10 años', cantidad: 0 },
                { categoria: '> 10 años', cantidad: 0.8 }
              ]} layout="horizontal">
                <XAxis type="number" domain={[0, 1]} />
                <YAxis dataKey="categoria" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#00bcd4" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico Gauge - Situación laboral */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-6">Situación laboral</h3>
            <div className="flex items-center justify-center h-64">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 200 120" className="w-full h-full">
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#00bcd4"
                    strokeWidth="20"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 92 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#d0465d"
                    strokeWidth="20"
                    strokeLinecap="round"
                  />
                  <line
                    x1="100"
                    y1="100"
                    x2="140"
                    y2="60"
                    stroke="#333"
                    strokeWidth="3"
                  />
                  <circle cx="100" cy="100" r="5" fill="#333" />
                </svg>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="text-2xl font-bold">40%</div>
                  <div className="text-sm text-gray-500">Trabaja</div>
                  <div className="text-sm text-gray-500">60% No trabaja</div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Barras Horizontal - Nivel de estudios */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-6">Nivel de estudios</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { nivel: 'Bachillerato', cantidad: 1 },
                { nivel: 'Estudios secundarios', cantidad: 0.5 },
                { nivel: 'Estudios superiores', cantidad: 8 },
                { nivel: 'Sin estudios oficiales', cantidad: 0 }
              ]} layout="horizontal">
                <XAxis type="number" domain={[0, 8]} />
                <YAxis dataKey="nivel" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="cantidad">
                  {[
                    { nivel: 'Bachillerato', cantidad: 1 },
                    { nivel: 'Estudios secundarios', cantidad: 0.5 },
                    { nivel: 'Estudios superiores', cantidad: 8 },
                    { nivel: 'Sin estudios oficiales', cantidad: 0 }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      index === 0 ? '#00bcd4' : 
                      index === 1 ? '#4a5568' : 
                      index === 2 ? '#3182ce' : '#gray'
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quinta fila - 2fr 1fr */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
          {/* Llamadas exitosas por día */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-6">Llamadas exitosas por día</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mensajesData}>
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="enviados" stroke="#22c55e" strokeWidth={2} name="Exitosas" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Preferencia de turno */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-6">Preferencia de turno</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Mañana', value: 45, color: '#00bcd4' },
                    { name: 'Tarde', value: 35, color: '#ff9800' },
                    { name: 'Noche', value: 20, color: '#d0465d' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {[
                    { name: 'Mañana', value: 45, color: '#00bcd4' },
                    { name: 'Tarde', value: 35, color: '#ff9800' },
                    { name: 'Noche', value: 20, color: '#d0465d' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico Extendido - Llamadas por hora a lo largo del tiempo */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:border-cyan-400 transition-all duration-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-6 text-center">Llamadas por hora a lo largo del tiempo</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={[
              { hora: '00', total: 0, exitosas: 0 },
              { hora: '01', total: 0, exitosas: 0 },
              { hora: '02', total: 0, exitosas: 0 },
              { hora: '03', total: 0, exitosas: 0 },
              { hora: '04', total: 0, exitosas: 0 },
              { hora: '05', total: 0, exitosas: 0 },
              { hora: '06', total: 0, exitosas: 0 },
              { hora: '07', total: 0, exitosas: 0 },
              { hora: '08', total: 0, exitosas: 0 },
              { hora: '09', total: 7, exitosas: 4 },
              { hora: '10', total: 2, exitosas: 1 },
              { hora: '11', total: 1, exitosas: 1 },
              { hora: '12', total: 12, exitosas: 1 },
              { hora: '13', total: 0, exitosas: 0 },
              { hora: '14', total: 5, exitosas: 0 },
              { hora: '15', total: 0, exitosas: 0 },
              { hora: '16', total: 0, exitosas: 0 },
              { hora: '17', total: 5, exitosas: 1 },
              { hora: '18', total: 0, exitosas: 0 },
              { hora: '19', total: 24, exitosas: 6 },
              { hora: '20', total: 0, exitosas: 0 },
              { hora: '21', total: 0, exitosas: 0 },
              { hora: '22', total: 0, exitosas: 0 },
              { hora: '23', total: 0, exitosas: 0 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hora" />
              <YAxis domain={[0, 25]} />
              <Tooltip 
                labelFormatter={(label) => `Hora: ${label}:00`}
                formatter={(value, name) => [value, name === 'total' ? 'Total' : 'Exitosas']}
              />
              <Line type="monotone" dataKey="total" stroke="#ff9800" strokeWidth={3} name="total" />
              <Line type="monotone" dataKey="exitosas" stroke="#00bcd4" strokeWidth={3} name="exitosas" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}