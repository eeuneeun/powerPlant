// next.config.js
const debug = process.env.NODE_ENV !== 'production'
const name = 'powerPlant'

module.exports = {
  assetPrefix: !debug ? `/${name}/` : '',
}