/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Routes configuration.
 */

import express from 'express'
import path from 'path'
import klawSync from 'klaw-sync'

const routesPath = path.resolve(__dirname, '..', 'routes')
const isWin = process.platform === 'win32'
const routes = klawSync(routesPath)
  .map(route => {
    if (route) return route.path
    return undefined
  })
  .filter(route => route && route.indexOf('router.js') > -1)

const getRouteName = routePath => routePath.replace(/-/g, ' ').toTitleCase()
const init = app => {
  let routePath = ''
  const router = express.Router()
  routes.forEach(route => {
    routePath = isWin ? route.split('\\') : route.split('/')
    routePath = routePath[routePath.length - 2]
    router.use(`/${routePath}`, require(`${route}`))
    console.log(`☮ Initializing ${getRouteName(routePath)} routes...`.yellow)
  })
  app.use(router) // Add to app routes
}

export default { init }
