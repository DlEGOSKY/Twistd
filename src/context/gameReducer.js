// === src/context/gameReducer.js ===
// Reducer central del juego con todas las acciones del ciclo de vida
// Estados: menu → config → jugando → transicion → revelando → terminado

import { getFraseAleatoria } from '../data/frases'
import { calcularCaos } from '../utils/caos'

// Estado inicial del juego
export const initialState = {
  // Pantalla actual de la aplicacion
  screen: 'menu', // menu | config | jugando | transicion | revelando | biblioteca
  
  // Configuracion de la partida
  config: {
    jugadores: [],           // Array de nombres (2-10)
    genero: 'terror',        // ID del genero seleccionado
    longitud: 'media',       // corta (1) | media (2) | larga (3) oraciones
    modo: 'normal',          // normal | dificil | imagen
    timer: 60,               // Segundos por turno (30 | 60 | null)
    fraseInicial: '',        // Frase de inicio (fija o aleatoria)
    frasePersonalizada: false, // true si el organizador escribio la frase
    rondas: 2,               // Numero de rondas (1-5)
    skinActivo: 'pergamino'  // ID del skin visual
  },
  
  // Estado de la partida en curso
  partida: {
    rondaActual: 1,
    turnoActual: 0,          // Indice del jugador actual
    contribuciones: [],      // Array de { jugador, texto, ronda }
    estado: 'esperando'      // esperando | escribiendo | completado
  },
  
  // Reacciones de jugadores al revelar (jugador: tipo)
  reacciones: {},
  
  // Puntuacion de caos (0-100, calculado al revelar)
  caos: 0,
  
  // Historias guardadas en LocalStorage
  historiasGuardadas: [],
  
  // UI temporal
  toast: null,               // { message, type } para notificaciones
  tiempoRestante: null       // Segundos restantes del timer actual
}

// Tipos de acciones disponibles
export const ActionTypes = {
  // Navegacion
  SET_SCREEN: 'SET_SCREEN',
  
  // Configuracion
  SET_CONFIG: 'SET_CONFIG',
  ADD_JUGADOR: 'ADD_JUGADOR',
  REMOVE_JUGADOR: 'REMOVE_JUGADOR',
  UPDATE_JUGADOR: 'UPDATE_JUGADOR',
  
  // Partida
  INIT_GAME: 'INIT_GAME',
  START_TURN: 'START_TURN',
  ADD_CONTRIBUTION: 'ADD_CONTRIBUTION',
  NEXT_TURN: 'NEXT_TURN',
  TIME_UP: 'TIME_UP',
  
  // Revelacion
  START_REVEAL: 'START_REVEAL',
  SET_REACTION: 'SET_REACTION',
  CALCULATE_CAOS: 'CALCULATE_CAOS',
  
  // Persistencia
  SAVE_STORY: 'SAVE_STORY',
  LOAD_STORIES: 'LOAD_STORIES',
  DELETE_STORY: 'DELETE_STORY',
  
  // UI
  SET_SKIN: 'SET_SKIN',
  SHOW_TOAST: 'SHOW_TOAST',
  HIDE_TOAST: 'HIDE_TOAST',
  SET_TIMER: 'SET_TIMER',
  
  // Reset
  RESET_GAME: 'RESET_GAME',
  RESET_TO_MENU: 'RESET_TO_MENU'
}

