/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Service provision routes.
 */

// --------------- Module Imports
import express from 'express'


const router = express.Router('jobs')
import controller from './jobs.controller'
import auth from '../../../services/auth.service'

// --------------- Module Routes
router.post('/request/:service/nearby', auth.isAuthenticated(), async (req, res, error) => {
  try {
    let user = req.user
    let service = req.params.service
    let latitude = req.query.latitude
    let longitude = req.query.longitude
    let radius = req.query.radius
    let keyword = req.query.keyword
    let merchants = await controller.requestNearby(
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
    let user = req.user
    let events = await controller.getByMerchant(user)
    return res.status(200).json(events)
  } catch (e) {
    error(e)
  }
})

export default router
