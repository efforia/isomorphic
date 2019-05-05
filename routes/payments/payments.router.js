/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Payment routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../swagger/swagger.router')
const SwaggerUtils = require('../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('payments')
const controller = require('./payments.controller')
const auth = require('../../services/auth.service')

router.post('/methods', auth.isAdmin(), async (req, res, error) => {
  try {
    let method = req.body
    let created = await controller.savePaymentMethod(method)
    return res.status(200).json(created)
  } catch (e) {
    error(e)
  }
})

router.post('/methods/toggle/:methodId', auth.isAdmin(), async (req, res, error) => {
  try {
    let methodId = req.params.methodId
    let toggled = await controller.togglePaymentMethod(methodId)
    return res.status(200).json(toggled)
  } catch (e) {
    error(e)
  }
})

router.get('/methods', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let paymentMethods = await controller.getPaymentMethods(req.user)
    return res.status(200).json(paymentMethods)
  } catch (e) {
    error(e)
  }
})

module.exports = router
