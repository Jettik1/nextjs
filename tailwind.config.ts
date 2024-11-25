import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'base-dark': {
          100: '#1a1a1a',
          200: '#1f1f1f',
          300: '#262626',
          400: '#333333',
          500: '#404040',
          600: '#4d4d4d',
          700: '#666666',
          800: '#808080',
          900: '#999999',
        },
        'base-dark-blue': {
          100: '#1e3a5f', // lightest
          200: '#1b3556',
          300: '#172f4d',
          400: '#142a44',
          500: '#11253b', // default
          600: '#0e2032',
          700: '#0b1b29',
          800: '#081620',
          900: '#050f17', // darkest
        },
        base: 'rgba(40, 40, 40, 1)',
        secondary: 'rgba(70, 70, 70, 1)',
      },
    },
  },
  plugins: [require('daisyui')],
}
export default config
