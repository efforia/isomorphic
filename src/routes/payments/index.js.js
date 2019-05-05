/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Payment routes.
 */

// --------------- Module Imports
import express from 'express'
import controller from './payments.controller'
import auth from '../../services/auth.service'


const router = express.Router('payments')

router.post('/methods', auth.isAdmin(), async (req, res, error) => {
  try {
    const method = req.body
    const created = await controller.savePaymentMethod(method)
    return res.status(200).json(created)
  } catch (e) {
    error(e)
  }
})

router.post('/methods/toggle/:methodId', auth.isAdmin(), async (req, res, error) => {
  try {
    const {methodId} = req.params
    const toggled = await controller.togglePaymentMethod(methodId)
    return res.status(200).json(toggled)
  } catch (e) {
    error(e)
  }
})

router.get('/methods', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const paymentMethods = await controller.getPaymentMethods(req.user)
    return res.status(200).json(paymentMethods)
  } catch (e) {
    error(e)
  }
})

export default router
