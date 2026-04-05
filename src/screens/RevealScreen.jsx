// === src/screens/RevealScreen.jsx ===
// Pantalla de revelacion de la historia completa
// Muestra historia con efecto typewriter, puntuacion de caos, reacciones y estadisticas

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { Button, ExportButtons } from '../components/ui'
import { StoryLine, CaosScore, ReactionPanel } from '../components/reveal'
import { CaosChart, WordCloud, StatsPanel } from '../components/stats'
import { getGenero } from '../data/generos'
import { useAudio } from '../hooks/useAudio'
import { 
  calcularEstadisticas, 
  contarPalabras, 
  calcularEvolucionCaos 
} from '../utils/estadisticas'

// Estados de la revelacion
const ESTADOS = {
  INTRO: 'intro',
  REVELANDO: 'revelando',
  CAOS: 'caos',
  ESTADISTICAS: 'estadisticas',
  REACCIONES: 'reacciones',
  COMPLETO: 'completo'
}

export default function RevealScreen() {
  const {
    config,
    partida,
    caos,
    reacciones,
    setReaccion,
    guardarHistoria,
    reiniciarPartida,
    volverAlMenu
  } = useGame()
  
  const [estado, setEstado] = useState(ESTADOS.INTRO)
  const [indiceContribucion, setIndiceContribucion] = useState(0)
  const [historiaGuardada, setHistoriaGuardada] = useState(false)
  
  const { playReveal, playSuccess } = useAudio()
  
  const genero = getGenero(config.genero)
  const contribuciones = partida.contribuciones
  
  // Calcular estadisticas (memoizadas)
  const estadisticas = useMemo(() => 
    calcularEstadisticas(contribuciones), 
    [contribuciones]
  )
  
  const palabrasFrecuentes = useMemo(() => 
    contarPalabras(contribuciones), 
    [contribuciones]
  )
  
  const evolucionCaos = useMemo(() => 
    calcularEvolucionCaos(contribuciones, config.genero), 
    [contribuciones, config.genero]
  )
  
  // Sonido de revelacion al iniciar
  const handleIniciarRevelacion = () => {
    playReveal()
    setEstado(ESTADOS.REVELANDO)
  }
  
  // Avanzar a siguiente contribucion
  const siguienteContribucion = () => {
    if (indiceContribucion < contribuciones.length - 1) {
      setIndiceContribucion(prev => prev + 1)
    } else {
      // Todas las contribuciones reveladas, mostrar caos
      setEstado(ESTADOS.CAOS)
    }
  }
  
  // Saltar toda la animacion
  const saltarAnimacion = () => {
    setIndiceContribucion(contribuciones.length - 1)
    setEstado(ESTADOS.CAOS)
  }
  
  // Guardar historia
  const handleGuardar = () => {
    playSuccess()
    guardarHistoria()
    setHistoriaGuardada(true)
  }
  
  return (
    <div className="screen-container">
      <div className="max-w-2xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl text-historia-text">
              La Historia
            </h1>
            <span 
              className="text-sm font-display"
              style={{ color: genero.colorTema }}
            >
              {genero.nombre}
            </span>
          </div>
          
          {estado === ESTADOS.REVELANDO && (
            <Button variant="ghost" size="sm" onClick={saltarAnimacion}>
              Saltar
            </Button>
          )}
        </div>
        
        {/* Pantalla de intro */}
        <AnimatePresence mode="wait">
          {estado === ESTADOS.INTRO && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card paper-texture text-center py-12"
            >
              <h2 className="font-display text-3xl text-historia-text mb-4">
                La historia esta lista
              </h2>
              <p className="text-historia-muted mb-6">
                {contribuciones.length} contribuciones de {config.jugadores.length} jugadores
              </p>
              <Button onClick={handleIniciarRevelacion} size="lg">
                Revelar Historia
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Revelacion de contribuciones */}
        {estado === ESTADOS.REVELANDO && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Contribuciones ya reveladas */}
            <div className="card paper-texture min-h-[300px]">
              {contribuciones.slice(0, indiceContribucion + 1).map((contrib, index) => (
                <StoryLine
                  key={index}
                  contribucion={contrib}
                  indiceJugador={index}
                  jugadores={config.jugadores}
                  animarTexto={index === indiceContribucion}
                  velocidadTypewriter={40}
                  onAnimacionCompleta={siguienteContribucion}
                />
              ))}
            </div>
            
            {/* Indicador de progreso */}
            <div className="flex items-center justify-center gap-2">
              {contribuciones.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= indiceContribucion 
                      ? 'bg-historia-accent' 
                      : 'bg-historia-border'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Puntuacion de caos */}
        {estado === ESTADOS.CAOS && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Historia completa (colapsada) */}
            <details className="card paper-texture">
              <summary className="font-display text-historia-text cursor-pointer">
                Ver historia completa
              </summary>
              <div className="mt-4 pt-4 border-t border-historia-border">
                {contribuciones.map((contrib, index) => (
                  <StoryLine
                    key={index}
                    contribucion={contrib}
                    indiceJugador={index}
                    jugadores={config.jugadores}
                    animarTexto={false}
                  />
                ))}
              </div>
            </details>
            
            {/* Medidor de caos */}
            <CaosScore puntaje={caos} animado={true} />
            
            {/* Boton para continuar a estadisticas */}
            <Button 
              onClick={() => setEstado(ESTADOS.ESTADISTICAS)} 
              fullWidth
            >
              Ver Estadísticas
            </Button>
          </motion.div>
        )}
        
        {/* Estadisticas visuales */}
        {estado === ESTADOS.ESTADISTICAS && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Grafico de evolucion del caos */}
            <CaosChart 
              evolucion={evolucionCaos} 
              jugadores={config.jugadores}
            />
            
            {/* Panel de metricas */}
            <StatsPanel estadisticas={estadisticas} />
            
            {/* Nube de palabras */}
            <WordCloud palabras={palabrasFrecuentes} maxPalabras={25} />
            
            {/* Boton para continuar a reacciones */}
            <Button 
              onClick={() => setEstado(ESTADOS.REACCIONES)} 
              fullWidth
            >
              Ver Reacciones
            </Button>
          </motion.div>
        )}
        
        {/* Panel de reacciones */}
        {estado === ESTADOS.REACCIONES && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Caos score compacto */}
            <div className="card text-center">
              <span className="font-mono text-2xl font-bold" style={{ color: caos > 60 ? '#EF4444' : '#22C55E' }}>
                Caos: {caos}%
              </span>
            </div>
            
            {/* Panel de reacciones */}
            <ReactionPanel
              jugadores={config.jugadores}
              reacciones={reacciones}
              onReaccion={setReaccion}
            />
            
            {/* Boton para finalizar */}
            <Button 
              onClick={() => setEstado(ESTADOS.COMPLETO)} 
              fullWidth
            >
              Finalizar
            </Button>
          </motion.div>
        )}
        
        {/* Pantalla final */}
        {estado === ESTADOS.COMPLETO && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Resumen */}
            <div className="card paper-texture text-center py-8">
              <h2 className="font-display text-2xl text-historia-text mb-2">
                Historia Completada
              </h2>
              <p className="text-historia-muted">
                {config.jugadores.join(', ')}
              </p>
              <p className="font-mono text-lg mt-4" style={{ color: caos > 60 ? '#EF4444' : '#22C55E' }}>
                Nivel de Caos: {caos}%
              </p>
            </div>
            
            {/* Acciones */}
            <div className="space-y-3">
              {/* Botones de guardar y exportar */}
              <div className="flex gap-3">
                {!historiaGuardada ? (
                  <Button onClick={handleGuardar} fullWidth variant="primary">
                    Guardar Historia
                  </Button>
                ) : (
                  <div className="flex-1 text-center text-green-600 font-display py-2 bg-green-50 rounded-lg border border-green-200">
                    <svg className="inline-block w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Guardada
                  </div>
                )}
                
                {/* Boton de exportar */}
                <ExportButtons 
                  historia={{
                    id: partida.id || Date.now().toString(),
                    fecha: new Date().toISOString(),
                    genero: config.genero,
                    jugadores: config.jugadores,
                    caos,
                    contribuciones,
                    reacciones
                  }}
                />
              </div>
              
              <Button onClick={reiniciarPartida} fullWidth variant="secondary">
                Nueva Partida (mismos jugadores)
              </Button>
              
              <Button onClick={volverAlMenu} fullWidth variant="ghost">
                Volver al Menu
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
