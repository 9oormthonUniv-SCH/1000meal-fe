import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      minHeight: {
        'screen-dvh': '100dvh',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
};

export default config;