// Reducer principal
export function gameReducer(state, action) {
  switch (action.type) {
    
    // === NAVEGACION ===
    case ActionTypes.SET_SCREEN:
      return {
        ...state,
        screen: action.payload
      }
    
    // === CONFIGURACION ===
    case ActionTypes.SET_CONFIG:
      return {
        ...state,
        config: {
          ...state.config,
          ...action.payload
        }
      }
    
    case ActionTypes.ADD_JUGADOR:
      // Maximo 10 jugadores
      if (state.config.jugadores.length >= 10) return state
      return {
        ...state,
        config: {
          ...state.config,
          jugadores: [...state.config.jugadores, action.payload]
        }
      }
    
    case ActionTypes.REMOVE_JUGADOR:
      return {
        ...state,
        config: {
          ...state.config,
          jugadores: state.config.jugadores.filter((_, i) => i !== action.payload)
        }
      }
    
    case ActionTypes.UPDATE_JUGADOR:
      return {
        ...state,
        config: {
          ...state.config,
          jugadores: state.config.jugadores.map((j, i) => 
            i === action.payload.index ? action.payload.nombre : j
          )
        }
      }
    
    // === PARTIDA ===
    case ActionTypes.INIT_GAME: {
      // Determinar frase inicial (personalizada o aleatoria)
      const fraseInicial = state.config.frasePersonalizada && state.config.fraseInicial
        ? state.config.fraseInicial
        : getFraseAleatoria(state.config.genero)
      
      return {
        ...state,
        screen: 'transicion',
        config: {
          ...state.config,
          fraseInicial
        },
        partida: {
          rondaActual: 1,
          turnoActual: 0,
          contribuciones: [{
            jugador: 'Sistema',
            texto: fraseInicial,
            ronda: 0,
            esFraseInicial: true
          }],
          estado: 'esperando'
        },
        reacciones: {},
        caos: 0,
        tiempoRestante: state.config.timer
      }
    }
    
    case ActionTypes.START_TURN:
      return {
        ...state,
        screen: 'jugando',
        partida: {
          ...state.partida,
          estado: 'escribiendo'
        },
        tiempoRestante: state.config.timer
      }
    
    case ActionTypes.ADD_CONTRIBUTION: {
      const { texto } = action.payload
      const jugadorActual = state.config.jugadores[state.partida.turnoActual]
      
      const nuevaContribucion = {
        jugador: jugadorActual,
        texto: texto.trim(),
        ronda: state.partida.rondaActual
      }
      
      return {
        ...state,
        partida: {
          ...state.partida,
          contribuciones: [...state.partida.contribuciones, nuevaContribucion],
          estado: 'completado'
        }
      }
    }
    
    case ActionTypes.NEXT_TURN: {
      const siguienteTurno = state.partida.turnoActual + 1
      const totalJugadores = state.config.jugadores.length
      
      // Verificar si terminamos la ronda
      if (siguienteTurno >= totalJugadores) {
        const siguienteRonda = state.partida.rondaActual + 1
        
        // Verificar si terminamos todas las rondas
        if (siguienteRonda > state.config.rondas) {
          return {
            ...state,
            screen: 'revelando',
            partida: {
              ...state.partida,
              estado: 'completado'
            }
          }
        }
        
        // Nueva ronda, volver al primer jugador
        return {
          ...state,
          screen: 'transicion',
          partida: {
            ...state.partida,
            rondaActual: siguienteRonda,
            turnoActual: 0,
            estado: 'esperando'
          },
          tiempoRestante: state.config.timer
        }
      }
      
      // Siguiente jugador en la misma ronda
      return {
        ...state,
        screen: 'transicion',
        partida: {
          ...state.partida,
          turnoActual: siguienteTurno,
          estado: 'esperando'
        },
        tiempoRestante: state.config.timer
      }
    }
    
    case ActionTypes.TIME_UP:
      // Cuando se acaba el tiempo, agregar contribucion vacia o parcial
      return {
        ...state,
        partida: {
          ...state.partida,
          estado: 'completado'
        },
        toast: {
          message: 'Se acabo el tiempo',
          type: 'warning'
        }
      }
    
    // === REVELACION ===
    case ActionTypes.START_REVEAL:
      return {
        ...state,
        screen: 'revelando',
        caos: calcularCaos(state.partida.contribuciones, state.config.genero)
      }
    
    case ActionTypes.SET_REACTION:
      return {
        ...state,
        reacciones: {
          ...state.reacciones,
          [action.payload.jugador]: action.payload.tipo
        }
      }
    
    case ActionTypes.CALCULATE_CAOS:
      return {
        ...state,
        caos: calcularCaos(state.partida.contribuciones, state.config.genero)
      }
    
    // === PERSISTENCIA ===
    case ActionTypes.SAVE_STORY: {
      const nuevaHistoria = {
        id: crypto.randomUUID(),
        fecha: Date.now(),
        genero: state.config.genero,
        jugadores: state.config.jugadores,
        contribuciones: state.partida.contribuciones,
        caos: state.caos,
        reacciones: state.reacciones
      }
      
      const historiasActualizadas = [nuevaHistoria, ...state.historiasGuardadas]
      
      // Guardar en LocalStorage
      try {
        localStorage.setItem('historias-guardadas', JSON.stringify(historiasActualizadas))
      } catch (e) {
        console.error('Error guardando historia:', e)
      }
      
      return {
        ...state,
        historiasGuardadas: historiasActualizadas,
        toast: {
          message: 'Historia guardada',
          type: 'success'
        }
      }
    }
    
    case ActionTypes.LOAD_STORIES: {
      try {
        const historias = JSON.parse(localStorage.getItem('historias-guardadas') || '[]')
        return {
          ...state,
          historiasGuardadas: historias
        }
      } catch (e) {
        console.error('Error cargando historias:', e)
        return state
      }
    }
    
    case ActionTypes.DELETE_STORY: {
      const historiasActualizadas = state.historiasGuardadas.filter(
        h => h.id !== action.payload
      )
      
      try {
        localStorage.setItem('historias-guardadas', JSON.stringify(historiasActualizadas))
      } catch (e) {
        console.error('Error eliminando historia:', e)
      }
      
      return {
        ...state,
        historiasGuardadas: historiasActualizadas,
        toast: {
          message: 'Historia eliminada',
          type: 'info'
        }
      }
    }
    
    // === UI ===
    case ActionTypes.SET_SKIN:
      return {
        ...state,
        config: {
          ...state.config,
          skinActivo: action.payload
        }
      }
    
    case ActionTypes.SHOW_TOAST:
      return {
        ...state,
        toast: action.payload
      }
    
    case ActionTypes.HIDE_TOAST:
      return {
        ...state,
        toast: null
      }
    
    case ActionTypes.SET_TIMER:
      return {
        ...state,
        tiempoRestante: action.payload
      }
    
    // === RESET ===
    case ActionTypes.RESET_GAME:
      return {
        ...state,
        screen: 'config',
        partida: initialState.partida,
        reacciones: {},
        caos: 0,
        tiempoRestante: null
      }
    
    case ActionTypes.RESET_TO_MENU:
      return {
        ...initialState,
        historiasGuardadas: state.historiasGuardadas
      }
    
    default:
      console.warn('Accion no reconocida:', action.type)
      return state
  }
}

