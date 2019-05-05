/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Server main file.
 */

const path = require('path')
const dotenvPath = path.resolve(__dirname, './.env')
const env = require('dotenv').config({ path: dotenvPath })
require('dotenv-expand')(env)
require('colors')
require('./overrides')
const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')
const ip = require('ip')
const compression = require('compression')
const secure = require('express-force-https')
const database = require('./config/database.config')
const seeds = require('./config/seeds.config')
const routes = require('./config/routes.config')
const subdomain = require('./config/subdomain.config')
const socket = require('./config/socket.config')
const storage = require('./config/storage.config')

const app = express()
let host = ip.address()
let port = process.env.PORT || '3000'
app.use(secure)
app.use(compression())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(passport.initialize())
app.use(logger('dev'))
app.set('port', port)
const server = app.listen(port, () => {
  routes.init(app)
  database.connect()
  subdomain.init(app)
  storage.init(app)
  if (process.env.NODE_ENV == 'dev') seeds.init(app)
  console.log(`☮ Server: API listening on http://${host}:${port}`.green.bold)
  let isSwaggerUpdate = process.env.npm_config_updateswagger
  if (isSwaggerUpdate) process.exit()
})

socket(server)

module.exports = app
