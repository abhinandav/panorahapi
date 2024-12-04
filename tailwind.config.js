import logical from 'tailwindcss-logical';
import corePlugin from './src/@core/tailwind/plugin.js'; 

const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  corePlugins: {
    preflight: false,
  },
  important: '#__next',
  plugins: [logical, corePlugin],
  theme: {
    extend: {},
  },
};

export default config;
