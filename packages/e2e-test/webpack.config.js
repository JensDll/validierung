const path = require('path')

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production'

  return {
    entry: {
      index: './src/index.js'
    },
    output: {
      filename: isProd ? '[name].min.js' : '[name].js',
      path: path.resolve(__dirname, 'dist')
    }
  }
}
