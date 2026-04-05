// === src/components/game/TimerDisplay.jsx ===
// Muestra countdown visual con barra de progreso y colores de urgencia
import { motion } from 'framer-motion'

export default function TimerDisplay({ 
  tiempoFormateado, 
  porcentajeRestante,
  activo 
}) {
  // Determinar color segun tiempo restante
  const getColor = () => {
    if (porcentajeRestante > 50) return '#22C55E' // Verde
    if (porcentajeRestante > 25) return '#EAB308' // Amarillo
    return '#EF4444' // Rojo
  }
  
  const color = getColor()
  
  // Animacion de pulso cuando queda poco tiempo
  const shouldPulse = porcentajeRestante <= 25 && activo
  
  return (
    <div className="w-full">
      {/* Tiempo en texto */}
      <motion.div
        animate={shouldPulse ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
        className="text-center mb-2"
      >
        <span 
          className="font-mono text-3xl font-bold"
          style={{ color }}
        >
          {tiempoFormateado}
        </span>
      </motion.div>
      
      {/* Barra de progreso */}
      <div className="h-2 bg-historia-border rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: '100%' }}
          animate={{ width: `${porcentajeRestante}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}
