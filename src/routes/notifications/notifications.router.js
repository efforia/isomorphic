/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Notification routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../swagger/swagger.router')
const SwaggerUtils = require('../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('notifications')
const controller = require('./notifications.controller')
const auth = require('../../services/auth.service')

router.post('/', auth.isAdmin(), async (req, res, error) => {
  try {
    let notificationInfo = req.body
    let notification = await controller.sendNotification(notificationInfo)
    return res.status(200).json(notification)
  } catch (e) {
    error(e)
  }
})

router.get('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let notifications = await controller.getByUser(user)
    return res.status(200).json(notifications)
  } catch (e) {
    error(e)
  }
})

router.get('/:id', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let id = req.params.id
    let notification = await controller.getById(id)
    return res.status(200).json(notification)
  } catch (e) {
    error(e)
  }
})

module.exports = router
