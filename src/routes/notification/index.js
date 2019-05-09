/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Notification routes.
 */

// --------------- Module Imports
import express from 'express'
import controller from './notification.controller'
import auth from '../../services/auth.service'


const router = express.Router('notifications')

router.post('/', auth.isAdmin(), async (req, res, error) => {
  try {
    const notificationInfo = req.body
    const notification = await controller.sendNotification(notificationInfo)
    return res.status(200).json(notification)
  } catch (e) {
    error(e)
  }
})

router.get('/', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const {user} = req
    const notifications = await controller.getByUser(user)
    return res.status(200).json(notifications)
  } catch (e) {
    error(e)
  }
})

router.get('/:id', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const {id} = req.params
    const notification = await controller.getById(id)
    return res.status(200).json(notification)
  } catch (e) {
    error(e)
  }
})

export default router
