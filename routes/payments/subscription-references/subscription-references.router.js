/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Subscription routes.
 */

// --------------- Module Imports
const SwaggerExpressRouter = require('../../../swagger/swagger.router')
const SwaggerUtils = require('../../../swagger/swagger.utils')
const router = new SwaggerExpressRouter('subscription-references')
const controller = require('./subscription-references.controller')
const auth = require('../../../services/auth.service')

router.post('/plans', auth.isAdmin(), async (req, res, error) => {
  try {
    let plan = req.body
    let created = await controller.savePlan(plan)
    return res.status(200).json(created)
  } catch (e) {
    error(e)
  }
})

router.post('/plans/toggle/:planId', auth.isAdmin(), async (req, res, error) => {
  try {
    let planId = req.params.planId
    let toggled = await controller.togglePlan(planId)
    return res.status(200).json(toggled)
  } catch (e) {
    error(e)
  }
})

router.get('/plans', async (req, res, error) => {
  try {
    let plans = await controller.getPlans()
    return res.status(200).json(plans)
  } catch (e) {
    error(e)
  }
})

router.post('/subscription', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let subscription = req.body
    let created = await controller.saveSubscription(req.user, subscription)
    return res.status(200).json(created)
  } catch (e) {
    error(e)
  }
})

router.post('/:id/delete', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let id = req.params.id
    let cancelled = await controller.cancelSubscription(id)
    return res.status(200).json(cancelled)
  } catch (e) {
    error(e)
  }
})

module.exports = router
