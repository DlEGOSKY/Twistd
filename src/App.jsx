// === src/App.jsx ===
// Componente raiz que maneja navegacion entre pantallas
// Usa GameContext para estado global y navegacion
// {/* ACTUALIZADO - Integradas pantallas de TURN FLOW */}

import { motion, AnimatePresence } from 'framer-motion'
import { GameProvider, useGame } from './context/GameContext'
import { Toast } from './components/ui'
import { ConfigScreen, TurnScreen, TransitionScreen, RevealScreen, BibliotecaScreen } from './screens'
import SkinWrapper from './components/layout/SkinWrapper'

// Pantalla de menu principal con animaciones mejoradas
const MenuScreen = () => {
  const { irAPantalla, historiasGuardadas } = useGame()
  
  return (
    <div className="screen-container items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card paper-texture text-center max-w-md w-full"
      >
        {/* Logo/Icono */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-4 bg-historia-accent rounded-2xl flex items-center justify-center shadow-lg"
        >
          <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </motion.div>
        
        <h1 className="font-display text-4xl text-historia-text mb-2">
          Twistd
        </h1>
        <p className="text-historia-muted text-lg mb-6">
          Historias con giros inesperados
        </p>
        
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => irAPantalla('config')}
            className="w-full px-4 py-3 bg-historia-accent text-historia-surface font-display font-semibold rounded-lg hover:bg-historia-text transition-colors"
          >
            Nueva Partida
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => irAPantalla('biblioteca')}
            className="w-full px-4 py-3 bg-historia-surface text-historia-accent border border-historia-border font-display font-semibold rounded-lg hover:bg-historia-bg transition-colors relative"
          >
            Historias Guardadas
            {historiasGuardadas.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-historia-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                {historiasGuardadas.length}
              </span>
            )}
          </motion.button>
        </div>
        
        {/* Version */}
        <p className="text-historia-muted text-xs mt-6 opacity-50">
          v1.0 - Hecho con amor
        </p>
      </motion.div>
    </div>
  )
}

// Componente interno que usa el contexto
function AppContent() {
  const { screen, toast, ocultarToast, config } = useGame()

  return (
    <SkinWrapper skinId={config.skinActivo}>
      <div className="min-h-screen min-h-[100dvh] bg-historia-bg skin-transition">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {screen === 'menu' && <MenuScreen />}
          {screen === 'config' && <ConfigScreen />}
          {screen === 'biblioteca' && <BibliotecaScreen />}
          {screen === 'transicion' && <TransitionScreen />}
          {screen === 'jugando' && <TurnScreen />}
          {screen === 'revelando' && <RevealScreen />}
        </motion.div>
      </AnimatePresence>
      
        {/* Toast de notificaciones */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={!!toast}
            onClose={ocultarToast}
          />
        )}
      </div>
    </SkinWrapper>
  )
}

// App envuelve todo en el GameProvider
function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}

export default App
