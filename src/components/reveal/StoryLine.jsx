// === src/components/reveal/StoryLine.jsx ===
// Muestra una contribucion con el nombre del autor y su color de tinta
import { useState } from 'react'
import { motion } from 'framer-motion'
import { getInkColor } from '../../data/skins'
import TypewriterText from './TypewriterText'

export default function StoryLine({
  contribucion,
  indiceJugador,
  jugadores,
  animarTexto = false,
  velocidadTypewriter = 50,
  onAnimacionCompleta,
  mostrarAutor = true
}) {
  const { jugador, texto, esFraseInicial } = contribucion
  
  // Obtener color del jugador
  const indice = esFraseInicial ? -1 : jugadores.indexOf(jugador)
  const color = esFraseInicial ? '#6D4C41' : getInkColor(indice >= 0 ? indice : 0)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4"
    >
      {/* Texto de la contribucion */}
      <p 
        className="font-serif text-lg leading-relaxed"
        style={{ color: esFraseInicial ? undefined : color }}
      >
        {animarTexto ? (
          <TypewriterText
            texto={texto}
            velocidad={velocidadTypewriter}
            onComplete={onAnimacionCompleta}
          />
        ) : (
          texto
        )}
      </p>
      
      {/* Nombre del autor */}
      {mostrarAutor && !esFraseInicial && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: animarTexto ? 0.5 : 0 }}
          className="text-sm font-display mt-1 text-right"
          style={{ color }}
        >
          - {jugador}
        </motion.p>
      )}
      
      {/* Indicador de frase inicial */}
      {esFraseInicial && mostrarAutor && (
        <p className="text-sm font-display mt-1 text-right text-historia-muted italic">
          (Frase inicial)
        </p>
      )}
    </motion.div>
  )
}

// Componente para mostrar todas las lineas de la historia
export function StoryLines({
  contribuciones,
  jugadores,
  animarSecuencialmente = false,
  velocidadTypewriter = 50,
  onTodasCompletadas
}) {
  const [indiceActual, setIndiceActual] = useState(0)
  
  const handleLineaCompleta = () => {
    if (indiceActual < contribuciones.length - 1) {
      setIndiceActual(prev => prev + 1)
    } else if (onTodasCompletadas) {
      onTodasCompletadas()
    }
  }
  
  return (
    <div className="space-y-2">
      {contribuciones.map((contrib, index) => {
        const debeAnimar = animarSecuencialmente && index === indiceActual
        const yaAnimado = !animarSecuencialmente || index < indiceActual
        
        if (animarSecuencialmente && index > indiceActual) {
          return null // No mostrar aun
        }
        
        return (
          <StoryLine
            key={index}
            contribucion={contrib}
            indiceJugador={index}
            jugadores={jugadores}
            animarTexto={debeAnimar}
            velocidadTypewriter={velocidadTypewriter}
            onAnimacionCompleta={handleLineaCompleta}
          />
        )
      })}
    </div>
  )
}
