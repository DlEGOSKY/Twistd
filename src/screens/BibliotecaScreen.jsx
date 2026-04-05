// === src/screens/BibliotecaScreen.jsx ===
// Biblioteca mejorada con filtros, busqueda, vista detallada y estadisticas
// Permite ver, filtrar, exportar y eliminar historias guardadas

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { Button, Modal, ExportButtons } from '../components/ui'
import { CaosScoreCompact } from '../components/reveal'
import { StatsPanel, WordCloud } from '../components/stats'
import { getGenero, GENEROS } from '../data/generos'
import { calcularEstadisticas, contarPalabras, calcularTendencias } from '../utils/estadisticas'
import { getInkColor } from '../data/skins'
import { useAudio } from '../hooks/useAudio'

export default function BibliotecaScreen() {
  const { volverAlMenu, historiasGuardadas, eliminarHistoria } = useGame()
  const { playClick, playSuccess, playError } = useAudio()
  
  // Estados locales
  const [filtroGenero, setFiltroGenero] = useState('todos')
  const [ordenarPor, setOrdenarPor] = useState('fecha') // fecha, caos, jugadores
  const [busqueda, setBusqueda] = useState('')
  const [historiaSeleccionada, setHistoriaSeleccionada] = useState(null)
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)
  
  // Calcular tendencias globales
  const tendencias = useMemo(() => 
    calcularTendencias(historiasGuardadas),
    [historiasGuardadas]
  )
  
  // Filtrar y ordenar historias
  const historiasFiltradas = useMemo(() => {
    let resultado = [...historiasGuardadas]
    
    // Filtrar por genero
    if (filtroGenero !== 'todos') {
      resultado = resultado.filter(h => h.genero === filtroGenero)
    }
    
    // Filtrar por busqueda (en texto y jugadores)
    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase()
      resultado = resultado.filter(h => {
        const textoCompleto = h.contribuciones?.map(c => c.texto).join(' ').toLowerCase() || ''
        const jugadores = h.jugadores?.join(' ').toLowerCase() || ''
        return textoCompleto.includes(termino) || jugadores.includes(termino)
      })
    }
    
    // Ordenar
    resultado.sort((a, b) => {
      switch (ordenarPor) {
        case 'caos':
          return (b.caos || 0) - (a.caos || 0)
        case 'jugadores':
          return (b.jugadores?.length || 0) - (a.jugadores?.length || 0)
        case 'fecha':
        default:
          return new Date(b.fecha) - new Date(a.fecha)
      }
    })
    
    return resultado
  }, [historiasGuardadas, filtroGenero, ordenarPor, busqueda])
  
  // Manejar eliminacion
  const handleEliminar = (id) => {
    playError()
    eliminarHistoria(id)
    setConfirmarEliminar(null)
    setHistoriaSeleccionada(null)
  }
  
  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }
  
  return (
    <div className="screen-container">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl text-historia-text">
              Biblioteca de Historias
            </h1>
            <p className="text-historia-muted text-sm">
              {historiasGuardadas.length} historia{historiasGuardadas.length !== 1 ? 's' : ''} guardada{historiasGuardadas.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <Button variant="ghost" onClick={volverAlMenu}>
            Volver
          </Button>
        </div>
        
        {/* Tendencias globales (si hay historias) */}
        {historiasGuardadas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-6 bg-gradient-to-r from-historia-surface to-historia-bg"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                {/* Total historias */}
                <div className="text-center">
                  <p className="font-mono text-2xl font-bold text-historia-accent">
                    {tendencias.totalHistorias}
                  </p>
                  <p className="text-xs text-historia-muted">Historias</p>
                </div>
                
                {/* Caos promedio */}
                <div className="text-center">
                  <p className="font-mono text-2xl font-bold" style={{ color: tendencias.caoPromedio > 60 ? '#EF4444' : '#22C55E' }}>
                    {tendencias.caoPromedio}%
                  </p>
                  <p className="text-xs text-historia-muted">Caos promedio</p>
                </div>
                
                {/* Jugadores unicos */}
                <div className="text-center">
                  <p className="font-mono text-2xl font-bold text-historia-text">
                    {tendencias.jugadoresUnicos}
                  </p>
                  <p className="text-xs text-historia-muted">Jugadores</p>
                </div>
              </div>
              
              {/* Genero favorito */}
              {tendencias.generoMasUsado && (
                <div className="flex items-center gap-2">
                  <span className="text-historia-muted text-sm">Genero favorito:</span>
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-display text-white"
                    style={{ backgroundColor: getGenero(tendencias.generoMasUsado)?.colorTema }}
                  >
                    {getGenero(tendencias.generoMasUsado)?.nombre}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Filtros y busqueda */}
        {historiasGuardadas.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {/* Busqueda */}
            <div className="flex-1 min-w-[200px] relative">
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-historia-muted"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar en historias..."
                className="w-full pl-10 pr-4 py-2 bg-historia-surface border border-historia-border rounded-lg text-historia-text placeholder:text-historia-muted focus:outline-none focus:ring-2 focus:ring-historia-accent"
              />
            </div>
            
            {/* Filtro por genero */}
            <select
              value={filtroGenero}
              onChange={(e) => setFiltroGenero(e.target.value)}
              className="px-4 py-2 bg-historia-surface border border-historia-border rounded-lg text-historia-text focus:outline-none focus:ring-2 focus:ring-historia-accent"
            >
              <option value="todos">Todos los generos</option>
              {GENEROS.map(g => (
                <option key={g.id} value={g.id}>{g.nombre}</option>
              ))}
            </select>
            
            {/* Ordenar por */}
            <select
              value={ordenarPor}
              onChange={(e) => setOrdenarPor(e.target.value)}
              className="px-4 py-2 bg-historia-surface border border-historia-border rounded-lg text-historia-text focus:outline-none focus:ring-2 focus:ring-historia-accent"
            >
              <option value="fecha">Mas recientes</option>
              <option value="caos">Mayor caos</option>
              <option value="jugadores">Mas jugadores</option>
            </select>
          </div>
        )}
        
        {/* Lista de historias */}
        {historiasFiltradas.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card paper-texture text-center py-12"
          >
            {historiasGuardadas.length === 0 ? (
              <>
                <svg className="w-16 h-16 mx-auto mb-4 text-historia-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-historia-muted text-lg mb-2">
                  Aun no hay historias guardadas
                </p>
                <p className="text-historia-muted text-sm">
                  Juega una partida y guarda tu historia para verla aqui
                </p>
              </>
            ) : (
              <>
                <p className="text-historia-muted text-lg">
                  No se encontraron historias
                </p>
                <p className="text-historia-muted text-sm mt-2">
                  Intenta con otros filtros o terminos de busqueda
                </p>
              </>
            )}
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {historiasFiltradas.map((historia, index) => {
              const genero = getGenero(historia.genero)
              const primerTexto = historia.contribuciones?.[0]?.texto || ''
              
              return (
                <motion.div
                  key={historia.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    playClick()
                    setHistoriaSeleccionada(historia)
                  }}
                  className="card cursor-pointer hover:shadow-lg transition-shadow border-l-4"
                  style={{ borderLeftColor: genero?.colorTema || '#D4A574' }}
                >
                  {/* Header de la tarjeta */}
                  <div className="flex items-start justify-between mb-2">
                    <span 
                      className="px-2 py-0.5 rounded text-xs font-display text-white"
                      style={{ backgroundColor: genero?.colorTema }}
                    >
                      {genero?.nombre}
                    </span>
                    <span className="text-xs text-historia-muted">
                      {formatearFecha(historia.fecha)}
                    </span>
                  </div>
                  
                  {/* Preview del texto */}
                  <p className="text-historia-text font-serif text-sm leading-relaxed mb-3 line-clamp-3">
                    {primerTexto.slice(0, 150)}...
                  </p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    {/* Jugadores */}
                    <div className="flex items-center gap-1">
                      {historia.jugadores?.slice(0, 3).map((j, i) => (
                        <span
                          key={i}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold"
                          style={{ backgroundColor: getInkColor(i) }}
                          title={j}
                        >
                          {j[0]}
                        </span>
                      ))}
                      {historia.jugadores?.length > 3 && (
                        <span className="text-xs text-historia-muted">
                          +{historia.jugadores.length - 3}
                        </span>
                      )}
                    </div>
                    
                    {/* Caos */}
                    <CaosScoreCompact puntaje={historia.caos || 0} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
        
        {/* Modal de historia detallada */}
        <Modal
          isOpen={!!historiaSeleccionada}
          onClose={() => setHistoriaSeleccionada(null)}
          title="Detalle de Historia"
          size="lg"
        >
          {historiaSeleccionada && (
            <HistoriaDetalle
              historia={historiaSeleccionada}
              onEliminar={() => setConfirmarEliminar(historiaSeleccionada.id)}
              onCerrar={() => setHistoriaSeleccionada(null)}
            />
          )}
        </Modal>
        
        {/* Modal de confirmacion de eliminacion */}
        <Modal
          isOpen={!!confirmarEliminar}
          onClose={() => setConfirmarEliminar(null)}
          title="Eliminar Historia"
          size="sm"
        >
          <div className="text-center py-4">
            <svg className="w-12 h-12 mx-auto mb-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            <p className="text-historia-text mb-6">
              Esta accion no se puede deshacer. La historia se eliminara permanentemente.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="ghost" onClick={() => setConfirmarEliminar(null)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={() => handleEliminar(confirmarEliminar)}>
                Eliminar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

// Componente para vista detallada de historia
function HistoriaDetalle({ historia, onEliminar, onCerrar }) {
  const [tab, setTab] = useState('historia') // historia, estadisticas
  const genero = getGenero(historia.genero)
  
  // Calcular estadisticas
  const estadisticas = useMemo(() => 
    calcularEstadisticas(historia.contribuciones || []),
    [historia.contribuciones]
  )
  
  const palabras = useMemo(() => 
    contarPalabras(historia.contribuciones || []),
    [historia.contribuciones]
  )
  
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }
  
  return (
    <div className="space-y-4">
      {/* Info general */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-historia-border">
        <div className="flex items-center gap-3">
          <span 
            className="px-3 py-1 rounded-full text-sm font-display text-white"
            style={{ backgroundColor: genero?.colorTema }}
          >
            {genero?.nombre}
          </span>
          <span className="text-historia-muted text-sm">
            {formatearFecha(historia.fecha)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <ExportButtons historia={historia} />
          <button
            onClick={onEliminar}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar historia"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Jugadores */}
      <div className="flex flex-wrap gap-2">
        {historia.jugadores?.map((jugador, i) => (
          <span
            key={i}
            className="px-3 py-1 rounded-full text-sm font-display text-white"
            style={{ backgroundColor: getInkColor(i) }}
          >
            {jugador}
          </span>
        ))}
        <span className="px-3 py-1 rounded-full text-sm font-mono bg-historia-surface text-historia-text border border-historia-border">
          Caos: {historia.caos}%
        </span>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2 border-b border-historia-border">
        <button
          onClick={() => setTab('historia')}
          className={`px-4 py-2 font-display transition-colors ${
            tab === 'historia' 
              ? 'text-historia-accent border-b-2 border-historia-accent' 
              : 'text-historia-muted hover:text-historia-text'
          }`}
        >
          Historia
        </button>
        <button
          onClick={() => setTab('estadisticas')}
          className={`px-4 py-2 font-display transition-colors ${
            tab === 'estadisticas' 
              ? 'text-historia-accent border-b-2 border-historia-accent' 
              : 'text-historia-muted hover:text-historia-text'
          }`}
        >
          Estadisticas
        </button>
      </div>
      
      {/* Contenido del tab */}
      <AnimatePresence mode="wait">
        {tab === 'historia' ? (
          <motion.div
            key="historia"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="max-h-[400px] overflow-y-auto pr-2 space-y-4"
          >
            {historia.contribuciones?.map((contrib, index) => {
              const indiceJugador = historia.jugadores?.indexOf(contrib.jugador) ?? 0
              const color = contrib.esFraseInicial ? '#6D4C41' : getInkColor(indiceJugador)
              
              return (
                <div key={index} className="pb-3 border-b border-historia-border last:border-0">
                  <p 
                    className="font-serif text-base leading-relaxed"
                    style={{ color: contrib.esFraseInicial ? undefined : color }}
                  >
                    {contrib.texto}
                  </p>
                  <p 
                    className="text-sm mt-1 text-right font-display"
                    style={{ color }}
                  >
                    {contrib.esFraseInicial ? '(Frase inicial)' : `- ${contrib.jugador}`}
                  </p>
                </div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            key="estadisticas"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4 max-h-[400px] overflow-y-auto pr-2"
          >
            <StatsPanel estadisticas={estadisticas} />
            <WordCloud palabras={palabras} maxPalabras={15} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
