// === src/hooks/useTimer.js ===
// Hook para manejar countdown de tiempo por turno
// Soporta pause, resume, callback cuando llega a cero, y efectos de sonido

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAudio } from './useAudio'

export function useTimer(initialSeconds, onTimeUp, conSonido = true) {
  const [segundosRestantes, setSegundosRestantes] = useState(initialSeconds)
  const [activo, setActivo] = useState(false)
  const [pausado, setPausado] = useState(false)
  const intervalRef = useRef(null)
  const onTimeUpRef = useRef(onTimeUp)
  const { playTick, playTimeWarning, playError } = useAudio()
  
  // Mantener referencia actualizada del callback
  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])
  
  // Limpiar intervalo al desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
  
  // Logica del countdown
  useEffect(() => {
    if (activo && !pausado && segundosRestantes > 0) {
      intervalRef.current = setInterval(() => {
        setSegundosRestantes(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setActivo(false)
            // Sonido de tiempo agotado
            if (conSonido) playError()
            // Llamar callback cuando llega a cero
            if (onTimeUpRef.current) {
              onTimeUpRef.current()
            }
            return 0
          }
          
          // Sonidos segun tiempo restante
          if (conSonido) {
            if (prev <= 6) {
              // Ultimos 5 segundos: beep de advertencia
              playTimeWarning()
            } else if (prev <= 11) {
              // Ultimos 10 segundos: tick audible
              playTick()
            }
          }
          
          return prev - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [activo, pausado, segundosRestantes, conSonido, playTick, playTimeWarning, playError])
  
  // Iniciar el timer
  const iniciar = useCallback((segundos = initialSeconds) => {
    setSegundosRestantes(segundos || initialSeconds)
    setPausado(false)
    setActivo(true)
  }, [initialSeconds])
  
  // Pausar el timer
  const pausar = useCallback(() => {
    setPausado(true)
  }, [])
  
  // Reanudar el timer
  const reanudar = useCallback(() => {
    setPausado(false)
  }, [])
  
  // Detener el timer
  const detener = useCallback(() => {
    setActivo(false)
    setPausado(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [])
  
  // Reiniciar el timer
  const reiniciar = useCallback((segundos = initialSeconds) => {
    detener()
    setSegundosRestantes(segundos || initialSeconds)
    setActivo(true)
  }, [initialSeconds, detener])
  
  // Formatear tiempo para mostrar (MM:SS)
  const formatearTiempo = useCallback((segundos) => {
    const mins = Math.floor(segundos / 60)
    const secs = segundos % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])
  
  // Calcular porcentaje restante (para barra de progreso)
  const porcentajeRestante = initialSeconds 
    ? Math.round((segundosRestantes / initialSeconds) * 100) 
    : 100
  
  return {
    segundosRestantes,
    tiempoFormateado: formatearTiempo(segundosRestantes),
    porcentajeRestante,
    activo,
    pausado,
    iniciar,
    pausar,
    reanudar,
    detener,
    reiniciar
  }
}

export default useTimer
