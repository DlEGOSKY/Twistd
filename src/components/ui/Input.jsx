// === src/components/ui/Input.jsx ===
// Campo de texto con label y estado de error
import { forwardRef } from 'react'

const Input = forwardRef(function Input({
  label,
  error,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  maxLength,
  disabled = false,
  className = ''
}, ref) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block font-display text-sm text-historia-text mb-1"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        disabled={disabled}
        className={`
          w-full px-3 py-2
          bg-historia-surface text-historia-text
          border border-historia-border rounded-lg
          font-serif text-base
          placeholder:text-historia-muted
          focus:outline-none focus:ring-2 focus:ring-historia-accent focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

export default Input
