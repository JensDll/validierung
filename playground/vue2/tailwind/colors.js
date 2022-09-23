const tailwindColors = require('tailwindcss/colors')
const { parseColor } = require('tailwindcss/lib/util/color')

// Delete deprecated colors
delete tailwindColors.lightBlue
delete tailwindColors.warmGray
delete tailwindColors.trueGray
delete tailwindColors.coolGray
delete tailwindColors.blueGray

const colors = {
  ...tailwindColors,
  gray: tailwindColors.slate
}

// Delete unused grays
delete colors.slate
delete colors.zinc
delete colors.neutral
delete colors.stone

const rgb = {}

for (const [colorName, value] of Object.entries(colors)) {
  if (colorName === 'white' || colorName === 'black') {
    const parts = parseColor(value).color.join(' ')
    rgb[colorName] = parts
  } else if (typeof value === 'object') {
    const shades = {}
    rgb[colorName] = shades
    for (const [shade, color] of Object.entries(value)) {
      const parts = parseColor(color).color.join(' ')
      shades[shade] = parts
    }
  }
}

function withAlphaValue(variable) {
  return `rgb(${asVar(variable)} / <alpha-value>)`
}

function asVar(variable) {
  return `var(${variable})`
}

colors.rgb = rgb

colors.text = {
  base: asVar('--tw-prose-body'),
  error: withAlphaValue('--color-text-error'),
  heading: asVar('--tw-prose-headings')
}

colors.bg = {
  base: withAlphaValue('--color-fill'),
  form: {
    base: withAlphaValue('--color-form-fill')
  }
}

colors.border = {
  base: withAlphaValue('--color-border-base'),
  form: {
    base: withAlphaValue('--color-border-form-base'),
    highlight: withAlphaValue('--color-border-form-highlight')
  }
}

module.exports.colors = colors
