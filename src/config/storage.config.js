/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Google Cloud Storage configuration.
 */

const path = require('path')
const fs = require('fs-extra')
const gcloudKeyFilepath = path.resolve(__dirname, '../keys/gcloud.json')

module.exports = {
  init: async () => {
    const gcloudKey = process.env.GOOGLE_APPLICATION_CREDENTIALS_VALUE
    process.env.GOOGLE_APPLICATION_CREDENTIALS = gcloudKeyFilepath
    await fs.ensureFileSync(gcloudKeyFilepath)
    fs.writeFileSync(gcloudKeyFilepath, gcloudKey)
  }
}
