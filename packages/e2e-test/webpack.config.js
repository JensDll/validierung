const path = require('path')

module.exports = env => {
  return {
    entry: {
      index: './src/index.js'
    },
    output: {
      filename: env.DEV ? '[name].dev.js' : '[name].prod.js',
      path: path.resolve(__dirname, 'dist')
    },
    optimization: {
      minimize: !env.DEV
    },
    externals: {}
  }
}
