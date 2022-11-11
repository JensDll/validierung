const plugin = require('tailwindcss/plugin')

const { colors } = require('./defaults/colors')
const { theme } = require('./theme')

function withAlphaValue(variable) {
  return `rgb(${asVar(variable)} / <alpha-value>)`
}

function asVar(variable) {
  return `var(${variable})`
}

const light = {
  ...theme.typography.slate.css,
  '--highlight': colors.rgb.blue['500'],
  '--border-form-highlight': colors.rgb.blue['500'],
  '--link': colors.rgb.orange['500'],
  '--error': colors.rgb.red['500'],
  '--fill': colors.rgb.gray['50'],
  '--fill-form': colors.rgb.white,
  '--border': colors.rgb.gray['200'],
  '--border-form': colors.rgb.gray['200']
}

module.exports.Themes = function () {
  return plugin(
    ({ addComponents }) => {
      addComponents({
        '.theme-light': light
      })
    },
    {
      theme: {
        colors: {
          ...colors,
          ...Object.entries(light).reduce((result, [key]) => {
            result[key.replace('--', '')] = withAlphaValue(key)
            return result
          }, {})
        },
        extend: {
          borderColor: {
            DEFAULT: 'rgb(var(--border))'
          }
        }
      }
    }
  )
}
