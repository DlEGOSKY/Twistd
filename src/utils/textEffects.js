// === src/utils/textEffects.js ===
// Helpers para efecto maquina de escribir y manipulacion de texto

/**
 * Divide un texto en caracteres para animacion typewriter
 * Preserva espacios y puntuacion
 */
export function dividirEnCaracteres(texto) {
  return texto.split('')
}

/**
 * Calcula el delay para cada caracter segun su tipo
 * Puntuacion tiene delay mas largo para efecto dramatico
 */
export function getDelayCaracter(caracter, baseDelay = 50) {
  // Puntuacion final: pausa larga
  if (['.', '!', '?'].includes(caracter)) {
    return baseDelay * 6
  }
  // Comas y puntos suspensivos: pausa media
  if ([',', ';', ':'].includes(caracter)) {
    return baseDelay * 3
  }
  // Espacios: pausa corta
  if (caracter === ' ') {
    return baseDelay * 0.5
  }
  // Caracteres normales
  return baseDelay
}

/**
 * Genera array de delays acumulados para cada caracter
 * Util para calcular cuando mostrar cada caracter
 */
export function generarTimeline(texto, baseDelay = 50) {
  const caracteres = dividirEnCaracteres(texto)
  let tiempoAcumulado = 0
  
  return caracteres.map((char, index) => {
    const delay = getDelayCaracter(char, baseDelay)
    const resultado = {
      caracter: char,
      indice: index,
      tiempoInicio: tiempoAcumulado,
      delay
    }
    tiempoAcumulado += delay
    return resultado
  })
}

/**
 * Calcula duracion total de la animacion typewriter
 */
export function calcularDuracionTotal(texto, baseDelay = 50) {
  const timeline = generarTimeline(texto, baseDelay)
  if (timeline.length === 0) return 0
  const ultimo = timeline[timeline.length - 1]
  return ultimo.tiempoInicio + ultimo.delay
}

/**
 * Extrae la ultima oracion de un texto
 */
export function extraerUltimaOracion(texto) {
  const oraciones = texto.split(/(?<=[.!?])\s+/)
  return oraciones[oraciones.length - 1] || texto
}

/**
 * Extrae la ultima palabra de un texto
 */
export function extraerUltimaPalabra(texto) {
  const palabras = texto.trim().split(/\s+/)
  return palabras[palabras.length - 1] || ''
}

/**
 * Limpia texto de caracteres especiales para comparacion
 */
export function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .trim()
}
