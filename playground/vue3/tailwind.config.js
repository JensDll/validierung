const Forms = require('@tailwindcss/forms')
const Typography = require('@tailwindcss/typography')
const { Icons } = require('tailwindcss-plugin-icons')
const defaultTheme = require('tailwindcss/defaultTheme')

const { Utilities } = require('./tailwind/utilities')
const { colors } = require('./tailwind/colors')

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors,
    fontFamily: {
      sans: [...defaultTheme.fontFamily.sans]
    },
    extend: {}
  },
  plugins: [
    Forms(),
    Typography(),
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
    }),
    Utilities()
  ]
}
