const config = require('config/tailwind.config')

module.exports = config({
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.mdx',
    './lib/**/*.{ts,tsx}',
    './../../packages/ui/src/**/*.{tsx,ts,js}',
  ],
  plugins: [require('@tailwindcss/container-queries')],
})
