// === src/hooks/useAudio.js ===
// Hook para efectos de sonido sintetizados con Web Audio API
// Sin archivos externos - todo generado programaticamente

import { useRef, useCallback, useEffect } from 'react'

// Crear contexto de audio compartido (singleton)
let audioContextInstance = null

function getAudioContext() {
  if (!audioContextInstance) {
    audioContextInstance = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContextInstance
}

// Reanudar contexto si esta suspendido (requerido por politicas de autoplay)
async function resumeAudioContext() {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }
  return ctx
}

/**
 * Hook principal para efectos de audio sintetizados
 */
export function useAudio() {
  const audioContextRef = useRef(null)
  
  // Inicializar contexto
  useEffect(() => {
    audioContextRef.current = getAudioContext()
    
    // Reanudar en primer click/touch del usuario
    const handleInteraction = () => {
      resumeAudioContext()
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }
    
    document.addEventListener('click', handleInteraction)
    document.addEventListener('touchstart', handleInteraction)
    
    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }
  }, [])
  
  /**
   * Sonido de tecla de maquina de escribir
   * Simula el click mecanico de una tecla
   */
  const playTypewriterKey = useCallback(async () => {
    try {
      const ctx = await resumeAudioContext()
      const now = ctx.currentTime
      
      // Oscilador para el "click"
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      // Frecuencia alta para sonido de click
      osc.frequency.setValueAtTime(800 + Math.random() * 200, now)
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.02)
      
      // Envolvente muy corta
      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
      
      osc.start(now)
      osc.stop(now + 0.05)
    } catch (e) {
      // Silenciar errores de audio (no critico)
    }
  }, [])
  
  /**
   * Sonido de retorno de carro (fin de linea)
   * Sonido mas largo y grave
   */
  const playCarriageReturn = useCallback(async () => {
    try {
      const ctx = await resumeAudioContext()
      const now = ctx.currentTime
      
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      // Barrido de frecuencia descendente
      osc.frequency.setValueAtTime(600, now)
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.15)
      
      gain.gain.setValueAtTime(0.1, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
      
      osc.start(now)
      osc.stop(now + 0.2)
    } catch (e) {
      // Silenciar errores
    }
  }, [])
  
  /**
   * Sonido de click de boton/UI
   * Sonido suave y corto
   */
  const playClick = useCallback(async () => {
    try {
      const ctx = await resumeAudioContext()
      const now = ctx.currentTime
      
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1000, now)
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.03)
      
      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
      
      osc.start(now)
      osc.stop(now + 0.05)
    } catch (e) {
      // Silenciar errores
    }
  }, [])
  
  /**
   * Sonido de exito/completado
   * Dos tonos ascendentes
   */
  const playSuccess = useCallback(async () => {
    try {
      const ctx = await resumeAudioContext()
      const now = ctx.currentTime
      
      // Primer tono
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(523.25, now) // C5
      gain1.gain.setValueAtTime(0.1, now)
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
      
      osc1.start(now)
      osc1.stop(now + 0.15)
      
      // Segundo tono (mas alto)
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(659.25, now + 0.1) // E5
      gain2.gain.setValueAtTime(0, now)
      gain2.gain.setValueAtTime(0.1, now + 0.1)
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
      
      osc2.start(now + 0.1)
      osc2.stop(now + 0.3)
    } catch (e) {
      // Silenciar errores
    }
  }, [])
  
  /**
   * Sonido de error/advertencia
   * Tono descendente
   */
  const playError = useCallback(async () => {
    try {
      const ctx = await resumeAudioContext()
      const now = ctx.currentTime
      
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(400, now)
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.2)
      
      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
      
      osc.start(now)
      osc.stop(now + 0.25)
    } catch (e) {
      // Silenciar errores
    }
  }, [])
  
  /**
   * Sonido de revelacion/drama
   * Acorde sostenido con reverb simulado
   */
  const playReveal = useCallback(async () => {
    try {
      const ctx = await resumeAudioContext()
      const now = ctx.currentTime
      
      // Crear multiples osciladores para acorde
      const frequencies = [261.63, 329.63, 392.00] // C4, E4, G4 (acorde mayor)
      
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now)
        
        // Entrada gradual
        gain.gain.setValueAtTime(0, now)
        gain.gain.linearRampToValueAtTime(0.06, now + 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5)
        
        osc.start(now)
        osc.stop(now + 1.5)
      })
    } catch (e) {
      // Silenciar errores
    }
  }, [])
  
  /**
   * Sonido de tick del timer
   * Click muy sutil
   */
  const playTick = useCallback(async () => {
    try {
      const ctx = await resumeAudioContext()
      const now = ctx.currentTime
      
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1200, now)
      
      gain.gain.setValueAtTime(0.03, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02)
      
      osc.start(now)
      osc.stop(now + 0.02)
    } catch (e) {
      // Silenciar errores
    }
  }, [])
  
  /**
   * Sonido de alerta de tiempo (ultimos segundos)
   * Beep urgente
   */
  const playTimeWarning = useCallback(async () => {
    try {
      const ctx = await resumeAudioContext()
      const now = ctx.currentTime
      
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.type = 'square'
      osc.frequency.setValueAtTime(880, now) // A5
      
      gain.gain.setValueAtTime(0.05, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
      
      osc.start(now)
      osc.stop(now + 0.1)
    } catch (e) {
      // Silenciar errores
    }
  }, [])
  
  return {
    playTypewriterKey,
    playCarriageReturn,
    playClick,
    playSuccess,
    playError,
    playReveal,
    playTick,
    playTimeWarning
  }
}

export default useAudio
