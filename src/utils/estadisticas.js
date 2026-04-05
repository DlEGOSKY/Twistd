// === src/utils/estadisticas.js ===
// Utilidades para calcular estadisticas de historias
// Analiza palabras, diversidad, coherencia, etc.

/**
 * Extraer todas las palabras de un texto (sin stopwords)
 */
const stopwords = new Set([
  'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'ser', 'se', 'no', 'haber',
  'por', 'con', 'su', 'para', 'como', 'estar', 'tener', 'le', 'lo', 'todo',
  'pero', 'mas', 'hacer', 'o', 'poder', 'decir', 'este', 'ir', 'otro', 'ese',
  'si', 'me', 'ya', 'ver', 'porque', 'dar', 'cuando', 'muy', 'sin', 'vez',
  'mucho', 'saber', 'que', 'sobre', 'tambien', 'me', 'hasta', 'hay', 'donde',
  'quien', 'desde', 'nos', 'durante', 'uno', 'ni', 'contra', 'ese', 'eso',
  'esto', 'mi', 'ante', 'algunos', 'que', 'al', 'del', 'los', 'las', 'unos',
  'unas', 'una', 'era', 'eres', 'es', 'somos', 'soy', 'fue', 'han', 'he'
])

export function extraerPalabras(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(p => p.length > 3 && !stopwords.has(p))
}

/**
 * Contar frecuencia de palabras
 */
export function contarPalabras(contribuciones) {
  const contador = {}
  
  contribuciones.forEach(contrib => {
    const palabras = extraerPalabras(contrib.texto)
    palabras.forEach(palabra => {
      contador[palabra] = (contador[palabra] || 0) + 1
    })
  })
  
  return Object.entries(contador)
    .sort((a, b) => b[1] - a[1])
    .map(([palabra, frecuencia]) => ({ palabra, frecuencia }))
}

/**
 * Calcular estadisticas generales de la historia
 */
export function calcularEstadisticas(contribuciones) {
  const textoCompleto = contribuciones.map(c => c.texto).join(' ')
  const palabras = extraerPalabras(textoCompleto)
  const palabrasUnicas = new Set(palabras)
  
  // Longitud promedio de contribuciones
  const longitudPromedio = Math.round(
    contribuciones.reduce((acc, c) => acc + c.texto.length, 0) / contribuciones.length
  )
  
  // Contribucion mas larga y mas corta
  const longitudes = contribuciones.map(c => c.texto.length)
  const masLarga = Math.max(...longitudes)
  const masCorta = Math.min(...longitudes)
  
  // Diversidad lexica (palabras unicas / total palabras)
  const diversidadLexica = palabras.length > 0 
    ? Math.round((palabrasUnicas.size / palabras.length) * 100)
    : 0
  
  return {
    totalPalabras: palabras.length,
    palabrasUnicas: palabrasUnicas.size,
    diversidadLexica,
    longitudPromedio,
    masLarga,
    masCorta,
    totalCaracteres: textoCompleto.length
  }
}

/**
 * Calcular evolucion del caos por contribucion
 * Retorna array con puntaje de caos parcial despues de cada contribucion
 */
export function calcularEvolucionCaos(contribuciones, genero) {
  const evolucion = []
  
  for (let i = 0; i < contribuciones.length; i++) {
    // Calcular caos solo con contribuciones hasta este punto
    const contribsHastaAqui = contribuciones.slice(0, i + 1)
    
    // Usar funcion simplificada de caos (sin importar el modulo completo)
    const caos = calcularCaosSimplificado(contribsHastaAqui, genero)
    
    evolucion.push({
      indice: i,
      jugador: contribuciones[i].jugador,
      caos: Math.round(caos)
    })
  }
  
  return evolucion
}

// Version simplificada del algoritmo de caos para estadisticas
function calcularCaosSimplificado(contribuciones, genero) {
  if (contribuciones.length === 0) return 0
  if (contribuciones.length === 1) return 20 // Base minima
  
  const textos = contribuciones.map(c => c.texto)
  let caosTotal = 0
  
  // Factor 1: Diversidad lexica
  const todasPalabras = textos.flatMap(extraerPalabras)
  const palabrasUnicas = new Set(todasPalabras)
  const diversidad = todasPalabras.length > 0 
    ? (palabrasUnicas.size / todasPalabras.length) * 100 
    : 0
  caosTotal += diversidad * 0.3
  
  // Factor 2: Variacion de longitud
  const longitudes = textos.map(t => t.length)
  const promedio = longitudes.reduce((a, b) => a + b, 0) / longitudes.length
  const varianza = longitudes.reduce((acc, l) => acc + Math.pow(l - promedio, 2), 0) / longitudes.length
  const desviacion = Math.sqrt(varianza)
  const coefVariacion = promedio > 0 ? (desviacion / promedio) * 100 : 0
  caosTotal += Math.min(coefVariacion, 40)
  
  // Factor 3: Transiciones abruptas (comparar contribuciones consecutivas)
  let transiciones = 0
  for (let i = 1; i < textos.length; i++) {
    const palabrasA = new Set(extraerPalabras(textos[i - 1]))
    const palabrasB = new Set(extraerPalabras(textos[i]))
    const interseccion = [...palabrasA].filter(p => palabrasB.has(p)).length
    const union = new Set([...palabrasA, ...palabrasB]).size
    const similitud = union > 0 ? (interseccion / union) * 100 : 0
    
    if (similitud < 30) transiciones++
  }
  const porcentajeTransiciones = (transiciones / (textos.length - 1)) * 100
  caosTotal += porcentajeTransiciones * 0.3
  
  return Math.min(Math.max(caosTotal, 20), 100)
}

/**
 * Analizar tendencias en historias guardadas
 */
export function calcularTendencias(historias) {
  if (!historias || historias.length === 0) {
    return {
      generoMasUsado: null,
      caoPromedio: 0,
      totalHistorias: 0,
      jugadoresUnicos: 0
    }
  }
  
  // Genero mas usado
  const generos = {}
  historias.forEach(h => {
    generos[h.genero] = (generos[h.genero] || 0) + 1
  })
  const generoMasUsado = Object.entries(generos)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null
  
  // Caos promedio
  const caoPromedio = Math.round(
    historias.reduce((acc, h) => acc + (h.caos || 0), 0) / historias.length
  )
  
  // Jugadores unicos
  const jugadores = new Set()
  historias.forEach(h => {
    h.jugadores?.forEach(j => jugadores.add(j))
  })
  
  return {
    generoMasUsado,
    caoPromedio,
    totalHistorias: historias.length,
    jugadoresUnicos: jugadores.size
  }
}
