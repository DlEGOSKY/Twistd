// === src/components/reveal/ReactionPanel.jsx ===
// Panel de botones de reaccion para que cada jugador vote
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactionIcon, { tiposReaccion, coloresReaccion } from '../ui/ReactionIcon'

export default function ReactionPanel({
  jugadores,
  reacciones,
  onReaccion,
  jugadorActivo = null  // Si se especifica, solo ese jugador puede votar
}) {
  const [jugadorSeleccionando, setJugadorSeleccionando] = useState(null)
  
  // Contar reacciones por tipo
  const conteoReacciones = tiposReaccion.reduce((acc, tipo) => {
    acc[tipo] = Object.values(reacciones).filter(r => r === tipo).length
    return acc
  }, {})
  
  // Manejar seleccion de jugador para votar
  const handleSeleccionarJugador = (jugador) => {
    if (jugadorActivo && jugador !== jugadorActivo) return
    setJugadorSeleccionando(jugador)
  }
  
  // Manejar voto de reaccion
  const handleVotar = (tipo) => {
    if (jugadorSeleccionando) {
      onReaccion(jugadorSeleccionando, tipo)
      setJugadorSeleccionando(null)
    }
  }
  
  return (
    <div className="card">
      <h3 className="font-display text-lg text-historia-text mb-4 text-center">
        Reacciones
      </h3>
      
      {/* Botones de reaccion con conteo */}
      <div className="flex justify-center gap-3 mb-4">
        {tiposReaccion.map(tipo => (
          <motion.button
            key={tipo}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => jugadorSeleccionando && handleVotar(tipo)}
            disabled={!jugadorSeleccionando}
            className={`
              relative p-3 rounded-xl transition-colors
              ${jugadorSeleccionando 
                ? 'bg-historia-surface hover:bg-historia-bg cursor-pointer' 
                : 'bg-historia-bg cursor-default'}
            `}
          >
            <ReactionIcon tipo={tipo} size={32} />
            
            {/* Badge de conteo */}
            <AnimatePresence>
              {conteoReacciones[tipo] > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                  style={{ backgroundColor: coloresReaccion[tipo] }}
                >
                  {conteoReacciones[tipo]}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
      
      {/* Lista de jugadores para votar */}
      <div className="border-t border-historia-border pt-4">
        <p className="text-historia-muted text-sm text-center mb-3">
          {jugadorSeleccionando 
            ? `${jugadorSeleccionando}, elige tu reaccion:`
            : 'Toca tu nombre para reaccionar:'}
        </p>
        
        <div className="flex flex-wrap justify-center gap-2">
          {jugadores.map((jugador, index) => {
            const yaVoto = reacciones[jugador]
            const estaSeleccionando = jugadorSeleccionando === jugador
            
            return (
              <motion.button
                key={jugador}
                whileTap={{ scale: 0.95 }}
                onClick={() => !yaVoto && handleSeleccionarJugador(jugador)}
                disabled={yaVoto}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-display transition-all
                  ${estaSeleccionando 
                    ? 'ring-2 ring-historia-accent bg-historia-accent text-white' 
                    : yaVoto
                      ? 'bg-historia-bg text-historia-muted'
                      : 'bg-historia-surface hover:bg-historia-bg text-historia-text'}
                `}
              >
                {jugador}
                {yaVoto && (
                  <span className="ml-1">
                    <ReactionIcon tipo={yaVoto} size={14} />
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
      
      {/* Instruccion de cancelar */}
      {jugadorSeleccionando && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-historia-muted mt-3"
        >
          <button 
            onClick={() => setJugadorSeleccionando(null)}
            className="underline hover:text-historia-text"
          >
            Cancelar
          </button>
        </motion.p>
      )}
    </div>
  )
}
