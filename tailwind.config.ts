import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3b82f6',
        'primary-dark': '#1e40af',
        'success': '#10b981',
        'warning': '#f59e0b',
        'danger': '#ef4444',
      },
    },
  },
  plugins: [],
};

export default config;
