const tailwindcssTheme = require('tailwindcss/defaultTheme')

const { typography } = require('./defaults/typography')

module.exports.theme = {
  typography,
  extend: {
    maxWidth: {
      container: 'var(--max-w-container)'
    },
    spacing: {
      container: 'var(--spacing-container)'
    },
    fontFamily: {
      sans: [...tailwindcssTheme.fontFamily.sans]
    }
  }
}
