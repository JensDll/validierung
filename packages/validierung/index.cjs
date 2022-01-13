'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/index.prod.cjs')
} else {
  module.exports = require('./dist/index.cjs')
}
