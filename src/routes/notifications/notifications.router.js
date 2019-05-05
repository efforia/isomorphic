/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Notification routes.
 */

// --------------- Module Imports
import SwaggerExpressRouter from '../../swagger/swagger.router'

import SwaggerUtils from '../../swagger/swagger.utils'
const router = new SwaggerExpressRouter('notifications')
import controller from './notifications.controller'
import auth from '../../services/auth.service'

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

export default router
