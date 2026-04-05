// === src/components/reveal/CaosScore.jsx ===
// Medidor visual de puntuacion de caos con animacion
import { motion } from 'framer-motion'
import { getDescripcionCaos, getColorCaos } from '../../utils/caos'

export default function CaosScore({ puntaje, animado = true }) {
  const { nivel, descripcion } = getDescripcionCaos(puntaje)
  const color = getColorCaos(puntaje)
  
  return (
    <div className="card paper-texture">
      <h3 className="font-display text-lg text-historia-text mb-3 text-center">
        Nivel de Caos
      </h3>
      
      {/* Barra de progreso */}
      <div className="relative h-4 bg-historia-border rounded-full overflow-hidden mb-3">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={animado ? { width: 0 } : { width: `${puntaje}%` }}
          animate={{ width: `${puntaje}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        
        {/* Marcadores de referencia */}
        <div className="absolute inset-0 flex justify-between px-1">
          {[20, 40, 60, 80].map(marca => (
            <div
              key={marca}
              className="w-px h-full bg-historia-bg/50"
              style={{ marginLeft: `${marca}%` }}
            />
          ))}
        </div>
      </div>
      
      {/* Puntaje numerico */}
      <div className="text-center">
        <motion.span
          className="font-mono text-4xl font-bold"
          style={{ color }}
          initial={animado ? { opacity: 0, scale: 0.5 } : {}}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {puntaje}%
        </motion.span>
      </div>
      
      {/* Nivel y descripcion */}
      <motion.div
        className="text-center mt-2"
        initial={animado ? { opacity: 0, y: 10 } : {}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
      >
        <p 
          className="font-display text-xl font-semibold"
          style={{ color }}
        >
          {nivel}
        </p>
        <p className="text-historia-muted text-sm mt-1">
          {descripcion}
        </p>
      </motion.div>
      
      {/* Escala de referencia */}
      <div className="flex justify-between text-xs text-historia-muted mt-4 px-1">
        <span>Coherente</span>
        <span>Delirio</span>
      </div>
    </div>
  )
}

// Version compacta para mostrar en tarjetas
export function CaosScoreCompact({ puntaje }) {
  const color = getColorCaos(puntaje)
  const { nivel } = getDescripcionCaos(puntaje)
  
  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="font-mono text-sm" style={{ color }}>
        {puntaje}%
      </span>
      <span className="text-historia-muted text-xs">
        ({nivel})
      </span>
    </div>
  )
}
