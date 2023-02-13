const Forms = require('@tailwindcss/forms')
const Typography = require('@tailwindcss/typography')
const { Icons } = require('tailwindcss-plugin-icons')

const { Common } = require('./src/styles/tailwind/common')
const { theme } = require('./src/styles/tailwind/theme')
const { Themes } = require('./src/styles/tailwind/themes')

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme,
  plugins: [
    Typography(),
    Forms(),
    Icons(({ theme }) => ({
      heroicons: {
        icons: {
          'plus-circle': {
            color: theme('colors.green.600'),
            cursor: 'pointer',
            '&:hover': {
              color: theme('colors.green.800')
            }
          },
          'minus-circle': {
            color: theme('colors.red.600'),
            cursor: 'pointer',
            '&:hover': {
              color: theme('colors.red.800')
            }
          }
        },
        includeAll: true,
        scale: iconName => (iconName.endsWith('-20-solid') ? 1.25 : 1.5)
      },
      custom: {
        icons: {
          loading: {
            '@keyframes spin': {
              to: {
                transform: 'rotate(360deg)'
              }
            },
            animation: 'spin 600ms linear infinite'
          }
        },
        scale: 1.5,
        location:
          'https://gist.githubusercontent.com/JensDll/4e59cf6005f585581975941a94bc1d88/raw/0e70bdac81224add27d8f0576ab15406709e5938/icons.json'
      }
    })),
    Common(),
    Themes()
  ]
}
