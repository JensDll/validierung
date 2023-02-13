const plugin = require('tailwindcss/plugin')

module.exports.Common = function () {
  return plugin(
    ({ addUtilities, matchUtilities, addVariant, theme, addBase }) => {
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
        '.firefox-border-animation-fix': {
          border: '0.05px solid rgba(0, 0, 0, 0)',
          backgroundClip: 'padding-box'
        },
        '.safari-overflow-fix': {
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

      addVariant(
        'supports-backdrop-blur',
        '@supports (backdrop-filter: blur(4px))'
      )
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
