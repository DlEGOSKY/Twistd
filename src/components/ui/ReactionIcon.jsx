// === src/components/ui/ReactionIcon.jsx ===
// Iconos SVG para las 5 reacciones disponibles
// Cada icono es un SVG inline estilizado sin emojis

const iconos = {
  // Risa - cara sonriente con lineas de risa
  risa: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
      <path d="M6 8l-2-1" />
      <path d="M18 8l2-1" />
    </svg>
  ),
  
  // Asombro - cara con ojos muy abiertos
  asombro: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="9" cy="9" r="1.5" fill="currentColor" />
      <circle cx="15" cy="9" r="1.5" fill="currentColor" />
      <circle cx="12" cy="15" r="2" />
    </svg>
  ),
  
  // Confusion - cara con signos de interrogacion
  confusion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
      <path d="M8 15s1-1 4-1 4 1 4 1" />
      <path d="M5 5l2 2" />
      <path d="M19 5l-2 2" />
      <text x="4" y="8" fontSize="6" fill="currentColor" stroke="none">?</text>
      <text x="18" y="8" fontSize="6" fill="currentColor" stroke="none">?</text>
    </svg>
  ),
  
  // Amor - corazon con trazo elegante
  amor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  
  // Terror - cara con expresion de susto
  terror: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="9" cy="9" r="1.5" />
      <circle cx="15" cy="9" r="1.5" />
      <ellipse cx="12" cy="15" rx="2" ry="3" />
      <path d="M8 5l1 2" />
      <path d="M16 5l-1 2" />
    </svg>
  )
}

// Nombres para mostrar en UI
const nombres = {
  risa: 'Risa',
  asombro: 'Asombro',
  confusion: 'Confusion',
  amor: 'Amor',
  terror: 'Terror'
}

// Colores asociados a cada reaccion
const colores = {
  risa: '#F59E0B',     // Amarillo
  asombro: '#8B5CF6',  // Purpura
  confusion: '#6B7280', // Gris
  amor: '#EC4899',     // Rosa
  terror: '#1F2937'    // Oscuro
}

export default function ReactionIcon({ 
  tipo, 
  size = 24, 
  className = '',
  showLabel = false 
}) {
  const icono = iconos[tipo]
  const nombre = nombres[tipo]
  const color = colores[tipo]
  
  if (!icono) return null
  
  return (
    <span 
      className={`inline-flex items-center gap-1 ${className}`}
      style={{ color }}
      title={nombre}
    >
      <span style={{ width: size, height: size }}>
        {icono}
      </span>
      {showLabel && (
        <span className="text-sm font-display">{nombre}</span>
      )}
    </span>
  )
}

// Exportar lista de tipos para iterar
export const tiposReaccion = Object.keys(iconos)
export { nombres as nombresReaccion, colores as coloresReaccion }
