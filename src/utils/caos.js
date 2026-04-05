// === src/utils/caos.js ===
// Algoritmo de puntuacion de caos narrativo
// Analiza coherencia tematica entre contribuciones usando palabras clave

import { getGenero } from '../data/generos'

/**
 * Calcula el puntaje de caos de una historia (0-100)
 * 0 = Historia muy coherente
 * 100 = Caos total, sin conexion entre partes
 * 
 * Factores analizados:
 * 1. Coincidencia con palabras clave del genero
 * 2. Transiciones abruptas de tema entre contribuciones
 * 3. Longitud y complejidad de oraciones
 * 4. Repeticion de conceptos (reduce caos)
 */
export function calcularCaos(contribuciones, generoId) {
  // Filtrar la frase inicial del sistema
  const contribucionesJugadores = contribuciones.filter(c => !c.esFraseInicial)
  
  if (contribucionesJugadores.length < 2) {
    // Con menos de 2 contribuciones no hay suficiente para medir caos
    return 50
  }
  
  const genero = getGenero(generoId)
  const palabrasClave = genero.palabrasClave || []
  
  let puntajeCaos = 0
  let factoresEvaluados = 0
  
  // Factor 1: Coincidencia con genero (0-25 puntos de caos)
  // Menos coincidencias = mas caos
  const coincidenciasGenero = contarCoincidenciasGenero(contribucionesJugadores, palabrasClave)
  const porcentajeCoincidencia = Math.min(coincidenciasGenero / contribucionesJugadores.length, 1)
  puntajeCaos += (1 - porcentajeCoincidencia) * 25
  factoresEvaluados++
  
  // Factor 2: Transiciones abruptas (0-35 puntos de caos)
  // Cambios bruscos de tema entre contribuciones consecutivas
  const transicionesAbruptas = detectarTransicionesAbruptas(contribucionesJugadores)
  const porcentajeTransiciones = transicionesAbruptas / Math.max(contribucionesJugadores.length - 1, 1)
  puntajeCaos += porcentajeTransiciones * 35
  factoresEvaluados++
  
  // Factor 3: Diversidad lexica (0-20 puntos de caos)
  // Muchas palabras unicas = potencialmente mas caotico
  const diversidad = calcularDiversidadLexica(contribucionesJugadores)
  puntajeCaos += diversidad * 20
  factoresEvaluados++
  
  // Factor 4: Consistencia de longitud (0-20 puntos de caos)
  // Variaciones extremas en longitud = mas caotico
  const variacionLongitud = calcularVariacionLongitud(contribucionesJugadores)
  puntajeCaos += variacionLongitud * 20
  factoresEvaluados++
  
  // Normalizar y redondear
  const caosNormalizado = Math.round(Math.min(Math.max(puntajeCaos, 0), 100))
  
  return caosNormalizado
}

/**
 * Cuenta cuantas contribuciones contienen palabras clave del genero
 */
function contarCoincidenciasGenero(contribuciones, palabrasClave) {
  if (palabrasClave.length === 0) return contribuciones.length
  
  let coincidencias = 0
  
  for (const contrib of contribuciones) {
    const textoLower = contrib.texto.toLowerCase()
    const tieneCoincidencia = palabrasClave.some(palabra => 
      textoLower.includes(palabra.toLowerCase())
    )
    if (tieneCoincidencia) coincidencias++
  }
  
  return coincidencias
}

/**
 * Detecta transiciones abruptas entre contribuciones consecutivas
 * Una transicion es abrupta si no comparten palabras significativas
 */
function detectarTransicionesAbruptas(contribuciones) {
  if (contribuciones.length < 2) return 0
  
  let transicionesAbruptas = 0
  
  for (let i = 1; i < contribuciones.length; i++) {
    const anterior = extraerPalabrasSignificativas(contribuciones[i - 1].texto)
    const actual = extraerPalabrasSignificativas(contribuciones[i].texto)
    
    // Verificar si hay alguna palabra en comun
    const hayConexion = anterior.some(palabra => actual.includes(palabra))
    
    if (!hayConexion) {
      transicionesAbruptas++
    }
  }
  
  return transicionesAbruptas
}

/**
 * Extrae palabras significativas (no stopwords) de un texto
 */
function extraerPalabrasSignificativas(texto) {
  const stopwords = new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
    'de', 'del', 'al', 'a', 'en', 'con', 'por', 'para',
    'y', 'o', 'pero', 'que', 'como', 'cuando', 'donde',
    'se', 'su', 'sus', 'mi', 'mis', 'tu', 'tus',
    'era', 'fue', 'es', 'son', 'esta', 'estan', 'hay',
    'no', 'si', 'mas', 'muy', 'ya', 'solo', 'todo', 'toda',
    'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas',
    'lo', 'le', 'les', 'me', 'te', 'nos'
  ])
  
  return texto
    .toLowerCase()
    .replace(/[^\w\sáéíóúüñ]/g, '')
    .split(/\s+/)
    .filter(palabra => palabra.length > 3 && !stopwords.has(palabra))
}

/**
 * Calcula la diversidad lexica (ratio de palabras unicas)
 * Retorna valor entre 0 (poca diversidad) y 1 (mucha diversidad)
 */
function calcularDiversidadLexica(contribuciones) {
  const todasPalabras = contribuciones
    .map(c => extraerPalabrasSignificativas(c.texto))
    .flat()
  
  if (todasPalabras.length === 0) return 0.5
  
  const palabrasUnicas = new Set(todasPalabras)
  const ratio = palabrasUnicas.size / todasPalabras.length
  
  // Normalizar: diversidad muy alta (>0.8) o muy baja (<0.3) es caotica
  if (ratio > 0.8) return ratio - 0.3
  if (ratio < 0.3) return 0.7 - ratio
  return Math.abs(ratio - 0.5) * 2
}

/**
 * Calcula la variacion en longitud de contribuciones
 * Retorna valor entre 0 (consistente) y 1 (muy variable)
 */
function calcularVariacionLongitud(contribuciones) {
  const longitudes = contribuciones.map(c => c.texto.length)
  
  if (longitudes.length < 2) return 0
  
  const promedio = longitudes.reduce((a, b) => a + b, 0) / longitudes.length
  const varianza = longitudes.reduce((sum, len) => sum + Math.pow(len - promedio, 2), 0) / longitudes.length
  const desviacion = Math.sqrt(varianza)
  
  // Normalizar desviacion a rango 0-1
  // Una desviacion de 100+ caracteres se considera muy alta
  return Math.min(desviacion / 100, 1)
}

/**
 * Obtiene una descripcion textual del nivel de caos
 */
export function getDescripcionCaos(puntaje) {
  if (puntaje < 20) return { nivel: 'Coherente', descripcion: 'La historia tiene sentido... sospechosamente' }
  if (puntaje < 40) return { nivel: 'Fluida', descripcion: 'Algunas sorpresas, pero se entiende' }
  if (puntaje < 60) return { nivel: 'Creativa', descripcion: 'El caos empieza a asomar' }
  if (puntaje < 80) return { nivel: 'Caotica', descripcion: 'Giros inesperados por doquier' }
  return { nivel: 'Delirio Total', descripcion: 'Nadie sabe que paso aqui' }
}

/**
 * Obtiene el color asociado al nivel de caos
 */
export function getColorCaos(puntaje) {
  if (puntaje < 20) return '#22C55E' // Verde
  if (puntaje < 40) return '#84CC16' // Lima
  if (puntaje < 60) return '#EAB308' // Amarillo
  if (puntaje < 80) return '#F97316' // Naranja
  return '#EF4444' // Rojo
}
