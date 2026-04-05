// === src/screens/TurnScreen.jsx ===
// Pantalla principal del turno donde el jugador escribe su contribucion
// Muestra contexto, timer, input y boton de envio

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { useTimer } from '../hooks/useTimer'
import { Button } from '../components/ui'
import { 
  PlayerIndicator, 
  TimerDisplay, 
  ContextClue, 
  ContributionInput 
} from '../components/game'
import { getGenero } from '../data/generos'

export default function TurnScreen() {
  const {
    config,
    partida,
    jugadorActual,
    contextoVisible,
    oracionesPorTurno,
    enviarContribucion,
    siguienteTurno,
    tiempoAgotado
  } = useGame()
  
  // Estado local para el texto de la contribucion
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  
  // Hook del timer (solo si hay limite de tiempo)
  const timerActivo = config.timer !== null
  const { 
    tiempoFormateado, 
    porcentajeRestante, 
    activo,
    iniciar,
    detener 
  } = useTimer(config.timer || 60, () => {
    // Callback cuando se acaba el tiempo
    handleTiempoAgotado()
  })
  
  // Iniciar timer al montar
  useEffect(() => {
    if (timerActivo) {
      iniciar(config.timer)
    }
    return () => detener()
  }, [timerActivo, config.timer, iniciar, detener])
  
  // Manejar tiempo agotado
  const handleTiempoAgotado = useCallback(() => {
    if (texto.trim()) {
      // Si hay texto, enviarlo aunque no cumpla minimo
      enviarContribucion(texto)
    } else {
      // Si no hay texto, marcar como tiempo agotado
      enviarContribucion('(Sin contribucion - tiempo agotado)')
    }
    tiempoAgotado()
    siguienteTurno()
  }, [texto, enviarContribucion, tiempoAgotado, siguienteTurno])
  
  // Manejar envio de contribucion
  const handleEnviar = useCallback(() => {
    if (enviando) return
    setEnviando(true)
    
    detener()
    enviarContribucion(texto)
    siguienteTurno()
  }, [texto, enviando, detener, enviarContribucion, siguienteTurno])
  
  // Obtener info del genero
  const genero = getGenero(config.genero)
  
  // Indice del jugador actual
  const indiceJugador = config.jugadores.indexOf(jugadorActual)
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="screen-container"
    >
      <div className="max-w-lg mx-auto w-full flex flex-col h-full">
        
        {/* Header con jugador y timer */}
        <div className="flex items-start justify-between mb-4">
          <PlayerIndicator
            nombre={jugadorActual}
            indice={indiceJugador}
            ronda={partida.rondaActual}
            totalRondas={config.rondas}
          />
          
          {/* Badge de genero */}
          <span 
            className="px-3 py-1 rounded-full text-sm font-display text-white"
            style={{ backgroundColor: genero.colorTema }}
          >
            {genero.nombre}
          </span>
        </div>
        
        {/* Timer (si esta activo) */}
        {timerActivo && (
          <div className="mb-4">
            <TimerDisplay
              tiempoFormateado={tiempoFormateado}
              porcentajeRestante={porcentajeRestante}
              activo={activo}
            />
          </div>
        )}
        
        {/* Contexto visible */}
        <div className="mb-4">
          <ContextClue
            contexto={contextoVisible}
            modo={config.modo}
            genero={config.genero}
          />
        </div>
        
        {/* Input de contribucion */}
        <div className="flex-1 mb-4">
          <ContributionInput
            value={texto}
            onChange={setTexto}
            onSubmit={handleEnviar}
            oracionesRequeridas={oracionesPorTurno}
            disabled={enviando}
          />
        </div>
        
        {/* Boton de enviar */}
        <Button
          onClick={handleEnviar}
          disabled={!texto.trim() || enviando}
          fullWidth
          size="lg"
        >
          {enviando ? 'Enviando...' : 'Listo, pasar turno'}
        </Button>
      </div>
    </motion.div>
  )
}
