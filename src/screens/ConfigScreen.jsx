// === src/screens/ConfigScreen.jsx ===
// Pantalla de configuracion de partida con formulario completo
// Permite configurar jugadores, genero, modo, timer, rondas y frase inicial

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../context/GameContext'
import { Button, Input, Select } from '../components/ui'
import SkinSelector from '../components/ui/SkinSelector'
import { listaGeneros } from '../data/generos'

export default function ConfigScreen() {
  const { 
    config, 
    setConfig, 
    agregarJugador, 
    eliminarJugador, 
    actualizarJugador,
    iniciarPartida,
    volverAlMenu,
    setSkin
  } = useGame()
  
  // Estado local para el input de nuevo jugador
  const [nuevoJugador, setNuevoJugador] = useState('')
  const [error, setError] = useState('')
  
  // Opciones para los selects
  const opcionesGenero = listaGeneros.map(g => ({ value: g.id, label: g.nombre }))
  const opcionesModo = [
    { value: 'normal', label: 'Normal - Ve ultima oracion' },
    { value: 'dificil', label: 'Dificil - Solo ultima palabra' },
    { value: 'imagen', label: 'Imagen - Describe arte abstracto' }
  ]
  const opcionesLongitud = [
    { value: 'corta', label: 'Corta - 1 oracion por turno' },
    { value: 'media', label: 'Media - 2 oraciones por turno' },
    { value: 'larga', label: 'Larga - 3 oraciones por turno' }
  ]
  const opcionesTimer = [
    { value: '30', label: '30 segundos' },
    { value: '60', label: '60 segundos' },
    { value: '90', label: '90 segundos' },
    { value: '', label: 'Sin limite' }
  ]
  const opcionesRondas = [
    { value: '1', label: '1 ronda' },
    { value: '2', label: '2 rondas' },
    { value: '3', label: '3 rondas' },
    { value: '4', label: '4 rondas' },
    { value: '5', label: '5 rondas' }
  ]
  
  // Agregar jugador a la lista
  const handleAgregarJugador = () => {
    const nombre = nuevoJugador.trim()
    if (!nombre) {
      setError('Escribe un nombre')
      return
    }
    if (config.jugadores.includes(nombre)) {
      setError('Ese nombre ya existe')
      return
    }
    if (config.jugadores.length >= 10) {
      setError('Maximo 10 jugadores')
      return
    }
    agregarJugador(nombre)
    setNuevoJugador('')
    setError('')
  }
  
  // Validar e iniciar partida
  const handleIniciar = () => {
    if (config.jugadores.length < 2) {
      setError('Necesitas al menos 2 jugadores')
      return
    }
    iniciarPartida()
  }
  
  // Verificar si la configuracion es valida
  const configValida = config.jugadores.length >= 2
  
  return (
    <div className="screen-container">
      <div className="max-w-lg mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl text-historia-text">
            Nueva Partida
          </h1>
          <button
            onClick={volverAlMenu}
            className="p-2 text-historia-muted hover:text-historia-text transition-colors"
            aria-label="Volver al menu"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Formulario */}
        <div className="space-y-6">
          
          {/* Seccion: Jugadores */}
          <section className="card">
            <h2 className="font-display text-lg text-historia-text mb-3">
              Jugadores ({config.jugadores.length}/10)
            </h2>
            
            {/* Lista de jugadores */}
            <div className="space-y-2 mb-3">
              {config.jugadores.map((jugador, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <span 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-mono"
                    style={{ backgroundColor: `var(--historia-ink${(index % 10) + 1}, #6D4C41)` }}
                  >
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={jugador}
                    onChange={(e) => actualizarJugador(index, e.target.value)}
                    className="flex-1 px-2 py-1 bg-transparent border-b border-historia-border text-historia-text focus:outline-none focus:border-historia-accent"
                  />
                  <button
                    onClick={() => eliminarJugador(index)}
                    className="p-1 text-historia-muted hover:text-red-600 transition-colors"
                    aria-label={`Eliminar ${jugador}`}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
            
            {/* Input para nuevo jugador */}
            {config.jugadores.length < 10 && (
              <div className="flex gap-2">
                <Input
                  placeholder="Nombre del jugador"
                  value={nuevoJugador}
                  onChange={(e) => setNuevoJugador(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAgregarJugador()}
                  maxLength={20}
                />
                <Button onClick={handleAgregarJugador} variant="secondary">
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </Button>
              </div>
            )}
            
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </section>
          
          {/* Seccion: Configuracion de juego */}
          <section className="card">
            <h2 className="font-display text-lg text-historia-text mb-3">
              Configuracion
            </h2>
            
            <div className="space-y-4">
              <Select
                label="Genero"
                value={config.genero}
                onChange={(e) => setConfig({ genero: e.target.value })}
                options={opcionesGenero}
              />
              
              <Select
                label="Modo de juego"
                value={config.modo}
                onChange={(e) => setConfig({ modo: e.target.value })}
                options={opcionesModo}
              />
              
              <Select
                label="Longitud por turno"
                value={config.longitud}
                onChange={(e) => setConfig({ longitud: e.target.value })}
                options={opcionesLongitud}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Tiempo por turno"
                  value={config.timer?.toString() || ''}
                  onChange={(e) => setConfig({ timer: e.target.value ? parseInt(e.target.value) : null })}
                  options={opcionesTimer}
                />
                
                <Select
                  label="Rondas"
                  value={config.rondas.toString()}
                  onChange={(e) => setConfig({ rondas: parseInt(e.target.value) })}
                  options={opcionesRondas}
                />
              </div>
            </div>
          </section>
          
          {/* Seccion: Frase inicial */}
          <section className="card">
            <h2 className="font-display text-lg text-historia-text mb-3">
              Frase inicial
            </h2>
            
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipoFrase"
                  checked={!config.frasePersonalizada}
                  onChange={() => setConfig({ frasePersonalizada: false, fraseInicial: '' })}
                  className="w-4 h-4 text-historia-accent"
                />
                <span className="text-historia-text">Aleatoria del genero</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipoFrase"
                  checked={config.frasePersonalizada}
                  onChange={() => setConfig({ frasePersonalizada: true })}
                  className="w-4 h-4 text-historia-accent"
                />
                <span className="text-historia-text">Personalizada</span>
              </label>
              
              {config.frasePersonalizada && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <textarea
                    value={config.fraseInicial}
                    onChange={(e) => setConfig({ fraseInicial: e.target.value })}
                    placeholder="Escribe la frase con la que comenzara la historia..."
                    className="w-full px-3 py-2 bg-historia-surface border border-historia-border rounded-lg text-historia-text font-serif resize-none focus:outline-none focus:ring-2 focus:ring-historia-accent"
                    rows={3}
                    maxLength={200}
                  />
                  <p className="text-historia-muted text-xs text-right mt-1">
                    {config.fraseInicial.length}/200
                  </p>
                </motion.div>
              )}
            </div>
          </section>
          
          {/* Seccion: Tema visual */}
          <section className="card">
            <SkinSelector 
              skinActual={config.skinActivo}
              onCambiarSkin={setSkin}
            />
          </section>
          
          {/* Boton iniciar */}
          <Button
            onClick={handleIniciar}
            disabled={!configValida}
            fullWidth
            size="lg"
          >
            Iniciar Partida
          </Button>
          
          {!configValida && (
            <p className="text-historia-muted text-sm text-center">
              Agrega al menos 2 jugadores para comenzar
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
