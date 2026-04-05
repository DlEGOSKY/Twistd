// === src/data/skins.js ===
// Definicion completa de skins visuales con paletas de colores
// Cada skin transforma la experiencia visual del juego

export const skins = {
  pergamino: {
    id: 'pergamino',
    nombre: 'Pergamino Antiguo',
    descripcion: 'Papel envejecido con tinta sepia',
    colores: {
      bg: '#F4ECD8',
      surface: '#FFF8E7',
      border: '#D4C5A9',
      text: '#3E2723',
      muted: '#8D6E63',
      accent: '#6D4C41'
    },
    // Fuente preferida para este skin
    fuentePrincipal: 'EB Garamond',
    // Efecto de textura CSS
    textura: true
  },
  
  maquina: {
    id: 'maquina',
    nombre: 'Maquina de Escribir',
    descripcion: 'Monocromo retro con teclas mecanicas',
    colores: {
      bg: '#1A1A1A',
      surface: '#2D2D2D',
      border: '#404040',
      text: '#E8E8E8',
      muted: '#888888',
      accent: '#CCCCCC'
    },
    fuentePrincipal: 'JetBrains Mono',
    textura: false
  },
  
  cuaderno: {
    id: 'cuaderno',
    nombre: 'Cuaderno Escolar',
    descripcion: 'Lineas azules sobre papel blanco',
    colores: {
      bg: '#FFFFFF',
      surface: '#F8FAFC',
      border: '#CBD5E1',
      text: '#1E293B',
      muted: '#64748B',
      accent: '#3B82F6'
    },
    fuentePrincipal: 'Crimson Pro',
    textura: false,
    // Lineas horizontales estilo cuaderno
    lineas: true
  },
  
  terminal: {
    id: 'terminal',
    nombre: 'Terminal Hacker',
    descripcion: 'Verde fosforo sobre negro absoluto',
    colores: {
      bg: '#0D0D0D',
      surface: '#1A1A1A',
      border: '#00FF00',
      text: '#00FF00',
      muted: '#008800',
      accent: '#00CC00'
    },
    fuentePrincipal: 'JetBrains Mono',
    textura: false,
    // Efecto de scanlines CRT
    scanlines: true
  },
  
  cuentos: {
    id: 'cuentos',
    nombre: 'Libro de Cuentos',
    descripcion: 'Ilustrado con colores pastel calidos',
    colores: {
      bg: '#FEF3E2',
      surface: '#FFFBF5',
      border: '#E8D5B7',
      text: '#5D4E37',
      muted: '#9B8B7A',
      accent: '#D4A574'
    },
    fuentePrincipal: 'EB Garamond',
    textura: true
  },
  
  papiro: {
    id: 'papiro',
    nombre: 'Papiro Egipcio',
    descripcion: 'Dorado antiguo con toques jeroglificos',
    colores: {
      bg: '#E8DCC8',
      surface: '#F5EDE0',
      border: '#C9B896',
      text: '#4A3C2A',
      muted: '#7D6E5A',
      accent: '#B8860B'
    },
    fuentePrincipal: 'EB Garamond',
    textura: true
  }
}

// Colores de tinta para jugadores (consistentes entre todos los skins)
// Cada jugador tiene un color unico para identificar sus contribuciones
export const inkColors = [
  { id: 'ink1', color: '#1A237E', nombre: 'Azul Tinta' },
  { id: 'ink2', color: '#B71C1C', nombre: 'Rojo Carmin' },
  { id: 'ink3', color: '#1B5E20', nombre: 'Verde Bosque' },
  { id: 'ink4', color: '#4A148C', nombre: 'Purpura Real' },
  { id: 'ink5', color: '#E65100', nombre: 'Naranja Oxido' },
  { id: 'ink6', color: '#006064', nombre: 'Turquesa Antiguo' },
  { id: 'ink7', color: '#880E4F', nombre: 'Magenta Oscuro' },
  { id: 'ink8', color: '#33691E', nombre: 'Oliva' },
  { id: 'ink9', color: '#BF360C', nombre: 'Terracota' },
  { id: 'ink10', color: '#4E342E', nombre: 'Marron Chocolate' }
]

// Lista ordenada de skins para UI
export const listaSkins = Object.values(skins)

// Obtener skin por ID con fallback a pergamino
export const getSkin = (id) => skins[id] || skins.pergamino

// Obtener color de tinta para un jugador por indice (0-9)
export const getInkColor = (index) => inkColors[index % inkColors.length].color
