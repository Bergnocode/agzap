/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00D856',
          hover: '#00bf4b',
        },
      },
      screens: {
        'xs': '320px',    // Mobile pequeno
        'sm': '480px',    // Mobile grande (ajustado para melhor compatibilidade)
        'md': '768px',    // Tablet (ajustado para padrão comum)
        'lg': '1024px',   // Desktop (ajustado para padrão comum)
        'xl': '1280px',   // Desktop grande
        '2xl': '1536px',  // Telas muito grandes
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      fontSize: {
        'xxs': '0.625rem',
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
    },
  },
  plugins: [],
};