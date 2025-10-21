'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  ArrowLeft, 
  Building, 
  User, 
  Lock,
  CheckCircle,
  XCircle,
  Zap,
  Globe,
  Phone,
  MessageSquare,
  Bot,
  BarChart3,
  Database,
  Trash2
} from 'lucide-react'

// Componente del indicador de pasos
const StepIndicator = ({ currentStep, goToStep }: { currentStep: number, goToStep: (step: number) => void }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <button
            onClick={() => goToStep(step)}
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
              step === currentStep
                ? 'bg-buffalo-green border-buffalo-green text-white'
                : step < currentStep
                ? 'bg-green-100 border-green-500 text-green-700'
                : 'bg-gray-100 border-gray-300 text-gray-500'
            }`}
          >
            {step < currentStep ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              step
            )}
          </button>
          {step < 5 && (
            <div className={`w-8 h-1 mx-2 rounded ${
              step < currentStep ? 'bg-green-500' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
    <div className="flex justify-between mt-2 text-sm text-gray-600">
      <span>Información Básica</span>
      <span>Verticales</span>
      <span>Webhooks</span>
      <span>Columnas PostgreSQL</span>
      <span>Generar KPIs</span>
    </div>
  </div>
)

// Componente del Paso 1: Información Básica
const Step1 = ({ formData, handleInputChange }: { formData: any, handleInputChange: (field: string, value: string) => void }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <Building className="h-5 w-5 mr-2 text-buffalo-green" />
        Información Básica
      </h3>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Nombre de la Empresa *
          </label>
          <input
            type="text"
            value={formData.nombreEmpresa}
            onChange={(e) => handleInputChange('nombreEmpresa', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-buffalo-green focus:border-buffalo-green transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
            placeholder="Mi Empresa S.A."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            URL del Logo
          </label>
          <input
            type="url"
            value={formData.logoUrl}
            onChange={(e) => handleInputChange('logoUrl', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-buffalo-green focus:border-buffalo-green transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
            placeholder="https://ejemplo.com/logo.png"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Usuario *
          </label>
          <input
            type="text"
            value={formData.usuario}
            onChange={(e) => handleInputChange('usuario', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-buffalo-green focus:border-buffalo-green transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
            placeholder="mi_usuario"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Contraseña *
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-buffalo-green focus:border-buffalo-green transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
            placeholder="Contraseña segura"
            required
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Tipo de Cliente
          </label>
          <select
            value={formData.tipoCliente}
            onChange={(e) => handleInputChange('tipoCliente', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-buffalo-green focus:border-buffalo-green transition-all duration-200 bg-white text-gray-900"
          >
            <option value="directo">Cliente Directo</option>
            <option value="partnership-sergi">Partnership: Sergi</option>
            <option value="partnership-maria">Partnership: María</option>
            <option value="partnership-carlos">Partnership: Carlos</option>
          </select>
        </div>
      </div>
    </div>
  </div>
)

// Componente del Paso 2: Verticales
const Step2 = ({ formData, handleVerticalChange }: { formData: any, handleVerticalChange: (vertical: string) => void }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <Zap className="h-5 w-5 mr-2 text-buffalo-green" />
        Verticales (Servicios) *
      </h3>
      <p className="text-sm text-gray-600 mt-1">Selecciona al menos una vertical</p>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Llamadas */}
        <label className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-buffalo-green hover:bg-buffalo-green/5 cursor-pointer transition-all duration-200">
          <input
            type="checkbox"
            checked={formData.verticales.llamadas}
            onChange={() => handleVerticalChange('llamadas')}
            className="h-4 w-4 text-buffalo-green focus:ring-buffalo-green border-gray-300 rounded mr-3"
          />
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-buffalo-green mr-2" />
            <div>
              <div className="font-medium text-gray-900">Llamadas</div>
              <div className="text-sm text-gray-500">Agentes de voz</div>
            </div>
          </div>
        </label>

        {/* Texto/Chat */}
        <label className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-buffalo-green hover:bg-buffalo-green/5 cursor-pointer transition-all duration-200">
          <input
            type="checkbox"
            checked={formData.verticales.texto}
            onChange={() => handleVerticalChange('texto')}
            className="h-4 w-4 text-buffalo-green focus:ring-buffalo-green border-gray-300 rounded mr-3"
          />
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 text-buffalo-green mr-2" />
            <div>
              <div className="font-medium text-gray-900">Texto/Chat</div>
              <div className="text-sm text-gray-500">Agentes de texto</div>
            </div>
          </div>
        </label>

        {/* Automatizaciones */}
        <label className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-buffalo-green hover:bg-buffalo-green/5 cursor-pointer transition-all duration-200">
          <input
            type="checkbox"
            checked={formData.verticales.automatizaciones}
            onChange={() => handleVerticalChange('automatizaciones')}
            className="h-4 w-4 text-buffalo-green focus:ring-buffalo-green border-gray-300 rounded mr-3"
          />
          <div className="flex items-center">
            <Bot className="h-5 w-5 text-buffalo-green mr-2" />
            <div>
              <div className="font-medium text-gray-900">Automatizaciones</div>
              <div className="text-sm text-gray-500">Procesos automatizados</div>
            </div>
          </div>
        </label>
      </div>
    </div>
  </div>
)

// Componente del Paso 3: Webhooks
const Step3 = ({ formData, handleWebhookChange, getWebhookGroups }: { formData: any, handleWebhookChange: (webhook: string, value: string) => void, getWebhookGroups: () => any[] }) => (
  <div className="space-y-6">
    {getWebhookGroups().map((group, groupIndex) => {
      const IconComponent = group.icon
      return (
        <div key={groupIndex} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <IconComponent className="h-5 w-5 mr-2 text-buffalo-green" />
              {group.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              URLs para recibir notificaciones de {group.title.toLowerCase()}
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {group.webhooks.map((webhook: any) => (
                <div key={webhook.key}>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {webhook.label}
                  </label>
                  <input
                    type="url"
                    value={formData.webhooks[webhook.key as keyof typeof formData.webhooks]}
                    onChange={(e) => handleWebhookChange(webhook.key, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-buffalo-green focus:border-buffalo-green transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                    placeholder={webhook.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    })}
    
    {getWebhookGroups().length === 0 && (
      <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
        <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay webhooks disponibles</h3>
        <p className="text-gray-600">Selecciona al menos una vertical en el paso anterior para configurar webhooks</p>
      </div>
    )}
  </div>
)

// Componente del Paso 4: Columnas PostgreSQL
const Step4 = ({ formData, addColumna, updateColumna, removeColumna, limpiarColumnas, tiposDatos, aiPrompt, setAiPrompt, generarColumnasConIA, aiLoading }: { 
  formData: any, 
  addColumna: () => void, 
  updateColumna: (id: string, field: string, value: string) => void,
  removeColumna: (id: string) => void,
  limpiarColumnas: () => void,
  tiposDatos: any[],
  aiPrompt: string,
  setAiPrompt: (value: string) => void,
  generarColumnasConIA: () => void,
  aiLoading: boolean
}) => {
  const columnas = formData.columnasPostgres || []

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Database className="h-5 w-5 mr-2 text-buffalo-green" />
          Configurar Columnas de PostgreSQL
        </h3>
        <p className="text-sm text-gray-600 mt-1">Define las columnas que tendrán las tablas en PostgreSQL para este cliente</p>
      </div>
      
      <div className="p-6">
        {/* Sección de IA */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center mb-4">
            <Bot className="h-6 w-6 text-blue-600 mr-2" />
            <h4 className="text-lg font-semibold text-gray-900">Generar Columnas con IA</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Describe las columnas que necesitas y la IA las generará automáticamente
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción de las columnas
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-gray-900 placeholder-gray-500 resize-none"
                rows={4}
                placeholder="Ejemplo: Necesito una tabla de llamadas con fecha, número de teléfono, duración, resultado de la llamada, nombre del cliente y coste..."
                disabled={aiLoading}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={generarColumnasConIA}
                disabled={aiLoading || !aiPrompt.trim()}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                {aiLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generando...
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4 mr-2" />
                    Generar con IA
                  </>
                )}
              </button>
              
              <button
                onClick={limpiarColumnas}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpiar Todo
              </button>
            </div>
          </div>
        </div>

        {/* Lista de columnas */}
        <div className="space-y-4 mb-6">
          {aiLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-blue-600 font-medium">Generando columnas con IA...</span>
              </div>
              <p className="text-sm text-blue-500">Analizando tu descripción y creando la estructura de la base de datos</p>
            </div>
          )}
          
          {columnas.map((columna: any, index: number) => (
            <div key={columna.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Columna {index + 1}</h4>
                <button
                  onClick={() => removeColumna(columna.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la columna
                  </label>
                  <input
                    type="text"
                    value={columna.nombre}
                    onChange={(e) => updateColumna(columna.id, 'nombre', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-buffalo-green focus:border-buffalo-green text-sm bg-white text-gray-900 placeholder-gray-500"
                    placeholder="nombre_columna"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de dato
                  </label>
                  <select
                    value={columna.tipo}
                    onChange={(e) => updateColumna(columna.id, 'tipo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-buffalo-green focus:border-buffalo-green text-sm bg-white text-gray-900"
                  >
                    {tiposDatos.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción (opcional)
                  </label>
                  <input
                    type="text"
                    value={columna.descripcion}
                    onChange={(e) => updateColumna(columna.id, 'descripcion', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-buffalo-green focus:border-buffalo-green text-sm bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Descripción de la columna"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {columnas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Database className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No hay columnas configuradas</p>
              <p className="text-sm text-gray-400 mt-1">Agrega columnas para definir la estructura de las tablas</p>
            </div>
          )}
        </div>
        
        {/* Botones de acción */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={addColumna}
            className="flex items-center px-4 py-2 bg-buffalo-green text-white rounded-lg hover:bg-buffalo-green/90 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Columna
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente del Paso 5: Generar KPIs
const Step5 = ({ formData, generarKPIs, kpiLoading, kpiGenerated, kpiData }: { 
  formData: any, 
  generarKPIs: () => void,
  kpiLoading: boolean,
  kpiGenerated: boolean,
  kpiData: any
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-buffalo-green" />
          Generar KPIs
        </h3>
        <p className="text-sm text-gray-600 mt-1">Envía las columnas de PostgreSQL al sistema de n8n</p>
      </div>
      
      <div className="p-6">
        <div className="text-center">
          {kpiGenerated ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-center mb-3">
                  <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                  <span className="text-green-600 font-semibold text-lg">¡KPIs Generados!</span>
                </div>
                <p className="text-green-600 text-sm">
                  Se han generado {kpiData?.length || 0} KPIs basados en las columnas de PostgreSQL
                </p>
              </div>

              {/* Lista de KPIs generados */}
              {kpiData && kpiData.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 text-left">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 text-buffalo-green mr-2" />
                    KPIs Generados ({kpiData.length})
                  </h4>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {kpiData.map((kpi: any, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-semibold text-gray-900 text-sm">{kpi.titulo}</h5>
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                            {kpi.tipo_grafico}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-xs mb-3">{kpi.descripcion}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Inputs: {kpi.inputs?.join(', ') || 'N/A'}</span>
                          <span>Nº: {kpi.num_inputs}</span>
                        </div>
                        
                        {kpi.ejemplo && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                            <strong>Ejemplo:</strong> {kpi.ejemplo}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-600 mb-4">
                  Se enviarán las <strong>{(formData.columnasPostgres || []).length} columnas</strong> 
                  configuradas en el paso anterior al webhook de n8n.
                </p>
              </div>
              
              <button
                onClick={generarKPIs}
                disabled={kpiLoading}
                className="flex items-center justify-center mx-auto px-12 py-4 bg-buffalo-green text-white rounded-xl hover:bg-buffalo-green/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                {kpiLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Generando KPIs...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-6 w-6 mr-3" />
                    Generar KPIs
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CrearClientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [kpiLoading, setKpiLoading] = useState(false)
  const [kpiGenerated, setKpiGenerated] = useState(false)
  const [kpiData, setKpiData] = useState<any>(null)
  
  // Generar UUID del cliente al inicio
  const [clienteId] = useState(() => {
    const id = crypto.randomUUID()
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔑 GENERACIÓN DE UUID DEL CLIENTE')
    console.log('📍 Ubicación: Línea ~556 - useState initialization')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ UUID generado:', id)
    console.log('💡 Este UUID se usará en lugar de formData.usuario')
    console.log('💡 Será enviado como cliente_id en webhooks (AI, KPIs)')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    return id
  })

  const [formData, setFormData] = useState<any>({
    nombreEmpresa: '',
    logoUrl: '',
    usuario: '',
    password: '',
    tipoCliente: 'Directo',
    verticales: {
      llamadas: false,
      texto: false,
      automatizaciones: false
    },
    webhooks: {
      // Webhooks de Llamadas
      webhookLlamadasDashboard: '',
      webhookLlamadasProbar: '',
      webhookLlamadasCampaña: '',
      webhookLlamadasDatabase: '',
      // Webhooks de Texto
      webhookTextoDashboard: '',
      webhookTextoDatabase: '',
      // Webhooks de Automatizaciones
      webhookAutomatizacionesDashboard: ''
    },
    columnasPostgres: [] as any[]
  })

  // Log inicial al cargar el componente
  useEffect(() => {
    console.log('🎬 === PÁGINA CREAR CLIENTE INICIADA ===')
    console.log('🔑 UUID del Cliente:', clienteId)
    console.log('📍 Paso actual:', currentStep)
    console.log('📊 Total de pasos:', totalSteps)
    console.log('📋 FormData inicial:', formData)
    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📝 RESUMEN DE CAMBIOS IMPLEMENTADOS:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('1️⃣ UUID del Cliente:')
    console.log('   ❌ Antes: Generado en handleSubmit() con Date.now()')
    console.log('   ✅ Ahora: Generado al inicio con crypto.randomUUID()')
    console.log('   📍 Ubicación: Línea ~556')
    console.log('')
    console.log('2️⃣ cliente_id en AI Webhook:')
    console.log('   ❌ Antes: formData.usuario || "nuevo_cliente"')
    console.log('   ✅ Ahora: clienteId (UUID)')
    console.log('   📍 Ubicación: Línea ~705')
    console.log('')
    console.log('3️⃣ cliente_id en KPIs Webhook:')
    console.log('   ❌ Antes: NO se enviaba cliente_id')
    console.log('   ✅ Ahora: clienteId (UUID) incluido en payload')
    console.log('   📍 Ubicación: Línea ~866')
    console.log('')
    console.log('4️⃣ Columnas PostgreSQL:')
    console.log('   ❌ Antes: ID con Date.now() o ai_${Date.now()}_${index}')
    console.log('   ✅ Ahora: crypto.randomUUID()')
    console.log('   📍 Ubicación: Líneas ~640, ~750')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  }, [])

  // Opciones de tipo de cliente basadas en los partnerships existentes
  const tiposCliente = [
    { value: 'Directo', label: 'Cliente Directo' },
    { value: 'Partnership: Sergi', label: 'Partnership: Sergi' },
    { value: 'Partnership: María', label: 'Partnership: María' },
    { value: 'Partnership: Carlos', label: 'Partnership: Carlos' }
  ]

  // Tipos de datos de PostgreSQL
  const tiposDatos = [
    { value: 'VARCHAR(255)', label: 'VARCHAR(255) - Texto corto' },
    { value: 'TEXT', label: 'TEXT - Texto largo' },
    { value: 'INTEGER', label: 'INTEGER - Número entero' },
    { value: 'DECIMAL(10,2)', label: 'DECIMAL(10,2) - Número decimal' },
    { value: 'BOOLEAN', label: 'BOOLEAN - Verdadero/Falso' },
    { value: 'TIMESTAMP', label: 'TIMESTAMP - Fecha y hora' },
    { value: 'DATE', label: 'DATE - Solo fecha' },
    { value: 'JSONB', label: 'JSONB - Datos JSON' },
    { value: 'UUID', label: 'UUID - Identificador único' }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleVerticalChange = (vertical: string) => {
    setFormData((prev: any) => ({
      ...prev,
      verticales: {
        ...prev.verticales,
        [vertical]: !prev.verticales[vertical as keyof typeof prev.verticales]
      }
    }))
  }

  const handleWebhookChange = (webhook: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      webhooks: {
        ...prev.webhooks,
        [webhook]: value
      }
    }))
  }

  // Funciones para manejar columnas de PostgreSQL
  const addColumna = () => {
    const columnaId = crypto.randomUUID()
    console.log('🔑 UUID generado para columna manual:', columnaId)
    
    const nuevaColumna = {
      id: columnaId,
      nombre: '',
      tipo: 'VARCHAR(255)',
      descripcion: ''
    }
    
    setFormData((prev: any) => ({
      ...prev,
      columnasPostgres: [...prev.columnasPostgres, nuevaColumna]
    }))
  }

  const updateColumna = (id: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      columnasPostgres: prev.columnasPostgres.map((col: any) => 
        col.id === id ? { ...col, [field]: value } : col
      )
    }))
  }

  const removeColumna = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      columnasPostgres: prev.columnasPostgres.filter((col: any) => col?.id !== id)
    }))
  }

  const limpiarColumnas = () => {
    setFormData((prev: any) => ({
      ...prev,
      columnasPostgres: []
    }))
  }

  // Función para generar columnas con IA
  const generarColumnasConIA = async () => {
    console.log('🚀 === INICIO generarColumnasConIA ===')
    console.log('📝 AI Prompt (raw):', aiPrompt)
    console.log('🔑 Cliente ID (UUID):', clienteId)
    console.log('👤 Usuario:', formData.usuario)
    
    if (!aiPrompt.trim()) {
      setError('Por favor, describe las columnas que necesitas')
      return
    }

    setAiLoading(true)
    setError('')

    const payload = {
      prompt: aiPrompt,
      cliente_id: clienteId,  // ✅ CAMBIO: Antes usaba formData.usuario, ahora usa UUID
      timestamp: new Date().toISOString()
    }

    console.log('📤 AI Columns - Payload enviado:', payload)
    console.log('📤 AI Columns - Payload JSON:', JSON.stringify(payload, null, 2))
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔄 CAMBIO IMPLEMENTADO EN: generarColumnasConIA()')
    console.log('📍 Línea ~705: cliente_id value')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('❌ ANTES: cliente_id = formData.usuario || "nuevo_cliente"')
    console.log('   Valor:', formData.usuario || 'nuevo_cliente')
    console.log('')
    console.log('✅ AHORA: cliente_id = clienteId (UUID)')
    console.log('   Valor:', clienteId)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    try {
      const response = await fetch('https://n8n.agenciabuffalo.es/webhook/4929eca1-03c9-4847-bece-ba410c5ecb0c', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      console.log('📡 AI Columns - Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ AI Columns - Error response:', errorText)
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('📥 AI Columns - Data recibida (raw):', data)
      console.log('📥 AI Columns - Data JSON:', JSON.stringify(data, null, 2))
      console.log('📥 AI Columns - Data type:', Array.isArray(data) ? 'Array' : typeof data)
      console.log('📥 AI Columns - Array length:', Array.isArray(data) ? data.length : 'N/A')
      
      // Manejar la estructura del webhook: array con objeto que contiene success y columnas
      let columnasData = null
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('✅ Detectado formato Array - tomando primer elemento')
        columnasData = data[0]
        console.log('📦 data[0]:', columnasData)
      } else if (data.success && data.columnas) {
        console.log('✅ Detectado formato Objeto directo')
        columnasData = data
      } else {
        console.warn('⚠️ No se detectó ningún formato válido')
      }
      
      console.log('🔍 AI Columns - columnasData parseada:', columnasData)
      console.log('🔍 AI Columns - columnasData.success:', columnasData?.success)
      console.log('🔍 AI Columns - columnasData.columnas:', columnasData?.columnas)
      console.log('🔍 AI Columns - columnas es Array?:', Array.isArray(columnasData?.columnas))
      
      if (columnasData && columnasData.success && columnasData.columnas && Array.isArray(columnasData.columnas)) {
        console.log('✅ VALIDACIÓN EXITOSA - Procesando columnas...')
        console.log('📊 Número de columnas recibidas:', columnasData.columnas.length)
        
        // Convertir las columnas de la IA al formato esperado
        const columnasGeneradas = columnasData.columnas.map((col: any, index: number) => {
          const columnaId = crypto.randomUUID()
          
          console.log(`  ➡️ Columna ${index + 1}:`, {
            id: columnaId,
            nombre: col.nombre,
            tipo: col.tipo,
            descripcion: col.descripcion
          })
          
          return {
            id: columnaId,
            nombre: col.nombre || `columna_${index + 1}`,
            tipo: col.tipo || 'VARCHAR(255)',
            descripcion: col.descripcion || ''
          }
        })

        console.log('✅ AI Columns - Columnas generadas (completo):', columnasGeneradas)
        console.log('✅ AI Columns - Total columnas generadas:', columnasGeneradas.length)
        console.log('🔑 AI Columns - Todas las columnas usan UUID como ID')

        // Reemplazar las columnas existentes con las generadas por IA
        setFormData((prev: any) => ({
          ...prev,
          columnasPostgres: columnasGeneradas
        }))

        console.log('💾 Estado actualizado - formData.columnasPostgres actualizado')
        
        setSuccess(`¡Excelente! Se generaron ${columnasGeneradas.length} columnas automáticamente con IA`)
        setAiPrompt('') // Limpiar el prompt
        
        console.log('🎉 === FIN generarColumnasConIA (EXITOSO) ===')
        
        // Mostrar mensaje de éxito por 5 segundos
        setTimeout(() => {
          setSuccess('')
        }, 5000)
      } else {
        console.error('❌ AI Columns - Formato inválido. columnasData:', columnasData)
        console.error('❌ AI Columns - Validación fallida:')
        console.error('   - columnasData existe?:', !!columnasData)
        console.error('   - columnasData.success?:', columnasData?.success)
        console.error('   - columnasData.columnas existe?:', !!columnasData?.columnas)
        console.error('   - columnas es Array?:', Array.isArray(columnasData?.columnas))
        throw new Error('Formato de respuesta inválido del servicio de IA')
      }
    } catch (error: any) {
      console.error('❌ AI Columns - Error capturado:', error)
      console.error('❌ AI Columns - Error message:', error.message)
      console.error('❌ AI Columns - Error stack:', error.stack)
      console.error('💥 === FIN generarColumnasConIA (ERROR) ===')
      setError(`Error al generar columnas con IA: ${error.message || 'Error desconocido'}`)
    } finally {
      console.log('🔄 AI Loading set to false')
      setAiLoading(false)
    }
  }

  // Función para generar KPIs
  const generarKPIs = async () => {
    console.log('🚀 === INICIO generarKPIs ===')
    console.log('🔑 Cliente ID (UUID):', clienteId)
    console.log('📋 Columnas PostgreSQL disponibles:', formData.columnasPostgres)
    console.log('📋 Total columnas:', formData.columnasPostgres?.length || 0)
    
    setKpiLoading(true)
    setError('')

    try {
      // Preparar datos incluyendo cliente_id y columnas PostgreSQL
      const payload = {
        cliente_id: clienteId,  // ✅ CAMBIO: Ahora incluye el UUID del cliente
        columnas_postgres: formData.columnasPostgres || [],
        timestamp: new Date().toISOString()
      }

      console.log('📤 KPIs - Payload enviado:', payload)
      console.log('📤 KPIs - Payload JSON:', JSON.stringify(payload, null, 2))
      console.log('🌐 KPIs - Endpoint:', 'https://n8n.agenciabuffalo.es/webhook/2f61521d-08e1-43af-945e-f84669a809ff')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🔄 CAMBIO IMPLEMENTADO EN: generarKPIs()')
      console.log('📍 Línea ~866: Payload structure')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('❌ ANTES: Solo enviaba columnas_postgres y timestamp')
      console.log('   Payload: { columnas_postgres: [...], timestamp: "..." }')
      console.log('')
      console.log('✅ AHORA: Incluye cliente_id (UUID) del paso anterior')
      console.log('   Payload: { cliente_id: "' + clienteId + '", columnas_postgres: [...], timestamp: "..." }')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

      const response = await fetch('https://n8n.agenciabuffalo.es/webhook/2f61521d-08e1-43af-945e-f84669a809ff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      console.log('📡 KPIs - Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ KPIs - Error response:', errorText)
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('📥 KPIs - Data recibida (raw):', data)
      console.log('📥 KPIs - Data JSON:', JSON.stringify(data, null, 2))
      console.log('📥 KPIs - Data type:', Array.isArray(data) ? 'Array' : typeof data)
      console.log('📥 KPIs - Array length:', Array.isArray(data) ? data.length : 'N/A')
      
      // Manejar la estructura del webhook: array con objeto que contiene success y kpis
      let kpiResponse = null
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('✅ Detectado formato Array - tomando primer elemento')
        kpiResponse = data[0]
        console.log('📦 data[0]:', kpiResponse)
      } else if (data.success && data.kpis) {
        console.log('✅ Detectado formato Objeto directo')
        kpiResponse = data
      } else {
        console.warn('⚠️ No se detectó ningún formato válido')
      }
      
      console.log('🔍 KPIs - kpiResponse parseada:', kpiResponse)
      console.log('🔍 KPIs - kpiResponse.success:', kpiResponse?.success)
      console.log('🔍 KPIs - kpiResponse.kpis:', kpiResponse?.kpis)
      console.log('🔍 KPIs - kpis es Array?:', Array.isArray(kpiResponse?.kpis))
      
      if (kpiResponse && kpiResponse.success && kpiResponse.kpis && Array.isArray(kpiResponse.kpis)) {
        console.log('✅ VALIDACIÓN EXITOSA - Procesando KPIs...')
        console.log('📊 Número de KPIs recibidos:', kpiResponse.kpis.length)
        
        // Mostrar cada KPI
        kpiResponse.kpis.forEach((kpi: any, index: number) => {
          console.log(`  ➡️ KPI ${index + 1}:`, {
            titulo: kpi.titulo,
            tipo_grafico: kpi.tipo_grafico,
            descripcion: kpi.descripcion,
            inputs: kpi.inputs,
            num_inputs: kpi.num_inputs
          })
        })
        
        console.log('✅ KPIs - Total KPIs generados:', kpiResponse.kpis.length)
        
        setKpiData(kpiResponse.kpis)
        setKpiGenerated(true)
        
        console.log('💾 Estado actualizado - kpiData y kpiGenerated actualizados')
        
        setSuccess(`¡KPIs generados exitosamente! Se han creado ${kpiResponse.kpis.length} KPIs para el cliente.`)
        
        console.log('🎉 === FIN generarKPIs (EXITOSO) ===')
        
        // Mostrar mensaje de éxito por 5 segundos
        setTimeout(() => {
          setSuccess('')
        }, 5000)
      } else {
        console.error('❌ KPIs - Formato inválido. kpiResponse:', kpiResponse)
        console.error('❌ KPIs - Validación fallida:')
        console.error('   - kpiResponse existe?:', !!kpiResponse)
        console.error('   - kpiResponse.success?:', kpiResponse?.success)
        console.error('   - kpiResponse.kpis existe?:', !!kpiResponse?.kpis)
        console.error('   - kpis es Array?:', Array.isArray(kpiResponse?.kpis))
        throw new Error('Formato de respuesta inválido del servicio de KPIs')
      }
    } catch (error: any) {
      console.error('❌ KPIs - Error capturado:', error)
      console.error('❌ KPIs - Error message:', error.message)
      console.error('❌ KPIs - Error stack:', error.stack)
      console.error('💥 === FIN generarKPIs (ERROR) ===')
      setError(`Error al generar KPIs: ${error.message || 'Error desconocido'}`)
    } finally {
      console.log('🔄 KPI Loading set to false')
      setKpiLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      setError('')
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      console.log(`⬅️ === NAVEGACIÓN ATRÁS: Paso ${currentStep} → Paso ${currentStep - 1} ===`)
      setCurrentStep(currentStep - 1)
      setError('')
      console.log(`✅ Regresando al paso ${currentStep - 1}`)
    } else {
      console.log('⚠️ Ya estás en el primer paso')
    }
  }

  const goToStep = (step: number) => {
    console.log(`🎯 === NAVEGACIÓN DIRECTA: Paso ${currentStep} → Paso ${step} ===`)
    setCurrentStep(step)
    setError('')
    console.log(`✅ Saltando directamente al paso ${step}`)
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1: // Información básica
        if (!formData.nombreEmpresa || !formData.usuario || !formData.password) {
          setError('Por favor completa todos los campos obligatorios')
          return false
        }
        return true
      
      case 2: // Verticales
        const verticalesSeleccionadas = Object.values(formData.verticales).some(v => v)
        if (!verticalesSeleccionadas) {
          setError('Debes seleccionar al menos una vertical (Llamadas, Texto/Chat o Automatizaciones)')
          return false
        }
        return true
      
      case 3: // Webhooks (opcional, siempre válido)
        return true
      
      default:
        return true
    }
  }

  const handleNext = () => {
    console.log(`🔄 === NAVEGACIÓN: Paso ${currentStep} → Paso ${currentStep + 1} ===`)
    
    // Mostrar datos del paso actual antes de avanzar
    switch(currentStep) {
      case 1:
        console.log('📋 Paso 1 (Información Básica) completado:')
        console.log('   - Cliente ID (UUID):', clienteId)
        console.log('   - Nombre Empresa:', formData.nombreEmpresa)
        console.log('   - Logo URL:', formData.logoUrl || '(no configurado)')
        console.log('   - Usuario:', formData.usuario)
        console.log('   - Password:', formData.password ? '****** (configurado)' : '(no configurado)')
        console.log('   - Tipo Cliente:', formData.tipoCliente)
        console.log('   ✅ Este UUID se usará en todo el proceso (AI, KPIs, creación final)')
        break
      
      case 2:
        console.log('📋 Paso 2 (Verticales) completado:')
        console.log('   - Llamadas:', formData.verticales.llamadas ? '✅' : '❌')
        console.log('   - Texto/Chat:', formData.verticales.texto ? '✅' : '❌')
        console.log('   - Automatizaciones:', formData.verticales.automatizaciones ? '✅' : '❌')
        const verticalesActivas = Object.keys(formData.verticales).filter(k => formData.verticales[k])
        console.log('   - Total verticales activas:', verticalesActivas.length)
        break
      
      case 3:
        console.log('📋 Paso 3 (Webhooks) completado:')
        const webhooksConfigurados = Object.keys(formData.webhooks).filter(k => formData.webhooks[k])
        console.log('   - Webhooks configurados:', webhooksConfigurados.length)
        if (webhooksConfigurados.length > 0) {
          webhooksConfigurados.forEach(key => {
            console.log(`     • ${key}:`, formData.webhooks[key])
          })
        } else {
          console.log('   - No se configuraron webhooks')
        }
        break
      
      case 4:
        console.log('📋 Paso 4 (Columnas PostgreSQL) completado:')
        console.log('   - Total columnas:', formData.columnasPostgres?.length || 0)
        if (formData.columnasPostgres && formData.columnasPostgres.length > 0) {
          formData.columnasPostgres.forEach((col: any, index: number) => {
            console.log(`     ${index + 1}. ${col.nombre} (${col.tipo}) - ID: ${col.id}`)
          })
        }
        break
    }
    
    // Permitir navegación libre sin validaciones
    nextStep()
    
    console.log(`✅ Navegación completada. Ahora en paso ${currentStep + 1}`)
  }


  // Función para determinar qué grupos de webhooks mostrar según las verticales seleccionadas
  const getWebhookGroups = () => {
    const groups = []
    
    if (formData.verticales.llamadas) {
      groups.push({
        title: 'Webhooks de Llamadas',
        icon: Phone,
        webhooks: [
          { key: 'webhookLlamadasDashboard', label: 'Webhook Dashboard', placeholder: 'https://api.ejemplo.com/webhook/llamadas/dashboard' },
          { key: 'webhookLlamadasProbar', label: 'Webhook Probar', placeholder: 'https://api.ejemplo.com/webhook/llamadas/probar' },
          { key: 'webhookLlamadasCampaña', label: 'Webhook Campaña', placeholder: 'https://api.ejemplo.com/webhook/llamadas/campaña' },
          { key: 'webhookLlamadasDatabase', label: 'Webhook Database', placeholder: 'https://api.ejemplo.com/webhook/llamadas/database' }
        ]
      })
    }
    
    if (formData.verticales.texto) {
      groups.push({
        title: 'Webhooks de Texto/Chat',
        icon: MessageSquare,
        webhooks: [
          { key: 'webhookTextoDashboard', label: 'Webhook Dashboard', placeholder: 'https://api.ejemplo.com/webhook/texto/dashboard' },
          { key: 'webhookTextoDatabase', label: 'Webhook Database', placeholder: 'https://api.ejemplo.com/webhook/texto/database' }
        ]
      })
    }
    
    if (formData.verticales.automatizaciones) {
      groups.push({
        title: 'Webhooks de Automatizaciones',
        icon: Bot,
        webhooks: [
          { key: 'webhookAutomatizacionesDashboard', label: 'Webhook Dashboard', placeholder: 'https://api.ejemplo.com/webhook/automatizaciones/dashboard' }
        ]
      })
    }
    
    return groups
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🚀 === INICIO handleSubmit (CREAR CLIENTE) ===')
    console.log('📋 FormData completo:', formData)
    
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('✅ Iniciando validaciones...')
      
      // Validaciones
      if (!formData.nombreEmpresa || !formData.usuario || !formData.password) {
        console.error('❌ Validación fallida: Campos obligatorios incompletos')
        setError('Por favor completa todos los campos obligatorios')
        return
      }
      console.log('✅ Campos obligatorios: OK')

      // Validar que al menos una vertical esté seleccionada
      const verticalesSeleccionadas = Object.values(formData.verticales).some(v => v)
      if (!verticalesSeleccionadas) {
        console.error('❌ Validación fallida: No hay verticales seleccionadas')
        setError('Debes seleccionar al menos una vertical (Llamadas, Texto/Chat o Automatizaciones)')
        return
      }
      console.log('✅ Verticales seleccionadas:', formData.verticales)

      // Crear cliente completo con UUID (ya generado al inicio)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🔄 CAMBIO IMPLEMENTADO EN: handleSubmit()')
      console.log('📍 Línea ~1118: nuevoCliente.id')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('❌ ANTES: id = Date.now() (timestamp)')
      console.log('   Ejemplo:', Date.now())
      console.log('')
      console.log('✅ AHORA: id = clienteId (UUID generado al inicio)')
      console.log('   Valor:', clienteId)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      
      const nuevoCliente = {
        id: clienteId,  // ✅ CAMBIO: Antes usaba Date.now(), ahora usa UUID
        nombreEmpresa: formData.nombreEmpresa,
        logoUrl: formData.logoUrl,
        usuario: formData.usuario,
        password: formData.password,
        tipoCliente: formData.tipoCliente,
        verticales: formData.verticales,
        webhooks: formData.webhooks,
        columnasPostgres: formData.columnasPostgres,
        kpisGenerados: kpiData,
        estado: 'Activo',
        fechaCreacion: new Date().toISOString()
      }

      console.log('📦 Objeto nuevoCliente creado:', nuevoCliente)
      console.log('📦 nuevoCliente JSON:', JSON.stringify(nuevoCliente, null, 2))
      console.log('📊 Resumen del cliente:')
      console.log('   - ID (UUID):', nuevoCliente.id)
      console.log('   - Empresa:', nuevoCliente.nombreEmpresa)
      console.log('   - Usuario:', nuevoCliente.usuario)
      console.log('   - Tipo:', nuevoCliente.tipoCliente)
      console.log('   - Verticales activas:', Object.keys(nuevoCliente.verticales).filter(k => nuevoCliente.verticales[k]))
      console.log('   - Columnas PostgreSQL:', nuevoCliente.columnasPostgres?.length || 0)
      console.log('   - KPIs generados:', nuevoCliente.kpisGenerados?.length || 0)
      console.log('   - Webhooks configurados:', Object.keys(nuevoCliente.webhooks).filter(k => nuevoCliente.webhooks[k]).length)

      // Aquí iría la llamada a la API para crear el cliente
      console.log('⚠️ NOTA: No hay endpoint configurado aún para crear cliente')
      console.log('⚠️ Endpoint sugerido: POST /api/clientes/create')
      console.log('📤 Payload que se enviaría:', nuevoCliente)
      
      // TODO: Descomentar cuando se implemente el endpoint
      /*
      const response = await fetch('/api/clientes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoCliente)
      })

      console.log('📡 Crear Cliente - Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Crear Cliente - Error response:', errorText)
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('📥 Crear Cliente - Data recibida:', data)
      */
      
      setSuccess('Cliente creado exitosamente')
      console.log('✅ Cliente creado exitosamente (simulado)')
      console.log('🎉 === FIN handleSubmit (EXITOSO) ===')
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        console.log('🔄 Redirigiendo a /admin/clientes...')
        router.push('/admin/clientes')
      }, 2000)

    } catch (error: any) {
      console.error('❌ Crear Cliente - Error capturado:', error)
      console.error('❌ Crear Cliente - Error message:', error.message)
      console.error('❌ Crear Cliente - Error stack:', error.stack)
      console.error('💥 === FIN handleSubmit (ERROR) ===')
      setError('Error al crear el cliente')
    } finally {
      console.log('🔄 Loading set to false')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 h-32 flex items-center justify-between px-8">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver
          </button>
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-buffalo-green rounded-xl flex items-center justify-center">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nuevo Cliente</h1>
              <p className="text-gray-600">Crear un nuevo cliente en el sistema</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Indicador de Pasos */}
        <StepIndicator currentStep={currentStep} goToStep={goToStep} />

        {/* Contenido del Paso Actual */}
        <div className="mb-8">
          {currentStep === 1 && <Step1 formData={formData} handleInputChange={handleInputChange} />}
          {currentStep === 2 && <Step2 formData={formData} handleVerticalChange={handleVerticalChange} />}
          {currentStep === 3 && <Step3 formData={formData} handleWebhookChange={handleWebhookChange} getWebhookGroups={getWebhookGroups} />}
          {currentStep === 4 && <Step4 formData={formData} addColumna={addColumna} updateColumna={updateColumna} removeColumna={removeColumna} limpiarColumnas={limpiarColumnas} tiposDatos={tiposDatos} aiPrompt={aiPrompt} setAiPrompt={setAiPrompt} generarColumnasConIA={generarColumnasConIA} aiLoading={aiLoading} />}
          {currentStep === 5 && <Step5 formData={formData} generarKPIs={generarKPIs} kpiLoading={kpiLoading} kpiGenerated={kpiGenerated} kpiData={kpiData} />}
        </div>

        {/* Navegación */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </button>

            <div className="flex space-x-4">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
              >
                Cancelar
              </button>
              
              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 text-sm font-semibold text-white bg-buffalo-green rounded-xl hover:bg-buffalo-green/90 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
                >
                  Siguiente
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 text-sm font-semibold text-white bg-buffalo-green rounded-xl hover:bg-buffalo-green/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Crear Cliente
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mensajes de Error y Éxito */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
