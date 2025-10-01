'use client'

import { useState, useRef, useEffect } from 'react'
import { Globe, Tag, Calendar, RefreshCw, ChevronDown } from 'lucide-react'

interface FilterDropdownsProps {
  selectedLanguage: string
  selectedCampaign: string
  selectedDateRange: string
  onLanguageChange: (language: string) => void
  onCampaignChange: (campaign: string) => void
  onDateRangeChange: (dateRange: string) => void
  onClear: () => void
}

export default function FilterDropdowns({
  selectedLanguage,
  selectedCampaign,
  selectedDateRange,
  onLanguageChange,
  onCampaignChange,
  onDateRangeChange,
  onClear
}: FilterDropdownsProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: 'es', name: 'Castellano' },
    { code: 'ca', name: 'Catalán' },
    { code: 'en', name: 'Inglés' }
  ]

  const campaigns = [
    'Campaña 1 - Navidad 2024',
    'Campaña 2 - Black Friday',
    'Campaña 3 - Verano 2024',
    'Campaña 4 - Primavera',
    'Campaña 5 - Back to School'
  ]

  const dateRanges = [
    'Hoy',
    'Ayer',
    'Últimos 7 días',
    'Últimos 30 días',
    'Este mes',
    'Mes pasado',
    'Personalizado...'
  ]

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
        setShowDatePicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
    setShowDatePicker(false)
  }

  const handleDateRangeSelect = (range: string) => {
    if (range === 'Personalizado...') {
      setShowDatePicker(true)
      setOpenDropdown(null)
    } else {
      onDateRangeChange(range)
      setOpenDropdown(null)
    }
  }

  return (
    <div ref={dropdownRef} className="flex items-center gap-3">
      {/* Filtro de Idiomas */}
      <div className="relative">
        <button
          onClick={() => toggleDropdown('language')}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Globe className="h-4 w-4" />
          {languages.find(lang => lang.code === selectedLanguage)?.name || 'Todos los idiomas'}
          <ChevronDown className="h-3 w-3" />
        </button>

        {openDropdown === 'language' && (
          <div className="absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <div className="py-1">
              <button
                onClick={() => {
                  onLanguageChange('all')
                  setOpenDropdown(null)
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                  selectedLanguage === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                Todos los idiomas
              </button>
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    onLanguageChange(language.code)
                    setOpenDropdown(null)
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                    selectedLanguage === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {language.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filtro de Campañas */}
      <div className="relative">
        <button
          onClick={() => toggleDropdown('campaign')}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Tag className="h-4 w-4" />
          {selectedCampaign || 'Todas las campañas'}
          <ChevronDown className="h-3 w-3" />
        </button>

        {openDropdown === 'campaign' && (
          <div className="absolute top-full mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <div className="py-1">
              <button
                onClick={() => {
                  onCampaignChange('')
                  setOpenDropdown(null)
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                  !selectedCampaign ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                Todas las campañas
              </button>
              {campaigns.map((campaign) => (
                <button
                  key={campaign}
                  onClick={() => {
                    onCampaignChange(campaign)
                    setOpenDropdown(null)
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                    selectedCampaign === campaign ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {campaign}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filtro de Fecha */}
      <div className="relative">
        <button
          onClick={() => toggleDropdown('date')}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Calendar className="h-4 w-4" />
          {selectedDateRange}
          <ChevronDown className="h-3 w-3" />
        </button>

        {openDropdown === 'date' && (
          <div className="absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <div className="py-1">
              {dateRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => handleDateRangeSelect(range)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                    selectedDateRange === range ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selector de fechas personalizado tipo Vueling */}
        {showDatePicker && (
          <div className="absolute top-full mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Seleccionar rango de fechas</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Fecha inicio</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Fecha fin</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDatePicker(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDateRangeChange('Rango personalizado')
                  setShowDatePicker(false)
                }}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Aplicar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Botón Limpiar */}
      <button
        onClick={onClear}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <RefreshCw className="h-4 w-4" />
        Limpiar
      </button>
    </div>
  )
}
