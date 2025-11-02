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
  Trash2,
  Activity,
  Download,
  Send
} from 'lucide-react'

// Componente del indicador de pasos
const StepIndicator = ({ currentStep, goToStep }: { currentStep: number, goToStep: (step: number) => void }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between">
      {[1, 2, 3, 4, 5, 6].map((step) => (
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
            {step < 6 && (
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
      <span>Preview Dashboard</span>
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
            <option value="Directo">Cliente Directo</option>
            {partnerships.map((partnership) => (
              <option key={partnership.id} value={`Partnership: ${partnership.nombre}`}>
                Partnership: {partnership.nombre}
              </option>
            ))}
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
        
        {columnas.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              ℹ️ Las columnas se guardan automáticamente cuando se generan con IA. Los JSON se pueden enviar via "Webhook Json".
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente del Paso 5: Generar KPIs
const Step5 = ({ formData, generarKPIs, kpiLoading, kpiGenerated, kpiData, enviarMapperViaWebhook, guardarMapperJSON, guardarSQLScriptsJSON }: { 
  formData: any, 
  generarKPIs: () => void,
  kpiLoading: boolean,
  kpiGenerated: boolean,
  kpiData: any,
  enviarMapperViaWebhook: () => void,
  guardarMapperJSON: () => void,
  guardarSQLScriptsJSON: () => void
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
                  Se han generado {kpiData?.total_kpis || kpiData?.kpis?.length || 0} KPIs basados en las columnas de PostgreSQL
                </p>
                {kpiData?.cliente_id && (
                  <p className="text-green-600 text-xs mt-2">
                    Cliente ID: {kpiData.cliente_id}
                  </p>
                )}
              </div>

              {/* Lista de KPIs generados */}
              {kpiData && kpiData.kpis && kpiData.kpis.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 text-left">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="h-5 w-5 text-buffalo-green mr-2" />
                    KPIs Generados ({kpiData.kpis.length})
                  </h4>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {kpiData.kpis.map((kpi: any, index: number) => (
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
              
              {/* Información de guardado automático */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-700 text-center font-medium mb-2">
                  ℹ️ Archivos guardados automáticamente:
                </p>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>✓ KPIs JSON (datos completos)</li>
                  <li>✓ Mapper Normalizado (relaciones columnas-KPIs con datos sintéticos)</li>
                  <li>✓ SQL Scripts (CREATE TABLE + Stored Procedure)</li>
                  <li>✓ Los JSON se pueden enviar via "Webhook Json"</li>
                </ul>
              </div>

              {/* Botones de acción adicionales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={guardarMapperJSON}
                  className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Mapper JSON
                </button>
                
                <button
                  onClick={guardarSQLScriptsJSON}
                  className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Descargar SQL Scripts
                </button>
                
                <button
                  onClick={enviarMapperViaWebhook}
                  className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar via Webhook Json
                </button>
              </div>

              {/* Información sobre webhooks Json */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Envío via Webhook Json
                </h4>
                <p className="text-xs text-green-700 mb-2">
                  El botón "Enviar via Webhook Json" enviará el mapper JSON a todos los webhooks configurados en el paso 3.
                </p>
                <ul className="text-xs text-green-600 space-y-1">
                  <li>• Se envía a todos los webhooks "Webhook Json" configurados</li>
                  <li>• Incluye mapper completo + columnas PostgreSQL + datos KPIs</li>
                  <li>• Método POST con Content-Type: application/json</li>
                  <li>• Respuesta detallada en consola del navegador</li>
                </ul>
              </div>
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

// Componente del Paso 6: Preview Dashboard
const Step6 = ({ formData, kpiData, clienteId }: { 
  formData: any,
  kpiData: any,
  clienteId: string
}) => {
  if (!kpiData || !kpiData.kpis) {
    console.warn('⚠️ Preview Dashboard: No hay KPIs para mostrar')
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
        <BarChart3 className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">KPIs no generados</h3>
        <p className="text-gray-600">Genera los KPIs en el paso anterior para ver el preview del dashboard</p>
      </div>
    )
  }

  const kpisIndividuales = kpiData.kpis.filter((kpi: any) => kpi.tipo_grafico === 'individual')
  const kpisLinea = kpiData.kpis.filter((kpi: any) => kpi.tipo_grafico === 'linea')
  const kpisBarras = kpiData.kpis.filter((kpi: any) => kpi.tipo_grafico.includes('barras'))
  const kpisDonut = kpiData.kpis.filter((kpi: any) => kpi.tipo_grafico === 'donut' || kpi.tipo_grafico === 'pie')

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 PREVIEW DASHBOARD - Paso 6')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🏢 Empresa:', formData.nombreEmpresa)
  console.log('🔑 Cliente ID:', clienteId)
  console.log('📊 KPIs por tipo:')
  console.log('   - Individuales:', kpisIndividuales.length, '(máx 3 mostrados)')
  console.log('   - Línea:', kpisLinea.length, '(máx 2 mostrados)')
  console.log('   - Barras:', kpisBarras.length, '(máx 2 mostrados)')
  console.log('   - Donut/Pie:', kpisDonut.length, '(máx 2 mostrados)')
  console.log('🎨 Diseño: n8n-dashboard style')
  console.log('📱 Responsive: ✅')
  console.log('   - Mobile: 1 columna')
  console.log('   - Tablet: 2 columnas')
  console.log('   - Desktop: 3-4 columnas')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  const colors = ['blue', 'green', 'purple', 'orange', 'red']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 -mx-4 sm:-mx-6 lg:-mx-8 -my-8 p-4 sm:p-6 lg:p-8">
      {/* Header - Estilo n8n-dashboard - RESPONSIVE */}
      <div className="bg-white border-b border-gray-200 shadow-sm rounded-xl mb-6 lg:mb-8">
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                {formData.nombreEmpresa || 'Cliente'} - Dashboard Preview
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Vista previa del dashboard con KPIs generados</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 sm:px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium text-green-700">Preview</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Info Row - RESPONSIVE */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Cliente ID:</span>
              <span className="font-mono text-gray-900 truncate">{clienteId.substring(0, 8)}...</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600">KPIs:</span>
              <span className="font-semibold text-gray-900">{kpiData.total_kpis || kpiData.kpis?.length || 0}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Columnas:</span>
              <span className="font-semibold text-gray-900">{formData.columnasPostgres?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row - RESPONSIVE: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {kpisIndividuales.slice(0, 3).map((kpi: any, index: number) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">{kpi.titulo}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {index === 0 ? '1,234' : index === 1 ? '145 seg' : '89%'}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">{kpi.descripcion?.substring(0, 50)}...</p>
                <div className="flex items-center gap-1 mt-2 text-xs sm:text-sm font-medium text-green-600">
                  <span>↑</span>
                  <span>+{12 + index * 3}% vs anterior</span>
                </div>
              </div>
              <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${
                index === 0 ? 'bg-blue-50 text-blue-600 border-blue-100' :
                index === 1 ? 'bg-green-50 text-green-600 border-green-100' :
                'bg-purple-50 text-purple-600 border-purple-100'
              }`}>
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1: Evolution Chart - Full Width - RESPONSIVE */}
      {kpisLinea.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{kpisLinea[0].titulo}</h3>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{kpisLinea[0].descripcion?.substring(0, 80)}...</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium self-start sm:self-center">Línea</span>
            </div>
            <div className="h-48 sm:h-56 md:h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border border-blue-200">
              <div className="text-center px-4">
                <Activity className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 mx-auto mb-3" />
                <p className="text-blue-700 text-sm sm:text-base font-semibold">Gráfico de Evolución</p>
                <p className="text-xs sm:text-sm text-blue-600 mt-2 break-words">Columnas: {kpisLinea[0].inputs?.join(', ')}</p>
                <p className="text-xs text-blue-500 mt-1">Datos simulados por día</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row 2: Donut Charts - RESPONSIVE */}
      {kpisDonut.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {kpisDonut.slice(0, 2).map((kpi: any, index: number) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{kpi.titulo}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{kpi.descripcion?.substring(0, 60)}...</p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium self-start sm:self-center">Donut</span>
              </div>
              <div className="h-48 sm:h-56 md:h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center border border-purple-200">
                <div className="text-center px-4">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-8 border-purple-400 border-t-purple-200 mx-auto mb-3"></div>
                  <p className="text-purple-700 text-sm sm:text-base font-semibold">Distribución</p>
                  <p className="text-xs sm:text-sm text-purple-600 mt-2 break-words">Columnas: {kpi.inputs?.join(', ')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts Row 3: Bar Charts - RESPONSIVE */}
      {kpisBarras.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {kpisBarras.slice(0, 2).map((kpi: any, index: number) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{kpi.titulo}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{kpi.descripcion?.substring(0, 60)}...</p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium self-start sm:self-center">
                  {kpi.tipo_grafico.includes('vertical') ? 'Barras V' : 'Barras H'}
                </span>
              </div>
              <div className="h-48 sm:h-56 md:h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center border border-green-200">
                <div className="text-center px-4">
                  <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-green-700 text-sm sm:text-base font-semibold">Gráfico de Comparación</p>
                  <p className="text-xs sm:text-sm text-green-600 mt-2 break-words">Columnas: {kpi.inputs?.join(', ')}</p>
                  <p className="text-xs text-green-500 mt-1">Rendimiento por categoría</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Banner - RESPONSIVE */}
      <div className="bg-gradient-to-r from-buffalo-green to-green-600 rounded-xl shadow-lg p-4 sm:p-6 text-white mb-4 sm:mb-6">
        <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">📊 Resumen del Dashboard</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
            <p className="text-green-100 text-xs sm:text-sm mb-1">Total KPIs</p>
            <p className="text-2xl sm:text-3xl font-bold">{kpiData.total_kpis || kpiData.kpis?.length || 0}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
            <p className="text-green-100 text-xs sm:text-sm mb-1">Columnas DB</p>
            <p className="text-2xl sm:text-3xl font-bold">{formData.columnasPostgres?.length || 0}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
            <p className="text-green-100 text-xs sm:text-sm mb-1">Gráficos</p>
            <p className="text-2xl sm:text-3xl font-bold">
              {kpiData.kpis?.filter((k: any) => k.tipo_grafico !== 'individual').length || 0}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
            <p className="text-green-100 text-xs sm:text-sm mb-1">Estado</p>
            <p className="text-2xl sm:text-3xl font-bold">✓ Listo</p>
          </div>
        </div>
      </div>

      {/* Info Note - RESPONSIVE */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">💡 Información del Preview</h3>
        <p className="text-sm sm:text-base text-blue-800 mb-3">
          Este es un preview simulado del dashboard. El dashboard real se generará al crear el cliente y se poblará con datos reales desde PostgreSQL.
        </p>
        <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
          <li>✓ Los gráficos mostrarán datos en tiempo real</li>
          <li>✓ Los KPIs se actualizarán automáticamente</li>
          <li>✓ Filtros por fecha, campaña e idioma disponibles</li>
          <li>✓ Análisis ML opcional para predicciones</li>
        </ul>
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
  const totalSteps = 6  // ✅ Cambiado de 5 a 6 para incluir preview dashboard
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [kpiLoading, setKpiLoading] = useState(false)
  const [kpiGenerated, setKpiGenerated] = useState(false)
  const [kpiData, setKpiData] = useState<any>(null)
  const [partnerships, setPartnerships] = useState<Array<{ id: number; nombre: string; slug: string }>>([])
  
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
      webhookLlamadasEnviarJson: '',
      // Webhooks de Texto
      webhookTextoDashboard: '',
      webhookTextoDatabase: '',
      webhookTextoEnviarJson: '',
      // Webhooks de Automatizaciones
      webhookAutomatizacionesDashboard: '',
      webhookAutomatizacionesEnviarJson: ''
    },
    columnasPostgres: [] as any[]
  })

  // Fetch partnerships from database
  useEffect(() => {
    const fetchPartnerships = async () => {
      try {
        const res = await fetch('/api/partnerships')
        const data = await res.json()
        if (data.success && data.partnerships) {
          setPartnerships(data.partnerships)
        }
      } catch (err) {
        console.error('Error fetching partnerships:', err)
      }
    }
    fetchPartnerships()
  }, [])

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
    console.log('4️⃣ KPIs - Estructura de Datos:')
    console.log('   ❌ Antes: Solo JSON en memoria')
    console.log('   ✅ Ahora: Preparados para tabla PostgreSQL con cliente_id')
    console.log('   📍 Ubicación: Línea ~965')
    console.log('   💾 Tabla: kpis (id, cliente_id, titulo, descripcion, ...)')
    console.log('')
    console.log('5️⃣ Columnas PostgreSQL:')
    console.log('   ❌ Antes: ID con Date.now() o ai_${Date.now()}_${index}')
    console.log('   ✅ Ahora: crypto.randomUUID()')
    console.log('   📍 Ubicación: Líneas ~640, ~750')
    console.log('')
    console.log('6️⃣ Datos Sintéticos en Mapper:')
    console.log('   ❌ Antes: default = null')
    console.log('   ✅ Ahora: Datos sintéticos inteligentes')
    console.log('   📍 Ubicación: Líneas ~1084-1165')
    console.log('   💡 Extrae ejemplos de descripción (\'ejemplo\', "ejemplo")')
    console.log('   💡 Fallback basado en tipo de columna y nombre')
    console.log('')
    console.log('7️⃣ Nuevo Paso 6: Preview Dashboard')
    console.log('   ✅ Diseño basado en n8n-dashboard')
    console.log('   ✅ Muestra KPIs por tipo (individual, línea, barras, donut)')
    console.log('   ✅ Diseño responsive (mobile, tablet, desktop)')
    console.log('   📍 Ubicación: Líneas ~569-789')
    console.log('')
    console.log('8️⃣ Webhooks Json:')
    console.log('   ✅ Agregado campo "Webhook Json" a cada vertical')
    console.log('   📍 Llamadas, Texto/Chat, Automatizaciones')
    console.log('')
    console.log('9️⃣ SQL Scripts Auto-generados:')
    console.log('   ✅ CREATE TABLE con comentarios')
    console.log('   ✅ Stored Procedure para INSERT')
    console.log('   ✅ Índices automáticos')
    console.log('   ✅ Ejemplo de uso incluido')
    console.log('   📍 Ubicación: Líneas ~1268-1505')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  }, [])

  // Opciones de tipo de cliente basadas en los partnerships existentes
  const tiposCliente = [
    { value: 'Directo', label: 'Cliente Directo' },
    ...partnerships.map(p => ({ 
      value: `Partnership: ${p.nombre}`, 
      label: `Partnership: ${p.nombre}` 
    }))
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

  // Función para guardar columnas PostgreSQL en archivo JSON
  const guardarColumnasJSON = () => {
    console.log('💾 === GUARDANDO COLUMNAS EN JSON ===')
    
    const columnasConClienteId = {
      cliente_id: clienteId,
      nombre_empresa: formData.nombreEmpresa || 'sin_nombre',
      timestamp: new Date().toISOString(),
      total_columnas: formData.columnasPostgres?.length || 0,
      columnas: formData.columnasPostgres || []
    }
    
    console.log('📦 Estructura a guardar:', columnasConClienteId)
    console.log('📊 Total columnas:', columnasConClienteId.total_columnas)
    console.log('🔑 Cliente ID:', columnasConClienteId.cliente_id)
    
    const dataStr = JSON.stringify(columnasConClienteId, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    
    const fileName = `columnas-${formData.nombreEmpresa || 'cliente'}-${clienteId.substring(0, 8)}.json`
    link.href = url
    link.download = fileName
    link.click()
    
    console.log('✅ Archivo JSON descargado:', fileName)
    console.log('📁 Guardar en proyecto: ./output/' + fileName)
    console.log('📄 Contenido del archivo:')
    console.log(dataStr)
    
    URL.revokeObjectURL(url)
  }

  // Función para guardar KPIs en archivo JSON
  const guardarKPIsJSON = () => {
    console.log('💾 === GUARDANDO KPIs EN JSON ===')
    
    if (!kpiData || !kpiData.kpis_tabla) {
      console.error('❌ No hay KPIs para guardar')
      setError('No hay KPIs generados para guardar')
      return
    }
    
    const kpisParaGuardar = {
      cliente_id: clienteId,
      nombre_empresa: formData.nombreEmpresa || 'sin_nombre',
      timestamp: kpiData.timestamp || new Date().toISOString(),
      total_kpis: kpiData.total_kpis || kpiData.kpis?.length || 0,
      kpis_display: kpiData.kpis, // Para visualización
      kpis_tabla: kpiData.kpis_tabla // Para inserción en PostgreSQL
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📦 ESTRUCTURA KPIs A GUARDAR')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔑 Cliente ID:', kpisParaGuardar.cliente_id)
    console.log('🏢 Nombre Empresa:', kpisParaGuardar.nombre_empresa)
    console.log('📊 Total KPIs:', kpisParaGuardar.total_kpis)
    console.log('📋 KPIs Display:', kpisParaGuardar.kpis_display.length, 'elementos')
    console.log('🗄️ KPIs Tabla:', kpisParaGuardar.kpis_tabla.length, 'registros')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    const dataStr = JSON.stringify(kpisParaGuardar, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    
    const fileName = `kpis-${formData.nombreEmpresa || 'cliente'}-${clienteId.substring(0, 8)}.json`
    link.href = url
    link.download = fileName
    link.click()
    
    console.log('✅ Archivo JSON descargado:', fileName)
    console.log('📁 Ubicación sugerida en proyecto: ./output/' + fileName)
    console.log('📁 También disponible en: ./crear_kpis_data.json (si deseas ese nombre)')
    console.log('')
    console.log('💡 Para guardar en el proyecto:')
    console.log('   1. Descarga el archivo desde el navegador')
    console.log('   2. Muévelo a: ./output/' + fileName)
    console.log('   3. O guárdalo como: ./crear_kpis_data.json')
    console.log('')
    console.log('📄 Contenido del archivo:')
    console.log(dataStr)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    URL.revokeObjectURL(url)
    setSuccess(`Archivo ${fileName} descargado exitosamente`)
  }

  // Función para extraer ejemplos de la descripción
  const extraerEjemploDeDescripcion = (descripcion: string): string | null => {
    if (!descripcion) return null
    
    // Buscar patrones como: 'ejemplo1', 'ejemplo2', 'ejemplo3'
    const matchQuotes = descripcion.match(/'([^']+)'/g)
    if (matchQuotes && matchQuotes.length > 0) {
      // Eliminar las comillas y tomar el primer ejemplo
      const primerEjemplo = matchQuotes[0].replace(/'/g, '')
      console.log(`   💡 Ejemplo extraído de descripción: "${primerEjemplo}"`)
      return primerEjemplo
    }
    
    // Buscar patrones como: "ejemplo1", "ejemplo2"
    const matchDoubleQuotes = descripcion.match(/"([^"]+)"/g)
    if (matchDoubleQuotes && matchDoubleQuotes.length > 0) {
      const primerEjemplo = matchDoubleQuotes[0].replace(/"/g, '')
      console.log(`   💡 Ejemplo extraído de descripción: "${primerEjemplo}"`)
      return primerEjemplo
    }
    
    return null
  }

  // Función para generar datos sintéticos basados en el tipo de dato
  const generarDatoSintetico = (tipo: string, nombreColumna: string, descripcion?: string) => {
    const tipoUpper = tipo.toUpperCase()
    
    // Intentar extraer ejemplo de la descripción primero
    if (descripcion && (tipoUpper.includes('VARCHAR') || tipoUpper.includes('TEXT'))) {
      const ejemploExtraido = extraerEjemploDeDescripcion(descripcion)
      if (ejemploExtraido) {
        return ejemploExtraido
      }
    }
    
    // Lógica basada en tipo de dato
    if (tipoUpper.includes('VARCHAR') || tipoUpper.includes('TEXT')) {
      if (nombreColumna.includes('nombre')) return 'Juan Pérez'
      if (nombreColumna.includes('telefono') || nombreColumna.includes('phone')) return '+34 612 345 678'
      if (nombreColumna.includes('email')) return 'ejemplo@empresa.com'
      if (nombreColumna.includes('ejecutor')) return 'Ana García'
      if (nombreColumna.includes('conversacion')) return 'Cliente pregunta por servicios disponibles. Agente explica opciones y precios.'
      if (nombreColumna.includes('transcripcion')) return 'Transcripción de ejemplo de la llamada...'
      return 'Texto de ejemplo'
    }
    
    if (tipoUpper.includes('INTEGER') || tipoUpper.includes('INT')) {
      if (nombreColumna.includes('tiempo') || nombreColumna.includes('duracion')) return 120
      if (nombreColumna.includes('total')) return 150
      if (nombreColumna.includes('cantidad')) return 45
      return 100
    }
    
    if (tipoUpper.includes('DECIMAL') || tipoUpper.includes('NUMERIC') || tipoUpper.includes('FLOAT')) {
      if (nombreColumna.includes('precio') || nombreColumna.includes('cost') || nombreColumna.includes('costo')) return 0.45
      if (nombreColumna.includes('porcentaje')) return 85.5
      return 123.45
    }
    
    if (tipoUpper.includes('BOOLEAN') || tipoUpper.includes('BOOL')) {
      return true
    }
    
    if (tipoUpper.includes('TIMESTAMP') || tipoUpper.includes('DATETIME')) {
      return new Date().toISOString()
    }
    
    if (tipoUpper.includes('DATE')) {
      return new Date().toISOString().split('T')[0]
    }
    
    if (tipoUpper.includes('UUID')) {
      return crypto.randomUUID()
    }
    
    if (tipoUpper.includes('JSON')) {
      return { ejemplo: 'dato', valor: 123 }
    }
    
    return null
  }

  // Función para generar ejemplo SQL basado en tipo de dato
  const generarEjemploSQL = (tipo: string, nombreColumna: string, descripcion?: string) => {
    const ejemploValor = generarDatoSintetico(tipo, nombreColumna, descripcion)
    
    if (ejemploValor === null) return 'NULL'
    
    const tipoUpper = tipo.toUpperCase()
    
    if (tipoUpper.includes('VARCHAR') || tipoUpper.includes('TEXT')) {
      return `'${ejemploValor}'`
    }
    
    if (tipoUpper.includes('INTEGER') || tipoUpper.includes('INT')) {
      return ejemploValor.toString()
    }
    
    if (tipoUpper.includes('DECIMAL') || tipoUpper.includes('NUMERIC') || tipoUpper.includes('FLOAT')) {
      return ejemploValor.toString()
    }
    
    if (tipoUpper.includes('BOOLEAN') || tipoUpper.includes('BOOL')) {
      return ejemploValor ? 'TRUE' : 'FALSE'
    }
    
    if (tipoUpper.includes('TIMESTAMP') || tipoUpper.includes('DATETIME')) {
      return `'${ejemploValor}'::timestamp`
    }
    
    if (tipoUpper.includes('DATE')) {
      return `'${ejemploValor}'::date`
    }
    
    if (tipoUpper.includes('UUID')) {
      return `'${ejemploValor}'::uuid`
    }
    
    if (tipoUpper.includes('JSON')) {
      return `'${JSON.stringify(ejemploValor)}'::jsonb`
    }
    
    return 'NULL'
  }

  // Función para crear mapper normalizado desde columnas y KPIs
  const crearMapperNormalizado = () => {
    console.log('🔄 === CREANDO MAPPER NORMALIZADO ===')
    
    if (!formData.columnasPostgres || formData.columnasPostgres.length === 0) {
      console.error('❌ No hay columnas para normalizar')
      return null
    }
    
    if (!kpiData || !kpiData.kpis_tabla) {
      console.error('❌ No hay KPIs para normalizar')
      return null
    }
    
    // Crear estructura normalizada para mapper
    const mapperNormalizado = {
      metadata: {
        cliente_id: clienteId,
        nombre_empresa: formData.nombreEmpresa || 'sin_nombre',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      },
      database_schema: {
        tabla_principal: formData.nombreEmpresa?.toLowerCase().replace(/\s+/g, '_') || 'cliente_data',
        columnas: formData.columnasPostgres.map((col: any) => ({
          id: col.id,
          nombre: col.nombre,
          tipo: col.tipo,
          descripcion: col.descripcion,
          nullable: true,
          default: generarDatoSintetico(col.tipo, col.nombre, col.descripcion),
          ejemplo_valor: generarDatoSintetico(col.tipo, col.nombre, col.descripcion),
          ejemplo_sql: generarEjemploSQL(col.tipo, col.nombre, col.descripcion)
        })),
        total_columnas: formData.columnasPostgres.length
      },
      kpis_mapping: {
        kpis: kpiData.kpis_tabla.map((kpi: any) => ({
          kpi_id: kpi.id,
          titulo: kpi.titulo,
          tipo_grafico: kpi.tipo_grafico,
          columnas_origen: JSON.parse(kpi.inputs || '[]'),
          orden: kpi.orden,
          activo: kpi.activo
        })),
        total_kpis: kpiData.total_kpis
      },
      field_mapping: {
        columna_kpi_relations: formData.columnasPostgres.map((col: any) => {
          // Buscar KPIs que usan esta columna
          const kpisRelacionados = kpiData.kpis_tabla.filter((kpi: any) => {
            const inputs = JSON.parse(kpi.inputs || '[]')
            return inputs.includes(col.nombre)
          })
          
          return {
            columna_id: col.id,
            columna_nombre: col.nombre,
            tipo_dato: col.tipo,
            descripcion: col.descripcion,
            ejemplo_valor: generarDatoSintetico(col.tipo, col.nombre, col.descripcion),
            ejemplo_sql: generarEjemploSQL(col.tipo, col.nombre, col.descripcion),
            usado_en_kpis: kpisRelacionados.map((kpi: any) => ({
              kpi_id: kpi.id,
              kpi_titulo: kpi.titulo,
              tipo_grafico: kpi.tipo_grafico
            })),
            total_kpis_relacionados: kpisRelacionados.length
          }
        })
      },
      example_data: {
        tabla_ejemplo: formData.nombreEmpresa?.toLowerCase().replace(/\s+/g, '_') || 'cliente_data',
        registros_ejemplo: [
          {
            id: crypto.randomUUID(),
            ...formData.columnasPostgres.reduce((acc: any, col: any) => {
              acc[col.nombre] = generarDatoSintetico(col.tipo, col.nombre, col.descripcion)
              return acc
            }, {}),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: crypto.randomUUID(),
            ...formData.columnasPostgres.reduce((acc: any, col: any) => {
              acc[col.nombre] = generarDatoSintetico(col.tipo, col.nombre, col.descripcion)
              return acc
            }, {}),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ],
        sql_insert_example: `INSERT INTO ${formData.nombreEmpresa?.toLowerCase().replace(/\s+/g, '_') || 'cliente_data'} (${formData.columnasPostgres.map((col: any) => col.nombre).join(', ')}) VALUES (${formData.columnasPostgres.map((col: any) => generarEjemploSQL(col.tipo, col.nombre, col.descripcion)).join(', ')});`
      },
      statistics: {
        total_columnas: formData.columnasPostgres.length,
        total_kpis: kpiData.total_kpis,
        columnas_usadas_en_kpis: formData.columnasPostgres.filter((col: any) => {
          return kpiData.kpis_tabla.some((kpi: any) => {
            const inputs = JSON.parse(kpi.inputs || '[]')
            return inputs.includes(col.nombre)
          })
        }).length,
        columnas_sin_uso: formData.columnasPostgres.filter((col: any) => {
          return !kpiData.kpis_tabla.some((kpi: any) => {
            const inputs = JSON.parse(kpi.inputs || '[]')
            return inputs.includes(col.nombre)
          })
        }).length
      }
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📋 MAPPER NORMALIZADO CREADO')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔑 Cliente ID:', mapperNormalizado.metadata.cliente_id)
    console.log('🏢 Nombre Empresa:', mapperNormalizado.metadata.nombre_empresa)
    console.log('📊 Total Columnas:', mapperNormalizado.statistics.total_columnas)
    console.log('📊 Total KPIs:', mapperNormalizado.statistics.total_kpis)
    console.log('🔗 Columnas usadas en KPIs:', mapperNormalizado.statistics.columnas_usadas_en_kpis)
    console.log('⚠️ Columnas sin uso:', mapperNormalizado.statistics.columnas_sin_uso)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    return mapperNormalizado
  }

  // Función para generar script SQL CREATE TABLE
  const generarCreateTableSQL = () => {
    if (!formData.columnasPostgres || formData.columnasPostgres.length === 0) {
      return ''
    }
    
    const tablaNombre = formData.nombreEmpresa?.toLowerCase().replace(/\s+/g, '_') || 'cliente_data'
    
    let sql = `-- ============================================\n`
    sql += `-- Tabla: ${tablaNombre}\n`
    sql += `-- Cliente: ${formData.nombreEmpresa}\n`
    sql += `-- Cliente ID: ${clienteId}\n`
    sql += `-- Fecha: ${new Date().toISOString()}\n`
    sql += `-- ============================================\n\n`
    
    sql += `CREATE TABLE IF NOT EXISTS ${tablaNombre} (\n`
    
    // Columnas
    formData.columnasPostgres.forEach((col: any, index: number) => {
      const notNull = col.nullable === false ? ' NOT NULL' : ''
      const defaultValue = col.default ? ` DEFAULT '${col.default}'` : ''
      sql += `  ${col.nombre} ${col.tipo}${notNull}${defaultValue}`
      
      if (index < formData.columnasPostgres.length - 1) {
        sql += ','
      }
      
      if (col.descripcion) {
        sql += ` -- ${col.descripcion}`
      }
      sql += '\n'
    })
    
    sql += `);\n\n`
    
    // Índices
    sql += `-- Índices\n`
    sql += `CREATE INDEX IF NOT EXISTS idx_${tablaNombre}_created ON ${tablaNombre}(fecha_hora);\n`
    
    // Buscar columna de cliente o ejecutor para índice
    const colCliente = formData.columnasPostgres.find((c: any) => 
      c.nombre.includes('cliente') || c.nombre.includes('ejecutor')
    )
    if (colCliente) {
      sql += `CREATE INDEX IF NOT EXISTS idx_${tablaNombre}_${colCliente.nombre} ON ${tablaNombre}(${colCliente.nombre});\n`
    }
    
    sql += `\n-- Comentarios de tabla\n`
    sql += `COMMENT ON TABLE ${tablaNombre} IS 'Tabla generada automáticamente para cliente: ${formData.nombreEmpresa} (${clienteId})';\n`
    
    return sql
  }

  // Función para generar stored procedure INSERT
  const generarStoredProcedureSQL = () => {
    if (!formData.columnasPostgres || formData.columnasPostgres.length === 0) {
      return ''
    }
    
    const tablaNombre = formData.nombreEmpresa?.toLowerCase().replace(/\s+/g, '_') || 'cliente_data'
    const procedureName = `sp_insertar_${tablaNombre}`
    
    let sql = `-- ============================================\n`
    sql += `-- Stored Procedure: ${procedureName}\n`
    sql += `-- Propósito: Insertar registros en ${tablaNombre}\n`
    sql += `-- ============================================\n\n`
    
    sql += `CREATE OR REPLACE FUNCTION ${procedureName}(\n`
    
    // Parámetros
    formData.columnasPostgres.forEach((col: any, index: number) => {
      sql += `  p_${col.nombre} ${col.tipo}`
      
      if (index < formData.columnasPostgres.length - 1) {
        sql += ','
      }
      sql += '\n'
    })
    
    sql += `) RETURNS UUID AS $$\n`
    sql += `DECLARE\n`
    sql += `  v_id UUID;\n`
    sql += `BEGIN\n`
    sql += `  -- Generar UUID si no existe columna id\n`
    sql += `  v_id := gen_random_uuid();\n\n`
    
    sql += `  -- Insertar registro\n`
    sql += `  INSERT INTO ${tablaNombre} (\n`
    
    // Lista de columnas
    formData.columnasPostgres.forEach((col: any, index: number) => {
      sql += `    ${col.nombre}`
      if (index < formData.columnasPostgres.length - 1) {
        sql += ','
      }
      sql += '\n'
    })
    
    sql += `  ) VALUES (\n`
    
    // Lista de valores (parámetros)
    formData.columnasPostgres.forEach((col: any, index: number) => {
      sql += `    p_${col.nombre}`
      if (index < formData.columnasPostgres.length - 1) {
        sql += ','
      }
      sql += '\n'
    })
    
    sql += `  );\n\n`
    sql += `  RETURN v_id;\n`
    sql += `END;\n`
    sql += `$$ LANGUAGE plpgsql;\n\n`
    
    // Ejemplo de uso
    sql += `-- ============================================\n`
    sql += `-- Ejemplo de uso:\n`
    sql += `-- ============================================\n`
    sql += `-- SELECT ${procedureName}(\n`
    formData.columnasPostgres.forEach((col: any, index: number) => {
      const ejemploValor = generarDatoSintetico(col.tipo, col.nombre, col.descripcion)
      const valorSQL = typeof ejemploValor === 'string' ? `'${ejemploValor}'` : 
                       ejemploValor === null ? 'NULL' : 
                       typeof ejemploValor === 'object' ? `'${JSON.stringify(ejemploValor)}'::jsonb` :
                       ejemploValor
      
      sql += `--   ${valorSQL}`
      if (index < formData.columnasPostgres.length - 1) {
        sql += ','
      }
      sql += `  -- ${col.nombre}\n`
    })
    sql += `-- );\n`
    
    return sql
  }

  // Función para guardar mapper normalizado en JSON
  const guardarMapperJSON = () => {
    console.log('💾 === GUARDANDO MAPPER NORMALIZADO EN JSON ===')
    
    const mapper = crearMapperNormalizado()
    
    if (!mapper) {
      setError('No se puede crear el mapper. Asegúrate de tener columnas y KPIs generados.')
      return
    }
    
    const dataStr = JSON.stringify(mapper, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    
    const fileName = `mapper-${formData.nombreEmpresa || 'cliente'}-${clienteId.substring(0, 8)}.json`
    link.href = url
    link.download = fileName
    link.click()
    
    console.log('✅ Archivo Mapper JSON descargado:', fileName)
    console.log('📁 Ubicación sugerida en proyecto: ./output/' + fileName)
    console.log('📁 También disponible en: ./scripts/field-mapping.json')
    console.log('')
    console.log('📄 Contenido del archivo:')
    console.log(dataStr)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    URL.revokeObjectURL(url)
    setSuccess(`Archivo mapper ${fileName} descargado exitosamente`)
  }

  // Función para validar URL de webhook
  const validarWebhookUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  // Función para enviar mapper JSON via webhook POST
  const enviarMapperViaWebhook = async () => {
    console.log('📤 === ENVIANDO MAPPER JSON VIA WEBHOOK ===')
    
    const mapper = crearMapperNormalizado()
    
    if (!mapper) {
      setError('No se puede crear el mapper. Asegúrate de tener columnas y KPIs generados.')
      return
    }

    // Obtener webhooks Json configurados
    const webhooksJson = Object.keys(formData.webhooks).filter(key => 
      key.includes('EnviarJson') && formData.webhooks[key] && formData.webhooks[key].trim() !== ''
    )

    if (webhooksJson.length === 0) {
      setError('No hay webhooks Json configurados. Ve al paso 3 para configurar los webhooks.')
      return
    }

    // Validar URLs antes de enviar
    const webhooksInvalidos = webhooksJson.filter(key => 
      !validarWebhookUrl(formData.webhooks[key])
    )

    if (webhooksInvalidos.length > 0) {
      setError(`URLs de webhook inválidas: ${webhooksInvalidos.join(', ')}. Verifica que las URLs sean válidas.`)
      return
    }

    setLoading(true)
    setError('')

    try {
      const resultados = []
      const errores = []
      
      for (const webhookKey of webhooksJson) {
        const webhookUrl = formData.webhooks[webhookKey].trim()
        const vertical = webhookKey.includes('Llamadas') ? 'Llamadas' : 
                        webhookKey.includes('Texto') ? 'Texto/Chat' : 'Automatizaciones'
        
        console.log(`📤 Enviando mapper a ${vertical}:`, webhookUrl)
        
        try {
          const payload = {
            cliente_id: clienteId,
            mapper_data: mapper,
            columnas_postgres: formData.columnasPostgres,
            kpis_data: kpiData,
            metadata: {
              vertical: vertical,
              timestamp: new Date().toISOString(),
              version: '1.0.0'
            }
          }

          console.log(`📦 Payload para ${vertical}:`, JSON.stringify(payload, null, 2))

          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos timeout

          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'User-Agent': 'Buffalo-IA-Clean/1.0.0'
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
            mode: 'cors',
            credentials: 'omit'
          })

          clearTimeout(timeoutId)

          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
          }

          let result
          try {
            result = await response.json()
          } catch (jsonError) {
            result = { message: 'Respuesta recibida pero no es JSON válido', status: response.status }
          }

          resultados.push({
            webhook: webhookKey,
            vertical: vertical,
            url: webhookUrl,
            success: true,
            response: result
          })

          console.log(`✅ Mapper enviado exitosamente a ${vertical}`)
          console.log('📥 Respuesta:', result)

        } catch (webhookError) {
          console.error(`❌ Error enviando a ${vertical}:`, webhookError)
          
          const errorMessage = webhookError instanceof Error ? webhookError.message : 'Error desconocido'
          errores.push({
            webhook: webhookKey,
            vertical: vertical,
            url: webhookUrl,
            error: errorMessage
          })

          // Continuar con otros webhooks aunque uno falle
          console.log(`⚠️ Continuando con otros webhooks después del error en ${vertical}`)
        }
      }

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📊 RESULTADOS WEBHOOKS')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('✅ Exitosos:', resultados.length)
      console.log('❌ Errores:', errores.length)
      
      if (resultados.length > 0) {
        console.log('📤 Webhooks exitosos:')
        resultados.forEach(r => {
          console.log(`   ✓ ${r.vertical}: ${r.url}`)
        })
      }
      
      if (errores.length > 0) {
        console.log('❌ Webhooks con error:')
        errores.forEach(e => {
          console.log(`   ✗ ${e.vertical}: ${e.url} - ${e.error}`)
        })
      }
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

      // Mostrar resultado final
      if (resultados.length > 0 && errores.length === 0) {
        setSuccess(`Mapper JSON enviado exitosamente a ${resultados.length} webhook(s)`)
      } else if (resultados.length > 0 && errores.length > 0) {
        setSuccess(`Mapper JSON enviado a ${resultados.length} webhook(s), ${errores.length} fallaron. Revisa la consola para detalles.`)
      } else {
        setError(`Error enviando a todos los webhooks. Revisa la consola para detalles.`)
      }
      
    } catch (error) {
      console.error('❌ Error general enviando mapper via webhook:', error)
      setError(`Error enviando mapper: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setLoading(false)
    }
  }

  // Función para guardar SQL scripts en JSON
  const guardarSQLScriptsJSON = () => {
    console.log('💾 === GUARDANDO SQL SCRIPTS EN JSON ===')
    
    const createTableScript = generarCreateTableSQL()
    const storedProcedureScript = generarStoredProcedureSQL()
    
    if (!createTableScript || !storedProcedureScript) {
      console.error('❌ No se pudieron generar los scripts SQL')
      return
    }
    
    const sqlScripts = {
      metadata: {
        cliente_id: clienteId,
        nombre_empresa: formData.nombreEmpresa || 'sin_nombre',
        tabla_nombre: formData.nombreEmpresa?.toLowerCase().replace(/\s+/g, '_') || 'cliente_data',
        timestamp: new Date().toISOString(),
        total_columnas: formData.columnasPostgres?.length || 0
      },
      create_table: {
        descripcion: 'Script SQL para crear la tabla principal',
        script: createTableScript
      },
      stored_procedure: {
        descripcion: 'Stored procedure para insertar registros',
        procedure_name: `sp_insertar_${formData.nombreEmpresa?.toLowerCase().replace(/\s+/g, '_') || 'cliente_data'}`,
        script: storedProcedureScript
      },
      columnas_detalle: formData.columnasPostgres.map((col: any) => ({
        nombre: col.nombre,
        tipo: col.tipo,
        descripcion: col.descripcion,
        ejemplo_valor: generarDatoSintetico(col.tipo, col.nombre, col.descripcion)
      }))
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📦 SQL SCRIPTS GENERADOS')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔑 Cliente ID:', sqlScripts.metadata.cliente_id)
    console.log('🗄️ Tabla:', sqlScripts.metadata.tabla_nombre)
    console.log('📊 Total Columnas:', sqlScripts.metadata.total_columnas)
    console.log('📝 CREATE TABLE: ✅')
    console.log('⚙️ Stored Procedure:', sqlScripts.stored_procedure.procedure_name)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    const dataStr = JSON.stringify(sqlScripts, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    
    const fileName = `sql-scripts-${formData.nombreEmpresa || 'cliente'}-${clienteId.substring(0, 8)}.json`
    link.href = url
    link.download = fileName
    link.click()
    
    console.log('✅ Archivo SQL Scripts JSON descargado:', fileName)
    console.log('📁 Ubicación sugerida: ./database/' + fileName)
    console.log('')
    console.log('📄 CREATE TABLE Script:')
    console.log(createTableScript)
    console.log('')
    console.log('⚙️ Stored Procedure Script:')
    console.log(storedProcedureScript)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    URL.revokeObjectURL(url)
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
        
        // Guardar automáticamente en JSON
        console.log('💾 Guardando columnas automáticamente en JSON...')
        const columnasParaGuardar = {
          cliente_id: clienteId,
          nombre_empresa: formData.nombreEmpresa || 'sin_nombre',
          timestamp: new Date().toISOString(),
          total_columnas: columnasGeneradas.length,
          columnas: columnasGeneradas
        }
        
        setTimeout(() => {
          const dataStr = JSON.stringify(columnasParaGuardar, null, 2)
          const dataBlob = new Blob([dataStr], { type: 'application/json' })
          const url = URL.createObjectURL(dataBlob)
          const link = document.createElement('a')
          const fileName = `columnas-${formData.nombreEmpresa || 'cliente'}-${clienteId.substring(0, 8)}.json`
          link.href = url
          link.download = fileName
          link.click()
          console.log('✅ Archivo columnas JSON descargado automáticamente:', fileName)
          console.log('📁 Guardar en proyecto: ./output/' + fileName)
          URL.revokeObjectURL(url)
        }, 500)
        
        setSuccess(`¡Excelente! Se generaron ${columnasGeneradas.length} columnas automáticamente con IA y se guardaron en JSON`)
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
        
        // Preparar KPIs para estructura de tabla con cliente_id
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('📝 PREPARANDO KPIs PARA TABLA DE BASE DE DATOS')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('❌ ANTES: KPIs sin cliente_id (solo JSON)')
        console.log('   Estructura: { kpis: [...] }')
        console.log('')
        console.log('✅ AHORA: KPIs preparados para tabla PostgreSQL')
        
        const timestamp = new Date().toISOString()
        
        // Crear registros individuales para cada KPI (formato tabla)
        const kpisParaTabla = kpiResponse.kpis.map((kpi: any, index: number) => ({
          id: crypto.randomUUID(),
          cliente_id: clienteId,
          titulo: kpi.titulo,
          descripcion: kpi.descripcion,
          tipo_grafico: kpi.tipo_grafico,
          num_inputs: kpi.num_inputs,
          inputs: JSON.stringify(kpi.inputs), // Array como JSON string para PostgreSQL
          ejemplo: kpi.ejemplo || null,
          orden: index + 1,
          activo: true,
          fecha_creacion: timestamp
        }))
        
        // Estructura completa con metadata
        const kpisConClienteId = {
          cliente_id: clienteId,
          timestamp: timestamp,
          total_kpis: kpiResponse.kpis.length,
          kpis: kpiResponse.kpis, // Original para display
          kpis_tabla: kpisParaTabla // Formato tabla para inserción
        }
        
        console.log('   Estructura tabla: tabla_kpis')
        console.log('   Columnas: id (UUID), cliente_id (UUID), titulo, descripcion, tipo_grafico, num_inputs, inputs (JSON), ejemplo, orden, activo, fecha_creacion')
        console.log('')
        console.log('📊 Registros preparados para inserción:')
        kpisParaTabla.forEach((kpi: any, index: number) => {
          console.log(`   ${index + 1}. ID: ${kpi.id} | Cliente: ${kpi.cliente_id} | Título: ${kpi.titulo}`)
        })
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('📦 KPIs completos:', kpisConClienteId)
        console.log('📦 KPIs para tabla (formato PostgreSQL):')
        kpisParaTabla.forEach((kpi: any) => {
          console.log('  -', kpi)
        })
        
        setKpiData(kpisConClienteId)
        setKpiGenerated(true)
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('💾 PREPARACIÓN PARA BASE DE DATOS')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('✅ Estado actualizado - kpiData guardado EN MEMORIA')
        console.log('📋 Estructura sugerida para tabla PostgreSQL:')
        console.log('')
        console.log('CREATE TABLE kpis (')
        console.log('  id UUID PRIMARY KEY,')
        console.log('  cliente_id UUID NOT NULL,')
        console.log('  titulo VARCHAR(255) NOT NULL,')
        console.log('  descripcion TEXT,')
        console.log('  tipo_grafico VARCHAR(50),')
        console.log('  num_inputs INTEGER,')
        console.log('  inputs JSONB,')
        console.log('  ejemplo TEXT,')
        console.log('  orden INTEGER,')
        console.log('  activo BOOLEAN DEFAULT true,')
        console.log('  fecha_creacion TIMESTAMP DEFAULT NOW()')
        console.log(');')
        console.log('')
        console.log('💡 Datos listos para:')
        console.log('   - Inserción en PostgreSQL')
        console.log('   - Total registros:', kpisParaTabla.length)
        console.log('   - Cliente ID:', clienteId)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        
        // Guardar automáticamente KPIs en JSON
        console.log('💾 Guardando KPIs automáticamente en JSON...')
        const kpisParaGuardarAuto = {
          cliente_id: clienteId,
          nombre_empresa: formData.nombreEmpresa || 'sin_nombre',
          timestamp: timestamp,
          total_kpis: kpiResponse.kpis.length,
          kpis_display: kpiResponse.kpis,
          kpis_tabla: kpisParaTabla
        }
        
        setTimeout(() => {
          // Guardar KPIs
          const dataStr = JSON.stringify(kpisParaGuardarAuto, null, 2)
          const dataBlob = new Blob([dataStr], { type: 'application/json' })
          const url = URL.createObjectURL(dataBlob)
          const link = document.createElement('a')
          const fileName = `kpis-${formData.nombreEmpresa || 'cliente'}-${clienteId.substring(0, 8)}.json`
          link.href = url
          link.download = fileName
          link.click()
          console.log('✅ Archivo KPIs JSON descargado automáticamente:', fileName)
          console.log('📁 Guardar en proyecto: ./output/' + fileName)
          URL.revokeObjectURL(url)
        }, 500)
        
        // Crear y guardar mapper normalizado automáticamente
        setTimeout(() => {
          console.log('🔄 Creando mapper normalizado automáticamente...')
          
          // Crear mapper con los datos actuales (no esperar a state)
          const mapperData = {
            metadata: {
              cliente_id: clienteId,
              nombre_empresa: formData.nombreEmpresa || 'sin_nombre',
              timestamp: timestamp,
              version: '1.0.0'
            },
            database_schema: {
              tabla_principal: formData.nombreEmpresa?.toLowerCase().replace(/\s+/g, '_') || 'cliente_data',
              columnas: formData.columnasPostgres.map((col: any) => ({
                id: col.id,
                nombre: col.nombre,
                tipo: col.tipo,
                descripcion: col.descripcion,
                nullable: true,
                default: generarDatoSintetico(col.tipo, col.nombre, col.descripcion)  // ✅ Datos sintéticos inteligentes
              })),
              total_columnas: formData.columnasPostgres.length
            },
            kpis_mapping: {
              kpis: kpisParaTabla.map((kpi: any) => ({
                kpi_id: kpi.id,
                titulo: kpi.titulo,
                tipo_grafico: kpi.tipo_grafico,
                columnas_origen: JSON.parse(kpi.inputs || '[]'),
                orden: kpi.orden,
                activo: kpi.activo
              })),
              total_kpis: kpiResponse.kpis.length
            },
            field_mapping: {
              columna_kpi_relations: formData.columnasPostgres.map((col: any) => {
                const kpisRelacionados = kpisParaTabla.filter((kpi: any) => {
                  const inputs = JSON.parse(kpi.inputs || '[]')
                  return inputs.includes(col.nombre)
                })
                
                return {
                  columna_id: col.id,
                  columna_nombre: col.nombre,
                  tipo_dato: col.tipo,
                  usado_en_kpis: kpisRelacionados.map((kpi: any) => ({
                    kpi_id: kpi.id,
                    kpi_titulo: kpi.titulo,
                    tipo_grafico: kpi.tipo_grafico
                  })),
                  total_kpis_relacionados: kpisRelacionados.length
                }
              })
            },
            statistics: {
              total_columnas: formData.columnasPostgres.length,
              total_kpis: kpiResponse.kpis.length,
              columnas_usadas_en_kpis: formData.columnasPostgres.filter((col: any) => {
                return kpisParaTabla.some((kpi: any) => {
                  const inputs = JSON.parse(kpi.inputs || '[]')
                  return inputs.includes(col.nombre)
                })
              }).length,
              columnas_sin_uso: formData.columnasPostgres.filter((col: any) => {
                return !kpisParaTabla.some((kpi: any) => {
                  const inputs = JSON.parse(kpi.inputs || '[]')
                  return inputs.includes(col.nombre)
                })
              }).length
            }
          }
          
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
          console.log('📋 MAPPER NORMALIZADO CREADO')
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
          console.log('🔑 Cliente ID:', mapperData.metadata.cliente_id)
          console.log('🏢 Nombre Empresa:', mapperData.metadata.nombre_empresa)
          console.log('📊 Total Columnas:', mapperData.statistics.total_columnas)
          console.log('📊 Total KPIs:', mapperData.statistics.total_kpis)
          console.log('🔗 Columnas usadas en KPIs:', mapperData.statistics.columnas_usadas_en_kpis)
          console.log('⚠️ Columnas sin uso:', mapperData.statistics.columnas_sin_uso)
          console.log('✨ Datos sintéticos generados en campo "default" para cada columna')
          console.log('💡 Método: Extrae ejemplos de descripción o genera según tipo')
          console.log('')
          console.log('📊 Ejemplos de datos sintéticos generados:')
          mapperData.database_schema.columnas.forEach((col: any, idx: number) => {
            const valorMostrar = typeof col.default === 'object' ? JSON.stringify(col.default) : col.default
            const esExtraido = col.descripcion && col.descripcion.includes("'")
            console.log(`   ${idx + 1}. ${col.nombre} (${col.tipo}): ${valorMostrar}${esExtraido ? ' 💡' : ''}`)
          })
          console.log('   💡 = Valor extraído de descripción')
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
          
          // Guardar el mapper
          const dataStr = JSON.stringify(mapperData, null, 2)
          const dataBlob = new Blob([dataStr], { type: 'application/json' })
          const url = URL.createObjectURL(dataBlob)
          const link = document.createElement('a')
          const fileName = `mapper-${formData.nombreEmpresa || 'cliente'}-${clienteId.substring(0, 8)}.json`
          link.href = url
          link.download = fileName
          link.click()
          
          console.log('✅ Archivo Mapper JSON descargado automáticamente:', fileName)
          console.log('📁 Ubicación sugerida en proyecto: ./output/' + fileName)
          console.log('📁 También disponible en: ./scripts/field-mapping.json')
          
          URL.revokeObjectURL(url)
        }, 1000)
        
        // Generar y guardar SQL Scripts automáticamente
        setTimeout(() => {
          console.log('🔄 Generando SQL Scripts automáticamente...')
          guardarSQLScriptsJSON()
        }, 1500)
        
        setSuccess(`¡KPIs generados exitosamente! Se han creado ${kpiResponse.kpis.length} KPIs. Archivos guardados: KPIs JSON, Mapper y SQL Scripts.`)
        
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
            const isEnviarJson = key.includes('EnviarJson')
            console.log(`     ${isEnviarJson ? '📤' : '•'} ${key}:`, formData.webhooks[key])
          })
          
          const enviarJsonCount = webhooksConfigurados.filter(k => k.includes('EnviarJson')).length
          if (enviarJsonCount > 0) {
            console.log(`   ✅ Webhooks Json configurados: ${enviarJsonCount}`)
          }
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
      
      case 5:
        console.log('📋 Paso 5 (Generar KPIs) completado:')
        console.log('   - KPIs generados:', kpiData?.total_kpis || kpiData?.kpis?.length || 0)
        console.log('   - Archivos generados automáticamente:')
        console.log('     ✅ KPIs JSON')
        console.log('     ✅ Mapper normalizado (con datos sintéticos)')
        console.log('     ✅ SQL Scripts (CREATE TABLE + Stored Procedure)')
        console.log('   → Avanzando a Preview Dashboard (Paso 6)')
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
          { key: 'webhookLlamadasDatabase', label: 'Webhook Database', placeholder: 'https://api.ejemplo.com/webhook/llamadas/database' },
          { key: 'webhookLlamadasEnviarJson', label: 'Webhook Json', placeholder: 'https://api.ejemplo.com/webhook/llamadas/json' }
        ]
      })
    }
    
    if (formData.verticales.texto) {
      groups.push({
        title: 'Webhooks de Texto/Chat',
        icon: MessageSquare,
        webhooks: [
          { key: 'webhookTextoDashboard', label: 'Webhook Dashboard', placeholder: 'https://api.ejemplo.com/webhook/texto/dashboard' },
          { key: 'webhookTextoDatabase', label: 'Webhook Database', placeholder: 'https://api.ejemplo.com/webhook/texto/database' },
          { key: 'webhookTextoEnviarJson', label: 'Webhook Json', placeholder: 'https://api.ejemplo.com/webhook/texto/json' }
        ]
      })
    }
    
    if (formData.verticales.automatizaciones) {
      groups.push({
        title: 'Webhooks de Automatizaciones',
        icon: Bot,
        webhooks: [
          { key: 'webhookAutomatizacionesDashboard', label: 'Webhook Dashboard', placeholder: 'https://api.ejemplo.com/webhook/automatizaciones/dashboard' },
          { key: 'webhookAutomatizacionesEnviarJson', label: 'Webhook Json', placeholder: 'https://api.ejemplo.com/webhook/automatizaciones/json' }
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
        kpisGenerados: kpiData,  // ✅ Incluye: { cliente_id, timestamp, total_kpis, kpis: [...] }
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
      console.log('   - KPIs generados:', nuevoCliente.kpisGenerados?.total_kpis || nuevoCliente.kpisGenerados?.kpis?.length || 0)
      console.log('   - KPIs cliente_id:', nuevoCliente.kpisGenerados?.cliente_id || 'N/A')
      console.log('   - KPIs formato tabla:', nuevoCliente.kpisGenerados?.kpis_tabla?.length || 0, 'registros listos para PostgreSQL')
      
      const webhooksConfigurados = Object.keys(nuevoCliente.webhooks).filter(k => nuevoCliente.webhooks[k])
      const webhooksJson = webhooksConfigurados.filter(k => k.includes('EnviarJson'))
      console.log('   - Webhooks configurados:', webhooksConfigurados.length)
      console.log('   - Webhooks Json:', webhooksJson.length)
      
      if (webhooksJson.length > 0) {
        console.log('   📤 Webhooks Json configurados:')
        webhooksJson.forEach(key => {
          console.log(`     • ${key}: ${nuevoCliente.webhooks[key]}`)
        })
      }
      
      if (nuevoCliente.kpisGenerados?.kpis_tabla && nuevoCliente.kpisGenerados.kpis_tabla.length > 0) {
        console.log('')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('📊 REGISTROS KPIs LISTOS PARA INSERTAR EN TABLA:')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        nuevoCliente.kpisGenerados.kpis_tabla.forEach((kpi: any, index: number) => {
          console.log(`${index + 1}. INSERT INTO kpis VALUES (`)
          console.log(`     id: '${kpi.id}',`)
          console.log(`     cliente_id: '${kpi.cliente_id}',`)
          console.log(`     titulo: '${kpi.titulo}',`)
          console.log(`     tipo_grafico: '${kpi.tipo_grafico}',`)
          console.log(`     orden: ${kpi.orden}`)
          console.log(`   )`)
        })
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      }

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
          {currentStep === 5 && <Step5 formData={formData} generarKPIs={generarKPIs} kpiLoading={kpiLoading} kpiGenerated={kpiGenerated} kpiData={kpiData} enviarMapperViaWebhook={enviarMapperViaWebhook} guardarMapperJSON={guardarMapperJSON} guardarSQLScriptsJSON={guardarSQLScriptsJSON} />}
          {currentStep === 6 && <Step6 formData={formData} kpiData={kpiData} clienteId={clienteId} />}
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
