const plugin = require('tailwindcss/plugin')

module.exports.Utilities = function () {
  return plugin(
    ({ addUtilities, matchUtilities, theme }) => {
      addUtilities({
        '.center-children': {
          display: 'grid',
          gridTemplateColumns: '100%',
          gridTemplateRows: '100%',
          placeItems: 'center',
          gridTemplateAreas: "'main'",
          '& > *': {
            gridArea: 'main'
          }
        }
      })

      addUtilities({
        '.container': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: theme('maxWidth.5xl'),
          paddingLeft: theme('padding.5'),
          paddingRight: theme('padding.5'),
          [`@media (min-width: ${theme('screens.md')})`]: {
            paddingLeft: theme('padding.8'),
            paddingRight: theme('padding.8')
          }
        }
      })

      addUtilities({
        '.firefox-border-animation-bug-fix': {
          border: '0.01px solid rgba(0, 0, 0, 0)',
          backgroundClip: 'padding-box'
        }
      })

      matchUtilities({
        'grid-area': values => {
          return {
            gridArea: values
          }
        }
      })
    },
    {
      corePlugins: {
        container: false
      }
    }
  )
}
