// === src/components/game/ContextClue.jsx ===
// Muestra el contexto visible para el jugador actual segun el modo de juego
// Normal: ultima oracion completa | Dificil: ultima palabra | Imagen: arte CSS
import { motion } from 'framer-motion'
import CSSArt from './CSSArt'

export default function ContextClue({ 
  contexto, 
  modo, 
  genero 
}) {
  // Modo imagen: mostrar arte CSS abstracto
  if (modo === 'imagen') {
    return (
      <div className="card paper-texture">
        <p className="text-historia-muted text-sm mb-3 text-center">
          Describe lo que ves en esta imagen:
        </p>
        <CSSArt genero={genero} />
      </div>
    )
  }
  
  // Modo dificil: solo mostrar ultima palabra destacada
  if (modo === 'dificil') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card paper-texture text-center py-6"
      >
        <p className="text-historia-muted text-sm mb-2">
          Tu unica pista:
        </p>
        <p className="font-serif text-3xl text-historia-text font-bold">
          "{contexto}"
        </p>
      </motion.div>
    )
  }
  
  // Modo normal: mostrar ultima oracion completa
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card paper-texture"
    >
      <p className="text-historia-muted text-sm mb-2">
        La historia hasta ahora termina con:
      </p>
      <p className="font-serif text-lg text-historia-text italic leading-relaxed">
        "...{contexto}"
      </p>
    </motion.div>
  )
}
