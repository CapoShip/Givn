/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // <--- C'est ici que ça change (avant c'était juste 'tailwindcss')
    autoprefixer: {},
  },
};

export default config;