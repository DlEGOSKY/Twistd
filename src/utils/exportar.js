// === src/utils/exportar.js ===
// Utilidades para exportar historias en diferentes formatos
// Soporta texto plano, JSON y copia al portapapeles

import { getGenero } from '../data/generos'

/**
 * Exportar historia como texto formateado
 */
export function exportarComoTexto(historia) {
  const { contribuciones, jugadores, genero, caos, fecha, reacciones } = historia
  const generoInfo = getGenero(genero)
  
  const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  let texto = `═══════════════════════════════════════════════════════════
                         TWISTD
═══════════════════════════════════════════════════════════

Genero: ${generoInfo?.nombre || genero}
Jugadores: ${jugadores.join(', ')}
Fecha: ${fechaFormateada}
Nivel de Caos: ${caos}%

───────────────────────────────────────────────────────────
                      LA HISTORIA
───────────────────────────────────────────────────────────

`

  contribuciones.forEach((contrib, index) => {
    if (contrib.esFraseInicial) {
      texto += `[Frase inicial]\n${contrib.texto}\n\n`
    } else {
      texto += `[${contrib.jugador}]\n${contrib.texto}\n\n`
    }
  })

  texto += `───────────────────────────────────────────────────────────

`

  // Agregar reacciones si existen
  if (reacciones && Object.keys(reacciones).length > 0) {
    texto += `REACCIONES:\n`
    Object.entries(reacciones).forEach(([jugador, reaccion]) => {
      const iconos = {
        risa: '(risa)',
        asombro: '(asombro)',
        confusion: '(confusion)',
        amor: '(amor)',
        terror: '(terror)'
      }
      texto += `  ${jugador}: ${iconos[reaccion] || reaccion}\n`
    })
    texto += '\n'
  }

  texto += `═══════════════════════════════════════════════════════════
                    Creado con Twistd
═══════════════════════════════════════════════════════════`

  return texto
}

/**
 * Exportar historia como JSON estructurado
 */
export function exportarComoJSON(historia) {
  const exportData = {
    version: '1.0',
    exportadoEn: new Date().toISOString(),
    historia: {
      id: historia.id,
      fecha: historia.fecha,
      genero: historia.genero,
      jugadores: historia.jugadores,
      caos: historia.caos,
      contribuciones: historia.contribuciones.map(c => ({
        jugador: c.jugador,
        texto: c.texto,
        esFraseInicial: c.esFraseInicial || false
      })),
      reacciones: historia.reacciones || {}
    }
  }
  
  return JSON.stringify(exportData, null, 2)
}

/**
 * Copiar texto al portapapeles
 */
export async function copiarAlPortapapeles(texto) {
  try {
    await navigator.clipboard.writeText(texto)
    return true
  } catch (err) {
    // Fallback para navegadores sin soporte
    const textarea = document.createElement('textarea')
    textarea.value = texto
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    
    try {
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return true
    } catch (e) {
      document.body.removeChild(textarea)
      return false
    }
  }
}

/**
 * Descargar archivo
 */
export function descargarArchivo(contenido, nombreArchivo, tipo = 'text/plain') {
  const blob = new Blob([contenido], { type: `${tipo};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = nombreArchivo
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

/**
 * Generar nombre de archivo basado en la historia
 */
export function generarNombreArchivo(historia, extension) {
  const fecha = new Date(historia.fecha)
  const fechaStr = fecha.toISOString().split('T')[0]
  const jugadoresStr = historia.jugadores.slice(0, 2).join('-')
  
  return `historia-${fechaStr}-${jugadoresStr}.${extension}`
}
