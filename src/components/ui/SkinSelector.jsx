// === src/components/ui/SkinSelector.jsx ===
// Selector visual de temas/skins para la aplicacion
// Muestra preview de cada skin con colores y fuentes

import { motion } from 'framer-motion'
import { skins, getSkin } from '../../data/skins'
import { useAudio } from '../../hooks/useAudio'

export default function SkinSelector({ skinActual, onCambiarSkin }) {
  const { playClick } = useAudio()
  const listaSkins = Object.values(skins)
  
  const handleSeleccionar = (skinId) => {
    playClick()
    onCambiarSkin(skinId)
  }
  
  return (
    <div className="space-y-3">
      <label className="block text-sm font-display text-historia-text mb-2">
        Tema Visual
      </label>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {listaSkins.map((skin) => {
          const esActivo = skinActual === skin.id
          
          return (
            <motion.button
              key={skin.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSeleccionar(skin.id)}
              className={`
                relative p-3 rounded-xl border-2 transition-all text-left
                ${esActivo 
                  ? 'border-historia-accent shadow-lg' 
                  : 'border-transparent hover:border-historia-border'}
              `}
              style={{ backgroundColor: skin.colores.fondo }}
            >
              {/* Indicador de seleccion */}
              {esActivo && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: skin.colores.acento }}
                >
                  <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
              
              {/* Preview de colores */}
              <div className="flex gap-1 mb-2">
                <div 
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: skin.colores.acento }}
                  title="Acento"
                />
                <div 
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: skin.colores.texto }}
                  title="Texto"
                />
                <div 
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: skin.colores.superficie }}
                  title="Superficie"
                />
              </div>
              
              {/* Nombre del skin */}
              <p 
                className="font-display text-sm font-semibold"
                style={{ 
                  color: skin.colores.texto,
                  fontFamily: skin.fuentes?.display || 'inherit'
                }}
              >
                {skin.nombre}
              </p>
              
              {/* Descripcion */}
              <p 
                className="text-xs mt-0.5 opacity-70"
                style={{ color: skin.colores.texto }}
              >
                {skin.descripcion}
              </p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// Version compacta para usar en header/settings
export function SkinSelectorCompact({ skinActual, onCambiarSkin }) {
  const { playClick } = useAudio()
  const listaSkins = Object.values(skins)
  
  return (
    <div className="flex gap-2">
      {listaSkins.map((skin) => {
        const esActivo = skinActual === skin.id
        
        return (
          <motion.button
            key={skin.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              playClick()
              onCambiarSkin(skin.id)
            }}
            className={`
              w-8 h-8 rounded-full border-2 transition-all
              ${esActivo ? 'ring-2 ring-offset-2 ring-historia-accent' : ''}
            `}
            style={{ 
              backgroundColor: skin.colores.fondo,
              borderColor: skin.colores.acento
            }}
            title={skin.nombre}
          >
            <span className="sr-only">{skin.nombre}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
