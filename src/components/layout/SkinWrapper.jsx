// === src/components/layout/SkinWrapper.jsx ===
// Wrapper que aplica el tema visual (skin) activo a toda la aplicacion
// Usa CSS custom properties para permitir cambio dinamico de colores

import { useMemo } from 'react'

// Definicion de skins disponibles con sus paletas de colores
const skins = {
  pergamino: {
    name: 'Pergamino Antiguo',
    bg: '#F4ECD8',
    surface: '#FFF8E7',
    border: '#D4C5A9',
    text: '#3E2723',
    muted: '#8D6E63',
    accent: '#6D4C41'
  },
  maquina: {
    name: 'Maquina de Escribir',
    bg: '#1A1A1A',
    surface: '#2D2D2D',
    border: '#404040',
    text: '#E8E8E8',
    muted: '#888888',
    accent: '#CCCCCC'
  },
  cuaderno: {
    name: 'Cuaderno Escolar',
    bg: '#FFFFFF',
    surface: '#F8FAFC',
    border: '#CBD5E1',
    text: '#1E293B',
    muted: '#64748B',
    accent: '#3B82F6'
  },
  terminal: {
    name: 'Terminal Hacker',
    bg: '#0D0D0D',
    surface: '#1A1A1A',
    border: '#00FF00',
    text: '#00FF00',
    muted: '#008800',
    accent: '#00CC00'
  },
  cuentos: {
    name: 'Libro de Cuentos',
    bg: '#FEF3E2',
    surface: '#FFFBF5',
    border: '#E8D5B7',
    text: '#5D4E37',
    muted: '#9B8B7A',
    accent: '#D4A574'
  },
  papiro: {
    name: 'Papiro Egipcio',
    bg: '#E8DCC8',
    surface: '#F5EDE0',
    border: '#C9B896',
    text: '#4A3C2A',
    muted: '#7D6E5A',
    accent: '#B8860B'
  }
}

// Colores de tinta para jugadores (consistentes entre skins)
const inkColors = [
  '#1A237E', // Azul tinta
  '#B71C1C', // Rojo carmin
  '#1B5E20', // Verde bosque
  '#4A148C', // Purpura real
  '#E65100', // Naranja oxido
  '#006064', // Turquesa antiguo
  '#880E4F', // Magenta oscuro
  '#33691E', // Oliva
  '#BF360C', // Terracota
  '#4E342E'  // Marron chocolate
]

export default function SkinWrapper({ skinId = 'pergamino', children }) {
  // Generar CSS custom properties basadas en el skin activo
  const skinStyles = useMemo(() => {
    const skin = skins[skinId] || skins.pergamino
    
    return {
      '--historia-bg': skin.bg,
      '--historia-surface': skin.surface,
      '--historia-border': skin.border,
      '--historia-text': skin.text,
      '--historia-muted': skin.muted,
      '--historia-accent': skin.accent,
      // Colores de tinta para jugadores
      ...inkColors.reduce((acc, color, i) => {
        acc[`--historia-ink${i + 1}`] = color
        return acc
      }, {})
    }
  }, [skinId])

  return (
    <div
      style={skinStyles}
      className="min-h-screen min-h-[100dvh] skin-transition"
      data-skin={skinId}
    >
      {children}
    </div>
  )
}

// Exportar lista de skins para uso en configuracion
export { skins, inkColors }
