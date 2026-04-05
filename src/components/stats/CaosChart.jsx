// === src/components/stats/CaosChart.jsx ===
// Grafico de linea mostrando evolucion del caos por contribucion
// SVG puro sin librerias externas

import { motion } from 'framer-motion'
import { getInkColor } from '../../data/skins'
import { getColorCaos } from '../../utils/caos'

export default function CaosChart({ evolucion, jugadores }) {
  if (!evolucion || evolucion.length === 0) return null
  
  const width = 400
  const height = 200
  const padding = { top: 20, right: 30, bottom: 30, left: 40 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom
  
  // Calcular escala
  const maxCaos = Math.max(...evolucion.map(e => e.caos))
  const minCaos = Math.min(...evolucion.map(e => e.caos))
  const rangoCaos = maxCaos - minCaos || 1
  
  // Generar puntos
  const puntos = evolucion.map((e, i) => {
    const x = padding.left + (i / (evolucion.length - 1)) * chartWidth
    const y = padding.top + chartHeight - ((e.caos - minCaos) / rangoCaos) * chartHeight
    return { x, y, caos: e.caos, indice: i, jugador: e.jugador }
  })
  
  // Generar path de la linea
  const linePath = puntos
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')
  
  // Area bajo la curva
  const areaPath = `
    M ${puntos[0].x} ${padding.top + chartHeight}
    L ${puntos[0].x} ${puntos[0].y}
    ${puntos.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}
    L ${puntos[puntos.length - 1].x} ${padding.top + chartHeight}
    Z
  `
  
  return (
    <div className="card">
      <h3 className="font-display text-lg text-historia-text mb-3">
        Evolución del Caos
      </h3>
      
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full"
        style={{ maxWidth: '100%' }}
      >
        {/* Grid horizontal */}
        {[0, 25, 50, 75, 100].map(valor => {
          const y = padding.top + chartHeight - ((valor - minCaos) / rangoCaos) * chartHeight
          return (
            <g key={valor}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-historia-border"
                opacity="0.3"
              />
              <text
                x={padding.left - 5}
                y={y}
                textAnchor="end"
                fontSize="10"
                className="text-historia-muted fill-current"
                dominantBaseline="middle"
              >
                {valor}%
              </text>
            </g>
          )
        })}
        
        {/* Area bajo la curva */}
        <motion.path
          d={areaPath}
          fill="url(#gradientCaos)"
          opacity="0.2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
        />
        
        {/* Gradiente */}
        <defs>
          <linearGradient id="gradientCaos" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={getColorCaos(maxCaos)} stopOpacity="0.8" />
            <stop offset="100%" stopColor={getColorCaos(minCaos)} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Linea principal */}
        <motion.path
          d={linePath}
          fill="none"
          stroke={getColorCaos((maxCaos + minCaos) / 2)}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        
        {/* Puntos */}
        {puntos.map((p, i) => {
          const indiceJugador = jugadores.indexOf(p.jugador)
          const color = getInkColor(indiceJugador >= 0 ? indiceJugador : 0)
          
          return (
            <motion.g
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill={color}
                stroke="white"
                strokeWidth="1.5"
              />
              <title>{p.jugador}: {p.caos}%</title>
            </motion.g>
          )
        })}
        
        {/* Eje X (indices de contribucion) */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={width - padding.right}
          y2={padding.top + chartHeight}
          stroke="currentColor"
          strokeWidth="1"
          className="text-historia-border"
        />
        
        {/* Labels del eje X */}
        {puntos.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={padding.top + chartHeight + 15}
            textAnchor="middle"
            fontSize="9"
            className="text-historia-muted fill-current"
          >
            {i + 1}
          </text>
        ))}
      </svg>
      
      {/* Leyenda */}
      <p className="text-historia-muted text-xs text-center mt-2">
        Contribuciones (1-{evolucion.length})
      </p>
    </div>
  )
}
