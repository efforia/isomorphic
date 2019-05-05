/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Server main file.
 */

import 'colors'
import path from 'path'
import express from 'express'
import passport from 'passport'
import logger from 'morgan'
import ip from 'ip'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import compression from 'compression'
import secure from 'express-force-https'

import router from './config/routes.config'
import database from './config/database.config'
import seeds from './config/seeds.config'
import socket from './config/socket.config'
import storage from './config/storage.config'

const { log } = console

const env = dotenv.config()
dotenvExpand(env)

const app = express()
const host = ip.address()
const port = process.env.PORT || '3000'
app.use(secure)
app.use(compression())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(logger('dev'))
app.set('port', port)
const server = app.listen(port, () => {
  router.init(app)
  database.connect()
  // storage.init(app)
  if (process.env.NODE_ENV === 'dev') seeds.init(app)
  log(`☮ Server: API listening on http://${host}:${port}`.green.bold)
})

socket(server)

export default app
