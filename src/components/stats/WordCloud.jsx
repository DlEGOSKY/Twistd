// === src/components/stats/WordCloud.jsx ===
// Nube de palabras mas frecuentes con tamanos proporcionales
// CSS puro sin librerias de visualizacion

import { useMemo } from 'react'
import { motion } from 'framer-motion'

export default function WordCloud({ palabras, maxPalabras = 20 }) {
  const palabrasOrdenadas = useMemo(() => {
    return palabras.slice(0, maxPalabras)
  }, [palabras, maxPalabras])
  
  if (palabrasOrdenadas.length === 0) return null
  
  // Escalar tamaños de fuente basado en frecuencia
  const maxFrecuencia = palabrasOrdenadas[0]?.frecuencia || 1
  const minFrecuencia = palabrasOrdenadas[palabrasOrdenadas.length - 1]?.frecuencia || 1
  
  const getTamano = (frecuencia) => {
    const normalizado = (frecuencia - minFrecuencia) / (maxFrecuencia - minFrecuencia)
    return 12 + normalizado * 32 // 12px a 44px
  }
  
  const getOpacidad = (frecuencia) => {
    const normalizado = (frecuencia - minFrecuencia) / (maxFrecuencia - minFrecuencia)
    return 0.4 + normalizado * 0.6 // 40% a 100%
  }
  
  // Colores variados para las palabras
  const colores = [
    '#D4A574', // Pergamino
    '#8B4513', // Marron
    '#C9B896', // Beige
    '#6D4C41', // Chocolate
    '#8B7355', // Tierra
    '#CD853F'  // Peru
  ]
  
  return (
    <div className="card">
      <h3 className="font-display text-lg text-historia-text mb-3">
        Palabras Más Usadas
      </h3>
      
      <div className="flex flex-wrap justify-center items-center gap-2 p-4 min-h-[200px]">
        {palabrasOrdenadas.map((item, index) => {
          const tamano = getTamano(item.frecuencia)
          const opacidad = getOpacidad(item.frecuencia)
          const color = colores[index % colores.length]
          
          return (
            <motion.span
              key={item.palabra}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: opacidad, scale: 1 }}
              transition={{ 
                delay: index * 0.05,
                type: 'spring',
                stiffness: 200
              }}
              whileHover={{ scale: 1.1, opacity: 1 }}
              className="font-serif font-bold cursor-default select-none"
              style={{
                fontSize: `${tamano}px`,
                color: color,
                lineHeight: 1.2,
                padding: '2px 4px'
              }}
              title={`${item.palabra}: ${item.frecuencia} veces`}
            >
              {item.palabra}
            </motion.span>
          )
        })}
      </div>
      
      {/* Leyenda */}
      <div className="border-t border-historia-border pt-2 mt-2">
        <div className="flex justify-between items-center text-xs text-historia-muted px-2">
          <span>Menos frecuente</span>
          <span>→</span>
          <span>Más frecuente</span>
        </div>
      </div>
    </div>
  )
}
