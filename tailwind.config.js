// === tailwind.config.js ===
// Configuración de Tailwind con tokens de color para skin Pergamino
// y extensiones para tipografía de Google Fonts

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        historia: {
          // Skin Pergamino Antiguo (default)
          bg: '#F4ECD8',
          surface: '#FFF8E7',
          border: '#D4C5A9',
          text: '#3E2723',
          muted: '#8D6E63',
          accent: '#6D4C41',
          // Colores de jugadores (10 tintas distintas)
          ink1: '#1A237E',
          ink2: '#B71C1C',
          ink3: '#1B5E20',
          ink4: '#4A148C',
          ink5: '#E65100',
          ink6: '#006064',
          ink7: '#880E4F',
          ink8: '#33691E',
          ink9: '#BF360C',
          ink10: '#4E342E'
        }
      },
      fontFamily: {
        // EB Garamond: historia revelada, frases de inicio
        serif: ['EB Garamond', 'Georgia', 'serif'],
        // Crimson Pro: nombres de jugadores, títulos
        display: ['Crimson Pro', 'Georgia', 'serif'],
        // JetBrains Mono: timer, contador de caracteres
        mono: ['JetBrains Mono', 'monospace']
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out'
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 }
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
