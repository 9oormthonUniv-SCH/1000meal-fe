import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      minHeight: {
        'screen-dvh': '100dvh',
      },
      boxShadow: {
        'even': '0px 0px 16px rgba(0,0,0,0.2)',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
};

export default config;