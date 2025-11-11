'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  label: string
}

export default function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(100)
  const [lightness, setLightness] = useState(50)
  const [rgb, setRgb] = useState({ r: 0, g: 200, b: 150 })
  const [hex, setHex] = useState('#00C896')
  const [popupPosition, setPopupPosition] = useState<'bottom' | 'top'>('bottom')
  const [popupCoords, setPopupCoords] = useState<{ top: number, left: number }>({ top: 0, left: 0 })
  const pickerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const gradientRef = useRef<HTMLDivElement>(null)
  const hueSliderRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const isDraggingHue = useRef(false)
  const isInitializing = useRef(false)
  const lastColorRef = useRef<string>('')

  // Convert hex to HSL
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360
    s /= 100
    l /= 100

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    }
  }

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  // Convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number) => {
    const rgb = hslToRgb(h, s, l)
    return rgbToHex(rgb.r, rgb.g, rgb.b)
  }

  // Initialize from color prop (only when color prop actually changes externally)
  useEffect(() => {
    if (color && color !== lastColorRef.current) {
      isInitializing.current = true
      lastColorRef.current = color
      const hsl = hexToHsl(color)
      setHue(hsl.h)
      setSaturation(hsl.s)
      setLightness(hsl.l)
      const rgb = hslToRgb(hsl.h, hsl.s, hsl.l)
      setRgb(rgb)
      setHex(color)
      // Reset flag after state updates complete
      setTimeout(() => {
        isInitializing.current = false
      }, 200)
    }
  }, [color])

  // Re-initialize color when modal opens to ensure correct display
  useEffect(() => {
    if (isOpen && color) {
      isInitializing.current = true
      const hsl = hexToHsl(color)
      setHue(hsl.h)
      setSaturation(hsl.s)
      setLightness(hsl.l)
      const rgb = hslToRgb(hsl.h, hsl.s, hsl.l)
      setRgb(rgb)
      setHex(color)
      lastColorRef.current = color
      // Reset flag after state updates complete
      setTimeout(() => {
        isInitializing.current = false
      }, 200)
    }
  }, [isOpen, color])

  // Update RGB and Hex when HSL changes (only update internal preview, do NOT propagate yet)
  useEffect(() => {
    // Skip during initialization to prevent infinite loop
    if (isInitializing.current) {
      return
    }
    
    const newRgb = hslToRgb(hue, saturation, lightness)
    const newHex = hslToHex(hue, saturation, lightness)
    
    // Only update if values actually changed
    if (newHex !== hex || newRgb.r !== rgb.r || newRgb.g !== rgb.g || newRgb.b !== rgb.b) {
      setRgb(newRgb)
      setHex(newHex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hue, saturation, lightness])

  // Handle gradient click/drag
  const handleGradientMouseDown = (e: React.MouseEvent) => {
    if (!gradientRef.current) return
    isDragging.current = true
    e.preventDefault()
    updateGradientColor(e)
  }
  const handleGradientMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    e.preventDefault()
    updateGradientColor(e)
  }
  const handleGradientMouseUp = () => {
    isDragging.current = false
  }

  const updateGradientColor = (e: React.MouseEvent | MouseEvent) => {
    if (!gradientRef.current) return
    const rect = gradientRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top))
    
    setSaturation(Math.round((x / rect.width) * 100))
    setLightness(Math.round(100 - (y / rect.height) * 100))
  }

  // Handle hue slider click/drag
  const handleHueMouseDown = (e: React.MouseEvent) => {
    isDraggingHue.current = true
    e.preventDefault()
    updateHue(e)
  }
  const handleHueMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingHue.current) return
    e.preventDefault()
    updateHue(e)
  }
  const handleHueMouseUp = () => {
    isDraggingHue.current = false
  }

  // Touch support (mobile/tablet)
  const updateGradientColorTouch = (e: React.TouchEvent) => {
    if (!gradientRef.current) return
    const rect = gradientRef.current.getBoundingClientRect()
    const touch = e.touches[0] || e.changedTouches[0]
    const x = Math.max(0, Math.min(rect.width, touch.clientX - rect.left))
    const y = Math.max(0, Math.min(rect.height, touch.clientY - rect.top))
    setSaturation(Math.round((x / rect.width) * 100))
    setLightness(Math.round(100 - (y / rect.height) * 100))
  }
  const updateHueTouch = (e: React.TouchEvent) => {
    if (!hueSliderRef.current) return
    const rect = hueSliderRef.current.getBoundingClientRect()
    const touch = e.touches[0] || e.changedTouches[0]
    const x = Math.max(0, Math.min(rect.width, touch.clientX - rect.left))
    setHue(Math.round((x / rect.width) * 360))
  }

  const updateHue = (e: React.MouseEvent | MouseEvent) => {
    if (!hueSliderRef.current) return
    const rect = hueSliderRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left))
    setHue(Math.round((x / rect.width) * 360))
  }

  // Mouse move handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current && gradientRef.current) {
        updateGradientColor(e)
      }
      if (isDraggingHue.current) {
        updateHue(e)
      }
    }

    const handleMouseUp = () => {
      isDragging.current = false
      isDraggingHue.current = false
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // Handle RGB input changes
  const handleRgbChange = (component: 'r' | 'g' | 'b', value: string) => {
    const num = Math.max(0, Math.min(255, parseInt(value) || 0))
    const newRgb = { ...rgb, [component]: num }
    setRgb(newRgb)
    
    // Convert RGB to HSL
    const r = newRgb.r / 255
    const g = newRgb.g / 255
    const b = newRgb.b / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }

    setHue(Math.round(h * 360))
    setSaturation(Math.round(s * 100))
    setLightness(Math.round(l * 100))
    
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    setHex(newHex)
  }

  // Handle hex input change
  const handleHexChange = (value: string) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setHex(value)
      const hsl = hexToHsl(value)
      setHue(hsl.h)
      setSaturation(hsl.s)
      setLightness(hsl.l)
      const rgb = hslToRgb(hsl.h, hsl.s, hsl.l)
      setRgb(rgb)
    } else if (value.length <= 7) {
      setHex(value)
    }
  }

  // Apply selection to parent
  const handleApply = () => {
    onChange(hex)
    lastColorRef.current = hex
    setIsOpen(false)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both the picker modal and the container button
      const clickedOutsidePicker = pickerRef.current && !pickerRef.current.contains(event.target as Node)
      const clickedOutsideContainer = containerRef.current && !containerRef.current.contains(event.target as Node)
      
      // Only close if clicked outside both the picker and the container (button)
      if (clickedOutsidePicker && clickedOutsideContainer) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      // Use a small delay to allow mousedown events inside the modal to process first
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 0)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Calculate popup position based on available space (viewport) - using portal coordinates
  useEffect(() => {
    const computePosition = (measuredHeight?: number) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth
      const popupWidth = 320
      const margin = 8
      const estimatedHeight = measuredHeight ?? 460

      // Decide top/bottom
      const spaceBelow = viewportHeight - rect.bottom
      const spaceAbove = rect.top
      let top = rect.bottom + margin
      let position: 'bottom' | 'top' = 'bottom'
      if (spaceBelow < estimatedHeight + margin && spaceAbove > estimatedHeight + margin) {
        top = rect.top - estimatedHeight - margin
        position = 'top'
      }

      // Clamp left to viewport
      let left = rect.left
      if (left + popupWidth + margin > viewportWidth) {
        left = viewportWidth - popupWidth - margin
      }
      if (left < margin) left = margin

      setPopupPosition(position)
      setPopupCoords({ top, left })
    }

    if (isOpen) {
      computePosition()
      // Recompute after first render to use real height
      setTimeout(() => {
        if (pickerRef.current) {
          computePosition(pickerRef.current.offsetHeight)
        }
      }, 0)
    }
  }, [isOpen])

  const currentColor = hslToHex(hue, saturation, lightness)
  const gradientColor = hslToHex(hue, 100, 50)

  return (
    <div className="relative" ref={containerRef}>
      {/* Color Display Button */}
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(!isOpen)
            }}
            className="w-12 h-12 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-500 transition-colors"
            style={{ backgroundColor: color || '#00C896' }}
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={color || '#00C896'}
            readOnly
            className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-900 text-sm"
          />
        </div>
      </div>

      {/* Color Picker Popup (Portal to avoid clipping by overflow hidden parents) */}
      {isOpen && createPortal(
        <div
          ref={pickerRef}
          className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-6"
          style={{
            width: 320,
            left: popupCoords.left,
            top: popupCoords.top
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Current Color & Hex Input */}
          <div className="flex items-center space-x-3 mb-4">
            <div
              className="w-12 h-12 border-2 border-gray-200 rounded-lg flex-shrink-0"
              style={{ backgroundColor: currentColor }}
            />
            <input
              type="text"
              value={hex}
              onChange={(e) => handleHexChange(e.target.value.toUpperCase())}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="#00C896"
            />
          </div>

          {/* Gradient Square */}
          <div
            ref={gradientRef}
            className="relative w-full h-48 rounded-lg mb-4 cursor-crosshair overflow-hidden"
            style={{
              background: `linear-gradient(to right, white, ${gradientColor}), linear-gradient(to bottom, transparent, black)`,
              backgroundBlendMode: 'multiply'
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
              handleGradientMouseDown(e)
            }}
            onMouseMove={(e) => {
              e.stopPropagation()
              handleGradientMouseMove(e)
            }}
            onMouseUp={(e) => {
              e.stopPropagation()
              handleGradientMouseUp()
            }}
            onMouseLeave={handleGradientMouseUp}
            onTouchStart={(e) => {
              e.stopPropagation()
              isDragging.current = true
              updateGradientColorTouch(e)
            }}
            onTouchMove={(e) => {
              e.stopPropagation()
              updateGradientColorTouch(e)
            }}
            onTouchEnd={() => { isDragging.current = false }}
          >
            {/* Saturation/Lightness Indicator */}
            <div
              className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${saturation}%`,
                top: `${100 - lightness}%`
              }}
            />
          </div>

          {/* Hue Slider */}
          <div className="relative mb-4">
            <div
              ref={hueSliderRef}
              className="w-full h-6 rounded-lg cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                handleHueMouseDown(e)
              }}
              onMouseMove={(e) => {
                e.stopPropagation()
                handleHueMouseMove(e)
              }}
              onMouseUp={(e) => {
                e.stopPropagation()
                handleHueMouseUp()
              }}
              onMouseLeave={handleHueMouseUp}
              onTouchStart={(e) => {
                e.stopPropagation()
                isDraggingHue.current = true
                updateHueTouch(e)
              }}
              onTouchMove={(e) => {
                e.stopPropagation()
                updateHueTouch(e)
              }}
              onTouchEnd={() => { isDraggingHue.current = false }}
            >
              {/* Hue Indicator */}
              <div
                className="absolute w-4 h-6 border-2 border-white rounded shadow-lg transform -translate-x-1/2 pointer-events-none"
                style={{
                  left: `${(hue / 360) * 100}%`
                }}
              />
            </div>
          </div>

          {/* RGB Inputs removed to prioritize action buttons */}

          {/* Actions */}
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-3 py-2 text-sm rounded-lg bg-buffalo-green text-white hover:bg-buffalo-green/90"
            >
              Seleccionar
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

