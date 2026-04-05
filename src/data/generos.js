// === src/data/generos.js ===
// Configuracion de generos narrativos con palabras clave para algoritmo de caos
// Las palabras clave ayudan a detectar coherencia tematica entre contribuciones

export const generos = {
  terror: {
    id: 'terror',
    nombre: 'Terror',
    descripcion: 'Historias que helaran la sangre',
    // Palabras clave para detectar coherencia tematica
    palabrasClave: [
      'oscuridad', 'sombra', 'muerte', 'sangre', 'grito', 'miedo',
      'fantasma', 'demonio', 'monstruo', 'pesadilla', 'tumba', 'cementerio',
      'noche', 'silencio', 'escalofrio', 'terror', 'horror', 'criatura',
      'maldicion', 'espiritu', 'cadaver', 'susurro', 'pasos', 'puerta',
      'sotano', 'atico', 'abandonado', 'oscuro', 'frio', 'helado'
    ],
    // Color tematico para UI
    colorTema: '#8B0000'
  },
  
  romance: {
    id: 'romance',
    nombre: 'Romance',
    descripcion: 'Amores que trascienden el tiempo',
    palabrasClave: [
      'amor', 'corazon', 'beso', 'abrazo', 'mirada', 'pasion',
      'caricia', 'suspiro', 'destino', 'alma', 'eterno', 'dulce',
      'tierno', 'suave', 'labios', 'manos', 'ojos', 'sonrisa',
      'encuentro', 'carta', 'promesa', 'juntos', 'siempre', 'nunca',
      'espera', 'anhelo', 'deseo', 'secreto', 'luna', 'estrellas'
    ],
    colorTema: '#C71585'
  },
  
  aventura: {
    id: 'aventura',
    nombre: 'Aventura',
    descripcion: 'Viajes epicos y descubrimientos',
    palabrasClave: [
      'viaje', 'tesoro', 'mapa', 'isla', 'selva', 'montana',
      'rio', 'barco', 'espada', 'heroe', 'mision', 'peligro',
      'trampa', 'cueva', 'secreto', 'antiguo', 'perdido', 'descubrir',
      'explorar', 'correr', 'saltar', 'escapar', 'luchar', 'victoria',
      'enemigo', 'aliado', 'camino', 'horizonte', 'brujula', 'aventurero'
    ],
    colorTema: '#228B22'
  },
  
  scifi: {
    id: 'scifi',
    nombre: 'Ciencia Ficcion',
    descripcion: 'Futuros posibles e imposibles',
    palabrasClave: [
      'nave', 'espacio', 'galaxia', 'planeta', 'estrella', 'robot',
      'androide', 'laser', 'teletransporte', 'dimension', 'tiempo', 'futuro',
      'tecnologia', 'computadora', 'inteligencia', 'artificial', 'alien', 'extraterrestre',
      'colonia', 'estacion', 'orbital', 'gravedad', 'luz', 'velocidad',
      'universo', 'cosmos', 'mision', 'capitan', 'tripulacion', 'portal'
    ],
    colorTema: '#4169E1'
  },
  
  fairytale: {
    id: 'fairytale',
    nombre: 'Cuento de Hadas',
    descripcion: 'Magia y finales felices',
    palabrasClave: [
      'princesa', 'principe', 'rey', 'reina', 'castillo', 'dragon',
      'hada', 'magia', 'varita', 'hechizo', 'encantado', 'bosque',
      'bruja', 'ogro', 'gigante', 'enano', 'duende', 'unicornio',
      'corona', 'trono', 'torre', 'espejo', 'manzana', 'rosa',
      'baile', 'medianoche', 'zapato', 'cristal', 'oro', 'plata'
    ],
    colorTema: '#9932CC'
  },
  
  comedia: {
    id: 'comedia',
    nombre: 'Comedia',
    descripcion: 'Situaciones absurdas y risas',
    palabrasClave: [
      'risa', 'broma', 'absurdo', 'ridiculo', 'torpe', 'caer',
      'tropezar', 'confundir', 'equivocar', 'loco', 'disparate', 'payaso',
      'fiesta', 'baile', 'cantar', 'gritar', 'correr', 'perseguir',
      'esconder', 'disfraz', 'sorpresa', 'accidente', 'desastre', 'caos',
      'vecino', 'jefe', 'suegra', 'perro', 'gato', 'loro'
    ],
    colorTema: '#FFD700'
  },
  
  misterio: {
    id: 'misterio',
    nombre: 'Misterio',
    descripcion: 'Enigmas por resolver',
    palabrasClave: [
      'detective', 'pista', 'evidencia', 'sospechoso', 'crimen', 'escena',
      'testigo', 'coartada', 'motivo', 'culpable', 'inocente', 'secreto',
      'oculto', 'descubrir', 'investigar', 'seguir', 'observar', 'nota',
      'carta', 'mensaje', 'codigo', 'llave', 'puerta', 'cerrada',
      'mansion', 'biblioteca', 'estudio', 'noche', 'lluvia', 'sombra'
    ],
    colorTema: '#2F4F4F'
  },
  
  western: {
    id: 'western',
    nombre: 'Western',
    descripcion: 'El salvaje oeste americano',
    palabrasClave: [
      'vaquero', 'sheriff', 'bandido', 'forajido', 'caballo', 'revolver',
      'duelo', 'saloon', 'desierto', 'cactus', 'sol', 'polvo',
      'tren', 'banco', 'oro', 'mina', 'carreta', 'frontera',
      'indio', 'apache', 'bufalo', 'ganado', 'rancho', 'cantina',
      'whisky', 'poker', 'sombrero', 'espuelas', 'lazo', 'wanted'
    ],
    colorTema: '#CD853F'
  }
}

// Lista ordenada de generos para UI
export const listaGeneros = Object.values(generos)

// Alias para compatibilidad
export const GENEROS = listaGeneros

// Obtener genero por ID con fallback
export const getGenero = (id) => generos[id] || generos.terror
