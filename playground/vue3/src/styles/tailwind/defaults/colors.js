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
    continue
  }

  if (value !== null && typeof value === 'object') {
    const shades = {}
    rgb[colorName] = shades

    for (const [shade, color] of Object.entries(value)) {
      const parts = parseColor(color).color.join(' ')
      shades[shade] = parts
    }
  }
}

colors.rgb = rgb

module.exports.colors = colors