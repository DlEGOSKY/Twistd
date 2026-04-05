// === src/components/ui/Button.jsx ===
// Boton reutilizable con variantes visuales, Framer Motion y sonido de click
import { motion } from 'framer-motion'
import { useAudio } from '../../hooks/useAudio'

const variants = {
  primary: 'bg-historia-accent text-historia-surface hover:bg-historia-text',
  secondary: 'bg-historia-surface text-historia-accent border border-historia-border hover:bg-historia-bg',
  ghost: 'bg-transparent text-historia-muted hover:text-historia-text hover:bg-historia-surface',
  danger: 'bg-red-700 text-white hover:bg-red-800'
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  conSonido = true
}) {
  const { playClick } = useAudio()
  
  const handleClick = (e) => {
    if (!disabled && conSonido) {
      playClick()
    }
    if (onClick) {
      onClick(e)
    }
  }
  
  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        font-display font-semibold rounded-lg
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-historia-accent focus:ring-offset-2 focus:ring-offset-historia-bg
        ${className}
      `}
    >
      {children}
    </motion.button>
  )
}
