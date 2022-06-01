const tailwindColors = require('tailwindcss/colors')

delete tailwindColors.lightBlue
delete tailwindColors.warmGray
delete tailwindColors.trueGray
delete tailwindColors.coolGray
delete tailwindColors.blueGray

tailwindColors.gray = tailwindColors.stone

delete tailwindColors.slate
delete tailwindColors.zinc
delete tailwindColors.neutral
delete tailwindColors.stone

module.exports.colors = tailwindColors
