// === src/components/game/CSSArt.jsx ===
// Genera arte abstracto CSS aleatorio para el modo imagen
// Usa formas geometricas con colores del genero seleccionado
import { useMemo } from 'react'
import { getGenero } from '../../data/generos'

// Colores base por genero para el arte
const coloresPorGenero = {
  terror: ['#1A1A2E', '#16213E', '#0F3460', '#E94560', '#533483'],
  romance: ['#FFE6E6', '#FF9999', '#FF6B6B', '#C44569', '#6C5B7B'],
  aventura: ['#2D5016', '#5C8A2F', '#8BC34A', '#CDDC39', '#795548'],
  scifi: ['#0D1B2A', '#1B263B', '#415A77', '#778DA9', '#00D9FF'],
  fairytale: ['#E8D5B7', '#F0E68C', '#DDA0DD', '#98D8C8', '#F7DC6F'],
  comedia: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'],
  misterio: ['#2C3E50', '#34495E', '#7F8C8D', '#95A5A6', '#BDC3C7'],
  western: ['#D4A574', '#C9B896', '#8B7355', '#CD853F', '#DEB887']
}

// Generar forma aleatoria
function generarForma(index, colores) {
  const tipos = ['circle', 'square', 'triangle', 'line']
  const tipo = tipos[Math.floor(Math.random() * tipos.length)]
  const color = colores[Math.floor(Math.random() * colores.length)]
  const size = 20 + Math.random() * 60
  const x = Math.random() * 80 + 10
  const y = Math.random() * 80 + 10
  const rotation = Math.random() * 360
  const opacity = 0.4 + Math.random() * 0.6
  
  return { tipo, color, size, x, y, rotation, opacity, id: index }
}

export default function CSSArt({ genero }) {
  // Generar formas aleatorias basadas en el genero
  const formas = useMemo(() => {
    const colores = coloresPorGenero[genero] || coloresPorGenero.terror
    const cantidad = 5 + Math.floor(Math.random() * 4) // 5-8 formas
    return Array.from({ length: cantidad }, (_, i) => generarForma(i, colores))
  }, [genero])
  
  // Renderizar forma segun tipo
  const renderForma = (forma) => {
    const baseStyle = {
      position: 'absolute',
      left: `${forma.x}%`,
      top: `${forma.y}%`,
      transform: `translate(-50%, -50%) rotate(${forma.rotation}deg)`,
      opacity: forma.opacity
    }
    
    switch (forma.tipo) {
      case 'circle':
        return (
          <div
            key={forma.id}
            style={{
              ...baseStyle,
              width: forma.size,
              height: forma.size,
              borderRadius: '50%',
              backgroundColor: forma.color
            }}
          />
        )
      
      case 'square':
        return (
          <div
            key={forma.id}
            style={{
              ...baseStyle,
              width: forma.size,
              height: forma.size,
              backgroundColor: forma.color
            }}
          />
        )
      
      case 'triangle':
        return (
          <div
            key={forma.id}
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              borderLeft: `${forma.size / 2}px solid transparent`,
              borderRight: `${forma.size / 2}px solid transparent`,
              borderBottom: `${forma.size}px solid ${forma.color}`,
              backgroundColor: 'transparent'
            }}
          />
        )
      
      case 'line':
        return (
          <div
            key={forma.id}
            style={{
              ...baseStyle,
              width: forma.size * 1.5,
              height: 4 + Math.random() * 4,
              backgroundColor: forma.color
            }}
          />
        )
      
      default:
        return null
    }
  }
  
  return (
    <div 
      className="relative w-full aspect-square bg-historia-surface rounded-lg overflow-hidden border border-historia-border"
      style={{ maxWidth: 280, margin: '0 auto' }}
    >
      {formas.map(renderForma)}
    </div>
  )
}
