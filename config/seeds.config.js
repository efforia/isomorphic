/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Seeds configuration.
 */

const path = require('path')
const fs = require('fs-extra')

module.exports = {
  init: async app => {
    app.use('/plant', (req, res) => {
      // import data for test
      const seedsDir = path.join(__dirname, '../seeds')
      let isFile
      fs.readdirSync(seedsDir).forEach(function(seed) {
        isFile = seed && seed.indexOf('.') > -1 && seed.indexOf('product') > -1
        if (isFile) require(path.join(seedsDir, seed))
      })
      return res.status(200).json('The seeds have been planted.')
    })
  }
}
