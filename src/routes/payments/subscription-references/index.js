/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Subscription routes.
 */

// --------------- Module Imports
import express from 'express'
import controller from './subscription-references.controller'
import auth from '../../../services/auth.service'


const router = express.Router('subscription-references')

router.post('/plans', auth.isAdmin(), async (req, res, error) => {
  try {
    const plan = req.body
    const created = await controller.savePlan(plan)
    return res.status(200).json(created)
  } catch (e) {
    error(e)
  }
})

router.post('/plans/toggle/:planId', auth.isAdmin(), async (req, res, error) => {
  try {
    const {planId} = req.params
    const toggled = await controller.togglePlan(planId)
    return res.status(200).json(toggled)
  } catch (e) {
    error(e)
  }
})

router.get('/plans', async (req, res, error) => {
  try {
    const plans = await controller.getPlans()
    return res.status(200).json(plans)
  } catch (e) {
    error(e)
  }
})

router.post('/subscription', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const subscription = req.body
    const created = await controller.saveSubscription(req.user, subscription)
    return res.status(200).json(created)
  } catch (e) {
    error(e)
  }
})

router.post('/:id/delete', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const {id} = req.params
    const cancelled = await controller.cancelSubscription(id)
    return res.status(200).json(cancelled)
  } catch (e) {
    error(e)
  }
})

export default router
