// === src/components/stats/StatsPanel.jsx ===
// Panel de metricas generales de la historia
// Muestra estadisticas numericas clave

import { motion } from 'framer-motion'

export default function StatsPanel({ estadisticas }) {
  const {
    totalPalabras,
    palabrasUnicas,
    diversidadLexica,
    longitudPromedio,
    masLarga,
    masCorta,
    totalCaracteres
  } = estadisticas
  
  const metricas = [
    {
      label: 'Palabras Totales',
      valor: totalPalabras.toLocaleString(),
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      label: 'Palabras Únicas',
      valor: palabrasUnicas.toLocaleString(),
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      )
    },
    {
      label: 'Diversidad Léxica',
      valor: `${diversidadLexica}%`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      descripcion: 'Variedad de vocabulario'
    },
    {
      label: 'Longitud Promedio',
      valor: `${longitudPromedio} car.`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
      )
    },
    {
      label: 'Más Larga',
      valor: `${masLarga} car.`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      )
    },
    {
      label: 'Más Corta',
      valor: `${masCorta} car.`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      )
    }
  ]
  
  return (
    <div className="card">
      <h3 className="font-display text-lg text-historia-text mb-4">
        Estadísticas de la Historia
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {metricas.map((metrica, index) => (
          <motion.div
            key={metrica.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 p-3 bg-historia-surface rounded-lg border border-historia-border"
          >
            <div className="text-historia-accent mt-0.5">
              {metrica.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs text-historia-muted mb-0.5">
                {metrica.label}
              </p>
              <p className="font-mono text-lg font-bold text-historia-text">
                {metrica.valor}
              </p>
              {metrica.descripcion && (
                <p className="text-xs text-historia-muted italic mt-0.5">
                  {metrica.descripcion}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Resumen adicional */}
      <div className="mt-4 pt-4 border-t border-historia-border">
        <p className="text-sm text-historia-muted text-center">
          <span className="font-mono font-bold text-historia-text">
            {totalCaracteres.toLocaleString()}
          </span>
          {' '}caracteres en total
        </p>
      </div>
    </div>
  )
}
