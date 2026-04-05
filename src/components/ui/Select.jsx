// === src/components/ui/Select.jsx ===
// Selector desplegable con estilo consistente
export default function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  disabled = false,
  className = ''
}) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block font-display text-sm text-historia-text mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full px-3 py-2 pr-10
            bg-historia-surface text-historia-text
            border border-historia-border rounded-lg
            font-serif text-base
            appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-historia-accent focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            ${className}
          `}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Flecha SVG personalizada */}
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-historia-muted pointer-events-none"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  )
}
