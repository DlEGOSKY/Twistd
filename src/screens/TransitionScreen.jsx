// === src/screens/TransitionScreen.jsx ===
// Pantalla negra entre turnos para ocultar contribuciones
// Muestra nombre del siguiente jugador y boton para revelar turno

import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { getInkColor } from '../data/skins'

export default function TransitionScreen() {
  const { 
    config,
    partida,
    jugadorActual,
    progresoPartida,
    iniciarTurno 
  } = useGame()
  
  // Indice del jugador actual
  const indiceJugador = config.jugadores.indexOf(jugadorActual)
  const colorJugador = getInkColor(indiceJugador)
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen min-h-[100dvh] bg-black flex flex-col items-center justify-center p-6"
    >
      {/* Instruccion */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-gray-500 text-sm mb-8 text-center"
      >
        Pasa el dispositivo a:
      </motion.p>
      
      {/* Nombre del jugador */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
        className="text-center mb-8"
      >
        <h1 
          className="font-display text-5xl font-bold mb-2"
          style={{ color: colorJugador }}
        >
          {jugadorActual}
        </h1>
        
        {config.rondas > 1 && (
          <p className="text-gray-600 text-lg">
            Ronda {partida.rondaActual} de {config.rondas}
          </p>
        )}
      </motion.div>
      
      {/* Barra de progreso */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-xs mb-8"
      >
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: colorJugador }}
            initial={{ width: 0 }}
            animate={{ width: `${progresoPartida.porcentaje}%` }}
            transition={{ delay: 0.8, duration: 0.5 }}
          />
        </div>
        <p className="text-gray-600 text-xs text-center mt-2">
          Turno {progresoPartida.actual + 1} de {progresoPartida.total}
        </p>
      </motion.div>
      
      {/* Boton para revelar turno */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={iniciarTurno}
        className="px-8 py-4 rounded-xl text-lg font-display font-semibold transition-colors"
        style={{ 
          backgroundColor: colorJugador,
          color: '#FFFFFF'
        }}
      >
        Revelar mi turno
      </motion.button>
      
      {/* Advertencia de privacidad */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-gray-700 text-xs mt-6 text-center max-w-xs"
      >
        Asegurate de que solo {jugadorActual} pueda ver la pantalla
      </motion.p>
    </motion.div>
  )
}
