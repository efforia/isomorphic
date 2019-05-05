/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description User routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../swagger/swagger.router')
const SwaggerUtils = require('../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('users')
const controller = require('./users.controller')
const auth = require('../../services/auth.service')

// --------------- Module Controller
router.post('/', async (req, res, error) => {
  try {
    let userInfo = req.body
    let created = await controller.create(userInfo)
    return res.status(200).json(created)
  } catch (e) {
    error(e)
  }
})

router.get('/username/exists/:username', async (req, res, error) => {
  try {
    let username = req.params.username
    let isUnique = await controller.isUniqueUsername(username)
    return res.status(200).json(isUnique)
  } catch (e) {
    error(e)
  }
})

router.get('/profile', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let profile = await controller.get(user)
    return res.status(200).json(profile)
  } catch (e) {
    error(e)
  }
})

router.put('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let updates = req.body
    let updated = await controller.update(user, updates)
    return res.status(200).json(updated)
  } catch (e) {
    error(e)
  }
})

router.post('/authenticate', auth.passwordIsValid(), async (req, res, error) => {
  try {
    let username = req.body.email
    let authenticated = await controller.authenticate(username)
    return res.status(200).json(authenticated)
  } catch (e) {
    error(e)
  }
})

router.post('/password/recover/:email', async (req, res, error) => {
  try {
    let email = req.params.email
    let confirmation = await controller.recoverPassword(email)
    return res.status(200).json(confirmation)
  } catch (e) {
    error(e)
  }
})

router.post(
  '/password/update',
  auth.isAuthenticated(),
  auth.passwordIsValid(),
  async (req, res, error) => {
    try {
      let user = req.user
      let newPassword = req.body.newPassword
      let updated = await controller.updatePassword(user, newPassword)
      return res.status(200).json(updated)
    } catch (e) {
      error(e)
    }
  }
)

router.post('/skips/:skip', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let userId = req.user._id
    let skip = req.params.skip
    let skipAdded = await controller.addSkip(userId, skip)
    return res.status(200).json(skipAdded)
  } catch (e) {
    error(e)
  }
})

module.exports = router

/* router.post('/email/verify/:confirmation', controller.confirmEmail) */
