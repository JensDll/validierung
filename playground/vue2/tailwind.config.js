const Form = require('@tailwindcss/forms')
const { Icons } = require('tailwindcss-plugin-icons')

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Montserrat', 'sans-serif']
    },
    extend: {}
  },
  plugins: [
    Form,
    Icons({
      heroiconsSolid: {
        icons: ['menu'],
        location:
          'https://esm.sh/@iconify-json/heroicons-solid@1.1.1/icons.json'
      },
      heroiconsOutline: {
        icons: ['plus-circle', 'minus-circle'],
        location:
          'https://esm.sh/@iconify-json/heroicons-outline@1.1.1/icons.json'
      },
      custom: {
        icons: ['loading'],
        location:
          'https://gist.githubusercontent.com/JensDll/4e59cf6005f585581975941a94bc1d88/raw/0e70bdac81224add27d8f0576ab15406709e5938/icons.json'
      }
    })
  ],
  corePlugins: {}
}
