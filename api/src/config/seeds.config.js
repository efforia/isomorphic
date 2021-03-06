/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Seeds configuration.
 */

import path from 'path'
import fs from 'fs-extra'

export default {
  init: async app => {
    app.use('/plant', (req, res) => {
      // import data for test
      const seedsDir = path.join(__dirname, '../seeds')
      let isFile
      fs.readdirSync(seedsDir).forEach(seed => {
        isFile = seed && seed.indexOf('.') > -1 && seed.indexOf('product') > -1
        if (isFile) require(path.join(seedsDir, seed))
      })
      return res.status(200).json('The seeds have been planted.')
    })
  }
}
