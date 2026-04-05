// === src/components/ui/ExportButtons.jsx ===
// Botones para exportar historia en diferentes formatos
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio } from '../../hooks/useAudio'
import {
  exportarComoTexto,
  exportarComoJSON,
  copiarAlPortapapeles,
  descargarArchivo,
  generarNombreArchivo
} from '../../utils/exportar'

export default function ExportButtons({ historia, onExportado }) {
  const [copiado, setCopiado] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { playSuccess, playClick } = useAudio()
  
  // Copiar como texto al portapapeles
  const handleCopiarTexto = async () => {
    const texto = exportarComoTexto(historia)
    const exito = await copiarAlPortapapeles(texto)
    
    if (exito) {
      playSuccess()
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
      if (onExportado) onExportado('copiado')
    }
    setMenuAbierto(false)
  }
  
  // Descargar como archivo de texto
  const handleDescargarTexto = () => {
    playClick()
    const texto = exportarComoTexto(historia)
    const nombre = generarNombreArchivo(historia, 'txt')
    descargarArchivo(texto, nombre, 'text/plain')
    if (onExportado) onExportado('texto')
    setMenuAbierto(false)
  }
  
  // Descargar como JSON
  const handleDescargarJSON = () => {
    playClick()
    const json = exportarComoJSON(historia)
    const nombre = generarNombreArchivo(historia, 'json')
    descargarArchivo(json, nombre, 'application/json')
    if (onExportado) onExportado('json')
    setMenuAbierto(false)
  }
  
  return (
    <div className="relative">
      {/* Boton principal */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setMenuAbierto(!menuAbierto)}
        className="flex items-center gap-2 px-4 py-2 bg-historia-surface text-historia-text border border-historia-border rounded-lg hover:bg-historia-bg transition-colors font-display"
      >
        {/* Icono de exportar */}
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        
        {copiado ? 'Copiado!' : 'Exportar'}
        
        {/* Flecha del dropdown */}
        <svg 
          className={`w-4 h-4 transition-transform ${menuAbierto ? 'rotate-180' : ''}`} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.button>
      
      {/* Menu dropdown */}
      <AnimatePresence>
        {menuAbierto && (
          <>
            {/* Overlay para cerrar */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setMenuAbierto(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-56 bg-historia-surface border border-historia-border rounded-lg shadow-lg z-20 overflow-hidden"
            >
              {/* Copiar al portapapeles */}
              <button
                onClick={handleCopiarTexto}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-historia-bg transition-colors"
              >
                <svg className="w-5 h-5 text-historia-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <div>
                  <p className="font-display text-historia-text">Copiar al portapapeles</p>
                  <p className="text-xs text-historia-muted">Texto formateado</p>
                </div>
              </button>
              
              <div className="border-t border-historia-border" />
              
              {/* Descargar TXT */}
              <button
                onClick={handleDescargarTexto}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-historia-bg transition-colors"
              >
                <svg className="w-5 h-5 text-historia-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <div>
                  <p className="font-display text-historia-text">Descargar .txt</p>
                  <p className="text-xs text-historia-muted">Archivo de texto</p>
                </div>
              </button>
              
              {/* Descargar JSON */}
              <button
                onClick={handleDescargarJSON}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-historia-bg transition-colors"
              >
                <svg className="w-5 h-5 text-historia-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M10 12l-2 2 2 2" />
                  <path d="M14 12l2 2-2 2" />
                </svg>
                <div>
                  <p className="font-display text-historia-text">Descargar .json</p>
                  <p className="text-xs text-historia-muted">Datos estructurados</p>
                </div>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
