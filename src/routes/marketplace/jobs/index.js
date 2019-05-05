/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Service provision routes.
 */

// --------------- Module Imports
import express from 'express'
import controller from './jobs.controller'
import auth from '../../../services/auth.service'


const router = express.Router('jobs')

// --------------- Module Routes
router.post('/request/:service/nearby', auth.isAuthenticated(), async (req, res, error) => {
  try {
    const {user} = req
    const {service} = req.params
    const {latitude} = req.query
    const {longitude} = req.query
    const {radius} = req.query
    const {keyword} = req.query
    const merchants = await controller.requestNearby(
      user,
      service,
      latitude,
      longitude,
      radius,
      keyword
    )
    return res.status(200).json(merchants)
  } catch (e) {
    error(e)
  }
})

router.get('/jobs', auth.isMerchant(), async (req, res, error) => {
  try {
    const {user} = req
    const events = await controller.getByMerchant(user)
    return res.status(200).json(events)
  } catch (e) {
    error(e)
  }
})

export default router
