// === src/components/game/PlayerIndicator.jsx ===
// Muestra el nombre y color del jugador actual con indicador visual
import { motion } from 'framer-motion'
import { getInkColor } from '../../data/skins'

export default function PlayerIndicator({ 
  nombre, 
  indice, 
  ronda, 
  totalRondas,
  size = 'md' 
}) {
  const color = getInkColor(indice)
  
  const sizes = {
    sm: { badge: 'w-8 h-8 text-sm', text: 'text-lg' },
    md: { badge: 'w-10 h-10 text-base', text: 'text-xl' },
    lg: { badge: 'w-12 h-12 text-lg', text: 'text-2xl' }
  }
  
  const { badge, text } = sizes[size] || sizes.md
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3"
    >
      {/* Badge con numero de jugador */}
      <div
        className={`${badge} rounded-full flex items-center justify-center text-white font-mono font-bold shadow-md`}
        style={{ backgroundColor: color }}
      >
        {indice + 1}
      </div>
      
      {/* Nombre y ronda */}
      <div>
        <h2 
          className={`${text} font-display font-semibold ink-effect`}
          style={{ color }}
        >
          {nombre}
        </h2>
        {totalRondas > 1 && (
          <p className="text-historia-muted text-sm">
            Ronda {ronda} de {totalRondas}
          </p>
        )}
      </div>
    </motion.div>
  )
}