// Helpers para obtener informacion del estado
export const getJugadorActual = (state) => 
  state.config.jugadores[state.partida.turnoActual]

export const getSiguienteJugador = (state) => {
  const siguiente = state.partida.turnoActual + 1
  if (siguiente >= state.config.jugadores.length) {
    return state.config.jugadores[0]
  }
  return state.config.jugadores[siguiente]
}

export const getUltimaContribucion = (state) => 
  state.partida.contribuciones[state.partida.contribuciones.length - 1]

export const getContextoVisible = (state) => {
  const ultima = getUltimaContribucion(state)
  if (!ultima) return ''
  
  switch (state.config.modo) {
    case 'normal':
      // Mostrar ultima oracion completa
      return ultima.texto
    case 'dificil':
      // Mostrar solo ultima palabra
      const palabras = ultima.texto.trim().split(/\s+/)
      return palabras[palabras.length - 1] || ''
    case 'imagen':
      // No mostrar texto, se mostrara arte CSS
      return null
    default:
      return ultima.texto
  }
}

export const getProgresoPartida = (state) => {
  const totalTurnos = state.config.jugadores.length * state.config.rondas
  const turnosCompletados = 
    (state.partida.rondaActual - 1) * state.config.jugadores.length + 
    state.partida.turnoActual
  return {
    actual: turnosCompletados,
    total: totalTurnos,
    porcentaje: Math.round((turnosCompletados / totalTurnos) * 100)
  }
}

export const getLongitudOraciones = (longitud) => {
  switch (longitud) {
    case 'corta': return 1
    case 'media': return 2
    case 'larga': return 3
    default: return 2
  }
}
