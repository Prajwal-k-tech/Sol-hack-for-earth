/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Catppuccin Mocha color palette
        base: {
          50: '#cdd6f4',  // lavender
          100: '#b4befe', // blue
          200: '#89b4fa', // sapphire
          300: '#74c7ec', // sky
          400: '#89dceb', // teal
          500: '#a6e3a1', // green
          600: '#f9e2af', // yellow
          700: '#fab387', // peach
          800: '#f38ba8', // maroon
          900: '#eba0ac', // pink
        },
        text: {
          primary: '#cdd6f4',   // lavender
          secondary: '#bac2de', // subtext1
          muted: '#a6adc8',     // subtext0
          disabled: '#6c7086', // overlay2
        },
        surface: {
          base: '#1e1e2e',      // base
          mantle: '#181825',    // mantle
          crust: '#11111b',     // crust
          overlay: '#313244',   // surface0
          'overlay-1': '#45475a', // surface1
          'overlay-2': '#585b70', // surface2
        },
        accent: {
          primary: '#cba6f7',   // mauve
          secondary: '#f5c2e7', // pink
          success: '#a6e3a1',   // green
          warning: '#f9e2af',   // yellow
          error: '#f38ba8',     // red
          info: '#89b4fa',      // blue
        },
        border: '#45475a',      // surface1
        ring: '#cba6f7',       // mauve
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(203, 166, 247, 0.3)',
        'glow-lg': '0 0 40px rgba(203, 166, 247, 0.2)',
      },
    },
  },
  plugins: [],
}
