// === src/components/game/ContributionInput.jsx ===
// Textarea para escribir contribucion con contador de caracteres y oraciones
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Contar oraciones en un texto (aproximado por puntuacion)
const contarOraciones = (texto) => {
  if (!texto.trim()) return 0
  // Contar puntos finales de oracion
  const matches = texto.match(/[.!?]+/g)
  return matches ? matches.length : 0
}

export default function ContributionInput({
  value,
  onChange,
  onSubmit,
  oracionesRequeridas = 2,
  maxLength = 500,
  disabled = false
}) {
  const textareaRef = useRef(null)
  const [oracionesActuales, setOracionesActuales] = useState(0)
  
  // Contar oraciones cuando cambia el texto
  useEffect(() => {
    setOracionesActuales(contarOraciones(value))
  }, [value])
  
  // Focus automatico al montar
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus()
    }
  }, [disabled])
  
  // Determinar estado de validacion
  const cumpleMinimo = oracionesActuales >= oracionesRequeridas
  const caracteresRestantes = maxLength - value.length
  
  // Manejar envio con Enter + Ctrl/Cmd
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && cumpleMinimo) {
      onSubmit()
    }
  }
  
  return (
    <div className="w-full">
      {/* Textarea principal */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Continua la historia..."
          maxLength={maxLength}
          className={`
            w-full px-4 py-3 min-h-[150px]
            bg-historia-surface text-historia-text
            border-2 rounded-lg
            font-serif text-lg leading-relaxed
            placeholder:text-historia-muted
            focus:outline-none focus:ring-0
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
            transition-colors duration-200
            ${cumpleMinimo ? 'border-green-500' : 'border-historia-border focus:border-historia-accent'}
          `}
          rows={5}
        />
        
        {/* Indicador de cursor parpadeante cuando esta vacio */}
        {!value && !disabled && (
          <span className="absolute top-3 left-4 text-historia-accent animate-cursor-blink pointer-events-none">
            |
          </span>
        )}
      </div>
      
      {/* Contadores */}
      <div className="flex items-center justify-between mt-2 text-sm">
        {/* Contador de oraciones */}
        <motion.div
          animate={{ scale: cumpleMinimo ? [1, 1.1, 1] : 1 }}
          className={`font-mono ${cumpleMinimo ? 'text-green-600' : 'text-historia-muted'}`}
        >
          {oracionesActuales}/{oracionesRequeridas} oraciones
          {cumpleMinimo && (
            <svg className="inline-block w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </motion.div>
        
        {/* Contador de caracteres */}
        <span className={`font-mono ${caracteresRestantes < 50 ? 'text-amber-600' : 'text-historia-muted'}`}>
          {caracteresRestantes} caracteres
        </span>
      </div>
      
      {/* Hint de envio */}
      <p className="text-historia-muted text-xs mt-2 text-center">
        Ctrl+Enter para enviar
      </p>
    </div>
  )
}
