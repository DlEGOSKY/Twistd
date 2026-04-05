// === src/context/GameContext.jsx ===
// Contexto global del juego con provider y hooks personalizados
// Centraliza todo el estado y acciones del ciclo de vida del juego

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { 
  gameReducer, 
  initialState, 
  ActionTypes,
  getJugadorActual,
  getSiguienteJugador,
  getUltimaContribucion,
  getContextoVisible,
  getProgresoPartida,
  getLongitudOraciones
} from './gameReducer'

// Crear contexto
const GameContext = createContext(null)

// Provider del contexto
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)
  
  // Cargar historias guardadas al iniciar
  useEffect(() => {
    dispatch({ type: ActionTypes.LOAD_STORIES })
  }, [])
  
  // === ACCIONES DE NAVEGACION ===
  const irAPantalla = useCallback((screen) => {
    dispatch({ type: ActionTypes.SET_SCREEN, payload: screen })
  }, [])
  
  // === ACCIONES DE CONFIGURACION ===
  const setConfig = useCallback((config) => {
    dispatch({ type: ActionTypes.SET_CONFIG, payload: config })
  }, [])
  
  const agregarJugador = useCallback((nombre) => {
    dispatch({ type: ActionTypes.ADD_JUGADOR, payload: nombre })
  }, [])
  
  const eliminarJugador = useCallback((index) => {
    dispatch({ type: ActionTypes.REMOVE_JUGADOR, payload: index })
  }, [])
  
  const actualizarJugador = useCallback((index, nombre) => {
    dispatch({ type: ActionTypes.UPDATE_JUGADOR, payload: { index, nombre } })
  }, [])
  
  // === ACCIONES DE PARTIDA ===
  const iniciarPartida = useCallback(() => {
    dispatch({ type: ActionTypes.INIT_GAME })
  }, [])
  
  const iniciarTurno = useCallback(() => {
    dispatch({ type: ActionTypes.START_TURN })
  }, [])
  
  const enviarContribucion = useCallback((texto) => {
    dispatch({ type: ActionTypes.ADD_CONTRIBUTION, payload: { texto } })
  }, [])
  
  const siguienteTurno = useCallback(() => {
    dispatch({ type: ActionTypes.NEXT_TURN })
  }, [])
  
  const tiempoAgotado = useCallback(() => {
    dispatch({ type: ActionTypes.TIME_UP })
  }, [])
  
  const setTiempoRestante = useCallback((tiempo) => {
    dispatch({ type: ActionTypes.SET_TIMER, payload: tiempo })
  }, [])
  
  // === ACCIONES DE REVELACION ===
  const iniciarRevelacion = useCallback(() => {
    dispatch({ type: ActionTypes.START_REVEAL })
  }, [])
  
  const setReaccion = useCallback((jugador, tipo) => {
    dispatch({ type: ActionTypes.SET_REACTION, payload: { jugador, tipo } })
  }, [])
  
  // === ACCIONES DE PERSISTENCIA ===
  const guardarHistoria = useCallback(() => {
    dispatch({ type: ActionTypes.SAVE_STORY })
  }, [])
  
  const eliminarHistoria = useCallback((id) => {
    dispatch({ type: ActionTypes.DELETE_STORY, payload: id })
  }, [])
  
  // === ACCIONES DE UI ===
  const setSkin = useCallback((skinId) => {
    dispatch({ type: ActionTypes.SET_SKIN, payload: skinId })
  }, [])
  
  const mostrarToast = useCallback((message, type = 'info') => {
    dispatch({ type: ActionTypes.SHOW_TOAST, payload: { message, type } })
  }, [])
  
  const ocultarToast = useCallback(() => {
    dispatch({ type: ActionTypes.HIDE_TOAST })
  }, [])
  
  // === ACCIONES DE RESET ===
  const reiniciarPartida = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_GAME })
  }, [])
  
  const volverAlMenu = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_TO_MENU })
  }, [])
  
  // === GETTERS DERIVADOS ===
  const jugadorActual = getJugadorActual(state)
  const siguienteJugador = getSiguienteJugador(state)
  const ultimaContribucion = getUltimaContribucion(state)
  const contextoVisible = getContextoVisible(state)
  const progresoPartida = getProgresoPartida(state)
  const oracionesPorTurno = getLongitudOraciones(state.config.longitud)
  
  // Valor del contexto
  const value = {
    // Estado
    state,
    screen: state.screen,
    config: state.config,
    partida: state.partida,
    reacciones: state.reacciones,
    caos: state.caos,
    historiasGuardadas: state.historiasGuardadas,
    toast: state.toast,
    tiempoRestante: state.tiempoRestante,
    
    // Getters derivados
    jugadorActual,
    siguienteJugador,
    ultimaContribucion,
    contextoVisible,
    progresoPartida,
    oracionesPorTurno,
    
    // Acciones de navegacion
    irAPantalla,
    
    // Acciones de configuracion
    setConfig,
    agregarJugador,
    eliminarJugador,
    actualizarJugador,
    
    // Acciones de partida
    iniciarPartida,
    iniciarTurno,
    enviarContribucion,
    siguienteTurno,
    tiempoAgotado,
    setTiempoRestante,
    
    // Acciones de revelacion
    iniciarRevelacion,
    setReaccion,
    
    // Acciones de persistencia
    guardarHistoria,
    eliminarHistoria,
    
    // Acciones de UI
    setSkin,
    mostrarToast,
    ocultarToast,
    
    // Acciones de reset
    reiniciarPartida,
    volverAlMenu
  }
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

// Hook para usar el contexto del juego
export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame debe usarse dentro de un GameProvider')
  }
  return context
}

// Hook para solo el estado (sin acciones) - optimizacion de renders
export function useGameState() {
  const { state } = useGame()
  return state
}

// Hook para solo la configuracion
export function useGameConfig() {
  const { config } = useGame()
  return config
}

// Hook para solo la partida actual
export function useGamePartida() {
  const { partida, jugadorActual, siguienteJugador, progresoPartida } = useGame()
  return { partida, jugadorActual, siguienteJugador, progresoPartida }
}

export default GameContext
