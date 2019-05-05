/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Swagger configuration.
 */

const path = require('path')
const express = require('express')
const subdomain = require('express-subdomain')
const secure = require('express-force-https')
const staticZip = require('express-static-gzip')

module.exports = SubdomainConfig = {
  use: async (app, alias, folder) => {
    const staticFolder = path.resolve(__dirname, '../public', folder)
    const indexFile = path.join(staticFolder, 'index.html')
    const buildFolder = path.join(staticFolder, 'build')
    const router = express.Router()

    app.use(subdomain(alias, express.static(staticFolder)))
    app.use(
      subdomain(
        alias,
        staticZip(buildFolder, {
          enableBrotli: true,
          orderPreference: ['br', 'gz']
        })
      )
    )
    app.use(subdomain(alias, secure))
    router.use('/*', (req, res, next) => {
      // console.log('Heeeeey')
      if (/.js|.html|.css|templates|js|scripts/.test(req.path) || req.xhr) {
        return next({ status: 404, message: 'Not Found' })
      } else {
        return res.sendFile(indexFile)
      }
    })
    app.use(subdomain(alias, router))
  },
  path(subdomain) {
    return subdomain
      .concat(process.env.STAGE !== 'prod' ? '-' : '')
      .concat(process.env.STAGE !== 'prod' ? process.env.STAGE : '')
  },
  init(app) {
    SubdomainConfig.use(app, SubdomainConfig.path('app'), 'customer')
    SubdomainConfig.use(app, SubdomainConfig.path('www'), 'landing')
    SubdomainConfig.use(app, SubdomainConfig.path('admin'), 'admin')
    SubdomainConfig.use(app, SubdomainConfig.path('store'), 'merchant')
    SubdomainConfig.use(app, SubdomainConfig.path('ong'), 'ong')
  }
}
