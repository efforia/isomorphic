/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description User routes.
 */

// --------------- Module Imports
import express from 'express'
import controller from './user.controller'
import auth from '../../services/auth.service'

const router = express.Router('users')

// --------------- Module Controller
router.post('/', async (req, res, error) => {
  try {
    const userInfo = req.body
    const created = await controller.create(userInfo)
    return res.status(200).json(created)
  } catch (e) {
    error(e)
  }
})

router.put('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const { user } = req
    const updates = req.body
    const updated = await controller.update(user, updates)
    return res.status(200).json(updated)
  } catch (e) {
    error(e)
  }
})

router.get('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const { user } = req
    const profile = await controller.get(user)
    return res.status(200).json(profile)
  } catch (e) {
    error(e)
  }
})

router.post('/login', auth.passwordIsValid(), async (req, res, error) => {
  try {
    const username = req.body.email
    const authenticated = await controller.authenticate(username)
    return res.status(200).json(authenticated)
  } catch (e) {
    error(e)
  }
})

router.post('/password/recover/:email', async (req, res, error) => {
  try {
    const { email } = req.params
    const confirmation = await controller.recoverPassword(email)
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
      const { user } = req
      const { newPassword } = req.body
      const updated = await controller.updatePassword(user, newPassword)
      return res.status(200).json(updated)
    } catch (e) {
      error(e)
    }
  }
)

router.get('/username/exists/:username', async (req, res, error) => {
  try {
    const { username } = req.params
    const isUnique = await controller.isUniqueUsername(username)
    return res.status(200).json(isUnique)
  } catch (e) {
    error(e)
  }
})

export default router

/* router.post('/email/verify/:confirmation', controller.confirmEmail) */
