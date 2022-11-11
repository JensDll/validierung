const plugin = require('tailwindcss/plugin')

module.exports.Common = function () {
  return plugin(
    ({ addUtilities, matchUtilities, theme, addBase }) => {
      addBase({
        '.container': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: theme('maxWidth.container'),
          paddingLeft: theme('padding.container'),
          paddingRight: theme('padding.container')
        }
      })

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
        '.firefox-border-animation-bug-fix': {
          border: '0.01px solid rgba(0, 0, 0, 0)',
          backgroundClip: 'padding-box'
        },
        '.safari-fix-overflow': {
          maskImage: 'radial-gradient(white, black)'
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
        container: false,
        ringColor: false,
        ringOffsetColor: false,
        ringOffsetWidth: false,
        ringOpacity: false,
        ringWidth: false
      }
    }
  )
}
