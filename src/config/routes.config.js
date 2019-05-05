/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Routes configuration.
 */

import express from 'express'
import path from 'path'
import klawSync from 'klaw-sync'

const isWin = process.platform === 'win32'
const routersPath = path.resolve(__dirname, '..', 'routes')
const routers = klawSync(routersPath)
  .map(route => {
    if (route) return route.path
    return undefined
  })
  .filter(route => route && route.indexOf('index.js') > -1)

const init = app => {
  let routePath = ''
  let endpoint = ''
  const appRouter = express.Router()
  routers.forEach(router => {
    routePath = isWin ? router.split('\\') : router.split('/')
    endpoint = routePath[routePath.length - 2]
    appRouter.use(`/${endpoint}`, require(`${router}`).default)
    console.log(`☮ Initializing /${endpoint} routes...`.yellow)
  })
  app.use(appRouter) // Add to app routers
}

export default { init }
