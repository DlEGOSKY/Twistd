// === src/components/reveal/TypewriterText.jsx ===
// Efecto maquina de escribir letra por letra con cursor parpadeante
// Soporta callback al completar, velocidad configurable y audio sintetizado

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { getDelayCaracter } from '../../utils/textEffects'
import { useAudio } from '../../hooks/useAudio'

export default function TypewriterText({
  texto,
  velocidad = 50,          // ms por caracter base
  onComplete,              // callback al terminar
  className = '',
  cursorClassName = '',
  autoStart = true,
  conSonido = true         // habilitar sonido de teclas
}) {
  const [caracteresVisibles, setCaracteresVisibles] = useState(0)
  const [completado, setCompletado] = useState(false)
  const timeoutRef = useRef(null)
  const caracteres = texto.split('')
  const { playTypewriterKey, playCarriageReturn } = useAudio()
  
  // Iniciar animacion
  useEffect(() => {
    if (!autoStart) return
    
    let indiceActual = 0
    
    const escribirSiguiente = () => {
      if (indiceActual >= caracteres.length) {
        setCompletado(true)
        // Sonido de retorno de carro al terminar
        if (conSonido) playCarriageReturn()
        if (onComplete) onComplete()
        return
      }
      
      const caracterActual = caracteres[indiceActual]
      const delay = getDelayCaracter(caracterActual, velocidad)
      
      // Reproducir sonido de tecla (solo para caracteres visibles, no espacios)
      if (conSonido && caracterActual !== ' ' && Math.random() > 0.3) {
        playTypewriterKey()
      }
      
      setCaracteresVisibles(indiceActual + 1)
      indiceActual++
      
      timeoutRef.current = setTimeout(escribirSiguiente, delay)
    }
    
    // Iniciar con pequeno delay
    timeoutRef.current = setTimeout(escribirSiguiente, 100)
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [texto, velocidad, autoStart, onComplete, caracteres.length, conSonido, playTypewriterKey, playCarriageReturn])
  
  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  
  // Texto visible hasta el momento
  const textoVisible = caracteres.slice(0, caracteresVisibles).join('')
  
  return (
    <span className={`inline ${className}`}>
      {textoVisible}
      {/* Cursor parpadeante mientras escribe */}
      {!completado && (
        <motion.span
          className={`inline-block w-0.5 h-[1em] bg-current ml-0.5 ${cursorClassName}`}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        />
      )}
    </span>
  )
}

// Version que permite saltar la animacion
export function TypewriterTextSkippable({
  texto,
  velocidad = 50,
  onComplete,
  className = ''
}) {
  const [saltado, setSaltado] = useState(false)
  
  const handleClick = () => {
    setSaltado(true)
    if (onComplete) onComplete()
  }
  
  if (saltado) {
    return <span className={className}>{texto}</span>
  }
  
  return (
    <span onClick={handleClick} className="cursor-pointer">
      <TypewriterText
        texto={texto}
        velocidad={velocidad}
        onComplete={onComplete}
        className={className}
      />
    </span>
  )
}
